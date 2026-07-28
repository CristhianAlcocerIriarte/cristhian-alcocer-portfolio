"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { navLinks, site } from "@/lib/content";
import {
  paletteThemes,
  usePaletteTheme,
} from "@/components/ThemeSwitcher";

function sectionId(href: string) {
  return href.replace(/^#/, "");
}

/** Distance from viewport top used to decide which section is "active". */
function spyOffset() {
  // Sticky header (~64px) + a bit of breathing room into the section.
  return 96;
}

export function Nav() {
  const pathname = usePathname();
  const onTools = pathname?.includes("/tools") ?? false;
  const [scrolled, setScrolled] = useState(false);
  const [sectionActive, setSectionActive] = useState("");
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const paletteMenuId = useId();
  const mobilePaletteId = useId();
  const paletteRef = useRef<HTMLDivElement>(null);
  const { theme, select } = usePaletteTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!paletteOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!paletteRef.current?.contains(event.target as Node)) {
        setPaletteOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPaletteOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [paletteOpen]);

  useEffect(() => {
    if (onTools) {
      setSectionActive("");
      return;
    }

    const sections = navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => document.getElementById(sectionId(link.href)))
      .filter(Boolean) as HTMLElement[];

    const updateActive = () => {
      const offset = spyOffset();
      let current = sections[0]?.id ?? "";

      // Last section whose top has crossed the spy line wins. Works for tall
      // sections like Experience where IntersectionObserver ratios are noisy.
      for (const section of sections) {
        if (section.getBoundingClientRect().top - offset <= 0) {
          current = section.id;
        }
      }

      // Near page bottom, force the last section (Contact) active.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;
      if (atBottom && sections.length) {
        current = sections[sections.length - 1].id;
      }

      setSectionActive((prev) => (prev === current ? prev : current));
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("hashchange", updateActive);
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("hashchange", updateActive);
      window.removeEventListener("resize", updateActive);
    };
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

  const navLinkClass = (isActive: boolean) =>
    `relative inline-flex min-h-11 items-center px-3 py-2 font-mono text-xs tracking-wide transition-colors duration-[220ms] ${
      isActive ? "text-accent" : "text-muted hover:text-text"
    }`;

  const paletteOption = (
    item: (typeof paletteThemes)[number],
    onPicked?: () => void,
  ) => {
    const active = theme === item.id;
    return (
      <button
        key={item.id}
        type="button"
        title={`${item.label} · ${item.source}`}
        aria-label={`Use ${item.label} palette`}
        aria-pressed={active}
        onClick={() => {
          select(item.id);
          onPicked?.();
        }}
        className={`flex w-full min-h-11 items-center gap-3 px-3 py-2 text-left font-mono text-xs transition-colors duration-[220ms] ${
          active
            ? "bg-accent-soft text-accent"
            : "text-muted hover:bg-bg/60 hover:text-text"
        }`}
      >
        <span
          className="theme-swatch shrink-0"
          style={{ ["--swatch" as string]: item.swatch }}
          aria-hidden
        />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="tracking-wide">{item.label}</span>
          <span className="truncate text-[0.65rem] opacity-70">{item.source}</span>
        </span>
      </button>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[50] transition-[background,border-color,backdrop-filter] duration-[220ms] ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between gap-4 px-[clamp(1.25rem,4vw,2.5rem)] py-3.5">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={(event) => {
            setOpen(false);
            setSectionActive("");
            // Same-route Link to "/" does not scroll; jump to the top explicitly.
            if (!onTools) {
              event.preventDefault();
              const cleanUrl = `${window.location.pathname}${window.location.search}`;
              window.history.pushState(null, "", cleanUrl);
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            }
          }}
        >
          <span className="flex h-11 w-11 items-center justify-center border border-accent/40 bg-accent-soft font-mono text-xs font-semibold text-accent transition-colors duration-[220ms] group-hover:border-accent">
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
            const className = navLinkClass(isActive);

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
                onClick={(event) => {
                  setSectionActive(link.id);
                  setOpen(false);
                  // Same-page: jump instantly so the page does not animate through About → …
                  if (!onTools) {
                    event.preventDefault();
                    const target = document.getElementById(link.id);
                    if (!target) return;
                    window.history.pushState(null, "", `#${link.id}`);
                    target.scrollIntoView({ behavior: "instant", block: "start" });
                  }
                }}
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

          <div className="relative" ref={paletteRef}>
            <button
              type="button"
              className={navLinkClass(paletteOpen)}
              aria-expanded={paletteOpen}
              aria-controls={paletteMenuId}
              aria-haspopup="menu"
              onClick={() => setPaletteOpen((value) => !value)}
            >
              Palette
              <span
                className={`absolute inset-x-3 -bottom-0.5 h-px bg-accent transition-opacity ${
                  paletteOpen ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
            {paletteOpen ? (
              <div
                id={paletteMenuId}
                role="menu"
                aria-label="Color palette"
                data-testid="theme-switcher"
                className="absolute right-0 top-full z-50 mt-2 min-w-[14rem] border border-line bg-surface/95 py-1 shadow-lg backdrop-blur-md"
              >
                {paletteThemes.map((item) =>
                  paletteOption(item, () => setPaletteOpen(false)),
                )}
              </div>
            ) : null}
          </div>

          {site.openToWork ? (
            <Link
              href={sectionHref("#contact")}
              className="btn-open-to-work ml-2"
              onClick={(event) => {
                setSectionActive("contact");
                if (!onTools) {
                  event.preventDefault();
                  const target = document.getElementById("contact");
                  if (!target) return;
                  window.history.pushState(null, "", "#contact");
                  target.scrollIntoView({ behavior: "instant", block: "start" });
                }
              }}
            >
              Open to work
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line-strong px-3 py-2 font-mono text-xs text-muted transition-colors duration-[220ms] hover:border-accent hover:text-accent lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => {
            setOpen((value) => {
              if (value) setMobilePaletteOpen(false);
              return !value;
            });
          }}
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
            {links.map((link) => {
              const isActive =
                link.kind === "tools"
                  ? onTools
                  : !onTools && sectionActive === link.id;
              return (
                <li key={link.id}>
                  <Link
                    href={
                      link.kind === "tools" ? "/tools/" : sectionHref(`#${link.id}`)
                    }
                    className={`block min-h-11 px-1 py-2.5 font-mono text-sm transition-colors duration-[220ms] ${
                      isActive ? "text-accent" : "text-muted hover:text-accent"
                    }`}
                    onClick={(event) => {
                      if (link.kind === "section") {
                        setSectionActive(link.id);
                        if (!onTools) {
                          event.preventDefault();
                          const target = document.getElementById(link.id);
                          if (target) {
                            window.history.pushState(null, "", `#${link.id}`);
                            target.scrollIntoView({
                              behavior: "instant",
                              block: "start",
                            });
                          }
                        }
                      }
                      setOpen(false);
                      setMobilePaletteOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            <li>
              <button
                type="button"
                className={`flex w-full min-h-11 items-center justify-between px-1 py-2.5 font-mono text-sm transition-colors duration-[220ms] ${
                  mobilePaletteOpen ? "text-accent" : "text-muted hover:text-accent"
                }`}
                aria-expanded={mobilePaletteOpen}
                aria-controls={mobilePaletteId}
                onClick={() => setMobilePaletteOpen((value) => !value)}
              >
                <span>Palette</span>
                <span aria-hidden className="text-xs opacity-70">
                  {mobilePaletteOpen ? "−" : "+"}
                </span>
              </button>
              {mobilePaletteOpen ? (
                <div
                  id={mobilePaletteId}
                  role="group"
                  aria-label="Color palette"
                  data-testid="theme-switcher"
                  className="mt-1 border border-line bg-surface/60"
                >
                  {paletteThemes.map((item) => paletteOption(item))}
                </div>
              ) : null}
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
