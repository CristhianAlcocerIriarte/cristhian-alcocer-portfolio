import { test, expect } from "@playwright/test";

test.describe("Portfolio - full automated suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("hero renders brand, headline and primary CTAs", async ({ page }) => {
    await expect(page.getByTestId("hero")).toBeVisible();
    await expect(page.getByTestId("hero-brand")).toContainText(
      "Cristhian Alcocer",
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Software Quality",
    );
    await expect(page.getByTestId("cta-experience")).toBeVisible();
    await expect(page.getByTestId("cta-linkedin")).toBeVisible();
    await expect(page.getByTestId("cta-tools")).toBeVisible();
  });

  test("navigation exposes all primary sections", async ({ page }) => {
    const nav = page.getByTestId("primary-nav");
    await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Expertise" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Experience" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Education" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Tools" })).toBeVisible();
  });

  test("core sections are present and reachable", async ({ page }) => {
    for (const id of [
      "about",
      "expertise",
      "experience",
      "education",
      "contact",
    ]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test("experience timeline highlights current NICE CXone role", async ({
    page,
  }) => {
    const experience = page.getByTestId("section-experience");
    await experience.scrollIntoViewIfNeeded();
    await expect(experience.getByText("NICE CXone", { exact: true })).toBeVisible();
    await expect(experience.getByText("Current", { exact: true })).toBeVisible();
    await expect(
      experience.getByText("Senior QA Engineer / QA Lead", { exact: true }),
    ).toBeVisible();
  });

  test("expertise area tags include Playwright and Postman", async ({
    page,
  }) => {
    const expertise = page.getByTestId("section-expertise");
    await expertise.scrollIntoViewIfNeeded();
    await expect(expertise.getByText("Playwright", { exact: true })).toBeVisible();
    await expect(expertise.getByText("Postman", { exact: true })).toBeVisible();
  });

  test("contact details and channels are valid", async ({ page }) => {
    const contact = page.getByTestId("section-contact");
    await contact.scrollIntoViewIfNeeded();

    await expect(
      contact.locator('a[href^="mailto:cristhianalcoceririarte@gmail.com"]'),
    ).toBeVisible();
    await expect(contact.locator('a[href^="https://wa.me/"]')).toBeVisible();
    await expect(
      contact.locator('a[href*="linkedin.com/in/cristhian-alcocer"]'),
    ).toBeVisible();
    await expect(
      contact.locator('a[href*="google.com/maps"]'),
    ).toBeVisible();
  });

  test("contact channels expose expected destinations", async ({ page }) => {
    const contact = page.getByTestId("section-contact");
    await contact.scrollIntoViewIfNeeded();

    await expect(
      contact.locator('a[href^="mailto:cristhianalcoceririarte@gmail.com"]'),
    ).toHaveAttribute("href", /mailto:cristhianalcoceririarte@gmail\.com/);
    await expect(contact.locator('a[href^="https://wa.me/"]')).toHaveAttribute(
      "href",
      /wa\.me\/59179969931/,
    );
    await expect(
      contact.locator('a[href*="linkedin.com/in/cristhian-alcocer"]'),
    ).toHaveAttribute("href", /linkedin\.com\/in\/cristhian-alcocer/);
    await expect(contact.locator('a[href*="google.com/maps"]')).toHaveAttribute(
      "href",
      /Plaza\+14\+de\+Septiembre/,
    );
  });

  test("skip link and document title meet a11y basics", async ({ page }) => {
    await expect(page).toHaveTitle(/Cristhian Alcocer/i);
    const skip = page.getByRole("link", { name: /skip to main content/i });
    await skip.focus();
    await expect(skip).toBeFocused();
  });

  test("live Playwright runner launch control is interactive", async ({
    page,
  }) => {
    await page.waitForFunction(
      () => document.documentElement.dataset.appReady === "true",
    );
    await page.getByTestId("run-suite-fab").click();
    await expect(page.getByTestId("test-runner")).toBeVisible();
    await expect(page.getByTestId("test-runner-title")).toContainText(
      /playwright/i,
    );
    await page.getByTestId("test-runner-close").click();
    await expect(page.getByTestId("test-runner")).toHaveCount(0);
  });
});
