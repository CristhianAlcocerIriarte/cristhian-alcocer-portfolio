"use client";

import { useEffect, useState } from "react";

export const paletteThemes = [
  {
    id: "terminal",
    label: "Terminal",
    swatch: "#22c55e",
    source: "Coding Bootcamp / Developer Tool",
  },
  {
    id: "signal",
    label: "Signal",
    swatch: "#3b82f6",
    source: "Portfolio / Personal",
  },
  {
    id: "cyan",
    label: "Cyan",
    swatch: "#22d3ee",
    source: "Space Tech / HUD",
  },
  {
    id: "amber",
    label: "Amber",
    swatch: "#e8b84a",
    source: "Open Source / Luxury gold",
  },
] as const;

export type PaletteThemeId = (typeof paletteThemes)[number]["id"];

export const DEFAULT_PALETTE: PaletteThemeId = "terminal";
export const PALETTE_STORAGE_KEY = "portfolio-palette";

export function isPaletteThemeId(value: string): value is PaletteThemeId {
  return paletteThemes.some((theme) => theme.id === value);
}

export function applyPaletteTheme(theme: PaletteThemeId) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--theme-color")
    .trim();
  if (meta && color) {
    meta.setAttribute("content", color);
  }
}

export function usePaletteTheme() {
  const [theme, setTheme] = useState<PaletteThemeId>(DEFAULT_PALETTE);

  useEffect(() => {
    const stored = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    const next =
      stored && isPaletteThemeId(stored) ? stored : DEFAULT_PALETTE;
    setTheme(next);
    applyPaletteTheme(next);
  }, []);

  const select = (next: PaletteThemeId) => {
    setTheme(next);
    applyPaletteTheme(next);
    window.localStorage.setItem(PALETTE_STORAGE_KEY, next);
  };

  return { theme, select };
}

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, select } = usePaletteTheme();

  return (
    <div
      className={
        compact
          ? "flex items-center gap-1.5"
          : "flex flex-wrap items-center gap-2"
      }
      role="group"
      aria-label="Color palette"
      data-testid="theme-switcher"
    >
      {!compact ? (
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
          Palette
        </span>
      ) : null}
      {paletteThemes.map((item) => {
        const active = theme === item.id;
        return (
          <button
            key={item.id}
            type="button"
            title={`${item.label} · ${item.source}`}
            aria-label={`Use ${item.label} palette`}
            aria-pressed={active}
            onClick={() => select(item.id)}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border px-2 transition duration-[220ms] ${
              active
                ? "border-accent bg-accent-soft text-accent"
                : "border-line-strong text-muted hover:border-accent/50 hover:text-text"
            }`}
          >
            <span
              className="theme-swatch"
              style={{ ["--swatch" as string]: item.swatch }}
              aria-hidden
            />
            {!compact ? (
              <span className="font-mono text-[0.65rem] uppercase tracking-wider">
                {item.label}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
