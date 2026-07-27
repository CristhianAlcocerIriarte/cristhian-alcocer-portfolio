"use client";

import { useState } from "react";
import { ConfluenceSim } from "@/components/tools/ConfluenceSim";
import { JiraSim } from "@/components/tools/JiraSim";
import { JMeterSim } from "@/components/tools/JMeterSim";
import { PostmanSim } from "@/components/tools/PostmanSim";
import { SqlSim } from "@/components/tools/SqlSim";

const tabs = [
  { id: "postman", label: "Postman", blurb: "API collection for this portfolio" },
  { id: "jmeter", label: "JMeter", blurb: "Load test against portfolio APIs" },
  { id: "jira", label: "Jira", blurb: "Epic, stories, tests and executions" },
  { id: "confluence", label: "Confluence", blurb: "Living documentation space" },
  { id: "sql", label: "SQL", blurb: "In-memory portfolio database" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ToolsShell() {
  const [active, setActive] = useState<TabId>("postman");

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
          Interactive demos of Postman, JMeter, Jira, Confluence and SQL - all
          seeded with real data from this portfolio so you can explore how I work
          with everyday QA and delivery tools.
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
      {active === "jmeter" ? <JMeterSim /> : null}
      {active === "jira" ? <JiraSim /> : null}
      {active === "confluence" ? <ConfluenceSim /> : null}
      {active === "sql" ? <SqlSim /> : null}
    </div>
  );
}
