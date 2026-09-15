# Dave Electrical Services

Next.js 15 website for **Dave Electrical Services**, managed with **npm
workspaces** (the app lives in `apps/electrical`).

```
apps/
  electrical/   → Dave Electrical Services  (dark + yellow theme)
packages/
  shared/       → (scaffold) shared code
```

> **Dave Cleaning has moved out.** The cleaning site is now its own standalone
> repo/project (`dave-cleaning-services`) so it can be deployed independently.
> This repo no longer contains it, and there are no links to it from here.

## Develop

```bash
npm install            # once, at the repo root

npm run dev            # → http://localhost:3000  (alias of dev:electrical)
npm run dev:electrical # → http://localhost:3000
```

## Build

```bash
npm run build:electrical
```

## Deploy (Vercel)

The Vercel project's **Root Directory** must point at the app folder:

- **Dave Electrical** project → Root Directory: `apps/electrical`

Set this in *Vercel → Project → Settings → Build & Deployment → Root Directory*
— there is no Next.js app at the repository root.
