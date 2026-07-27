export type WcagLevel = "A" | "AA" | "AAA";
export type WcagImpact = "critical" | "serious" | "moderate" | "minor" | "pass";

export type WcagSectionDef = {
  id: string;
  label: string;
  selector: string;
  checks: {
    id: string;
    principle: string;
    criterion: string;
    level: WcagLevel;
    title: string;
    how: string;
  }[];
};

export const wcagSections: WcagSectionDef[] = [
  {
    id: "document",
    label: "Document / Page",
    selector: "html",
    checks: [
      {
        id: "html-lang",
        principle: "Understandable",
        criterion: "3.1.1 Language of Page",
        level: "A",
        title: "Page has a valid lang attribute",
        how: "Inspect <html lang>",
      },
      {
        id: "document-title",
        principle: "Operable",
        criterion: "2.4.2 Page Titled",
        level: "A",
        title: "Document title identifies the page",
        how: "Inspect document.title",
      },
      {
        id: "skip-link",
        principle: "Operable",
        criterion: "2.4.1 Bypass Blocks",
        level: "A",
        title: "Skip to main content link is available",
        how: "Find skip link targeting #main",
      },
      {
        id: "main-landmark",
        principle: "Operable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Main landmark exists",
        how: "Find main#main or [role=main]",
      },
    ],
  },
  {
    id: "nav",
    label: "Navigation",
    selector: '[data-testid="primary-nav"], header nav',
    checks: [
      {
        id: "nav-landmark",
        principle: "Operable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Primary navigation is exposed as a nav landmark",
        how: "Find nav[aria-label] or data-testid=primary-nav",
      },
      {
        id: "nav-link-names",
        principle: "Perceivable",
        criterion: "2.4.4 Link Purpose",
        level: "A",
        title: "Nav links have accessible names",
        how: "Every nav anchor has non-empty text",
      },
    ],
  },
  {
    id: "hero",
    label: "Hero",
    selector: '[data-testid="hero"], #top',
    checks: [
      {
        id: "hero-h1",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Hero exposes a single page h1",
        how: "Exactly one h1 in the document, visible in hero",
      },
      {
        id: "hero-cta-names",
        principle: "Operable",
        criterion: "2.4.4 Link Purpose",
        level: "A",
        title: "Hero CTAs have clear accessible names",
        how: "Check experience, LinkedIn and suite controls",
      },
    ],
  },
  {
    id: "about",
    label: "About",
    selector: "#about",
    checks: [
      {
        id: "about-heading",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "About section has a heading",
        how: "Find h2 inside #about",
      },
      {
        id: "about-text",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "About content is available as text",
        how: "Section contains readable paragraph text",
      },
    ],
  },
  {
    id: "expertise",
    label: "Expertise",
    selector: "#expertise, [data-testid='section-expertise']",
    checks: [
      {
        id: "expertise-heading",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Expertise section has a heading",
        how: "Find h2 inside expertise section",
      },
      {
        id: "expertise-structure",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Expertise areas use headings for each capability",
        how: "Find multiple h3 cards",
      },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    selector: "#experience, [data-testid='section-experience']",
    checks: [
      {
        id: "experience-heading",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Experience section has a heading",
        how: "Find h2 inside experience section",
      },
      {
        id: "experience-list",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Roles are structured as a list/timeline",
        how: "Find ol/ul or article entries",
      },
    ],
  },
  {
    id: "education",
    label: "Education",
    selector: "#education",
    checks: [
      {
        id: "education-heading",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Education section has a heading",
        how: "Find h2 inside #education",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    selector: "#contact, [data-testid='section-contact']",
    checks: [
      {
        id: "contact-heading",
        principle: "Perceivable",
        criterion: "1.3.1 Info and Relationships",
        level: "A",
        title: "Contact section has a heading",
        how: "Find h2 inside contact section",
      },
      {
        id: "contact-labels",
        principle: "Perceivable",
        criterion: "1.3.1 / 3.3.2 Labels or Instructions",
        level: "A",
        title: "Form fields are associated with labels",
        how: "Name, email and message inputs have labels",
      },
      {
        id: "contact-links",
        principle: "Operable",
        criterion: "2.4.4 Link Purpose",
        level: "A",
        title: "Email, WhatsApp and LinkedIn links are named",
        how: "Inspect mailto, wa.me and LinkedIn anchors",
      },
    ],
  },
];

export const wcagPrinciples = [
  "Perceivable",
  "Operable",
  "Understandable",
  "Robust",
] as const;
