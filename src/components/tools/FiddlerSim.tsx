"use client";

import { useMemo, useState } from "react";
import {
  fiddlerCapture,
  fiddlerFilters,
  fiddlerSessions,
  matchesFiddlerFilter,
  type FiddlerSession,
} from "@/lib/tools/fiddler-data";

type InspectorTab = "headers" | "textview" | "raw";

function statusTone(code: number) {
  if (code >= 200 && code < 300) return "text-pass";
  if (code >= 300 && code < 400) return "text-accent";
  return "text-warn";
}

export function FiddlerSim() {
  const [filter, setFilter] = useState<(typeof fiddlerFilters)[number]>("All");
  const [selectedId, setSelectedId] = useState(fiddlerSessions[0]?.id ?? "");
  const [capturing, setCapturing] = useState(true);
  const [inspector, setInspector] = useState<InspectorTab>("headers");
  const [side, setSide] = useState<"request" | "response">("response");

  const visible = useMemo(
    () => fiddlerSessions.filter((session) => matchesFiddlerFilter(session, filter)),
    [filter],
  );

  const selected: FiddlerSession =
    visible.find((session) => session.id === selectedId) ??
    visible[0] ??
    fiddlerSessions[0];

  const rawRequest = useMemo(() => {
    if (!selected) return "";
    const lines = [
      `${selected.method} ${selected.url} HTTP/1.1`,
      `Host: ${selected.host}`,
      ...Object.entries(selected.requestHeaders).map(
        ([key, value]) => `${key}: ${value}`,
      ),
      "",
      selected.requestBody ?? "",
    ];
    return lines.join("\n");
  }, [selected]);

  const rawResponse = useMemo(() => {
    if (!selected) return "";
    const lines = [
      `HTTP/1.1 ${selected.result} ${selected.result < 400 ? "OK" : "Error"}`,
      ...Object.entries(selected.responseHeaders).map(
        ([key, value]) => `${key}: ${value}`,
      ),
      "",
      selected.responseBody,
    ];
    return lines.join("\n");
  }, [selected]);

  return (
    <div className="min-h-[560px] min-w-0 overflow-x-hidden border border-line bg-surface/40">
      <div className="border-b border-line px-4 py-3 sm:px-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
          Fiddler lab
        </p>
        <h3 className="mt-1 text-lg text-text">{fiddlerCapture.title}</h3>
        <p className="mt-1 text-sm text-muted">
          HTTP(S) debugging proxy simulation for portfolio traffic: homepage, Tools,
          mock APIs, fonts and WhatsApp redirect.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            className={`btn ${capturing ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setCapturing((value) => !value)}
          >
            {capturing ? "Capturing" : "Paused"}
          </button>
          <span className="break-words font-mono text-xs leading-relaxed text-muted">
            Proxy {fiddlerCapture.proxy} · {fiddlerCapture.gateway}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {fiddlerFilters.map((item) => (
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

      <div className="grid min-w-0 gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0 border-b border-line lg:border-b-0 lg:border-r">
          {/* Mobile: compact session cards */}
          <ul className="max-h-[420px] overflow-y-auto md:hidden">
            {visible.map((session, index) => (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(session.id)}
                  className={`flex w-full min-w-0 flex-col gap-1 border-b border-line/70 px-3 py-3 text-left transition hover:bg-bg/50 ${
                    selected?.id === session.id ? "bg-accent-soft/40" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 font-mono text-[0.65rem] text-muted">
                      {index + 1}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-xs ${statusTone(session.result)}`}
                    >
                      {session.result}
                    </span>
                    <span className="min-w-0 truncate font-mono text-xs text-accent">
                      {session.method} {session.url}
                    </span>
                  </div>
                  <p className="truncate pl-5 font-mono text-[0.65rem] text-muted">
                    {session.protocol} · {session.host}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop: full session table */}
          <div className="hidden max-h-[420px] overflow-y-auto md:block">
            <table className="w-full table-fixed text-left text-xs">
              <thead className="sticky top-0 bg-surface font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                <tr className="border-b border-line">
                  <th className="w-10 px-3 py-2">#</th>
                  <th className="w-14 px-2 py-2">Result</th>
                  <th className="w-16 px-2 py-2">Protocol</th>
                  <th className="w-[22%] px-2 py-2">Host</th>
                  <th className="px-2 py-2">URL</th>
                  <th className="w-16 px-2 py-2">Body</th>
                  <th className="w-[18%] px-3 py-2">Process</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((session, index) => (
                  <tr
                    key={session.id}
                    className={`cursor-pointer border-b border-line/70 hover:bg-bg/50 ${
                      selected?.id === session.id ? "bg-accent-soft/40" : ""
                    }`}
                    onClick={() => setSelectedId(session.id)}
                  >
                    <td className="px-3 py-2 font-mono text-muted">{index + 1}</td>
                    <td className={`px-2 py-2 font-mono ${statusTone(session.result)}`}>
                      {session.result}
                    </td>
                    <td className="px-2 py-2 font-mono text-muted">{session.protocol}</td>
                    <td className="truncate px-2 py-2 text-text/85">{session.host}</td>
                    <td className="truncate px-2 py-2 font-mono text-accent">
                      {session.method} {session.url}
                    </td>
                    <td className="px-2 py-2 font-mono text-muted">
                      {session.bodySize}
                    </td>
                    <td className="truncate px-3 py-2 font-mono text-muted">
                      {session.process}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0 px-4 py-3 sm:px-5">
          {selected ? (
            <>
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                <span className={`font-mono text-sm ${statusTone(selected.result)}`}>
                  {selected.result}
                </span>
                <span className="min-w-0 break-all font-mono text-xs text-accent">
                  {selected.method} {selected.host}
                  {selected.url}
                </span>
                <span className="font-mono text-[0.7rem] text-muted">
                  {selected.durationMs} ms
                </span>
              </div>
              <p className="mt-2 break-words text-sm text-muted">{selected.notes}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(["request", "response"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSide(item)}
                    className={`border px-2.5 py-1 font-mono text-[0.7rem] capitalize ${
                      side === item
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line-strong text-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                {(["headers", "textview", "raw"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setInspector(item)}
                    className={`border px-2.5 py-1 font-mono text-[0.7rem] ${
                      inspector === item
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line-strong text-muted"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-3 max-h-[300px] min-w-0 overflow-x-hidden overflow-y-auto border border-line bg-bg p-3">
                {inspector === "headers" ? (
                  <dl className="space-y-2 font-mono text-[0.72rem]">
                    {Object.entries(
                      side === "request"
                        ? selected.requestHeaders
                        : selected.responseHeaders,
                    ).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-accent">{key}</dt>
                        <dd className="break-all text-text/85">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {inspector === "textview" ? (
                  <pre className="max-w-full whitespace-pre-wrap break-words font-mono text-[0.72rem] leading-relaxed text-text/90">
                    {side === "request"
                      ? selected.requestBody || "(no request body)"
                      : selected.responseBody || "(empty body)"}
                  </pre>
                ) : null}

                {inspector === "raw" ? (
                  <pre className="max-w-full whitespace-pre-wrap break-words font-mono text-[0.72rem] leading-relaxed text-text/90">
                    {side === "request" ? rawRequest : rawResponse}
                  </pre>
                ) : null}
              </div>

              {capturing ? (
                <p className="mt-3 font-mono text-[0.68rem] text-pass">
                  Capture is on - new Tools/API actions would append sessions in a live
                  proxy.
                </p>
              ) : (
                <p className="mt-3 font-mono text-[0.68rem] text-warn">
                  Capture paused.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">No sessions for this filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
