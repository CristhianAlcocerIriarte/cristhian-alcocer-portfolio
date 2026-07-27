# Cristhian Alcocer — Portfolio

Premium QA Lead portfolio built with **Next.js** (static export) for GitHub Pages.

## Develop locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build static site

```bash
npm run build
```

Output is written to `out/` (ready for GitHub Pages).

## Deploy to GitHub Pages

1. Push this repo to GitHub as `cristhian-alcocer-portfolio`.
2. In repo **Settings → Pages**, set source to the `gh-pages` branch (or GitHub Actions).
3. Run:

```bash
npm run deploy
```

`basePath` is configured as `/cristhian-alcocer-portfolio` for production. If the repository name changes, update `repoName` in `next.config.ts`.

## Edit content

All copy lives in [`src/lib/content.ts`](src/lib/content.ts) — update roles, metrics, contact links, and LinkedIn URL there.
