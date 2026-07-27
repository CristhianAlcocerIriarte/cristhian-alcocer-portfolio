"use client";

import { useMemo, useRef, useState } from "react";
import type { Result, NodeResult } from "axe-core";
import { wcagSections, type WcagImpact } from "@/lib/tools/wcag-data";

type CheckResult = {
  id: string;
  sectionId: string;
  sectionLabel: string;
  title: string;
  criterion: string;
  level: string;
  principle: string;
  status: "pass" | "fail" | "review";
  detail: string;
};

type AuditSummary = {
  passes: number;
  fails: number;
  reviews: number;
  axeViolations: number;
  axePasses: number;
  durationMs: number;
};

function homeHref() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}/`;
}

function query(root: ParentNode, selector: string) {
  try {
    return root.querySelector(selector);
  } catch {
    return null;
  }
}

function queryAll(root: ParentNode, selector: string) {
  try {
    return Array.from(root.querySelectorAll(selector));
  } catch {
    return [];
  }
}

function runSectionChecks(doc: Document): CheckResult[] {
  const results: CheckResult[] = [];

  for (const section of wcagSections) {
    const scope =
      section.id === "document"
        ? doc.documentElement
        : query(doc, section.selector);

    for (const check of section.checks) {
      let status: CheckResult["status"] = "fail";
      let detail = "Check failed.";

      switch (check.id) {
        case "html-lang": {
          const lang = doc.documentElement.getAttribute("lang")?.trim();
          status = lang ? "pass" : "fail";
          detail = lang ? `lang="${lang}"` : "Missing html lang attribute";
          break;
        }
        case "document-title": {
          const title = doc.title?.trim() ?? "";
          status = /cristhian/i.test(title) ? "pass" : "fail";
          detail = title ? `title="${title}"` : "Empty document title";
          break;
        }
        case "skip-link": {
          const skip = queryAll(doc, "a").find((a) =>
            /skip to main content/i.test(a.textContent ?? ""),
          );
          const href = skip?.getAttribute("href") ?? "";
          status = skip && href.includes("main") ? "pass" : "fail";
          detail = skip
            ? `Found skip link -> ${href}`
            : "Skip link not found";
          break;
        }
        case "main-landmark": {
          const main = query(doc, "main#main, main, [role='main']");
          status = main ? "pass" : "fail";
          detail = main ? "Main landmark present" : "Main landmark missing";
          break;
        }
        case "nav-landmark": {
          const nav =
            query(doc, '[data-testid="primary-nav"]') ||
            query(doc, 'header nav, nav[aria-label]');
          status = nav ? "pass" : "fail";
          detail = nav
            ? `Nav landmark: ${(nav as HTMLElement).getAttribute("aria-label") || "primary-nav"}`
            : "Primary nav not found";
          break;
        }
        case "nav-link-names": {
          const nav =
            query(doc, '[data-testid="primary-nav"]') ||
            query(doc, "header nav");
          const links = nav ? queryAll(nav, "a") : [];
          const unnamed = links.filter(
            (a) => !(a.textContent || "").trim(),
          );
          status = links.length > 0 && unnamed.length === 0 ? "pass" : "fail";
          detail = `${links.length} nav links, ${unnamed.length} unnamed`;
          break;
        }
        case "hero-h1": {
          const h1s = queryAll(doc, "h1");
          status = h1s.length === 1 ? "pass" : "fail";
          detail =
            h1s.length === 1
              ? `h1: "${(h1s[0].textContent || "").trim().slice(0, 60)}"`
              : `Expected 1 h1, found ${h1s.length}`;
          break;
        }
        case "hero-cta-names": {
          const ids = ["cta-experience", "cta-linkedin", "cta-tools"];
          const missing = ids.filter((id) => !query(doc, `[data-testid="${id}"]`));
          status = missing.length === 0 ? "pass" : "fail";
          detail =
            missing.length === 0
              ? "Hero CTAs present with test ids"
              : `Missing: ${missing.join(", ")}`;
          break;
        }
        case "about-heading":
        case "expertise-heading":
        case "experience-heading":
        case "education-heading":
        case "contact-heading": {
          const heading = scope ? query(scope, "h2") : null;
          status = heading ? "pass" : "fail";
          detail = heading
            ? `h2: "${(heading.textContent || "").trim().slice(0, 70)}"`
            : `No h2 in ${section.label}`;
          break;
        }
        case "about-text": {
          const paragraphs = scope ? queryAll(scope, "p") : [];
          status = paragraphs.length >= 2 ? "pass" : "fail";
          detail = `${paragraphs.length} paragraph(s) in About`;
          break;
        }
        case "expertise-structure": {
          const cards = scope ? queryAll(scope, "h3") : [];
          status = cards.length >= 3 ? "pass" : "fail";
          detail = `${cards.length} expertise headings (h3)`;
          break;
        }
        case "experience-list": {
          const items = scope
            ? queryAll(scope, "article, li, [class*='timeline']")
            : [];
          status = items.length >= 2 ? "pass" : "fail";
          detail = `${items.length} structured experience entries`;
          break;
        }
        case "contact-labels": {
          const labels = ["Email", "WhatsApp", "LinkedIn", "Location"];
          const missing = labels.filter(
            (label) =>
              !Array.from(queryAll(doc, "dt")).some((dt) =>
                (dt.textContent ?? "").includes(label),
              ),
          );
          status = missing.length === 0 ? "pass" : "fail";
          detail =
            missing.length === 0
              ? "Contact channel labels present"
              : `Missing labels: ${missing.join(", ")}`;
          break;
        }
        case "contact-links": {
          const mail = query(doc, 'a[href^="mailto:"]');
          const whatsapp = query(doc, 'a[href*="wa.me"]');
          const linkedin = queryAll(doc, "a").find((a) =>
            /linkedin/i.test(a.getAttribute("href") || a.textContent || ""),
          );
          const ok = Boolean(mail && whatsapp && linkedin);
          status = ok ? "pass" : "fail";
          detail = `mailto=${Boolean(mail)}, whatsapp=${Boolean(whatsapp)}, linkedin=${Boolean(linkedin)}`;
          break;
        }
        default: {
          status = scope ? "review" : "fail";
          detail = scope
            ? "Manual review recommended"
            : `Section not found: ${section.selector}`;
        }
      }

      if (!scope && section.id !== "document") {
        status = "fail";
        detail = `Section scope missing (${section.selector})`;
      }

      results.push({
        id: check.id,
        sectionId: section.id,
        sectionLabel: section.label,
        title: check.title,
        criterion: check.criterion,
        level: check.level,
        principle: check.principle,
        status,
        detail,
      });
    }
  }

  return results;
}

function impactTone(impact: string | null | undefined): WcagImpact {
  if (impact === "critical" || impact === "serious" || impact === "moderate" || impact === "minor") {
    return impact;
  }
  return "moderate";
}

export function WcagSim() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [violations, setViolations] = useState<Result[]>([]);
  const [passes, setPasses] = useState<Result[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [selectedSection, setSelectedSection] = useState("all");
  const [error, setError] = useState<string | null>(null);

  const filteredChecks = useMemo(
    () =>
      selectedSection === "all"
        ? checks
        : checks.filter((item) => item.sectionId === selectedSection),
    [checks, selectedSection],
  );

  const runAudit = async () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc?.body) {
      setError("Homepage preview is not ready yet. Wait a moment and retry.");
      return;
    }

    setRunning(true);
    setError(null);
    const started = performance.now();

    try {
      const sectionResults = runSectionChecks(doc);
      const axeMod = await import("axe-core");
      const axe = axeMod.default ?? axeMod;

      // Pass the iframe Element (same-window Node). Passing iframe.contentDocument
      // fails axe context validation because it belongs to another Window realm.
      const axeResults = await axe.run(iframe, {
        runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
        iframes: true,
      });

      setChecks(sectionResults);
      setViolations(axeResults.violations);
      setPasses(axeResults.passes);
      setSummary({
        passes: sectionResults.filter((item) => item.status === "pass").length,
        fails: sectionResults.filter((item) => item.status === "fail").length,
        reviews: sectionResults.filter((item) => item.status === "review").length,
        axeViolations: axeResults.violations.length,
        axePasses: axeResults.passes.length,
        durationMs: Math.round(performance.now() - started),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "WCAG audit failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-[560px] border border-line bg-surface/40">
      <div className="border-b border-line px-4 py-3 sm:px-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
          WCAG audit lab
        </p>
        <h3 className="mt-1 text-lg text-text">Accessibility testing simulation</h3>
        <p className="mt-1 text-sm text-muted">
          Runs section-level WCAG checks plus axe-core (WCAG 2.0/2.1 A/AA) against a live
          preview of this portfolio homepage.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!ready || running}
          onClick={() => void runAudit()}
        >
          {running ? "Running audit..." : "Run WCAG audit"}
        </button>
        <span className="font-mono text-xs text-muted">
          Target: homepage sections (nav, hero, about, expertise, experience, education,
          contact)
        </span>
      </div>

      {error ? (
        <p className="border-b border-line px-4 py-3 font-mono text-sm text-warn sm:px-5">
          {error}
        </p>
      ) : null}

      {summary ? (
        <div className="grid grid-cols-2 gap-3 border-b border-line px-4 py-4 sm:grid-cols-6 sm:px-5">
          {[
            ["Section pass", summary.passes, "text-pass"],
            ["Section fail", summary.fails, "text-warn"],
            ["Review", summary.reviews, "text-muted"],
            ["axe violations", summary.axeViolations, "text-warn"],
            ["axe passes", summary.axePasses, "text-pass"],
            ["Duration", `${summary.durationMs} ms`, "text-text"],
          ].map(([label, value, tone]) => (
            <div key={String(label)} className="border border-line bg-bg/50 px-3 py-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                {label}
              </p>
              <p className={`mt-1 font-mono text-sm ${tone}`}>{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-line px-3 py-3 lg:border-b-0 lg:border-r">
          <p className="mb-2 px-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Sections
          </p>
          <button
            type="button"
            onClick={() => setSelectedSection("all")}
            className={`mb-1 w-full px-2 py-2 text-left font-mono text-xs ${
              selectedSection === "all"
                ? "bg-accent-soft text-accent"
                : "text-muted hover:text-text"
            }`}
          >
            All sections
          </button>
          {wcagSections.map((section) => {
            const fails = checks.filter(
              (item) => item.sectionId === section.id && item.status === "fail",
            ).length;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setSelectedSection(section.id)}
                className={`mb-1 flex w-full items-center justify-between px-2 py-2 text-left font-mono text-xs ${
                  selectedSection === section.id
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-text"
                }`}
              >
                <span>{section.label}</span>
                {checks.length ? (
                  <span className={fails ? "text-warn" : "text-pass"}>
                    {fails ? `${fails} fail` : "ok"}
                  </span>
                ) : null}
              </button>
            );
          })}
        </aside>

        <div className="min-w-0 px-4 py-3 sm:px-5">
          <div className="mb-4 overflow-hidden border border-line bg-bg">
            <div className="flex items-center justify-between border-b border-line px-3 py-2 font-mono text-[0.65rem] text-muted">
              <span>Live page preview</span>
              <span>{ready ? "ready" : "loading..."}</span>
            </div>
            <iframe
              ref={iframeRef}
              id="wcag-preview-frame"
              title="Portfolio homepage preview for WCAG audit"
              src={homeHref()}
              className="h-[220px] w-full bg-bg"
              onLoad={() => setReady(true)}
            />
          </div>

          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Section checks
          </p>
          {filteredChecks.length ? (
            <ul className="mb-5 space-y-2">
              {filteredChecks.map((item) => (
                <li
                  key={`${item.sectionId}-${item.id}`}
                  className="border border-line bg-bg/40 px-3 py-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-text">{item.title}</p>
                      <p className="mt-1 font-mono text-[0.68rem] text-muted">
                        {item.sectionLabel} · {item.criterion} · Level {item.level}
                      </p>
                      <p className="mt-1 font-mono text-[0.68rem] text-text/75">
                        {item.detail}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-[0.7rem] uppercase ${
                        item.status === "pass"
                          ? "text-pass"
                          : item.status === "fail"
                            ? "text-warn"
                            : "text-muted"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-5 text-sm text-muted">
              Run the audit to evaluate WCAG checks per section.
            </p>
          )}

          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            axe-core violations
          </p>
          {violations.length ? (
            <ul className="space-y-2">
              {violations.map((violation) => (
                <li key={violation.id} className="border border-warn/30 bg-bg/40 px-3 py-2">
                  <p className="text-sm text-text">
                    <span className="font-mono text-warn">
                      [{impactTone(violation.impact)}]
                    </span>{" "}
                    {violation.help}
                  </p>
                  <p className="mt-1 font-mono text-[0.68rem] text-muted">
                    {violation.id} · {violation.tags.filter((tag) => tag.startsWith("wcag")).join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-muted">{violation.description}</p>
                  <ul className="mt-2 space-y-1 font-mono text-[0.65rem] text-text/70">
                    {violation.nodes.slice(0, 3).map((node: NodeResult, index) => (
                      <li key={`${violation.id}-${index}`} className="truncate">
                        {node.target.join(" ")}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : summary ? (
            <p className="font-mono text-sm text-pass">
              No axe-core violations found on the homepage preview.
            </p>
          ) : (
            <p className="text-sm text-muted">
              axe results will appear here after running the audit.
            </p>
          )}

          {passes.length && summary ? (
            <p className="mt-4 font-mono text-xs text-muted">
              axe also reported {passes.length} passing rule groups on this page.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
