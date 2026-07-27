"use client";

import { useState, type FormEvent } from "react";
import { contact, site } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

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

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal delay={0.08}>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                Contact information
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                {site.availability}
              </p>

              <ul className="mt-8 space-y-3 font-mono text-sm">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="contact-link"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.phoneHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    {site.phone}
                  </a>
                </li>
                <li className="px-3 py-2 text-muted">{site.location}</li>
                <li>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    LinkedIn profile →
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <form
              onSubmit={onSubmit}
              className="border border-line bg-surface/50 p-6 sm:p-8"
            >
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
