import { education } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education() {
  return (
    <section id="education" className="section-pad border-t border-line">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow={education.eyebrow}
            title={education.title}
            subtitle={education.subtitle}
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <Reveal delay={0.08}>
            <div className="border-l border-accent/40 pl-6 sm:pl-8">
              <h3 className="font-display text-2xl tracking-tight text-text">
                {education.degree.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{education.degree.field}</p>
              <p className="mt-2 text-muted">{education.degree.institution}</p>
              <p className="mt-4 font-mono text-xs text-muted">
                {education.degree.period}
              </p>
              <ul className="mt-6 space-y-3">
                {education.degree.focus.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-xs text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-prose">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="space-y-10">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  Skills & competencies
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {education.skills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  Languages
                </h3>
                <ul className="mt-4 space-y-2">
                  {education.languages.map((language) => (
                    <li
                      key={language.name}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted"
                    >
                      <span className="font-medium text-text">
                        {language.name}
                      </span>
                      <span className="font-mono text-xs">{language.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
