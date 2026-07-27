"use client";

import { useState } from "react";
import { ConfluenceSim } from "@/components/tools/ConfluenceSim";
import { FiddlerSim } from "@/components/tools/FiddlerSim";
import { JiraSim } from "@/components/tools/JiraSim";
import { JMeterSim } from "@/components/tools/JMeterSim";
import { KafkaSim } from "@/components/tools/KafkaSim";
import { PlaywrightSim } from "@/components/tools/PlaywrightSim";
import { PostmanSim } from "@/components/tools/PostmanSim";
import { SqlSim } from "@/components/tools/SqlSim";
import { WcagSim } from "@/components/tools/WcagSim";

const tabs = [
  { id: "confluence", label: "Confluence", blurb: "Living documentation space" },
  { id: "jira", label: "Jira", blurb: "Epic, stories, tests and executions" },
  { id: "sql", label: "SQL", blurb: "In-memory portfolio database" },
  { id: "postman", label: "Postman", blurb: "API collection for this portfolio" },
  { id: "playwright", label: "Playwright", blurb: "Run E2E tests live, one or all" },
  { id: "jmeter", label: "JMeter", blurb: "Load test against portfolio APIs" },
  { id: "fiddler", label: "Fiddler", blurb: "HTTP(S) traffic inspection" },
  { id: "wcag", label: "WCAG", blurb: "Accessibility audit by section" },
  { id: "kafka", label: "Kafka", blurb: "Event streaming for portfolio flows" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ToolsShell() {
  const [active, setActive] = useState<TabId>("confluence");

  return (
    <div>
      <div className="mb-6 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
          Tools lab
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-text sm:text-4xl md:text-5xl">
          QA tooling simulations
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
          Interactive demos of Confluence, Jira, SQL, Postman, Playwright, JMeter,
          Fiddler, WCAG and Kafka - seeded with real portfolio data so you can explore
          how I work with everyday QA and delivery tools.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-line pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`border px-3 py-2 text-left transition ${
              active === tab.id
                ? "border-accent bg-accent-soft text-accent"
                : "border-line-strong text-muted hover:border-accent/50 hover:text-text"
            }`}
          >
            <span className="block font-mono text-xs font-semibold tracking-wide">
              {tab.label}
            </span>
            <span className="mt-0.5 block text-[0.7rem] opacity-80">{tab.blurb}</span>
          </button>
        ))}
      </div>

      {active === "postman" ? <PostmanSim /> : null}
      {active === "playwright" ? <PlaywrightSim /> : null}
      {active === "jmeter" ? <JMeterSim /> : null}
      {active === "jira" ? <JiraSim /> : null}
      {active === "confluence" ? <ConfluenceSim /> : null}
      {active === "sql" ? <SqlSim /> : null}
      {active === "wcag" ? <WcagSim /> : null}
      {active === "kafka" ? <KafkaSim /> : null}
      {active === "fiddler" ? <FiddlerSim /> : null}
    </div>
  );
}
