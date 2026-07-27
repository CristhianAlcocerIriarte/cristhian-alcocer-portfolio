import { about, site } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="section-pad border-t border-line">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
        </Reveal>

        <Reveal delay={0.05}>
          <blockquote className="mb-6 max-w-3xl border-l border-accent/50 pl-5 font-display text-xl leading-snug tracking-tight text-text sm:text-2xl">
            “{about.quote}”
          </blockquote>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <Reveal delay={0.08}>
            <div className="text-prose space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              <p className="text-text/90">
                <strong className="font-medium text-text">{site.fullName}</strong>
                {" - "}
                {site.headline}
              </p>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
              {about.recommendation ? (
                <figure className="mt-8 border border-line bg-surface/50 p-5 sm:p-6">
                  <blockquote className="text-prose text-sm leading-relaxed text-text/85 sm:text-base">
                    “{about.recommendation.quote}”
                  </blockquote>
                  <figcaption className="mt-3 font-mono text-xs text-muted">
                    <span className="text-accent">{about.recommendation.author}</span>
                    {" · "}
                    {about.recommendation.role}
                  </figcaption>
                </figure>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="border-l border-accent/40 pl-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                {about.philosophyTitle}
              </h3>
              <ul className="mt-5 space-y-4">
                {about.philosophy.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base"
                  >
                    <span className="mt-1 shrink-0 font-mono text-xs text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-prose">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
