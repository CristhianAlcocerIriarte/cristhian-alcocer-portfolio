/** Shared pacing for Tools lab runners so suites feel sequential and readable. */

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Delay between suite steps. Reduced-motion users get a short pause only. */
export function suiteStepDelay(baseMs = 420) {
  return prefersReducedMotion() ? Math.min(40, baseMs) : baseMs;
}

/** Slight pause after a result is shown before starting the next step. */
export function suiteResultPause(stepMs: number) {
  return Math.max(40, Math.round(stepMs * 0.4));
}
