"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { metrics, terminalTests } from "@/lib/content";
import { CountUp } from "@/components/motion/CountUp";

export function TerminalPanel() {
  const reduceMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const timers: number[] = [];

    if (reduceMotion) {
      timers.push(
        window.setTimeout(() => {
          setVisibleLines(terminalTests.length);
          setShowSummary(true);
        }, 0),
      );
      return () => timers.forEach((id) => window.clearTimeout(id));
    }

    terminalTests.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleLines(index + 1);
        }, 280 + index * 220),
      );
    });

    timers.push(
      window.setTimeout(
        () => setShowSummary(true),
        280 + terminalTests.length * 220 + 160,
      ),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduceMotion]);

  return (
    <div className="terminal-window overflow-hidden">
      <div className="terminal-chrome">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="ml-2 font-mono text-[0.7rem] text-muted">
          qa-lead.spec.ts
        </span>
        <span className="ml-auto font-mono text-[0.65rem] uppercase tracking-wider text-pass">
          passing
        </span>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-3 border-b border-line pb-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="min-w-0">
              <CountUp
                value={metric.value}
                suffix={metric.suffix}
                decimals={metric.decimals}
                className="font-mono text-xl font-semibold text-accent sm:text-2xl"
              />
              <p className="mt-1 font-mono text-[0.65rem] leading-snug text-muted sm:text-xs">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 font-mono text-[0.78rem] leading-relaxed sm:text-sm">
          {terminalTests.map((test, index) => {
            const visible = index < visibleLines;
            return (
              <motion.div
                key={test.assertion}
                initial={false}
                animate={{
                  opacity: visible ? 1 : 0,
                  y: visible ? 0 : 6,
                }}
                transition={{ duration: 0.22 }}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                aria-hidden={!visible}
              >
                <span className="text-pass" aria-hidden>
                  PASS
                </span>
                <span className="text-text/90">{test.assertion}</span>
                <span className="text-muted">{test.duration}</span>
              </motion.div>
            );
          })}

          <motion.div
            initial={false}
            animate={{ opacity: showSummary ? 1 : 0 }}
            className="pt-2 text-muted"
          >
            Test Suites: <span className="text-pass">1 passed</span>, 1 total
            <br />
            Tests: <span className="text-pass">4 passed</span>, 4 total
            <br />
            Ran all suites in 0.61s
            <span className="cursor-blink" aria-hidden />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
