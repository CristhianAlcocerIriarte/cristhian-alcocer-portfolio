"use client";

import { useMemo, useState } from "react";
import {
  listTables,
  runSql,
  sampleQueries,
  type QueryResult,
} from "@/lib/tools/db";

export function SqlSim() {
  const tables = useMemo(() => listTables(), []);
  const [sql, setSql] = useState(sampleQueries[3] ?? "SHOW TABLES;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = (query = sql) => {
    try {
      const next = runSql(query);
      setResult(next);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Query failed");
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
          LIMIT, SHOW TABLES and DESCRIBE.
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
                  className="font-mono text-xs text-accent hover:underline"
                  onClick={() => {
                    const query = `SELECT * FROM ${table.name} LIMIT 10;`;
                    setSql(query);
                    execute(query);
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
                  className="text-left font-mono text-[0.68rem] leading-snug text-muted hover:text-accent"
                  onClick={() => {
                    setSql(query);
                    execute(query);
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
            onChange={(event) => setSql(event.target.value)}
            rows={6}
            className="w-full resize-y border border-line-strong bg-bg px-3 py-2 font-mono text-xs text-text outline-none focus:border-accent"
            spellCheck={false}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={() => execute()}>
              Run query
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSql("SHOW TABLES;");
                execute("SHOW TABLES;");
              }}
            >
              Show tables
            </button>
          </div>

          <div className="mt-4">
            {error ? (
              <p className="font-mono text-sm text-warn">{error}</p>
            ) : null}
            {result ? (
              <>
                <p className="mb-2 font-mono text-xs text-pass">{result.message}</p>
                <div className="max-h-[320px] overflow-auto border border-line">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-bg font-mono text-muted">
                      <tr>
                        {result.columns.map((column) => (
                          <th key={column} className="whitespace-nowrap px-3 py-2">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, index) => (
                        <tr key={index} className="border-t border-line/70">
                          {result.columns.map((column) => (
                            <td
                              key={column}
                              className="max-w-[280px] truncate px-3 py-2 text-text/85"
                              title={String(row[column] ?? "")}
                            >
                              {String(row[column] ?? "NULL")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : !error ? (
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
