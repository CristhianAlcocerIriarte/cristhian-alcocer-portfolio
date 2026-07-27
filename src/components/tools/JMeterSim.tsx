"use client";

import { useEffect, useMemo, useState } from "react";
import { executeMockApi, portfolioCollection } from "@/lib/tools/mock-api";

type Sample = {
  path: string;
  method: string;
  elapsed: number;
  success: boolean;
};

type RunStats = {
  samples: number;
  errors: number;
  avg: number;
  min: number;
  max: number;
  throughput: number;
};

const endpoints = portfolioCollection
  .filter((item) => item.method === "GET" || item.id === "post-contact")
  .slice(0, 6);

export function JMeterSim() {
  const [users, setUsers] = useState(20);
  const [loops, setLoops] = useState(3);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const stats: RunStats | null = useMemo(() => {
    if (!samples.length) return null;
    const times = samples.map((sample) => sample.elapsed);
    const errors = samples.filter((sample) => !sample.success).length;
    const totalTime = times.reduce((sum, value) => sum + value, 0);
    return {
      samples: samples.length,
      errors,
      avg: Math.round(totalTime / times.length),
      min: Math.min(...times),
      max: Math.max(...times),
      throughput: Number((samples.length / (totalTime / 1000 || 1)).toFixed(2)),
    };
  }, [samples]);

  useEffect(() => {
    if (!running) return;
    let cancelled = false;

    const run = async () => {
      const nextSamples: Sample[] = [];
      const nextLog: string[] = [
        `Starting Thread Group: ${users} users x ${loops} loops`,
      ];
      const total = users * loops * endpoints.length;
      let done = 0;

      for (let loop = 1; loop <= loops; loop += 1) {
        for (let user = 1; user <= users; user += 1) {
          if (cancelled) return;
          for (const endpoint of endpoints) {
            const body =
              endpoint.method === "POST"
                ? {
                    name: `Virtual User ${user}`,
                    email: `vu${user}@load.test`,
                    message: `JMeter loop ${loop}`,
                  }
                : undefined;
            const response = await executeMockApi({
              method: endpoint.method,
              path: endpoint.path,
              body,
            });
            const sample: Sample = {
              path: endpoint.path,
              method: endpoint.method,
              elapsed: response.latencyMs + Math.round(Math.random() * 25),
              success: response.status < 400,
            };
            nextSamples.push(sample);
            done += 1;
            if (done % Math.max(1, Math.floor(total / 12)) === 0 || done === total) {
              nextLog.push(
                `VU-${user} ${endpoint.method} ${endpoint.path} -> ${response.status} (${sample.elapsed} ms)`,
              );
              setSamples([...nextSamples]);
              setLog([...nextLog]);
              setProgress(Math.round((done / total) * 100));
            }
          }
        }
      }

      nextLog.push("TearDown complete. Aggregate report ready.");
      setLog([...nextLog]);
      setSamples([...nextSamples]);
      setProgress(100);
      setRunning(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [running, users, loops]);

  return (
    <div className="min-h-[560px] border border-line bg-surface/40">
      <div className="border-b border-line px-4 py-3 sm:px-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
          Test Plan
        </p>
        <h3 className="mt-1 text-lg text-text">Portfolio API Load Test</h3>
        <p className="mt-1 text-sm text-muted">
          Thread Group hits the same mock APIs exposed in the Postman collection.
        </p>
      </div>

      <div className="grid gap-4 border-b border-line px-4 py-4 sm:grid-cols-3 sm:px-5">
        <label className="block">
          <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Threads (users)
          </span>
          <input
            type="number"
            min={1}
            max={50}
            value={users}
            disabled={running}
            onChange={(event) => setUsers(Number(event.target.value))}
            className="w-full border border-line-strong bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Loop count
          </span>
          <input
            type="number"
            min={1}
            max={10}
            value={loops}
            disabled={running}
            onChange={(event) => setLoops(Number(event.target.value))}
            className="w-full border border-line-strong bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-accent"
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            className="btn btn-primary w-full"
            disabled={running}
            onClick={() => {
              setSamples([]);
              setLog([]);
              setProgress(0);
              setRunning(true);
            }}
          >
            {running ? "Running..." : "Start test"}
          </button>
        </div>
      </div>

      <div className="border-b border-line px-4 py-3 sm:px-5">
        <div className="mb-2 flex items-center justify-between font-mono text-xs text-muted">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden bg-bg">
          <div
            className="h-full bg-accent transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 gap-3 border-b border-line px-4 py-4 sm:grid-cols-5 sm:px-5">
          {[
            ["Samples", stats.samples],
            ["Errors", stats.errors],
            ["Avg ms", stats.avg],
            ["Min/Max", `${stats.min}/${stats.max}`],
            ["Throughput", `${stats.throughput}/s`],
          ].map(([label, value]) => (
            <div key={label} className="border border-line bg-bg/50 px-3 py-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                {label}
              </p>
              <p className="mt-1 font-mono text-sm text-text">{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-line px-4 py-3 lg:border-b-0 lg:border-r lg:px-5">
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Samplers
          </p>
          <ul className="space-y-1 font-mono text-xs text-muted">
            {endpoints.map((endpoint) => (
              <li key={endpoint.id}>
                <span className="text-accent">{endpoint.method}</span> {endpoint.path}
              </li>
            ))}
          </ul>
        </div>
        <div className="max-h-[260px] overflow-y-auto px-4 py-3 lg:px-5">
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            View Results Tree
          </p>
          <pre className="whitespace-pre-wrap font-mono text-[0.7rem] leading-relaxed text-text/85">
            {log.length ? log.join("\n") : "No results yet. Start the test plan."}
          </pre>
        </div>
      </div>
    </div>
  );
}
