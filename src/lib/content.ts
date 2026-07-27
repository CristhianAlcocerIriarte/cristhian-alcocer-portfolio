export const site = {
  name: "Cristhian Alcocer",
  fullName: "Cristhian Alcocer Iriarte",
  role: "QA Lead & Senior QA Engineer",
  location: "Cochabamba, Bolivia",
  tagline: "Quality that ships without surprises.",
  summary:
    "Senior Manual QA Engineer / QA Lead — enterprise cloud platforms",
  intro:
    "7 years driving quality across workflow automation, database connectors and cloud-native products — from full-stack validation with Postman & SQL to Agile facilitation and AI-powered test design with Playwright.",
  email: "cristhianalcoceririarte@gmail.com",
  phone: "+591 799 699 31",
  phoneHref: "https://wa.me/59179969931",
  linkedin: "https://www.linkedin.com/in/cristhian-alcocer-iriarte",
  openToWork: true,
  availability: "Open to QA leadership roles, consulting and quality engineering collaborations.",
};

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#expertise", label: "Expertise" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;

export const metrics = [
  { value: 7, suffix: "", label: "Years in QA", decimals: 0 },
  { value: 20, suffix: "%", label: "Less prod bug leakage", decimals: 0 },
  { value: 99.9, suffix: "%", label: "Platform availability", decimals: 1 },
] as const;

export const terminalTests = [
  { assertion: "expect(experience).toBe('7 years')", duration: "4ms" },
  { assertion: "expect(bugLeakage).toReduceBy('20%')", duration: "7ms" },
  { assertion: "expect(availability).toEqual('99.9%')", duration: "3ms" },
  { assertion: "expect(coverage).toContain('full-stack')", duration: "5ms" },
] as const;

export const about = {
  eyebrow: "About",
  title: "Bridging frontend usability & backend stability",
  paragraphs: [
    "— QA Lead and Senior QA Engineer with 7 years driving quality in complex enterprise software: workflow automation tools, database connectors and cloud-native platforms at global scale.",
    "My focus is protecting product integrity and delivering seamless experiences in fast-paced Agile environments. I bridge the gap between frontend usability and backend stability, working closely with Developers and Product Owners to define bulletproof acceptance criteria before a single line of code ships.",
    "Based in Cochabamba, Bolivia, I thrive where quality, technical leadership and continuous process optimization are the standard.",
  ],
  philosophyTitle: "Work philosophy",
  philosophy: [
    "Advocate for quality at the earliest stages — a true Shift-Left culture.",
    "Ensure stability, data integrity and backward compatibility before production.",
    "Catch defects upstream through proactive requirement review.",
    "Use AI strategically to accelerate test design, log analysis and docs.",
    "Build high-performing QA teams through mentorship and shared standards.",
  ],
};

export const expertise = {
  eyebrow: "Areas of expertise",
  title: "Quality engineering capabilities",
  subtitle:
    "From leadership and Agile facilitation to hands-on full-stack validation and emerging automation practices.",
  areas: [
    {
      id: "leadership",
      title: "QA leadership & Agile facilitation",
      description:
        "Leading technical QA teams, facilitating Scrum ceremonies as Technical Scrum Facilitator, and owning quality roadmaps across multiple critical products at once.",
      tags: ["Scrum", "Team leadership", "Quality roadmaps"],
    },
    {
      id: "fullstack",
      title: "Full-stack testing",
      description:
        "API validation with Postman, backend data integrity checks via SQL, and deep log analysis — catching corruption long before it reaches the interface.",
      tags: ["Postman", "SQL Server", "Log analysis"],
    },
    {
      id: "ai",
      title: "Tech stack & AI efficiency",
      description:
        "Proactive adoption of Claude AI, Google Gemini, Atlassian Rovo and Cursor to optimize test design, technical reporting, log analysis and workflow standardization.",
      tags: ["Claude AI", "Gemini", "Atlassian Rovo", "Cursor"],
    },
    {
      id: "automation",
      title: "Test automation — growth area",
      description:
        "Prototyping modern automation with Playwright for visual validation and cross-browser consistency, expanding UI coverage in exploratory projects.",
      tags: ["Playwright", "E2E testing", "Visual validation"],
    },
  ],
};

export const experience = {
  eyebrow: "Professional experience",
  title: "Building quality in enterprise environments",
  subtitle:
    "Senior and leadership QA roles inside global software enterprises, owning quality across multiple critical products.",
  roles: [
    {
      title: "Senior Manual QA Engineer / QA Lead",
      company: "NICE CXone",
      period: "Mar 2019 — Present",
      current: true,
      summary:
        "Guiding QA strategy and technical agility for cloud-native solutions — making complex backend architectures work seamlessly with the interface. Technical Scrum Facilitator for Studio, DBConnector, Workforce Intelligence and Workflow Data.",
      highlights: [
        {
          label: "AI-powered testing",
          text: "E2E test plans with a multi-model AI workflow — 100% business requirement coverage, 40% faster test design.",
        },
        {
          label: "Shift-Left culture",
          text: "Active participation in requirement phases cut production bug leakage by 20%.",
        },
        {
          label: "Full-stack validation",
          text: "API testing with Postman and SQL data integrity checks — 30% faster integration testing.",
        },
        {
          label: "Agile leadership",
          text: "Technical Scrum Facilitator lifting sprint velocity by 15% and clearing roadblocks proactively.",
        },
        {
          label: "Performance & risk",
          text: "Load testing caught 3 critical bottlenecks pre-launch, maintaining 99.9% availability.",
        },
        {
          label: "Mentorship",
          text: "Standardized an exploratory testing repository — 20% faster onboarding for new engineers.",
        },
      ],
    },
    {
      title: "IT System Manager",
      company: "Pharmacy Chavez",
      period: "Sep 2016 — Feb 2019",
      current: false,
      summary:
        "Directed IT infrastructure strategy for high availability, security and alignment with business goals — managing the full lifecycle of enterprise systems.",
      highlights: [
        {
          label: "Infrastructure",
          text: "Guided technical teams and managed infrastructure lifecycle with enterprise security standards.",
        },
        {
          label: "Continuity",
          text: "Created disaster recovery plans and IT policies ensuring compliance and business continuity.",
        },
      ],
    },
    {
      title: "Technical Support Specialist",
      company: "Bata Manaco",
      period: "Aug 2014 — Aug 2016",
      current: false,
      summary:
        "High-tier technical support and local infrastructure management with a strong focus on preventive maintenance and issue resolution.",
      highlights: [
        {
          label: "Diagnostics",
          text: "Diagnosed complex hardware/software issues and deployed critical security patches.",
        },
        {
          label: "Process",
          text: "Authored technical SOPs that significantly reduced daily support ticket volume.",
        },
      ],
    },
  ],
};

export const education = {
  eyebrow: "Education & foundations",
  title: "Core foundations",
  subtitle:
    "A solid academic background in systems analysis combined with deep, practical Agile and Scrum expertise.",
  degree: {
    title: "Systems Analyst",
    institution: "CATEC — Cochabamba, Bolivia",
    period: "Nov 2004 — Nov 2009",
  },
  skills: [
    "Shift-Left testing",
    "Risk-based testing",
    "E2E testing",
    "Performance & load",
    "Agile / Scrum",
    "Postman",
    "Playwright",
    "SQL Server",
    "Jira",
    "JMeter",
    "Claude AI",
    "Google Gemini",
  ],
};

export const contact = {
  eyebrow: "Get in touch",
  title: "Let's connect",
  subtitle:
    "Interested in quality engineering, Agile leadership or AI-powered testing? Reach out — I'd love to hear from you.",
};
