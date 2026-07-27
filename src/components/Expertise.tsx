import { expertise } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Expertise() {
  return (
    <section id="expertise" className="section-pad border-t border-line">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow={expertise.eyebrow}
            title={expertise.title}
            subtitle={expertise.subtitle}
          />
        </Reveal>

        <div className="grid gap-0 md:grid-cols-2">
          {expertise.areas.map((area, index) => (
            <Reveal
              key={area.id}
              delay={0.06 * index}
              className={`group border-t border-line py-8 md:px-6 md:py-10 ${
                index % 2 === 0 ? "md:border-r" : ""
              } ${index < 2 ? "md:border-b-0" : ""}`}
            >
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs text-accent/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-line transition-colors group-hover:bg-accent/40" />
              </div>
              <h3 className="font-display text-xl tracking-tight text-text sm:text-2xl">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {area.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {area.tags.map((tag) => (
                  <span key={tag} className="skill-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
