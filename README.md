# Hritik Jhaveri — Portfolio

Personal portfolio site showcasing ML, data science, and systems projects with interactive pipeline breakdowns.

**Live:** https://codex83.github.io/portfolio/

## Stack

- Next.js 16 (App Router, static export)
- TypeScript + Tailwind CSS v4
- Deployed to GitHub Pages via GitHub Actions

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000/portfolio](http://localhost:3000/portfolio).

## Adding a project

Edit [`src/data/projects.ts`](src/data/projects.ts) — each entry has a slug, tagline, problem statement, tool groups, pipeline stages, and results. The site rebuilds and deploys automatically on push to `main`.
