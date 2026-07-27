export type LiveTestStatus = "idle" | "running" | "passed" | "failed";

export type LiveTestCase = {
  id: string;
  title: string;
  file: string;
  run: () => Promise<void>;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function qs<T extends Element = Element>(selector: string): T {
  const el = document.querySelector(selector);
  assert(el, `Expected selector to match: ${selector}`);
  return el as T;
}

function qsa(selector: string): Element[] {
  return Array.from(document.querySelectorAll(selector));
}

async function wait(ms: number) {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
}

export const liveSuiteMeta = {
  project: "chromium",
  specFile: "e2e/portfolio.spec.ts",
  suiteName: "portfolio.full-suite.spec.ts",
};

export const liveTestCases: LiveTestCase[] = [
  {
    id: "hero-brand",
    title: "hero renders brand, headline and primary CTAs",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(120);
      const hero = qs('[data-testid="hero"]');
      assert(hero.textContent?.includes("Quality that ships"), "Missing hero headline");
      assert(qs('[data-testid="cta-experience"]'), "Missing experience CTA");
      assert(qs('[data-testid="cta-linkedin"]'), "Missing LinkedIn CTA");
      assert(qs('[data-testid="run-suite-hero"]'), "Missing Run suite CTA");
    },
  },
  {
    id: "nav-sections",
    title: "navigation exposes all primary sections",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(100);
      const labels = ["About", "Expertise", "Experience", "Education", "Contact"];
      const nav = qs('[data-testid="primary-nav"]');
      for (const label of labels) {
        assert(
          Array.from(nav.querySelectorAll("a")).some((a) =>
            a.textContent?.includes(label),
          ),
          `Nav missing link: ${label}`,
        );
      }
    },
  },
  {
    id: "sections-present",
    title: "core sections are present and reachable",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(100);
      for (const id of ["about", "expertise", "experience", "education", "contact"]) {
        assert(document.getElementById(id), `Section missing: #${id}`);
      }
    },
  },
  {
    id: "experience-current",
    title: "experience timeline highlights current NICE CXone role",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(140);
      const experience = qs('[data-testid="section-experience"]');
      experience.scrollIntoView({ behavior: "instant", block: "center" });
      await wait(180);
      assert(experience.textContent?.includes("NICE CXone"), "NICE CXone not found");
      assert(experience.textContent?.includes("Current"), "Current badge missing");
      assert(
        experience.textContent?.includes("Senior Manual QA Engineer / QA Lead"),
        "Current role title missing",
      );
    },
  },
  {
    id: "expertise-tags",
    title: "expertise area tags include Playwright and Postman",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(120);
      const expertise = qs('[data-testid="section-expertise"]');
      expertise.scrollIntoView({ behavior: "instant", block: "center" });
      await wait(160);
      const text = expertise.textContent ?? "";
      assert(text.includes("Playwright"), "Playwright tag missing");
      assert(text.includes("Postman"), "Postman tag missing");
    },
  },
  {
    id: "contact-controls",
    title: "contact details and form controls are valid",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(120);
      const contact = qs('[data-testid="section-contact"]');
      contact.scrollIntoView({ behavior: "instant", block: "center" });
      await wait(160);
      assert(
        contact.querySelector('a[href^="mailto:cristhianalcoceririarte@gmail.com"]'),
        "Email mailto link missing",
      );
      assert(
        contact.querySelector('a[href^="https://wa.me/"]'),
        "WhatsApp link missing",
      );
      assert(qs('[data-testid="contact-name"]'), "Name input missing");
      assert(qs('[data-testid="contact-email"]'), "Email input missing");
      assert(qs('[data-testid="contact-message"]'), "Message textarea missing");
      assert(qs('[data-testid="contact-submit"]'), "Submit button missing");
    },
  },
  {
    id: "contact-form-input",
    title: "contact form accepts valid input",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(100);
      const name = qs<HTMLInputElement>('[data-testid="contact-name"]');
      const email = qs<HTMLInputElement>('[data-testid="contact-email"]');
      const message = qs<HTMLTextAreaElement>('[data-testid="contact-message"]');

      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      const areaSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      )?.set;

      nativeSetter?.call(name, "Hiring Manager");
      name.dispatchEvent(new Event("input", { bubbles: true }));
      nativeSetter?.call(email, "hiring@example.com");
      email.dispatchEvent(new Event("input", { bubbles: true }));
      areaSetter?.call(message, "Interested in a QA Lead conversation.");
      message.dispatchEvent(new Event("input", { bubbles: true }));

      await wait(80);
      assert(name.value === "Hiring Manager", "Name value was not set");
      assert(email.value === "hiring@example.com", "Email value was not set");
      assert(message.value.includes("QA Lead"), "Message value was not set");
    },
  },
  {
    id: "a11y-basics",
    title: "skip link and document title meet a11y basics",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(80);
      assert(/Cristhian Alcocer/i.test(document.title), "Document title mismatch");
      const skip = qsa("a").find((a) =>
        /skip to main content/i.test(a.textContent ?? ""),
      );
      assert(skip, "Skip link missing");
      (skip as HTMLElement).focus();
      assert(document.activeElement === skip, "Skip link did not receive focus");
    },
  },
  {
    id: "runner-shell",
    title: "live Playwright runner shell is mounted while suite executes",
    file: "e2e/portfolio.spec.ts",
    run: async () => {
      await wait(60);
      assert(qs('[data-testid="test-runner"]'), "Test runner panel missing");
      assert(
        /playwright/i.test(
          qs('[data-testid="test-runner-title"]').textContent ?? "",
        ),
        "Runner title missing Playwright label",
      );
    },
  },
];

export async function runLiveSuite(
  onUpdate: (payload: {
    id: string;
    status: LiveTestStatus;
    durationMs?: number;
    error?: string;
  }) => void,
) {
  for (const testCase of liveTestCases) {
    onUpdate({ id: testCase.id, status: "running" });
    const started = performance.now();
    try {
      await testCase.run();
      onUpdate({
        id: testCase.id,
        status: "passed",
        durationMs: Math.max(1, Math.round(performance.now() - started)),
      });
    } catch (error) {
      onUpdate({
        id: testCase.id,
        status: "failed",
        durationMs: Math.max(1, Math.round(performance.now() - started)),
        error: error instanceof Error ? error.message : "Unknown assertion error",
      });
    }
  }
}
