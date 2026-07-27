export type ConfluencePage = {
  id: string;
  title: string;
  space: string;
  labels: string[];
  updated: string;
  body: string[];
};

export const confluenceSpace = {
  key: "PORTFOLIO",
  name: "Portfolio Documentation",
  description: "Living documentation for the Cristhian Alcocer portfolio site.",
};

export const confluencePages: ConfluencePage[] = [
  {
    id: "home",
    title: "Home",
    space: "PORTFOLIO",
    labels: ["overview"],
    updated: "2026-07-27",
    body: [
      "Welcome to the Portfolio Documentation space.",
      "This Confluence simulation captures architecture, QA strategy, tooling demos and release notes for https://cristhianalcoceririarte.github.io/cristhian-alcocer-portfolio/.",
      "Use the left sidebar to browse pages. Content mirrors the real site so recruiters can see how QA artifacts are organized.",
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    space: "PORTFOLIO",
    labels: ["engineering"],
    updated: "2026-07-27",
    body: [
      "Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion.",
      "Deployment: static export to GitHub Pages with basePath /cristhian-alcocer-portfolio.",
      "Content source of truth: src/lib/content.ts.",
      "Interactive Tools lab: /tools with Postman, JMeter, Jira, Confluence and SQL simulations backed by portfolio data.",
      "Quality gate: Playwright e2e suite runs in GitHub Actions before Pages deploy.",
    ],
  },
  {
    id: "test-strategy",
    title: "Test Strategy",
    space: "PORTFOLIO",
    labels: ["qa", "strategy"],
    updated: "2026-07-27",
    body: [
      "Approach: Shift-Left content review + risk-based smoke coverage + live demonstration of tooling fluency.",
      "Automated suite: e2e/portfolio.spec.ts contains exactly 9 Playwright test cases (Chromium).",
      "Jira mapping: Epic PORT-1 -> Stories PORT-2/3/4 -> Test Cases PORT-10..PORT-18 (TC-01..TC-09) -> Test Executions PORT-20/21/22.",
      "Layers:",
      "1) Content integrity (LinkedIn-aligned experience, contact channels).",
      "2) UI smoke (hero, navigation, section reachability).",
      "3) Interactive runner assertions (browser-side suite mirroring Playwright).",
      "4) CI Playwright against static export (9/9).",
      "5) Tools lab demos (Postman/JMeter/Jira/Confluence/SQL) for tooling fluency.",
      "Environments: localhost:3000 (dev), static out/ (CI), GitHub Pages (prod).",
    ],
  },
  {
    id: "release-notes",
    title: "Release Notes",
    space: "PORTFOLIO",
    labels: ["release"],
    updated: "2026-07-27",
    body: [
      "v1.0 - Next.js portfolio rebuild with amber dark theme and Playwright runner.",
      "v1.1 - LinkedIn content alignment, WhatsApp contact link, spacing polish.",
      "v1.2 - Tools lab: Postman collection, JMeter plan, Jira QA project, Confluence docs, SQL console.",
    ],
  },
  {
    id: "api-contracts",
    title: "API Contracts (Mock)",
    space: "PORTFOLIO",
    labels: ["api"],
    updated: "2026-07-27",
    body: [
      "The Postman simulation exposes mock REST endpoints used by this page's tooling demo:",
      "GET /api/health - service health",
      "GET /api/profile - public profile payload",
      "GET /api/experience - roles timeline",
      "GET /api/experience/current - current role only",
      "GET /api/expertise - expertise areas",
      "GET /api/skills - skills + languages",
      "GET /api/education - education record",
      "GET /api/metrics - portfolio metrics",
      "POST /api/contact - contact form simulation (requires name, email, message)",
    ],
  },
  {
    id: "data-model",
    title: "Data Model",
    space: "PORTFOLIO",
    labels: ["sql", "data"],
    updated: "2026-07-27",
    body: [
      "SQL lab tables:",
      "profiles - single-row profile identity",
      "experiences - professional roles",
      "experience_highlights - achievement bullets per role",
      "expertise_areas - capability cards",
      "skills - competency catalog",
      "education - academic record",
      "contact_messages - simulated inbound messages",
      "jira_issues - QA backlog mirror",
      "Suggested query: SELECT company, title, period FROM experiences WHERE current = true;",
    ],
  },
];
