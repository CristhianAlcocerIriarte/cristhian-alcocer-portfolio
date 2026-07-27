"use client";

import { useState, type FormEvent } from "react";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      `Portfolio inquiry from ${name || "a visitor"}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

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

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal delay={0.08}>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  Open to work
                </span>
                <p className="text-sm text-muted sm:text-base">
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
                      {channel.href ? (
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
                      ) : (
                        <span className="font-mono text-sm text-text/85">
                          {channel.value}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <form
              onSubmit={onSubmit}
              className="border border-line bg-surface/50 p-6 sm:p-8"
            >
              <div className="mb-6 border-b border-line pb-4">
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  Send a message
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Opens your email client with the inquiry ready to send.
                </p>
              </div>

              <div className="grid gap-5">
                <label className="block">
                  <span className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
                    Full name
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    data-testid="contact-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full border border-line-strong bg-bg px-3 py-3 font-sans text-sm text-text outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
                    Email address
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    data-testid="contact-email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full border border-line-strong bg-bg px-3 py-3 font-sans text-sm text-text outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
                    Message
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    data-testid="contact-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="w-full resize-y border border-line-strong bg-bg px-3 py-3 font-sans text-sm text-text outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                    placeholder="Tell me about the role or collaboration..."
                  />
                </label>

                <button
                  type="submit"
                  data-testid="contact-submit"
                  className="btn btn-primary w-full sm:w-auto"
                >
                  Send message
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
