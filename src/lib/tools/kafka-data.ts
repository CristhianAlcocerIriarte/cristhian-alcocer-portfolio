export type KafkaTopicName =
  | "portfolio.page-views"
  | "portfolio.contact-messages"
  | "portfolio.qa.test-results"
  | "portfolio.tools.audit-events";

export type KafkaMessage = {
  id: string;
  topic: KafkaTopicName;
  partition: number;
  offset: number;
  key: string;
  timestamp: string;
  value: Record<string, unknown>;
};

export type KafkaTopic = {
  name: KafkaTopicName;
  partitions: number;
  replicationFactor: number;
  description: string;
  consumerGroup: string;
};

export const kafkaCluster = {
  id: "portfolio-local",
  brokers: ["localhost:9092"],
  clientId: "qa-tools-lab",
};

export const kafkaTopics: KafkaTopic[] = [
  {
    name: "portfolio.page-views",
    partitions: 3,
    replicationFactor: 1,
    description: "Page section views and navigation events from the portfolio.",
    consumerGroup: "analytics-consumers",
  },
  {
    name: "portfolio.contact-messages",
    partitions: 2,
    replicationFactor: 1,
    description: "Contact form submissions produced by /api/contact.",
    consumerGroup: "crm-intake",
  },
  {
    name: "portfolio.qa.test-results",
    partitions: 3,
    replicationFactor: 1,
    description: "Playwright E2E and live suite results (9 test cases).",
    consumerGroup: "quality-gate",
  },
  {
    name: "portfolio.tools.audit-events",
    partitions: 2,
    replicationFactor: 1,
    description: "Tools lab events: Postman sends, JMeter runs, WCAG audits.",
    consumerGroup: "observability",
  },
];

function isoMinutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export function createSeedMessages(): KafkaMessage[] {
  const seed: Omit<KafkaMessage, "id" | "offset">[] = [
    {
      topic: "portfolio.page-views",
      partition: 0,
      key: "visitor-hero",
      timestamp: isoMinutesAgo(42),
      value: {
        path: "/",
        section: "hero",
        event: "section_view",
        referrer: "linkedin",
      },
    },
    {
      topic: "portfolio.page-views",
      partition: 1,
      key: "visitor-experience",
      timestamp: isoMinutesAgo(40),
      value: {
        path: "/",
        section: "experience",
        event: "section_view",
        company: "NICE CXone",
      },
    },
    {
      topic: "portfolio.page-views",
      partition: 2,
      key: "visitor-tools",
      timestamp: isoMinutesAgo(18),
      value: {
        path: "/tools/",
        section: "tools",
        event: "route_view",
        tab: "postman",
      },
    },
    {
      topic: "portfolio.contact-messages",
      partition: 0,
      key: "hiring@example.com",
      timestamp: isoMinutesAgo(35),
      value: {
        name: "Hiring Manager",
        email: "hiring@example.com",
        channel: "contact-form",
        message: "Interested in a QA Lead conversation.",
      },
    },
    {
      topic: "portfolio.qa.test-results",
      partition: 0,
      key: "e2e-suite",
      timestamp: isoMinutesAgo(12),
      value: {
        suite: "e2e/portfolio.spec.ts",
        browser: "chromium",
        total: 9,
        passed: 9,
        failed: 0,
        status: "passed",
      },
    },
    {
      topic: "portfolio.qa.test-results",
      partition: 1,
      key: "tc-09",
      timestamp: isoMinutesAgo(11),
      value: {
        testCase: "PORT-18",
        title: "live Playwright runner launch control is interactive",
        status: "passed",
        durationMs: 1600,
      },
    },
    {
      topic: "portfolio.tools.audit-events",
      partition: 0,
      key: "postman",
      timestamp: isoMinutesAgo(8),
      value: {
        tool: "postman",
        action: "send",
        method: "GET",
        path: "/api/profile",
        status: 200,
      },
    },
    {
      topic: "portfolio.tools.audit-events",
      partition: 1,
      key: "wcag",
      timestamp: isoMinutesAgo(3),
      value: {
        tool: "wcag",
        action: "audit_completed",
        axeViolations: 0,
        sectionFails: 0,
      },
    },
  ];

  return seed.map((item, index) => ({
    ...item,
    id: `msg-${index + 1}`,
    offset: index,
  }));
}

export const produceTemplates: Record<
  KafkaTopicName,
  { key: string; value: Record<string, unknown> }
> = {
  "portfolio.page-views": {
    key: "visitor-contact",
    value: {
      path: "/",
      section: "contact",
      event: "section_view",
      cta: "whatsapp",
    },
  },
  "portfolio.contact-messages": {
    key: "recruiter@company.com",
    value: {
      name: "Recruiter",
      email: "recruiter@company.com",
      channel: "contact-form",
      message: "Let's talk about a QA leadership role.",
    },
  },
  "portfolio.qa.test-results": {
    key: "live-suite",
    value: {
      suite: "live-suite",
      total: 9,
      passed: 9,
      failed: 0,
      status: "passed",
      source: "test-runner",
    },
  },
  "portfolio.tools.audit-events": {
    key: "jmeter",
    value: {
      tool: "jmeter",
      action: "load_test_finished",
      users: 20,
      loops: 3,
      errors: 0,
    },
  },
};
