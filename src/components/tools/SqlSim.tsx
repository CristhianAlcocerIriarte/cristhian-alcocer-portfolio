"use client";

import { useMemo, useState } from "react";
import {
  listTables,
  runSql,
  sampleQueries,
  type QueryResult,
  type SqlRow,
} from "@/lib/tools/db";
import {
  suiteResultPause,
  suiteStepDelay,
  wait,
} from "@/lib/tools/suite-pace";

export function SqlSim() {
  const tables = useMemo(() => listTables(), []);
  const [sql, setSql] = useState(sampleQueries[3] ?? "SHOW TABLES;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [visibleRows, setVisibleRows] = useState<SqlRow[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (query = sql) => {
    if (running) return;
    setRunning(true);
    setError(null);
    setResult(null);
    setVisibleRows([]);
    const step = suiteStepDelay(280);

    try {
      await wait(step);
      const next = runSql(query);
      setResult({ ...next, rows: [] });
      await wait(suiteResultPause(step));

      const rows = next.rows;
      if (!rows.length) {
        setResult(next);
        setVisibleRows([]);
        return;
      }

      const chunk = Math.max(1, Math.ceil(rows.length / 10));
      for (let i = 0; i < rows.length; i += chunk) {
        const slice = rows.slice(0, i + chunk);
        setVisibleRows(slice);
        setResult({ ...next, rows: slice, message: next.message });
        await wait(suiteStepDelay(110));
      }
      setVisibleRows(rows);
      setResult(next);
    } catch (err) {
      setResult(null);
      setVisibleRows([]);
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-[560px] border border-line bg-surface/40">
      <div className="border-b border-line px-4 py-3 sm:px-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
          SQL Lab
        </p>
        <h3 className="mt-1 text-lg text-text">portfolio_db</h3>
        <p className="mt-1 text-sm text-muted">
          In-memory database seeded from this page. Supports SELECT, WHERE, ORDER BY,
          LIMIT, SHOW TABLES and DESCRIBE. Result rows stream in gradually.
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-line px-4 py-3 lg:border-b-0 lg:border-r lg:px-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Tables
          </p>
          <ul className="mt-2 space-y-1">
            {tables.map((table) => (
              <li key={table.name}>
                <button
                  type="button"
                  disabled={running}
                  className="font-mono text-xs text-accent hover:underline disabled:opacity-50"
                  onClick={() => {
                    const query = `SELECT * FROM ${table.name} LIMIT 10;`;
                    setSql(query);
                    void execute(query);
                  }}
                >
                  {table.name}
                </button>
                <span className="ml-2 font-mono text-[0.65rem] text-muted">
                  {table.rows.length}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Samples
          </p>
          <ul className="mt-2 space-y-2">
            {sampleQueries.map((query) => (
              <li key={query}>
                <button
                  type="button"
                  disabled={running}
                  className="text-left font-mono text-[0.68rem] leading-snug text-muted hover:text-accent disabled:opacity-50"
                  onClick={() => {
                    setSql(query);
                    void execute(query);
                  }}
                >
                  {query}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="px-4 py-3 sm:px-5">
          <textarea
            value={sql}
            disabled={running}
            onChange={(event) => setSql(event.target.value)}
            rows={6}
            className="w-full resize-y border border-line-strong bg-bg px-3 py-2 font-mono text-xs text-text outline-none focus:border-accent disabled:opacity-50"
            spellCheck={false}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              disabled={running}
              onClick={() => void execute()}
            >
              {running ? "Running…" : "Run query"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={running}
              onClick={() => {
                setSql("SHOW TABLES;");
                void execute("SHOW TABLES;");
              }}
            >
              Show tables
            </button>
          </div>

          <div className="mt-4">
            {error ? (
              <p className="font-mono text-sm text-warn">{error}</p>
            ) : null}
            {running && !result ? (
              <p className="font-mono text-sm text-accent">Executing query…</p>
            ) : null}
            {result ? (
              <>
                <p className="mb-2 font-mono text-xs text-pass">
                  {result.message}
                  {running
                    ? ` · streaming ${visibleRows.length} rows…`
                    : ""}
                </p>
                <div className="max-h-[320px] overflow-auto border border-line">
                  <table className="min-w-full text-left text-xs">
                    <thead className="sticky top-0 bg-surface">
                      <tr>
                        {result.columns.map((column) => (
                          <th
                            key={column}
                            className="border-b border-line px-3 py-2 font-mono font-medium text-muted"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(result.rows.length ? result.rows : visibleRows).map(
                        (row, index) => (
                          <tr key={index} className="odd:bg-bg/40">
                            {result.columns.map((column) => (
                              <td
                                key={column}
                                className="border-b border-line/60 px-3 py-1.5 font-mono text-text/85"
                              >
                                {String(
                                  (row as Record<string, unknown>)[column] ?? "",
                                )}
                              </td>
                            ))}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : !error && !running ? (
              <p className="text-sm text-muted">
                Run a query to inspect portfolio tables.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
