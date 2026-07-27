export type LiveTestStatus = "idle" | "running" | "passed" | "failed";

export type LiveTestCase = {
  id: string;
  title: string;
  file: string;
  /** Maps to Playwright describe / test name in e2e/portfolio.spec.ts */
  playwrightName: string;
  run: (root?: Document) => Promise<void>;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function resolveRoot(root?: Document): Document {
  return root ?? document;
}

function qs<T extends Element = Element>(root: Document, selector: string): T {
  const el = root.querySelector(selector);
  assert(el, `Expected selector to match: ${selector}`);
  return el as T;
}

function qsa(root: Document, selector: string): Element[] {
  return Array.from(root.querySelectorAll(selector));
}

async function wait(ms: number) {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
}

export const liveSuiteMeta = {
  project: "chromium",
  specFile: "e2e/portfolio.spec.ts",
  suiteName: "Portfolio - full automated suite",
  workers: 1,
  retries: 0,
};

export const liveTestCases: LiveTestCase[] = [
  {
    id: "hero-brand",
    title: "hero renders brand, headline and primary CTAs",
    playwrightName: "hero renders brand, headline and primary CTAs",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(120);
      const hero = qs(doc, '[data-testid="hero"]');
      assert(hero.textContent?.includes("Quality that ships"), "Missing hero headline");
      assert(qs(doc, '[data-testid="cta-experience"]'), "Missing experience CTA");
      assert(qs(doc, '[data-testid="cta-linkedin"]'), "Missing LinkedIn CTA");
      assert(qs(doc, '[data-testid="run-suite-hero"]'), "Missing Run suite CTA");
    },
  },
  {
    id: "nav-sections",
    title: "navigation exposes all primary sections",
    playwrightName: "navigation exposes all primary sections",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(100);
      const labels = ["About", "Expertise", "Experience", "Education", "Contact", "Tools"];
      const nav = qs(doc, '[data-testid="primary-nav"]');
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
    playwrightName: "core sections are present and reachable",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(100);
      for (const id of ["about", "expertise", "experience", "education", "contact"]) {
        assert(doc.getElementById(id), `Section missing: #${id}`);
      }
    },
  },
  {
    id: "experience-current",
    title: "experience timeline highlights current NICE CXone role",
    playwrightName: "experience timeline highlights current NICE CXone role",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(140);
      const experience = qs(doc, '[data-testid="section-experience"]');
      experience.scrollIntoView({ behavior: "instant", block: "center" });
      await wait(180);
      assert(experience.textContent?.includes("NICE CXone"), "NICE CXone not found");
      assert(experience.textContent?.includes("Current"), "Current badge missing");
      assert(
        experience.textContent?.includes("Senior QA Engineer / QA Lead"),
        "Current role title missing",
      );
    },
  },
  {
    id: "expertise-tags",
    title: "expertise area tags include Playwright and Postman",
    playwrightName: "expertise area tags include Playwright and Postman",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(120);
      const expertise = qs(doc, '[data-testid="section-expertise"]');
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
    playwrightName: "contact details and form controls are valid",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(120);
      const contact = qs(doc, '[data-testid="section-contact"]');
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
      assert(qs(doc, '[data-testid="contact-name"]'), "Name input missing");
      assert(qs(doc, '[data-testid="contact-email"]'), "Email input missing");
      assert(qs(doc, '[data-testid="contact-message"]'), "Message textarea missing");
      assert(qs(doc, '[data-testid="contact-submit"]'), "Submit button missing");
    },
  },
  {
    id: "contact-form-input",
    title: "contact form accepts valid input",
    playwrightName: "contact form accepts valid input",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(100);
      const name = qs<HTMLInputElement>(doc, '[data-testid="contact-name"]');
      const email = qs<HTMLInputElement>(doc, '[data-testid="contact-email"]');
      const message = qs<HTMLTextAreaElement>(doc, '[data-testid="contact-message"]');

      const win = doc.defaultView ?? window;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        win.HTMLInputElement.prototype,
        "value",
      )?.set;
      const areaSetter = Object.getOwnPropertyDescriptor(
        win.HTMLTextAreaElement.prototype,
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
    playwrightName: "skip link and document title meet a11y basics",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(80);
      assert(/Cristhian Alcocer/i.test(doc.title), "Document title mismatch");
      const skip = qsa(doc, "a").find((a) =>
        /skip to main content/i.test(a.textContent ?? ""),
      );
      assert(skip, "Skip link missing");
      (skip as HTMLElement).focus();
      assert(doc.activeElement === skip, "Skip link did not receive focus");
    },
  },
  {
    id: "runner-shell",
    title: "live Playwright runner launch control is interactive",
    playwrightName: "live Playwright runner launch control is interactive",
    file: "e2e/portfolio.spec.ts",
    run: async (root) => {
      const doc = resolveRoot(root);
      await wait(80);

      const existing = doc.querySelector('[data-testid="test-runner"]');
      if (existing) {
        assert(
          /playwright/i.test(
            qs(doc, '[data-testid="test-runner-title"]').textContent ?? "",
          ),
          "Runner title missing Playwright label",
        );
        return;
      }

      // Tools lab runs against an iframe. Clicking the FAB would auto-start a
      // nested suite, so we validate the launch control without opening it.
      assert(
        doc.documentElement.dataset.appReady === "true",
        "Homepage app ready flag missing",
      );
      const fab = qs<HTMLButtonElement>(doc, '[data-testid="run-suite-fab"]');
      assert(!fab.disabled, "Run suite FAB is disabled");
      assert(
        fab.getAttribute("aria-haspopup") === "dialog",
        "Run suite FAB is not a dialog trigger",
      );
    },
  },
];

export type LiveSuiteUpdate = {
  id: string;
  status: LiveTestStatus;
  durationMs?: number;
  error?: string;
};

async function runOne(
  testCase: LiveTestCase,
  onUpdate: (payload: LiveSuiteUpdate) => void,
  root?: Document,
) {
  onUpdate({ id: testCase.id, status: "running" });
  const started = performance.now();
  try {
    await testCase.run(root);
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

export async function runLiveSuite(
  onUpdate: (payload: LiveSuiteUpdate) => void,
  root?: Document,
) {
  for (const testCase of liveTestCases) {
    await runOne(testCase, onUpdate, root);
  }
}

export async function runLiveTests(
  ids: string[],
  onUpdate: (payload: LiveSuiteUpdate) => void,
  root?: Document,
) {
  const selected = liveTestCases.filter((testCase) => ids.includes(testCase.id));
  for (const testCase of selected) {
    await runOne(testCase, onUpdate, root);
  }
}

export async function runLiveTest(
  id: string,
  onUpdate: (payload: LiveSuiteUpdate) => void,
  root?: Document,
) {
  const testCase = liveTestCases.find((item) => item.id === id);
  if (!testCase) {
    throw new Error(`Unknown live test: ${id}`);
  }
  await runOne(testCase, onUpdate, root);
}
