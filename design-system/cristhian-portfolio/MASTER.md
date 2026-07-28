# Design System Master File

> **CRITICAL:** This is the single source of truth for the Cristhian Alcocer portfolio UI.
> Generated from **UI/UX Pro Max** recommendations for Portfolio/Personal + Developer Tool (QA).
> Page overrides in `pages/` take precedence when present.

---

## Project

| Field | Value |
|-------|-------|
| **Name** | Cristhian Portfolio |
| **Product** | Portfolio / Personal + Developer Tool (QA Lead) |
| **Stack** | Next.js 16 · React 19 · Tailwind 4 · Framer Motion |
| **Query** | portfolio QA engineer tester professional dark terminal technical modern |
| **Source** | UI/UX Pro Max skill (`.cursor/skills/ui-ux-pro-max`) |

---

## Design Dials

- **Variance:** 5/10 — Balanced / Modern
- **Motion:** 6/10 — Standard (scroll reveal + micro-interactions)
- **Density:** 4/10 — Spacious / marketing rhythm (not dashboard-dense)

---

## Pattern

- **Name:** Storytelling-Driven (Portfolio Grid hybrid)
- **Sections:** 1. Hero (Brand / Role + visual), 2. About / Philosophy, 3. Expertise, 4. Experience, 5. Education, 6. Contact
- **CTA Placement:** Hero primary (Experience) + secondary (LinkedIn) + tools lab entry
- **Conversion Focus:** Credibility (experience timeline, recommendation, live test suite)

---

## Style

- **Primary:** Motion-Driven + Minimalism
- **Secondary:** Dark Mode (OLED) + Developer / terminal aesthetic
- **Keywords:** high contrast, scroll reveals, monospace UI chrome, sharp geometry, gold accent
- **Best For:** QA / engineer personal brand, technical storytelling
- **Mode:** Dark-only (intentional product choice; contrast validated against dark surfaces)
- **Do not mix:** Soft claymorphism, purple SaaS gradients, generic corporate templates

---

## Colors

Semantic tokens only — do not hardcode hex in components.
Switchable via `data-theme` + ThemeSwitcher (`localStorage: portfolio-palette`).

### Default: `terminal` (Coding Bootcamp / Developer Tool)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#020617` | `--bg` |
| Surface | `#0e1223` | `--surface` |
| Surface elevated | `#1a1e2f` | `--surface-elevated` |
| Border | `#1e293b` / `#334155` | `--line` / `--line-strong` |
| Foreground | `#f8fafc` | `--text` |
| Muted | `#94a3b8` | `--muted` |
| Accent | `#22c55e` | `--accent` (+ `--accent-rgb`) |
| Pass | `#4ade80` | `--pass` |
| Warn | `#ef4444` | `--warn` |
| On accent | `#052e16` | `--on-accent` |

### Alternate palettes

| Theme id | Accent | Source (UI/UX Pro Max) |
|----------|--------|------------------------|
| `terminal` | `#22c55e` green | Coding Bootcamp / Developer Tool |
| `signal` | `#3b82f6` blue | Portfolio / Personal |
| `cyan` | `#22d3ee` cyan | Space Tech / HUD |
| `amber` | `#e8b84a` gold | Open Source / Luxury |

Effects (glow, tools CTA, contact hover) use `rgba(var(--accent-rgb), …)` so they track the active theme.

---

## Typography

| Role | Font | Notes |
|------|------|-------|
| Display / headings | Instrument Serif | Expressive portfolio signal (skill: expressive + variable) |
| Body | DM Sans | Readable UI sans (Tech Startup pairing body) |
| Mono / chrome | JetBrains Mono | Developer Mono pairing — nav, chips, terminal |
| Base size | 16px | Mobile body ≥16px |
| Body line-height | 1.5–1.6 | |
| Type scale | 12 / 14 / 16 / 18 / 24 / 32 / clamp hero | Consistent scale |

Load via `next/font` only (no external Google Fonts `<link>`).

---

## Spacing

Spacious density scale (dial 4):

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px–96px (section pad) |

Use 4/8pt rhythm. Section padding: `clamp(2.5rem, 5vw, 3.75rem)`.

---

## Layout

- **Container:** `min(1120px, 100%)` centered
- **Breakpoints:** 375 / 768 / 1024 / 1440
- **Hero:** Brand-first name, one headline, one supporting line, CTA group, one dominant visual (terminal)
- **No hero overlays:** No floating badges/chips on the terminal visual
- **Cards:** Prefer borders/dividers over boxed cards unless interaction needs a container
- **z-index:** 0 base · 10 sticky chrome · 40 FAB · 50 nav/dialog · 100 skip link

---

## Motion

- **Micro-interactions:** 150–300ms, ease-out enter / ease-in exit
- **Scroll reveal:** opacity + `translateY(16–24px)`, duration ~350–450ms, stagger 40–80ms
- **Transforms only:** opacity / transform — never width/height/top/left
- **Press:** scale ~0.98 on primary controls
- **Hover lift:** `translateY(-1px to -2px)` max
- **Always** honor `prefers-reduced-motion`
- **Avoid:** decorative-only loops >2 per view; durations >500ms for UI chrome

---

## Interaction & Accessibility (priority 1–2)

- Contrast ≥4.5:1 body text; ≥3:1 large UI glyphs
- Visible `:focus-visible` rings (2–4px accent)
- Touch targets ≥44×44px; ≥8px gap between targets
- `cursor-pointer` on all clickable elements
- Skip link to `#main`
- Sequential heading hierarchy
- Labels on icon-only controls (`aria-label`)
- Do not rely on hover alone for critical actions
- Modal: Escape + clear dismiss; scrim ≥40–60% black

---

## Key Effects

- Subtle grid + radial glow atmosphere (not flat single-color bg)
- Terminal window as product visual anchor
- Scroll-triggered section reveals
- Accent underline for active nav
- Soft gold glow on Tools CTA (one intentional motion focus)

---

## Avoid (Anti-patterns)

- Corporate generic templates / interchangeable SaaS layouts
- Purple-on-white or AI purple/indigo gradients
- Emoji as structural icons
- Placeholder-only form labels
- Instant 0ms state changes
- Removing focus rings
- Horizontal scroll on mobile
- Hero clutter (stats strips, promo chips, multiple competing headlines)
- Mixing filled/outline icon styles randomly
- Raw hex colors inside components

---

## Pre-Delivery Checklist

- [x] No emojis as structural icons (status glyphs are mono text, not emoji icons)
- [x] cursor-pointer on interactive controls
- [x] Hover/press transitions 150–300ms
- [x] Dark mode text contrast validated against tokens
- [x] Focus states visible
- [x] prefers-reduced-motion respected
- [x] Responsive container + mobile nav
- [x] Brand-first hero composition
- [x] Semantic color tokens in CSS variables
- [x] Skip link present

---

## Stack Notes (Next.js)

- App Router · Server Components by default
- `next/font` for all typefaces
- Client components only where interaction/motion requires it
- Prefer `next/dynamic` for heavy below-fold widgets when splitting helps
- Hash deep-links for sections; preserve nav consistency across `/` and `/tools`
