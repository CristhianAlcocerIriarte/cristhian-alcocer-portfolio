import { experience } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <section
      id="experience"
      data-testid="section-experience"
      className="section-pad border-t border-line"
    >
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow={experience.eyebrow}
            title={experience.title}
            subtitle={experience.subtitle}
          />
        </Reveal>

        <ol className="relative space-y-0">
          {experience.roles.map((role, index) => (
            <Reveal key={`${role.company}-${role.period}`} delay={0.08 * index} as="li">
              <article
                className={`relative grid gap-5 border-l border-line py-6 pl-6 sm:pl-8 md:grid-cols-[220px_1fr] md:gap-8 ${
                  index === experience.roles.length - 1 ? "pb-0" : ""
                }`}
              >
                <span
                  className={`absolute top-10 -left-[5px] h-2.5 w-2.5 rounded-full ${
                    role.current
                      ? "bg-accent shadow-[0_0_0_4px_var(--accent-soft)]"
                      : "bg-line-strong"
                  }`}
                  aria-hidden
                />

                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted">
                    {role.period}
                  </p>
                  <p className="mt-2 font-mono text-sm text-accent">
                    {role.company}
                  </p>
                  {role.employment ? (
                    <p className="mt-1 font-mono text-[0.65rem] text-muted/80">
                      {role.employment}
                    </p>
                  ) : null}
                  {role.current ? (
                    <span className="mt-3 inline-block border border-accent/30 bg-accent-soft px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                      Current
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-xl tracking-tight text-text sm:text-2xl">
                    {role.title}
                  </h3>
                  <p className="text-prose mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {role.summary}
                  </p>
                  <ul className="mt-5 space-y-4">
                    {role.highlights.map((item) => (
                      <li key={item.label} className="min-w-0">
                        <p className="font-mono text-xs uppercase tracking-wider text-accent">
                          {item.label}
                        </p>
                        <p className="text-prose mt-1.5 text-sm leading-relaxed text-text/80 sm:text-[0.95rem]">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
