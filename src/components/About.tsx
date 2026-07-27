import { about } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="section-pad border-t border-line">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal delay={0.08}>
            <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              {about.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 28)}
                  className={index === 0 ? "text-text/90" : undefined}
                >
                  {index === 0 ? (
                    <>
                      <strong className="font-medium text-text">
                        Cristhian Alcocer Iriarte
                      </strong>{" "}
                      {paragraph}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
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
                    <span>{item}</span>
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
