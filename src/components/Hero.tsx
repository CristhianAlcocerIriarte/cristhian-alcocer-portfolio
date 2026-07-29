"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/content";
import { TerminalPanel } from "@/components/ui/TerminalPanel";

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.38,
            ease: [0.22, 1, 0.36, 1] as const,
            delay,
          },
        };

  return (
    <section
      id="top"
      data-testid="hero"
      className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pb-14"
    >
      <div className="container-narrow section-pad !py-0">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div>
            <motion.p
              className="font-display text-[clamp(2.75rem,7vw,4.75rem)] leading-[1.02] tracking-tight text-text"
              data-testid="hero-brand"
              {...fade(0.1)}
            >
              {site.name}
            </motion.p>

            <motion.h1
              className="mt-4 max-w-xl text-xl font-medium leading-snug tracking-tight text-text/90 sm:text-2xl"
              {...fade(0.16)}
            >
              Software Quality{" "}
              <span className="text-accent">Powered by AI</span>
            </motion.h1>

            <motion.p
              className="text-prose mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
              {...fade(0.22)}
            >
              {site.summary}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              {...fade(0.3)}
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
              <Link
                href="/tools/"
                data-testid="cta-tools"
                className="btn btn-tools"
              >
                Tools
              </Link>
            </motion.div>
          </div>

          <motion.div {...fade(0.24)} className="lg:pt-4">
            <TerminalPanel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
