"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/content";

function sectionId(href: string) {
  return href.replace(/^#/, "");
}

export function Nav() {
  const pathname = usePathname();
  const onTools = pathname?.includes("/tools") ?? false;
  const [scrolled, setScrolled] = useState(false);
  const [sectionActive, setSectionActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (onTools) return;

    const sections = navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => document.querySelector(link.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setSectionActive(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onTools]);

  const sectionHref = (href: string) => {
    const id = sectionId(href);
    // Always route through the home path so Next.js applies basePath correctly
    // (plain "/#id" anchors break on GitHub Pages project sites).
    return { pathname: "/" as const, hash: id };
  };

  const links = [
    ...navLinks.map((link) => ({
      label: link.label,
      id: sectionId(link.href),
      kind: "section" as const,
    })),
    { label: "Tools", id: "tools", kind: "tools" as const },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between gap-4 px-[clamp(1.25rem,4vw,2.5rem)] py-3.5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-accent/40 bg-accent-soft font-mono text-xs font-semibold text-accent transition-colors group-hover:border-accent">
            CA
          </span>
          <span className="font-display text-lg tracking-tight text-text">
            Cristhian <em className="not-italic text-accent">Alcocer</em>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
          data-testid="primary-nav"
        >
          {links.map((link) => {
            const isActive =
              link.kind === "tools" ? onTools : !onTools && sectionActive === link.id;
            const className = `relative px-3 py-2 font-mono text-xs tracking-wide transition-colors ${
              isActive ? "text-accent" : "text-muted hover:text-text"
            }`;

            if (link.kind === "tools") {
              return (
                <Link key={link.id} href="/tools/" className={className}>
                  {link.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-px bg-accent transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            }

            return (
              <Link
                key={link.id}
                href={sectionHref(`#${link.id}`)}
                className={className}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-px bg-accent transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
          {site.openToWork ? (
            <Link
              href={sectionHref("#contact")}
              className="ml-2 border border-accent/35 bg-accent-soft px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-accent transition-colors hover:border-accent"
            >
              Open to work
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center border border-line-strong px-3 py-2 font-mono text-xs text-muted lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-bg/95 px-[clamp(1.25rem,4vw,2.5rem)] py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={
                    link.kind === "tools" ? "/tools/" : sectionHref(`#${link.id}`)
                  }
                  className="block px-1 py-2.5 font-mono text-sm text-muted hover:text-accent"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
