# Dave Services — Monorepo

Two sister-brand websites in one codebase, managed with **npm workspaces**.

```
apps/
  electrical/   → Dave Electrical Services  (dark + yellow theme)
  cleaning/     → Dave Cleaning Services     (light + blue theme)
packages/
  shared/       → (scaffold) code shared between the two apps
```

Each app is a standalone Next.js 15 app with its own theme, content, and Vercel
deployment.

### Dave Cleaning — unlisted demo

The cleaning app is served under the base path **`/demo/dave-cleaning-services`**
(set via `basePath` in `apps/cleaning/next.config.mjs`, mirrored in
`apps/cleaning/lib/basePath.ts`). It is intentionally **unlisted**: the electrical
site contains no link or CTA to it, and the cleaning domain root (`/`) returns a
404 — the site is reachable only if you already have the URL. Locally it runs at
`http://localhost:3001/demo/dave-cleaning-services`.

## Develop

```bash
npm install            # once, at the repo root (hoists deps for both apps)

npm run dev:electrical # → http://localhost:3000
npm run dev:cleaning   # → http://localhost:3001
```

The cleaning app can run a self-contained local MongoDB for its admin/quote
features (no Docker needed):

```bash
npm --workspace apps/cleaning run dev:db      # start local DB (separate terminal)
npm --workspace apps/cleaning run seed:admin  # seed admin user (once)
```

## Build

```bash
npm run build:electrical
npm run build:cleaning
```

## Deploy (Vercel) — IMPORTANT

Because the apps moved into subfolders, each Vercel project's **Root Directory**
must point at its app folder:

- **Dave Electrical** project → Root Directory: `apps/electrical`
- **Dave Cleaning** project (new) → Root Directory: `apps/cleaning`

Set this in *Vercel → Project → Settings → Build & Deployment → Root Directory*
**before** pushing this restructure, or the build will fail (there is no longer a
Next.js app at the repository root).
