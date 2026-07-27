"use client";

import { useMemo, useState } from "react";
import { jiraIssues, jiraProject, type JiraIssue } from "@/lib/tools/jira-data";

const filters = ["All", "Epic", "Story", "Test", "Test Execution"] as const;

function statusClass(status: JiraIssue["status"]) {
  if (status === "Pass" || status === "Done") return "text-pass border-pass/30 bg-pass/10";
  if (status === "Fail" || status === "Blocked") return "text-warn border-warn/30 bg-warn/10";
  if (status === "In Progress") return "text-accent border-accent/30 bg-accent-soft";
  return "text-muted border-line-strong bg-bg/40";
}

export function JiraSim() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selectedKey, setSelectedKey] = useState("PORT-1");

  const visible = useMemo(
    () =>
      jiraIssues.filter((issue) =>
        filter === "All" ? true : issue.type === filter,
      ),
    [filter],
  );

  const selected =
    jiraIssues.find((issue) => issue.key === selectedKey) ?? jiraIssues[0];

  const children = jiraIssues.filter((issue) => issue.parent === selected.key);

  return (
    <div className="min-h-[560px] border border-line bg-surface/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
            Project {jiraProject.key}
          </p>
          <h3 className="text-lg text-text">{jiraProject.name}</h3>
          <p className="mt-1 text-xs text-muted">
            {jiraProject.testCaseCount} test cases mapped from{" "}
            <span className="font-mono text-accent">{jiraProject.suiteFile}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`border px-2.5 py-1 font-mono text-[0.7rem] transition ${
                filter === item
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line-strong text-muted hover:text-text"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-line lg:border-b-0 lg:border-r">
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-surface font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                <tr className="border-b border-line">
                  <th className="px-4 py-2">Key</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Summary</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((issue) => (
                  <tr
                    key={issue.key}
                    className={`cursor-pointer border-b border-line/70 transition hover:bg-bg/50 ${
                      selected.key === issue.key ? "bg-accent-soft/50" : ""
                    }`}
                    onClick={() => setSelectedKey(issue.key)}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-accent">
                      {issue.key}
                    </td>
                    <td className="px-2 py-2.5 font-mono text-[0.7rem] text-muted">
                      {issue.type}
                    </td>
                    <td className="px-2 py-2.5 text-text/90">{issue.summary}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex border px-2 py-0.5 font-mono text-[0.65rem] ${statusClass(issue.status)}`}
                      >
                        {issue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-accent">{selected.key}</span>
            <span className="font-mono text-[0.7rem] text-muted">{selected.type}</span>
            <span
              className={`inline-flex border px-2 py-0.5 font-mono text-[0.65rem] ${statusClass(selected.status)}`}
            >
              {selected.status}
            </span>
          </div>
          <h4 className="mt-3 font-display text-xl text-text">{selected.summary}</h4>
          <p className="mt-3 text-sm leading-relaxed text-muted">{selected.description}</p>

          <dl className="mt-4 grid gap-2 font-mono text-xs text-muted sm:grid-cols-2">
            <div>
              <dt className="uppercase tracking-wider">Assignee</dt>
              <dd className="mt-1 text-text">{selected.assignee}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wider">Priority</dt>
              <dd className="mt-1 text-text">{selected.priority}</dd>
            </div>
            {selected.parent ? (
              <div>
                <dt className="uppercase tracking-wider">Parent</dt>
                <dd className="mt-1 text-accent">{selected.parent}</dd>
              </div>
            ) : null}
            {selected.executionOf ? (
              <div>
                <dt className="uppercase tracking-wider">Executes</dt>
                <dd className="mt-1 text-text">{selected.executionOf}</dd>
              </div>
            ) : null}
            {selected.environment ? (
              <div>
                <dt className="uppercase tracking-wider">Environment</dt>
                <dd className="mt-1 text-text">{selected.environment}</dd>
              </div>
            ) : null}
            {selected.spec ? (
              <div>
                <dt className="uppercase tracking-wider">Spec</dt>
                <dd className="mt-1 text-text">{selected.spec}</dd>
              </div>
            ) : null}
          </dl>

          {selected.labels.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.labels.map((label) => (
                <span key={label} className="skill-chip">
                  {label}
                </span>
              ))}
            </div>
          ) : null}

          {selected.acceptanceCriteria?.length ? (
            <div className="mt-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                Acceptance criteria
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {selected.acceptanceCriteria.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {selected.steps?.length ? (
            <div className="mt-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                Test steps
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-muted">
                {selected.steps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              {selected.expected ? (
                <p className="mt-3 text-sm text-text/85">
                  <span className="font-mono text-accent">Expected:</span>{" "}
                  {selected.expected}
                </p>
              ) : null}
            </div>
          ) : null}

          {children.length ? (
            <div className="mt-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                Child issues
              </p>
              <ul className="mt-2 space-y-1 font-mono text-xs">
                {children.map((child) => (
                  <li key={child.key}>
                    <button
                      type="button"
                      className="text-left text-accent hover:underline"
                      onClick={() => setSelectedKey(child.key)}
                    >
                      {child.key}
                    </button>{" "}
                    <span className="text-muted">
                      {child.type} · {child.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
