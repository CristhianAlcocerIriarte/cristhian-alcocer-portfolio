"use client";

import { useState } from "react";
import { confluencePages, confluenceSpace } from "@/lib/tools/confluence-data";

export function ConfluenceSim() {
  const [pageId, setPageId] = useState(confluencePages[0]?.id ?? "home");
  const page = confluencePages.find((item) => item.id === pageId) ?? confluencePages[0];

  return (
    <div className="grid min-h-[560px] overflow-hidden border border-line bg-surface/40 lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line lg:border-b-0 lg:border-r">
        <div className="border-b border-line px-4 py-3">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
            Space
          </p>
          <p className="mt-1 text-sm text-text">{confluenceSpace.name}</p>
          <p className="mt-1 text-xs text-muted">{confluenceSpace.key}</p>
        </div>
        <ul>
          {confluencePages.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setPageId(item.id)}
                className={`w-full px-4 py-3 text-left text-sm transition ${
                  pageId === item.id
                    ? "bg-accent-soft text-text"
                    : "text-muted hover:bg-bg/50 hover:text-text"
                }`}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <article className="px-4 py-5 sm:px-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          {confluenceSpace.key} / {page.title}
        </p>
        <h3 className="mt-2 font-display text-3xl text-text">{page.title}</h3>
        <p className="mt-2 font-mono text-xs text-muted">
          Updated {page.updated}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {page.labels.map((label) => (
            <span key={label} className="skill-chip">
              {label}
            </span>
          ))}
        </div>
        <div className="text-prose mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
