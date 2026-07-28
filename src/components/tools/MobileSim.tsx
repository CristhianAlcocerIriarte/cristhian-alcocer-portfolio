"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  checksForPlatform,
  devicesForPlatform,
  mobileLab,
  type MobileDevice,
  type MobileOrientation,
  type MobilePlatform,
} from "@/lib/tools/mobile-data";
import {
  suiteResultPause,
  suiteStepDelay,
  wait,
} from "@/lib/tools/suite-pace";

type CheckStatus = "pass" | "fail" | "review" | "queued" | "running";

type CheckResult = {
  id: string;
  category: string;
  title: string;
  status: CheckStatus;
  detail: string;
  durationMs?: number;
};

type RunSummary = {
  passes: number;
  fails: number;
  reviews: number;
  durationMs: number;
  device: string;
  platform: MobilePlatform;
  orientation: MobileOrientation;
  completed: number;
  total: number;
};

type RunProgress = {
  current: number;
  total: number;
  checkId: string;
  title: string;
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

function minBox(el: Element) {
  const rect = (el as HTMLElement).getBoundingClientRect?.();
  if (!rect) return { w: 0, h: 0 };
  return { w: rect.width, h: rect.height };
}

function evaluateMobileCheck(
  doc: Document,
  platform: MobilePlatform,
  viewportWidth: number,
  checkId: string,
): Omit<CheckResult, "id" | "category" | "title"> {
  let status: CheckStatus = "fail";
  let detail = "Check failed.";

  switch (checkId) {
    case "viewport-meta": {
      const meta = query(doc, 'meta[name="viewport"]') as HTMLMetaElement | null;
      const content = meta?.content ?? "";
      const ok = /width\s*=\s*device-width/i.test(content);
      status = ok ? "pass" : "fail";
      detail = content ? `content="${content}"` : "Missing viewport meta";
      break;
    }
    case "no-user-scalable-lock": {
      const meta = query(doc, 'meta[name="viewport"]') as HTMLMetaElement | null;
      const content = (meta?.content ?? "").toLowerCase();
      const locked =
        /user-scalable\s*=\s*no/.test(content) ||
        /maximum-scale\s*=\s*1([^\d.]|$)/.test(content);
      status = locked ? "fail" : "pass";
      detail = locked
        ? "Viewport locks zoom (user-scalable/maximum-scale)"
        : "Zoom not locked by viewport meta";
      break;
    }
    case "no-horizontal-overflow": {
      const root = doc.documentElement;
      const overflow = root.scrollWidth - root.clientWidth;
      status = overflow <= 1 ? "pass" : "fail";
      detail =
        overflow <= 1
          ? `No overflow (scrollWidth=${root.scrollWidth})`
          : `Horizontal overflow ${overflow}px at ${viewportWidth}px width`;
      break;
    }
    case "touch-targets": {
      const ctas = [
        query(doc, '[data-testid="cta-experience"]'),
        query(doc, '[data-testid="cta-linkedin"]'),
        query(doc, '[data-testid="cta-tools"]'),
      ].filter(Boolean) as Element[];
      if (!ctas.length) {
        status = "fail";
        detail = "Hero CTAs not found";
        break;
      }
      const undersized = ctas.filter((el) => {
        const { w, h } = minBox(el);
        return w < 44 || h < 44;
      });
      status = undersized.length === 0 ? "pass" : "fail";
      detail =
        undersized.length === 0
          ? `${ctas.length} CTAs ≥ 44×44px`
          : `${undersized.length}/${ctas.length} CTAs below 44×44px`;
      break;
    }
    case "mobile-nav": {
      if (viewportWidth >= 1024) {
        status = "review";
        detail = "Desktop width — compact nav not required";
        break;
      }
      const menuBtn = queryAll(doc, "button").find((btn) =>
        /menu|close/i.test(btn.textContent ?? ""),
      );
      const mobileNav = query(doc, "#mobile-nav");
      status = menuBtn || mobileNav ? "pass" : "fail";
      detail = menuBtn
        ? `Found mobile menu control: "${(menuBtn.textContent || "").trim()}"`
        : mobileNav
          ? "mobile-nav landmark present"
          : "No mobile menu control found";
      break;
    }
    case "tap-not-hover-only": {
      const ctas = [
        query(doc, '[data-testid="cta-experience"]'),
        query(doc, '[data-testid="cta-linkedin"]'),
        query(doc, '[data-testid="cta-tools"]'),
      ].filter(Boolean) as Element[];
      const interactive = ctas.every(
        (el) => el.tagName === "A" || el.tagName === "BUTTON",
      );
      status = ctas.length > 0 && interactive ? "pass" : "fail";
      detail = interactive
        ? "Hero CTAs are tap-capable anchors/buttons"
        : "Hero CTAs missing or not interactive elements";
      break;
    }
    case "body-font-size": {
      const body = doc.body;
      const size = body
        ? Number.parseFloat(
            doc.defaultView?.getComputedStyle(body).fontSize || "0",
          )
        : 0;
      status = size >= 16 ? "pass" : "fail";
      detail = `body font-size: ${size || "n/a"}px`;
      break;
    }
    case "safe-scroll-margin": {
      const about = query(doc, "#about") as HTMLElement | null;
      const contact = query(doc, "#contact") as HTMLElement | null;
      const aboutMargin = about
        ? Number.parseFloat(
            doc.defaultView?.getComputedStyle(about).scrollMarginTop || "0",
          )
        : 0;
      const contactMargin = contact
        ? Number.parseFloat(
            doc.defaultView?.getComputedStyle(contact).scrollMarginTop || "0",
          )
        : 0;
      status = aboutMargin >= 40 && contactMargin >= 40 ? "pass" : "fail";
      detail = `scroll-margin-top about=${aboutMargin}px contact=${contactMargin}px`;
      break;
    }
    case "skip-link": {
      const skip = queryAll(doc, "a").find((a) =>
        /skip to main content/i.test(a.textContent ?? ""),
      );
      status = skip ? "pass" : "fail";
      detail = skip
        ? `Skip link -> ${skip.getAttribute("href")}`
        : "Skip link not found";
      break;
    }
    case "main-landmark": {
      const main = query(doc, "main#main, main, [role='main']");
      status = main ? "pass" : "fail";
      detail = main ? "main landmark present" : "main landmark missing";
      break;
    }
    case "android-touch-action": {
      const samples = [
        ...queryAll(doc, "button").slice(0, 4),
        ...queryAll(doc, "a.btn, .btn").slice(0, 4),
      ];
      if (!samples.length) {
        status = "review";
        detail = "No sample controls found";
        break;
      }
      const withManipulation = samples.filter((el) => {
        const value =
          doc.defaultView?.getComputedStyle(el as Element).touchAction || "";
        return /manipulation|none|pan-y|pan-x/.test(value);
      });
      status =
        withManipulation.length >= Math.ceil(samples.length / 2)
          ? "pass"
          : "review";
      detail = `${withManipulation.length}/${samples.length} controls declare touch-action`;
      break;
    }
    case "ios-tap-highlight": {
      const ctas = [
        query(doc, '[data-testid="cta-experience"]'),
        query(doc, '[data-testid="cta-tools"]'),
      ].filter(Boolean) as HTMLElement[];
      const focusable = ctas.every(
        (el) =>
          el.tagName === "A" || el.tagName === "BUTTON" || el.tabIndex >= 0,
      );
      status = ctas.length > 0 && focusable ? "pass" : "fail";
      detail = focusable
        ? "Primary CTAs remain focusable for VoiceOver / keyboard"
        : "Primary CTAs not focusable";
      break;
    }
    default:
      status = "review";
      detail = "Unhandled check";
  }

  return { status, detail };
}

export function MobileSim() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const runIdRef = useRef(0);
  const [platform, setPlatform] = useState<MobilePlatform>("android");
  const [orientation, setOrientation] =
    useState<MobileOrientation>("portrait");
  const [deviceId, setDeviceId] = useState("pixel-8");
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [progress, setProgress] = useState<RunProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const platformDevices = useMemo(
    () => devicesForPlatform(platform),
    [platform],
  );

  const device: MobileDevice =
    platformDevices.find((item) => item.id === deviceId) ?? platformDevices[0];

  useEffect(() => {
    if (!platformDevices.some((item) => item.id === deviceId)) {
      setDeviceId(platformDevices[0]?.id ?? "pixel-8");
    }
  }, [platform, platformDevices, deviceId]);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!progress) return;
    const node = resultsRef.current?.querySelector(
      `[data-check-id="${progress.checkId}"]`,
    );
    node?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [progress]);

  const frameWidth =
    orientation === "portrait" ? device.width : device.height;
  const frameHeight =
    orientation === "portrait" ? device.height : device.width;

  // Fit device preview into the available panel (~min of 320–420 CSS px wide).
  const previewScale = Math.min(1, 320 / frameWidth);

  const liveCounts = useMemo(() => {
    const passes = results.filter((item) => item.status === "pass").length;
    const fails = results.filter((item) => item.status === "fail").length;
    const reviews = results.filter((item) => item.status === "review").length;
    const done = passes + fails + reviews;
    return { passes, fails, reviews, done, total: results.length };
  }, [results]);

  const runSuite = async () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc?.body) {
      setError("Device preview is not ready yet. Wait a moment and retry.");
      return;
    }

    const runId = ++runIdRef.current;
    const defs = checksForPlatform(platform);
    const stepDelay = suiteStepDelay(420);
    const started = performance.now();

    setRunning(true);
    setError(null);
    setSummary(null);
    setProgress(null);

    // Nudge layout to the simulated viewport before measuring.
    iframe.style.width = `${frameWidth}px`;
    iframe.style.height = `${frameHeight}px`;

    const queued: CheckResult[] = defs.map((check) => ({
      id: check.id,
      category: check.category,
      title: check.title,
      status: "queued",
      detail: "Queued…",
    }));
    setResults(queued);

    let latest = queued;

    try {
      for (let index = 0; index < defs.length; index += 1) {
        if (runIdRef.current !== runId) return;

        const check = defs[index];
        setProgress({
          current: index + 1,
          total: defs.length,
          checkId: check.id,
          title: check.title,
        });

        latest = latest.map((item) =>
          item.id === check.id
            ? {
                ...item,
                status: "running",
                detail: "Executing…",
              }
            : item,
        );
        setResults(latest);

        // Let React paint the running state before evaluating.
        await wait(stepDelay);
        if (runIdRef.current !== runId) return;

        const checkStarted = performance.now();
        const outcome = evaluateMobileCheck(
          doc,
          platform,
          frameWidth,
          check.id,
        );
        const durationMs = Math.max(
          12,
          Math.round(performance.now() - checkStarted),
        );

        latest = latest.map((item) =>
          item.id === check.id
            ? {
                ...item,
                status: outcome.status,
                detail: outcome.detail,
                durationMs,
              }
            : item,
        );
        setResults(latest);

        await wait(suiteResultPause(stepDelay));
      }

      if (runIdRef.current !== runId) return;

      setSummary({
        passes: latest.filter((item) => item.status === "pass").length,
        fails: latest.filter((item) => item.status === "fail").length,
        reviews: latest.filter((item) => item.status === "review").length,
        durationMs: Math.round(performance.now() - started),
        device: device.name,
        platform,
        orientation,
        completed: latest.length,
        total: latest.length,
      });
      setProgress(null);
    } catch (err) {
      if (runIdRef.current !== runId) return;
      setError(err instanceof Error ? err.message : "Mobile suite failed");
      setProgress(null);
    } finally {
      if (runIdRef.current === runId) {
        setRunning(false);
      }
    }
  };

  const reloadPreview = () => {
    runIdRef.current += 1;
    setRunning(false);
    setReady(false);
    setResults([]);
    setSummary(null);
    setProgress(null);
    setError(null);
    setIframeKey((value) => value + 1);
  };

  return (
    <div className="min-h-[560px] border border-line bg-surface/40">
      <div className="border-b border-line px-4 py-3 sm:px-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
          Mobile lab
        </p>
        <h3 className="mt-1 text-lg text-text">{mobileLab.title}</h3>
        <p className="mt-1 text-sm text-muted">{mobileLab.subtitle}</p>
        <p className="mt-2 font-mono text-[0.68rem] text-muted">
          {mobileLab.appiumNote}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex gap-2">
          {(["android", "ios"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPlatform(item)}
              disabled={running}
              className={`border px-3 py-2 font-mono text-xs uppercase tracking-wider transition ${
                platform === item
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line-strong text-muted hover:text-text"
              } disabled:opacity-50`}
            >
              {item === "android" ? "Android" : "iOS"}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 font-mono text-xs text-muted">
          Device
          <select
            value={device.id}
            disabled={running}
            onChange={(event) => setDeviceId(event.target.value)}
            className="border border-line-strong bg-bg px-2 py-1.5 text-text outline-none focus:border-accent disabled:opacity-50"
          >
            {platformDevices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.width}×{item.height}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-2">
          {(["portrait", "landscape"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOrientation(item)}
              disabled={running}
              className={`border px-2.5 py-1.5 font-mono text-[0.7rem] capitalize transition ${
                orientation === item
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line-strong text-muted hover:text-text"
              } disabled:opacity-50`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!ready || running}
          onClick={() => {
            void runSuite();
          }}
        >
          {running
            ? progress
              ? `Running ${progress.current}/${progress.total}…`
              : "Running…"
            : "Run mobile suite"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={running}
          onClick={reloadPreview}
        >
          Reload preview
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-line px-4 py-2 font-mono text-[0.68rem] text-muted sm:px-5">
        <span>
          OS {device.os} · DPR {device.dpr}
        </span>
        <span>
          Viewport {frameWidth}×{frameHeight}
        </span>
        <span>{device.framework}</span>
        <span>{ready ? "preview ready" : "loading preview…"}</span>
      </div>

      {error ? (
        <p className="border-b border-line px-4 py-3 font-mono text-sm text-warn sm:px-5">
          {error}
        </p>
      ) : null}

      {progress ? (
        <div className="border-b border-line px-4 py-3 sm:px-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs text-accent">
              Executing {progress.current}/{progress.total}: {progress.title}
            </p>
            <p className="font-mono text-[0.68rem] text-muted">
              {liveCounts.passes} pass · {liveCounts.fails} fail ·{" "}
              {liveCounts.reviews} review
            </p>
          </div>
          <div className="h-1.5 overflow-hidden border border-line bg-bg">
            <div
              className="h-full bg-accent transition-[width] duration-300 ease-out"
              style={{
                width: `${Math.round((progress.current / progress.total) * 100)}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      {summary || (running && liveCounts.total > 0) ? (
        <div className="grid grid-cols-2 gap-3 border-b border-line px-4 py-4 sm:grid-cols-5 sm:px-5">
          {[
            ["Pass", summary?.passes ?? liveCounts.passes, "text-pass"],
            ["Fail", summary?.fails ?? liveCounts.fails, "text-warn"],
            ["Review", summary?.reviews ?? liveCounts.reviews, "text-muted"],
            [
              "Duration",
              summary ? `${summary.durationMs} ms` : "…",
              "text-text",
            ],
            [
              "Target",
              summary
                ? `${summary.device} · ${summary.orientation}`
                : `${device.name} · ${orientation}`,
              "text-accent",
            ],
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

      <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.95fr)_1.05fr]">
        <div className="flex justify-center border-b border-line px-4 py-6 lg:border-b-0 lg:border-r sm:px-5">
          <div
            className="relative"
            style={{
              width: frameWidth * previewScale,
              height: frameHeight * previewScale,
            }}
          >
            <div
              className={`absolute inset-0 overflow-hidden border border-line-strong bg-black shadow-[0_24px_60px_rgba(0,0,0,0.45)] ${
                platform === "ios" ? "rounded-[2rem]" : "rounded-[1.25rem]"
              }`}
            >
              <div
                className={`flex items-center justify-between px-4 font-mono text-[0.55rem] text-white/80 ${
                  platform === "ios" ? "h-8 pt-1" : "h-7"
                }`}
              >
                <span>{platform === "ios" ? "Carrier" : "5G"}</span>
                <span className="opacity-70">
                  {platform === "ios" ? "9:41" : "12:00"}
                </span>
                <span>{platform === "ios" ? "100%" : "100% ▮"}</span>
              </div>
              {platform === "ios" ? (
                <div
                  className="pointer-events-none absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black"
                  aria-hidden
                />
              ) : null}
              <div
                className="origin-top-left bg-bg"
                style={{
                  width: frameWidth,
                  height: frameHeight - (platform === "ios" ? 32 : 28),
                  transform: `scale(${previewScale})`,
                }}
              >
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  title={`${device.name} portfolio preview`}
                  src={homeHref()}
                  className="border-0 bg-bg"
                  style={{
                    width: frameWidth,
                    height: frameHeight - (platform === "ios" ? 32 : 28),
                  }}
                  onLoad={() => setReady(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 px-4 py-4 sm:px-5">
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Mobile suite results
            {running && progress
              ? ` · ${progress.current}/${progress.total}`
              : summary
                ? ` · ${summary.completed}/${summary.total}`
                : ""}
          </p>
          {results.length ? (
            <ul ref={resultsRef} className="space-y-2">
              {results.map((item) => (
                <li
                  key={item.id}
                  data-check-id={item.id}
                  className={`border px-3 py-2 transition-colors duration-200 ${
                    item.status === "running"
                      ? "border-accent/40 bg-accent-soft/40"
                      : "border-line bg-bg/40"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-text">{item.title}</p>
                      <p className="mt-1 font-mono text-[0.68rem] text-muted">
                        {item.category} · {item.id}
                        {item.durationMs != null
                          ? ` · ${item.durationMs}ms`
                          : ""}
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
                            : item.status === "running"
                              ? "text-accent"
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
            <p className="text-sm text-muted">
              Pick Android or iOS, choose a device, then run the mobile suite against
              the live portfolio preview. Checks execute one by one so you can follow
              progress.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
