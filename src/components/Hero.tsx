"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/content";
import { RunSuiteHeroButton } from "@/components/TestRunner";
import { TerminalPanel } from "@/components/ui/TerminalPanel";

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1] as const,
            delay,
          },
        };

  return (
    <section
      id="top"
      data-testid="hero"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:min-h-[100svh] lg:pb-24"
    >
      <div className="container-narrow section-pad !py-0">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div>
            <motion.p
              className="eyebrow mb-6"
              {...fade(0.05)}
            >
              QA Lead · {site.location}
            </motion.p>

            <motion.p
              className="mb-3 font-display text-2xl tracking-tight text-text/90 sm:text-3xl"
              {...fade(0.12)}
            >
              {site.name}
            </motion.p>

            <motion.h1
              className="font-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.05] tracking-tight text-text"
              {...fade(0.2)}
            >
              Quality that ships
              <br />
              <span className="text-accent">without surprises.</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-xl text-base font-medium text-text/85 sm:text-lg"
              {...fade(0.28)}
            >
              {site.summary}
            </motion.p>

            <motion.p
              className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
              {...fade(0.34)}
            >
              {site.intro}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              {...fade(0.42)}
            >
              <a
                href="#experience"
                data-testid="cta-experience"
                className="btn btn-primary"
              >
                View experience
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="cta-linkedin"
                className="btn btn-ghost"
              >
                Connect on LinkedIn
              </a>
              <RunSuiteHeroButton />
            </motion.div>
          </div>

          <motion.div {...fade(0.35)} className="lg:pt-4">
            <TerminalPanel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
