"use client";

import { useMemo, useState } from "react";
import {
  executeMockApi,
  portfolioCollection,
  type CollectionRequest,
  type HttpMethod,
  type MockResponse,
} from "@/lib/tools/mock-api";
import {
  suiteResultPause,
  suiteStepDelay,
  wait,
} from "@/lib/tools/suite-pace";

type SendPhase = "idle" | "connecting" | "headers" | "body" | "done";

export function PostmanSim() {
  const [selectedId, setSelectedId] = useState(portfolioCollection[0]?.id ?? "");
  const selected = useMemo(
    () => portfolioCollection.find((item) => item.id === selectedId) ?? portfolioCollection[0],
    [selectedId],
  );
  const [method, setMethod] = useState<HttpMethod>(selected.method);
  const [path, setPath] = useState(selected.path);
  const [bodyText, setBodyText] = useState(
    selected.body ? JSON.stringify(selected.body, null, 2) : "",
  );
  const [response, setResponse] = useState<MockResponse | null>(null);
  const [statusLine, setStatusLine] = useState<{
    status: number;
    statusText: string;
    latencyMs: number;
  } | null>(null);
  const [visibleBody, setVisibleBody] = useState("");
  const [sending, setSending] = useState(false);
  const [phase, setPhase] = useState<SendPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  const loadRequest = (item: CollectionRequest) => {
    if (sending) return;
    setSelectedId(item.id);
    setMethod(item.method);
    setPath(item.path);
    setBodyText(item.body ? JSON.stringify(item.body, null, 2) : "");
    setResponse(null);
    setStatusLine(null);
    setVisibleBody("");
    setPhase("idle");
    setError(null);
  };

  const send = async () => {
    setSending(true);
    setError(null);
    setResponse(null);
    setStatusLine(null);
    setVisibleBody("");
    const step = suiteStepDelay(320);

    try {
      setPhase("connecting");
      await wait(step);

      let body: unknown;
      if (method !== "GET" && bodyText.trim()) {
        body = JSON.parse(bodyText);
      }
      const result = await executeMockApi({ method, path, body });

      setPhase("headers");
      setStatusLine({
        status: result.status,
        statusText: result.statusText,
        latencyMs: result.latencyMs,
      });
      await wait(suiteResultPause(step));

      setPhase("body");
      const pretty = JSON.stringify(result.body, null, 2);
      const chunk = Math.max(24, Math.ceil(pretty.length / 8));
      for (let i = 0; i < pretty.length; i += chunk) {
        setVisibleBody(pretty.slice(0, i + chunk));
        await wait(suiteStepDelay(90));
      }
      setVisibleBody(pretty);
      setResponse(result);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      setResponse(null);
      setStatusLine(null);
      setVisibleBody("");
      setPhase("idle");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid min-h-[560px] gap-0 overflow-hidden border border-line bg-surface/40 lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line lg:border-b-0 lg:border-r">
        <div className="border-b border-line px-4 py-3">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
            Collection
          </p>
          <p className="mt-1 text-sm text-text">Portfolio APIs</p>
        </div>
        <ul className="max-h-[240px] overflow-y-auto lg:max-h-none">
          {portfolioCollection.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => loadRequest(item)}
                disabled={sending}
                className={`flex w-full items-start gap-2 px-4 py-3 text-left transition disabled:opacity-50 ${
                  selectedId === item.id
                    ? "bg-accent-soft text-text"
                    : "text-muted hover:bg-bg/60 hover:text-text"
                }`}
              >
                <span
                  className={`mt-0.5 font-mono text-[0.65rem] font-semibold ${
                    item.method === "GET"
                      ? "text-pass"
                      : item.method === "POST"
                        ? "text-accent"
                        : "text-warn"
                  }`}
                >
                  {item.method}
                </span>
                <span className="text-sm leading-snug">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-col">
        <div className="border-b border-line px-4 py-3">
          <p className="text-sm text-muted">{selected.description}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <select
              value={method}
              disabled={sending}
              onChange={(event) => setMethod(event.target.value as HttpMethod)}
              className="border border-line-strong bg-bg px-3 py-2 font-mono text-xs text-text outline-none focus:border-accent disabled:opacity-50"
            >
              {(["GET", "POST", "PUT", "DELETE"] as HttpMethod[]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              value={path}
              disabled={sending}
              onChange={(event) => setPath(event.target.value)}
              className="min-w-0 flex-1 border border-line-strong bg-bg px-3 py-2 font-mono text-xs text-text outline-none focus:border-accent disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={sending}
              className="btn btn-primary !min-h-10 !px-4"
            >
              {sending
                ? phase === "connecting"
                  ? "Connecting…"
                  : phase === "headers"
                    ? "Headers…"
                    : phase === "body"
                      ? "Streaming…"
                      : "Sending…"
                : "Send"}
            </button>
          </div>
        </div>

        {method !== "GET" ? (
          <div className="border-b border-line px-4 py-3">
            <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
              Body (JSON)
            </p>
            <textarea
              value={bodyText}
              disabled={sending}
              onChange={(event) => setBodyText(event.target.value)}
              rows={7}
              className="w-full resize-y border border-line-strong bg-bg px-3 py-2 font-mono text-xs text-text outline-none focus:border-accent disabled:opacity-50"
            />
          </div>
        ) : null}

        <div className="flex-1 px-4 py-3">
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Response
            {phase !== "idle" && phase !== "done" ? ` · ${phase}` : ""}
          </p>
          {error ? <p className="font-mono text-sm text-warn">{error}</p> : null}
          {phase === "connecting" ? (
            <p className="font-mono text-sm text-accent">Opening connection…</p>
          ) : null}
          {response || visibleBody || statusLine ? (
            <div className="space-y-3">
              {statusLine ? (
                <div className="flex flex-wrap gap-3 font-mono text-xs">
                  <span className={statusLine.status < 400 ? "text-pass" : "text-warn"}>
                    {statusLine.status} {statusLine.statusText}
                  </span>
                  <span className="text-muted">{statusLine.latencyMs} ms</span>
                </div>
              ) : null}
              {visibleBody || phase === "body" || phase === "done" ? (
                <pre className="max-h-[320px] overflow-auto border border-line bg-bg p-3 font-mono text-[0.72rem] leading-relaxed text-text/90">
                  {visibleBody || "…"}
                </pre>
              ) : phase === "headers" ? (
                <p className="font-mono text-xs text-muted">
                  Status received · waiting for body…
                </p>
              ) : null}
            </div>
          ) : !error && phase === "idle" ? (
            <p className="text-sm text-muted">
              Select a request and click Send to execute the mock portfolio API.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
