"use client";

import { contact, site } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const channels = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
  {
    label: "WhatsApp",
    value: site.phone,
    href: site.phoneHref,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "View profile",
    href: site.linkedin,
    external: true,
  },
  {
    label: "Location",
    value: site.location,
    href: "https://www.google.com/maps/search/?api=1&query=Plaza+14+de+Septiembre%2C+Cochabamba%2C+Bolivia",
    external: true,
  },
] as const;

export function Contact() {
  return (
    <section
      id="contact"
      data-testid="section-contact"
      className="section-pad border-t border-line"
    >
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow={contact.eyebrow}
            title={contact.title}
            subtitle={contact.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                Open to work
              </span>
              <p className="text-prose text-sm text-muted sm:text-base">
                QA leadership and Quality Control Engineer roles.
              </p>
            </div>

            <dl className="mt-2">
              {channels.map((channel) => (
                <div
                  key={channel.label}
                  className="grid grid-cols-[6.5rem_1fr] items-center gap-3 border-b border-line py-3.5 sm:grid-cols-[7.5rem_1fr]"
                >
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
                    {channel.label}
                  </dt>
                  <dd className="min-w-0">
                    <a
                      href={channel.href}
                      className="contact-link"
                      {...(channel.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                    >
                      {channel.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
