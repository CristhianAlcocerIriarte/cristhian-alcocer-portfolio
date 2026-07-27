"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  liveSuiteMeta,
  liveTestCases,
  runLiveSuite,
  type LiveTestStatus,
} from "@/lib/live-suite";

type RowState = {
  status: LiveTestStatus;
  durationMs?: number;
  error?: string;
};

type SuitePhase = "idle" | "running" | "done";

const idleRows = (): Record<string, RowState> =>
  Object.fromEntries(
    liveTestCases.map((test) => [test.id, { status: "idle" as const }]),
  );

function statusIcon(status: LiveTestStatus) {
  if (status === "passed") return "✓";
  if (status === "failed") return "✘";
  if (status === "running") return "●";
  return "○";
}

export function TestRunner() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<SuitePhase>("idle");
  const [rows, setRows] = useState<Record<string, RowState>>(idleRows);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const runIdRef = useRef(0);

  const passed = useMemo(
    () => Object.values(rows).filter((row) => row.status === "passed").length,
    [rows],
  );
  const failed = useMemo(
    () => Object.values(rows).filter((row) => row.status === "failed").length,
    [rows],
  );

  useEffect(() => {
    document.documentElement.dataset.appReady = "true";
  }, []);

  useEffect(() => {
    if (phase !== "running" || !startedAt) return;
    const id = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt);
    }, 80);
    return () => window.clearInterval(id);
  }, [phase, startedAt]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const runSuite = useCallback(async () => {
    const runId = ++runIdRef.current;
    const start = performance.now();
    setPhase("running");
    setStartedAt(start);
    setElapsedMs(0);
    setRows(idleRows());

    await runLiveSuite(({ id, status, durationMs, error }) => {
      if (runId !== runIdRef.current) return;
      setRows((current) => ({
        ...current,
        [id]: { status, durationMs, error },
      }));
    });

    if (runId !== runIdRef.current) return;
    setPhase("done");
    setElapsedMs(performance.now() - start);
  }, []);

  const openAndRun = useCallback(() => {
    setOpen(true);
    window.setTimeout(() => {
      void runSuite();
    }, 280);
  }, [runSuite]);

  const close = useCallback(() => {
    runIdRef.current += 1;
    setOpen(false);
    setPhase("idle");
  }, []);

  return (
    <>
      <button
        type="button"
        data-testid="run-suite-fab"
        onClick={openAndRun}
        className="suite-fab group fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 border border-accent/50 bg-bg/90 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-accent hover:bg-accent-soft"
        aria-haspopup="dialog"
      >
        <span className="relative flex h-8 w-8 items-center justify-center bg-accent text-bg">
          <span className="font-mono text-sm font-bold">▶</span>
          <span className="suite-fab-ping pointer-events-none absolute inset-0 bg-accent/40" aria-hidden />
        </span>
        <span className="text-left">
          <span className="block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">
            Playwright
          </span>
          <span className="block text-sm font-medium text-text">Run full suite</span>
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="test-runner-title"
              data-testid="test-runner"
              className="terminal-window flex max-h-[min(92vh,860px)] w-full max-w-3xl flex-col overflow-hidden"
              initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="terminal-chrome justify-between">
                <div className="flex items-center gap-2">
                  <span className="terminal-dot" />
                  <span className="terminal-dot" />
                  <span className="terminal-dot" />
                  <span
                    id="test-runner-title"
                    data-testid="test-runner-title"
                    className="ml-2 font-mono text-[0.75rem] text-text"
                  >
                    npx playwright test · {liveSuiteMeta.suiteName}
                  </span>
                </div>
                <button
                  type="button"
                  data-testid="test-runner-close"
                  onClick={close}
                  className="font-mono text-xs text-muted transition hover:text-text"
                >
                  Esc · Close
                </button>
              </div>

              <div className="border-b border-line px-4 py-3 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
                      Live automated validation
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Executes real assertions against this page - same coverage as
                      the Playwright e2e suite.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost !min-h-9 !px-3 !text-xs"
                    onClick={() => {
                      void runSuite();
                    }}
                    disabled={phase === "running"}
                  >
                    Re-run
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="border border-line bg-bg/40 px-3 py-2">
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                      Status
                    </p>
                    <p className="mt-1 font-mono text-sm text-text">
                      {phase === "running"
                        ? "RUNNING"
                        : phase === "done"
                          ? failed
                            ? "FAILED"
                            : "PASSED"
                          : "IDLE"}
                    </p>
                  </div>
                  <div className="border border-line bg-bg/40 px-3 py-2">
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                      Passed
                    </p>
                    <p className="mt-1 font-mono text-sm text-pass">
                      {passed}/{liveTestCases.length}
                    </p>
                  </div>
                  <div className="border border-line bg-bg/40 px-3 py-2">
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                      Failed
                    </p>
                    <p className="mt-1 font-mono text-sm text-warn">{failed}</p>
                  </div>
                  <div className="border border-line bg-bg/40 px-3 py-2">
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                      Duration
                    </p>
                    <p className="mt-1 font-mono text-sm text-text">
                      {(elapsedMs / 1000).toFixed(2)}s
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3 font-mono text-[0.78rem] sm:px-4">
                {liveTestCases.map((test) => {
                  const row = rows[test.id] ?? { status: "idle" as const };
                  const color =
                    row.status === "passed"
                      ? "text-pass"
                      : row.status === "failed"
                        ? "text-warn"
                        : row.status === "running"
                          ? "text-accent"
                          : "text-muted";

                  return (
                    <div
                      key={test.id}
                      className={`border border-transparent px-2 py-2 ${
                        row.status === "running"
                          ? "border-accent/30 bg-accent-soft/40"
                          : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
                        <span className={`${color} mt-0.5`}>
                          {statusIcon(row.status)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-text/90">{test.title}</p>
                          <p className="text-[0.68rem] text-muted">{test.file}</p>
                          {row.error ? (
                            <p className="mt-1 text-warn">{row.error}</p>
                          ) : null}
                        </div>
                        <span className="text-muted">
                          {row.durationMs
                            ? `${row.durationMs}ms`
                            : row.status === "running"
                              ? "…"
                              : "-"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-line px-4 py-3 font-mono text-[0.72rem] text-muted sm:px-5">
                {phase === "done" ? (
                  <p>
                    Test Suites:{" "}
                    <span className={failed ? "text-warn" : "text-pass"}>
                      {failed ? "1 failed" : "1 passed"}
                    </span>
                    , 1 total · Tests:{" "}
                    <span className="text-pass">{passed} passed</span>
                    {failed ? (
                      <>
                        , <span className="text-warn">{failed} failed</span>
                      </>
                    ) : null}
                    , {liveTestCases.length} total · Ran in{" "}
                    {(elapsedMs / 1000).toFixed(2)}s
                    <span className="cursor-blink" aria-hidden />
                  </p>
                ) : (
                  <p>
                    Running {liveSuiteMeta.project} · collecting{" "}
                    {liveTestCases.length} tests
                    <span className="cursor-blink" aria-hidden />
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function RunSuiteHeroButton() {
  return (
    <button
      type="button"
      data-testid="run-suite-hero"
      className="btn btn-ghost border-accent/40 text-accent hover:bg-accent-soft"
      onClick={() => {
        document
          .querySelector<HTMLButtonElement>('[data-testid="run-suite-fab"]')
          ?.click();
      }}
    >
      ▶ Run Playwright suite
    </button>
  );
}
