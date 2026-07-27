export type JiraIssueType = "Epic" | "Story" | "Test" | "Test Execution";
export type JiraStatus = "To Do" | "In Progress" | "Done" | "Pass" | "Fail" | "Blocked";

export type JiraIssue = {
  key: string;
  type: JiraIssueType;
  summary: string;
  status: JiraStatus;
  assignee: string;
  priority: "Highest" | "High" | "Medium" | "Low";
  parent?: string;
  labels: string[];
  description: string;
  acceptanceCriteria?: string[];
  steps?: string[];
  expected?: string;
  executionOf?: string;
  environment?: string;
  spec?: string;
};

export const jiraProject = {
  key: "PORT",
  name: "Portfolio QA",
  epic: "PORT-1",
  suiteFile: "e2e/portfolio.spec.ts",
  testCaseCount: 9,
};

/** Mirrors the 9 Playwright E2E tests in e2e/portfolio.spec.ts */
export const e2eTestCases = [
  {
    key: "PORT-10",
    summary: "TC-01: Hero renders brand, headline and primary CTAs",
    parent: "PORT-2",
    labels: ["e2e", "hero", "smoke"],
    description:
      "Mapped to Playwright: hero renders brand, headline and primary CTAs",
    steps: [
      "Open homepage",
      "Assert [data-testid=hero] is visible",
      "Assert h1 contains Quality that ships",
      "Assert CTAs experience, LinkedIn and Tools are visible",
    ],
    expected: "Hero composition and primary CTAs render correctly.",
  },
  {
    key: "PORT-11",
    summary: "TC-02: Navigation exposes all primary sections",
    parent: "PORT-2",
    labels: ["e2e", "nav"],
    description:
      "Mapped to Playwright: navigation exposes all primary sections",
    steps: [
      "Open homepage on desktop viewport",
      "Assert primary nav links: About, Expertise, Experience, Education, Contact, Tools",
    ],
    expected: "All primary navigation links are visible.",
  },
  {
    key: "PORT-12",
    summary: "TC-03: Core sections are present and reachable",
    parent: "PORT-2",
    labels: ["e2e", "structure"],
    description:
      "Mapped to Playwright: core sections are present and reachable",
    steps: [
      "Locate #about, #expertise, #experience, #education, #contact",
      "Assert each section is visible",
    ],
    expected: "All core homepage sections exist in the DOM.",
  },
  {
    key: "PORT-13",
    summary: "TC-04: Experience timeline highlights current NICE CXone role",
    parent: "PORT-2",
    labels: ["e2e", "experience"],
    description:
      "Mapped to Playwright: experience timeline highlights current NICE CXone role",
    steps: [
      "Scroll to Experience section",
      "Assert NICE CXone, Current badge and Senior QA Engineer / QA Lead are visible",
    ],
    expected: "Current role is highlighted with correct title and company.",
  },
  {
    key: "PORT-14",
    summary: "TC-05: Expertise tags include Playwright and Postman",
    parent: "PORT-2",
    labels: ["e2e", "expertise"],
    description:
      "Mapped to Playwright: expertise area tags include Playwright and Postman",
    steps: [
      "Scroll to Expertise section",
      "Assert Playwright and Postman tags are visible",
    ],
    expected: "Playwright and Postman tags are present.",
  },
  {
    key: "PORT-15",
    summary: "TC-06: Contact details and channels are valid",
    parent: "PORT-3",
    labels: ["e2e", "contact"],
    description:
      "Mapped to Playwright: contact details and channels are valid",
    steps: [
      "Scroll to Contact",
      "Assert mailto, WhatsApp, LinkedIn and Maps links are visible",
    ],
    expected: "All contact channels are available.",
  },
  {
    key: "PORT-16",
    summary: "TC-07: Contact channels expose expected destinations",
    parent: "PORT-3",
    labels: ["e2e", "contact"],
    description:
      "Mapped to Playwright: contact channels expose expected destinations",
    steps: [
      "Inspect mailto, wa.me, LinkedIn and Google Maps href values",
      "Assert destinations match the public contact profile",
    ],
    expected: "Contact channel destinations are correct.",
  },
  {
    key: "PORT-17",
    summary: "TC-08: Skip link and document title meet a11y basics",
    parent: "PORT-3",
    labels: ["e2e", "a11y"],
    description:
      "Mapped to Playwright: skip link and document title meet a11y basics",
    steps: [
      "Assert document title matches Cristhian Alcocer",
      "Focus Skip to main content link",
      "Assert link receives focus",
    ],
    expected: "Basic accessibility controls work as expected.",
  },
  {
    key: "PORT-18",
    summary: "TC-09: Live Playwright runner launch control is interactive",
    parent: "PORT-4",
    labels: ["e2e", "playwright", "runner"],
    description:
      "Mapped to Playwright: live Playwright runner launch control is interactive",
    steps: [
      "Wait for app hydration (data-app-ready)",
      "Click Run full suite FAB",
      "Assert test runner panel is visible with Playwright title",
      "Close runner and assert it unmounts",
    ],
    expected: "Interactive runner opens and closes correctly.",
  },
] as const;

export const jiraIssues: JiraIssue[] = [
  {
    key: "PORT-1",
    type: "Epic",
    summary: "Portfolio website quality assurance",
    status: "Done",
    assignee: "Cristhian Alcocer",
    priority: "Highest",
    labels: ["portfolio", "quality-gate", "playwright"],
    description: `Epic covering the automated E2E suite in ${jiraProject.suiteFile}. Scope: ${jiraProject.testCaseCount} Playwright test cases for homepage quality, contact flows, accessibility and the live runner.`,
  },
  {
    key: "PORT-2",
    type: "Story",
    summary: "As a recruiter, I can review structure, navigation and experience",
    status: "Done",
    assignee: "Cristhian Alcocer",
    priority: "High",
    parent: "PORT-1",
    labels: ["content", "nav", "experience"],
    description:
      "Covers TC-01 to TC-05 from the Playwright suite: hero, navigation, sections, experience and expertise.",
    acceptanceCriteria: [
      "Hero headline and CTAs are visible",
      "Primary navigation includes all sections + Tools",
      "Core sections and current NICE role are correct",
    ],
  },
  {
    key: "PORT-3",
    type: "Story",
    summary: "As a visitor, I can contact Cristhian and use a11y basics",
    status: "Done",
    assignee: "Cristhian Alcocer",
    priority: "High",
    parent: "PORT-1",
    labels: ["contact", "a11y"],
    description:
      "Covers TC-06 to TC-08: contact channels, destination checks and skip-link/title accessibility.",
    acceptanceCriteria: [
      "Email, WhatsApp, LinkedIn and Maps links are present",
      "Channel destinations match the public profile",
      "Skip link can receive keyboard focus",
    ],
  },
  {
    key: "PORT-4",
    type: "Story",
    summary: "As a hiring manager, I can launch the live Playwright demo",
    status: "Done",
    assignee: "Cristhian Alcocer",
    priority: "High",
    parent: "PORT-1",
    labels: ["playwright", "demo"],
    description:
      "Covers TC-09: interactive runner FAB opens the live suite panel and can be closed.",
    acceptanceCriteria: [
      "Run full suite control is interactive after hydration",
      "Runner panel shows Playwright branding",
      "Closing removes the runner from the DOM",
    ],
  },
  ...e2eTestCases.map((testCase) => ({
    key: testCase.key,
    type: "Test" as const,
    summary: testCase.summary,
    status: "Pass" as const,
    assignee: "Cristhian Alcocer",
    priority: "High" as const,
    parent: testCase.parent,
    labels: [...testCase.labels],
    description: testCase.description,
    steps: [...testCase.steps],
    expected: testCase.expected,
    spec: jiraProject.suiteFile,
  })),
  {
    key: "PORT-20",
    type: "Test Execution",
    summary: "TE: Playwright E2E full suite (9/9)",
    status: "Pass",
    assignee: "Cristhian Alcocer",
    priority: "Highest",
    parent: "PORT-1",
    labels: ["execution", "playwright", "ci"],
    description:
      "Single execution record for all 9 automated test cases in e2e/portfolio.spec.ts (Chromium).",
    executionOf: e2eTestCases.map((item) => item.key).join(", "),
    environment: "CI static export / localhost Chromium",
  },
  {
    key: "PORT-21",
    type: "Test Execution",
    summary: "TE: Smoke subset - hero, nav, experience, contact",
    status: "Pass",
    assignee: "Cristhian Alcocer",
    priority: "High",
    parent: "PORT-2",
    labels: ["execution", "smoke"],
    description: "Execution of TC-01, TC-02, TC-04 and TC-06.",
    executionOf: "PORT-10, PORT-11, PORT-13, PORT-15",
    environment: "localhost / GitHub Pages",
  },
  {
    key: "PORT-22",
    type: "Test Execution",
    summary: "TE: Runner and accessibility checks",
    status: "Pass",
    assignee: "Cristhian Alcocer",
    priority: "High",
    parent: "PORT-4",
    labels: ["execution", "a11y", "runner"],
    description: "Execution of TC-08 and TC-09.",
    executionOf: "PORT-17, PORT-18",
    environment: "Chromium",
  },
];
