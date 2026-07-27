export const site = {
  name: "Cristhian Alcocer",
  fullName: "Cristhian Alcocer Iriarte",
  role: "QA Lead & Senior QA Engineer",
  headline:
    "QA Lead | Senior Manual QA Engineer | Agile Leadership | AI-Powered Testing",
  location: "Cochabamba, Bolivia",
  tagline: "Quality that ships without surprises.",
  summary:
    "QA Lead · Senior Manual QA Engineer - Agile leadership & AI-powered testing",
  intro:
    "I don’t just find bugs; I build trust through technical excellence and innovation, protecting product integrity across cloud-native platforms with Shift-Left strategy, full-stack validation and AI-enhanced QA workflows.",
  email: "cristhianalcoceririarte@gmail.com",
  phone: "+591 799 699 31",
  phoneHref: "https://wa.me/59179969931",
  linkedin: "https://www.linkedin.com/in/cristhian-alcocer-iriarte",
  openToWork: true,
  availability:
    "Open to Quality Control Engineer and QA leadership roles, ready to elevate product quality standards and lead high-performing QA workflows.",
};

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#expertise", label: "Expertise" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;

export const metrics = [
  { value: 7, suffix: "+", label: "Years in Senior QA / Lead", decimals: 0 },
  { value: 4, suffix: "", label: "Leadership roles", decimals: 0 },
  { value: 32, suffix: "", label: "Mapped skills", decimals: 0 },
] as const;

export const terminalTests = [
  { assertion: "expect(role).toMatch(/QA Lead|Senior QA/)", duration: "4ms" },
  { assertion: "expect(approach).toContain('Shift-Left')", duration: "6ms" },
  { assertion: "expect(aiStack).toContain('Claude')", duration: "3ms" },
  { assertion: "expect(tooling).toContain('Playwright')", duration: "5ms" },
] as const;

export const about = {
  eyebrow: "About",
  title: "Building trust through technical excellence",
  quote:
    "I don’t just find bugs; I build trust through technical excellence and innovation.",
  paragraphs: [
    "For me, Quality Assurance is not just a development phase, but a critical business driver. I specialize in protecting product integrity and optimizing the end-user experience by implementing rigorous, risk-based testing strategies across complex software ecosystems.",
    "Throughout my career, I have mastered bridging Frontend usability and Backend stability, leading quality initiatives in Agile (Scrum/Kanban) environments so every release is synonymous with reliability and technical excellence.",
    "I am a strong advocate for Shift-Left testing, collaborating closely with Developers and Product Managers to catch defects early and streamline delivery. I thrive in high-growth environments where quality, leadership and process optimization are top priorities.",
  ],
  philosophyTitle: "Strategic focus",
  philosophy: [
    "Drive high-level quality roadmaps, mentor engineers and act as Technical Scrum Facilitator between engineering and business goals.",
    "Integrate generative AI (Claude) to accelerate reporting, log analysis, RCA and coding assistance.",
    "Validate APIs with Postman and protect data integrity with SQL Server across microservices.",
    "Execute performance and load testing to uncover bottlenecks and protect scalability under traffic.",
    "Evolve automation practice with Playwright for exploratory precision and visual validation.",
  ],
  recommendation: {
    quote:
      "Cristhian provides the exact kind of agile leadership and technical rigor that high-performing teams need.",
    author: "Britt Hawley",
    role: "Engineering Director, managed Cristhian directly at NICE",
  },
};

export const expertise = {
  eyebrow: "Areas of expertise",
  title: "Strategic value & technical expertise",
  subtitle:
    "QA leadership, AI-enhanced productivity, backend/API mastery, resilience testing and a growing Playwright automation practice.",
  areas: [
    {
      id: "leadership",
      title: "QA leadership & strategy",
      description:
        "Expert in driving quality roadmaps, mentoring junior engineers and fostering a culture of excellence. Technical Scrum Facilitator ensuring alignment between engineering teams and business goals.",
      tags: ["Scrum / Kanban", "Quality roadmaps", "Mentorship"],
    },
    {
      id: "fullstack",
      title: "Backend & API mastery",
      description:
        "Deep expertise in API validation with Postman and complex data integrity checks via SQL Server, ensuring seamless communication and synchronization between microservices.",
      tags: ["Postman", "SQL Server", "Microservices"],
    },
    {
      id: "ai",
      title: "AI-enhanced productivity",
      description:
        "Integrating Claude into daily QA workflows to accelerate RCA, technical documentation, SQL validation scripts and operational efficiency across the developer-to-QA feedback loop.",
      tags: ["Claude", "Atlassian Rovo", "Jira"],
    },
    {
      id: "automation",
      title: "Resilience, performance & automation",
      description:
        "Performance and load testing to identify bottlenecks under high concurrency. Expanding the stack with Playwright for visual validation, cross-browser consistency and specialized UI testing.",
      tags: ["JMeter", "Playwright", "Load testing"],
    },
  ],
};

export const experience = {
  eyebrow: "Professional experience",
  title: "Building quality and resilient systems",
  subtitle:
    "Senior QA leadership at NICE CXone, preceded by IT systems management and technical specialist roles across Bolivia.",
  roles: [
    {
      title: "Senior QA Engineer / QA Lead",
      company: "NICE CXone",
      period: "Mar 2019 - Present",
      employment: "Full-time · Cochabamba, Bolivia",
      current: true,
      summary:
        "Spearheading quality strategies and technical agility for cloud-native contact center solutions. Connecting complex backend architectures with smooth user experiences, and integrating Claude AI to optimize high-performance Scrum rituals and delivery quality.",
      highlights: [
        {
          label: "AI-driven efficiency",
          text: "Integrated Claude into daily workflow to accelerate RCA, refine technical documentation and assist in generating complex SQL validation scripts, shortening the developer-to-QA feedback loop.",
        },
        {
          label: "QA leadership & Scrum",
          text: "Led Agile ceremonies with quality oversight, removing technical blockers and optimizing team velocity to deliver mission-critical features.",
        },
        {
          label: "Quality strategy",
          text: "Architected comprehensive E2E test plans as QA Lead, shifting quality left and reducing production bug leakage by ensuring testability from the requirement phase.",
        },
        {
          label: "Full-stack & API validation",
          text: "Deep-dive testing with Postman for API/middleware validation and SQL for backend data integrity across microservices.",
        },
        {
          label: "Performance & resilience",
          text: "Spearheaded performance and load testing to protect platform stability under high-concurrency scenarios in the CXone ecosystem.",
        },
        {
          label: "Modern UI testing",
          text: "Leveraged Playwright for manual execution and visual validation, exploring cross-browser consistency and specialized UI testing.",
        },
        {
          label: "Risk & mentorship",
          text: "Identified cross-team dependencies and mitigation strategies; mentored junior QA engineers on exploratory testing, documentation and AI-assisted workflows.",
        },
      ],
    },
    {
      title: "Information Technology System Manager",
      company: "Farmacia Chavez",
      period: "Sep 2016 - Feb 2019",
      employment: "Full-time · Bolivia",
      current: false,
      summary:
        "Directed the strategic design, implementation and security of corporate IT infrastructure. Led technical teams to ensure 24/7 operational continuity while aligning technology initiatives with business objectives.",
      highlights: [
        {
          label: "Infrastructure & governance",
          text: "Orchestrated deployment and maintenance of IT systems for high availability, data integrity and peak performance.",
        },
        {
          label: "Leadership",
          text: "Directed a multidisciplinary IT team with mentorship, clear KPIs and streamlined troubleshooting workflows.",
        },
        {
          label: "Compliance & continuity",
          text: "Enforced IT policies and security protocols; built disaster recovery and business continuity plans to protect critical assets.",
        },
      ],
    },
    {
      title: "Information Technology Technical Specialist",
      company: "Bata Group",
      period: "Aug 2014 - Aug 2016",
      employment: "Full-time · Bolivia",
      current: false,
      summary:
        "Delivered high-tier technical support and infrastructure management focused on proactive maintenance, security hardening and technical documentation.",
      highlights: [
        {
          label: "Systems & security",
          text: "Diagnosed complex hardware/software issues, managed backups and recovery, and deployed critical security patches.",
        },
        {
          label: "Documentation",
          text: "Authored SOPs and user guides that promoted self-service and reduced recurring support overhead.",
        },
        {
          label: "Deployment",
          text: "Led installation and optimization of operating systems and enterprise software for seamless cross-platform integration.",
        },
      ],
    },
    {
      title: "Information Technology System Manager",
      company: "Plasticos Derqui",
      period: "Jul 2012 - Jul 2014",
      employment: "Full-time · Bolivia",
      current: false,
      summary:
        "Strategically directed planning, deployment and security of organizational IT infrastructure, ensuring high-availability systems and aligning technology roadmaps with business growth.",
      highlights: [
        {
          label: "Operations governance",
          text: "Owned the end-to-end IT infrastructure lifecycle for performance, scalability and enterprise security standards.",
        },
        {
          label: "Leadership & vendors",
          text: "Mentored IT specialists and managed vendor relationships and budgets for cost-efficient service delivery.",
        },
        {
          label: "Continuity",
          text: "Engineered disaster recovery and risk mitigation plans to protect mission-critical data and minimize downtime.",
        },
      ],
    },
  ],
};

export const education = {
  eyebrow: "Education & foundations",
  title: "Core foundations",
  subtitle:
    "Formal systems analysis education combined with practical Agile delivery, data architecture and auditing discipline.",
  degree: {
    title: "System Analyst",
    field: "Computer and Information Sciences and Support Services",
    institution: "CATEC, Cochabamba, Bolivia",
    period: "Nov 2004 - Nov 2009",
    focus: [
      "Systems engineering & SDLC: turning business requirements into efficient software solutions",
      "Software construction with OOP and algorithmic logic (Java/Python)",
      "Relational databases (SQL): integrity, normalization and complex data flows",
      "Requirements engineering, Agile project management and systems auditing / RCA",
    ],
  },
  languages: [{ name: "English", level: "Full professional proficiency" }],
  skills: [
    "SDLC / STLC",
    "Agile (Scrum/Kanban)",
    "Shift-Left",
    "Risk-based testing",
    "Root Cause Analysis",
    "Postman",
    "Playwright",
    "SQL Server",
    "JMeter",
    "Fiddler",
    "Jira",
    "Confluence",
    "Atlassian Rovo",
    "Claude",
  ],
};

export const contact = {
  eyebrow: "Get in touch",
  title: "Let's connect",
  subtitle:
    "Interested in quality engineering, Agile leadership or AI-powered testing? Let’s discuss how I can elevate your product’s quality standards.",
};
