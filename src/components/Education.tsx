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

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal delay={0.08}>
            <div className="border border-line bg-surface/60 p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                Education
              </p>
              <h3 className="mt-4 font-display text-2xl tracking-tight text-text">
                {education.degree.title}
              </h3>
              <p className="mt-2 text-muted">{education.degree.institution}</p>
              <p className="mt-4 font-mono text-xs text-muted">
                {education.degree.period}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
