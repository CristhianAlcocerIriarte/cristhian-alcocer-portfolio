"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  liveSuiteMeta,
  liveTestCases,
  runLiveTests,
  type LiveTestStatus,
} from "@/lib/live-suite";

type RowState = {
  status: LiveTestStatus;
  durationMs?: number;
  error?: string;
};

type RunMode = "idle" | "running" | "done";

function homeHref() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}/`;
}

function idleRows(): Record<string, RowState> {
  return Object.fromEntries(
    liveTestCases.map((test) => [test.id, { status: "idle" as const }]),
  );
}

function statusTone(status: LiveTestStatus) {
  if (status === "passed") return "text-pass";
  if (status === "failed") return "text-warn";
  if (status === "running") return "text-accent";
  return "text-muted";
}

function statusIcon(status: LiveTestStatus) {
  if (status === "passed") return "✓";
  if (status === "failed") return "✘";
  if (status === "running") return "●";
  return "○";
}

export function PlaywrightSim() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runIdRef = useRef(0);
  const [frameReady, setFrameReady] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(liveTestCases.map((test) => test.id)),
  );
  const [activeId, setActiveId] = useState(liveTestCases[0]?.id ?? "");
  const [rows, setRows] = useState<Record<string, RowState>>(idleRows);
  const [phase, setPhase] = useState<RunMode>("idle");
  const [log, setLog] = useState<string[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const active = useMemo(
    () => liveTestCases.find((test) => test.id === activeId) ?? liveTestCases[0],
    [activeId],
  );

  const passed = useMemo(
    () => Object.values(rows).filter((row) => row.status === "passed").length,
    [rows],
  );
  const failed = useMemo(
    () => Object.values(rows).filter((row) => row.status === "failed").length,
    [rows],
  );

  useEffect(() => {
    if (phase !== "running" || !startedAt) return;
    const id = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt);
    }, 80);
    return () => window.clearInterval(id);
  }, [phase, startedAt]);

  const getRoot = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) {
      throw new Error("Homepage preview is not ready yet");
    }
    return doc;
  }, []);

  const appendLog = useCallback((line: string) => {
    setLog((current) => [...current.slice(-40), line]);
  }, []);

  const beginRun = useCallback(() => {
    const runId = ++runIdRef.current;
    const start = performance.now();
    setPhase("running");
    setStartedAt(start);
    setElapsedMs(0);
    return { runId, start };
  }, []);

  const finishRun = useCallback((runId: number, start: number) => {
    if (runId !== runIdRef.current) return;
    setPhase("done");
    setElapsedMs(performance.now() - start);
  }, []);

  const onUpdate = useCallback(
    (
      runId: number,
      payload: {
        id: string;
        status: LiveTestStatus;
        durationMs?: number;
        error?: string;
      },
    ) => {
      if (runId !== runIdRef.current) return;
      setRows((current) => ({
        ...current,
        [payload.id]: {
          status: payload.status,
          durationMs: payload.durationMs,
          error: payload.error,
        },
      }));
      setActiveId(payload.id);

      const testCase = liveTestCases.find((item) => item.id === payload.id);
      if (payload.status === "running") {
        appendLog(`  ✓ starting: ${testCase?.title ?? payload.id}`);
      } else if (payload.status === "passed") {
        appendLog(
          `  ✓ passed ${payload.durationMs ?? 0}ms · ${testCase?.title ?? payload.id}`,
        );
      } else if (payload.status === "failed") {
        appendLog(
          `  ✘ failed ${payload.durationMs ?? 0}ms · ${payload.error ?? "error"}`,
        );
      }
    },
    [appendLog],
  );

  const runIds = useCallback(
    async (ids: string[], label: string) => {
      if (!ids.length || phase === "running") return;
      let root: Document;
      try {
        root = getRoot();
      } catch (error) {
        appendLog(
          `Error: ${error instanceof Error ? error.message : "Preview unavailable"}`,
        );
        return;
      }

      const { runId, start } = beginRun();
      setRows((current) => {
        const next = { ...current };
        for (const id of ids) {
          next[id] = { status: "idle" };
        }
        return next;
      });
      appendLog(`Running ${ids.length} test(s) · ${label}`);
      appendLog(`Using: ${liveSuiteMeta.specFile} [${liveSuiteMeta.project}]`);

      await runLiveTests(
        ids,
        (payload) => onUpdate(runId, payload),
        root,
      );

      finishRun(runId, start);
      appendLog(`Done in ${Math.round(performance.now() - start)}ms`);
    },
    [appendLog, beginRun, finishRun, getRoot, onUpdate, phase],
  );

  const runAll = () => {
    void runIds(
      liveTestCases.map((test) => test.id),
      "full suite",
    );
  };

  const runSelected = () => {
    void runIds([...selected], "selected");
  };

  const runSingle = (id: string) => {
    void runIds([id], "single");
  };

  const toggleSelected = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(liveTestCases.map((test) => test.id)));
  };

  const selectNone = () => {
    setSelected(new Set());
  };

  const reset = () => {
    runIdRef.current += 1;
    setPhase("idle");
    setRows(idleRows());
    setLog([]);
    setElapsedMs(0);
    setStartedAt(null);
  };

  return (
    <div className="min-h-[560px] border border-line bg-surface/40">
      <div className="border-b border-line px-4 py-3 sm:px-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
          Playwright lab
        </p>
        <h3 className="mt-1 text-lg text-text">{liveSuiteMeta.suiteName}</h3>
        <p className="mt-1 text-sm text-muted">
          Live browser assertions against the portfolio homepage preview. Run one
          test, a selection, or the full suite mapped to{" "}
          <span className="font-mono text-accent">{liveSuiteMeta.specFile}</span>.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!frameReady || phase === "running"}
          onClick={runAll}
        >
          Run all ({liveTestCases.length})
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!frameReady || phase === "running" || selected.size === 0}
          onClick={runSelected}
        >
          Run selected ({selected.size})
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={phase === "running"}
          onClick={reset}
        >
          Reset
        </button>
        <span className="ml-auto font-mono text-xs text-muted">
          {frameReady ? "preview ready" : "loading preview…"} · {passed} passed ·{" "}
          {failed} failed · {(elapsedMs / 1000).toFixed(1)}s
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-line lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
              Spec · {liveSuiteMeta.project}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="font-mono text-[0.65rem] text-accent hover:underline"
                onClick={selectAll}
              >
                all
              </button>
              <button
                type="button"
                className="font-mono text-[0.65rem] text-muted hover:text-accent"
                onClick={selectNone}
              >
                none
              </button>
            </div>
          </div>

          <ul className="max-h-[420px] overflow-y-auto">
            {liveTestCases.map((test, index) => {
              const row = rows[test.id] ?? { status: "idle" as const };
              return (
                <li
                  key={test.id}
                  className={`border-b border-line/70 ${
                    activeId === test.id ? "bg-accent-soft/35" : ""
                  }`}
                >
                  <div className="flex items-start gap-2 px-3 py-3 sm:px-4">
                    <input
                      type="checkbox"
                      className="mt-1 accent-[var(--accent)]"
                      checked={selected.has(test.id)}
                      onChange={() => toggleSelected(test.id)}
                      aria-label={`Select ${test.title}`}
                      disabled={phase === "running"}
                    />
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => setActiveId(test.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs ${statusTone(row.status)}`}
                        >
                          {statusIcon(row.status)}
                        </span>
                        <span className="font-mono text-[0.65rem] text-muted">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate text-sm text-text">{test.title}</span>
                      </div>
                      <p className="mt-1 font-mono text-[0.65rem] text-muted">
                        {row.durationMs ? `${row.durationMs}ms` : "—"}
                        {row.error ? ` · ${row.error}` : ""}
                      </p>
                    </button>
                    <button
                      type="button"
                      className="shrink-0 border border-line-strong px-2 py-1 font-mono text-[0.65rem] text-accent transition hover:border-accent disabled:opacity-40"
                      disabled={!frameReady || phase === "running"}
                      onClick={() => runSingle(test.id)}
                    >
                      Run
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid gap-0">
          <div className="border-b border-line px-4 py-3 sm:px-5">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
              Active test
            </p>
            <p className="mt-1 text-sm text-text">{active?.title}</p>
            <p className="mt-1 font-mono text-[0.7rem] text-muted">
              npx playwright test {liveSuiteMeta.specFile} -g &quot;
              {active?.playwrightName}&quot;
            </p>
            {rows[active?.id ?? ""]?.error ? (
              <p className="mt-2 font-mono text-xs text-warn">
                {rows[active?.id ?? ""].error}
              </p>
            ) : null}
          </div>

          <div className="border-b border-line bg-bg px-4 py-3 sm:px-5">
            <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
              Reporter output
            </p>
            <pre className="max-h-[160px] overflow-auto font-mono text-[0.72rem] leading-relaxed text-text/90">
              {log.length
                ? log.join("\n")
                : "Waiting to run… select tests and click Run."}
            </pre>
          </div>

          <div className="px-4 py-3 sm:px-5">
            <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
              Homepage under test
            </p>
            <div className="overflow-hidden border border-line bg-bg">
              <iframe
                ref={iframeRef}
                title="Portfolio homepage under Playwright tests"
                src={homeHref()}
                className="h-[260px] w-full bg-bg"
                onLoad={() => {
                  const ready = () => {
                    const doc = iframeRef.current?.contentDocument;
                    if (doc?.documentElement.dataset.appReady === "true") {
                      setFrameReady(true);
                      return true;
                    }
                    return false;
                  };
                  if (ready()) return;
                  const timer = window.setInterval(() => {
                    if (ready()) window.clearInterval(timer);
                  }, 120);
                  window.setTimeout(() => {
                    window.clearInterval(timer);
                    if (iframeRef.current?.contentDocument?.body) {
                      setFrameReady(true);
                    }
                  }, 4000);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
