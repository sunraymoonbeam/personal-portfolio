# personal-portfolio

My personal site → **www.renhwa.com**. Built with **Astro + TypeScript + Tailwind**, with a single lazy-loaded **React + three.js** 3D hero.

## Why this stack (the "best of both worlds")

- **Astro** ships the whole site as static HTML with ~no JavaScript. Fast, cheap to host, great on memory.
- The **3D blob** is the *one* interactive part. It's a React island loaded with `client:visible`, so the heavy WebGL/three.js code (~900 KB) only downloads for that component — everything else stays zero-JS. That's **lazy loading / lazy hydration** in practice.
- **TypeScript** everywhere (strict mode). Content is type-checked at build time.

## Editing content (no code needed)

| What | Where |
|------|-------|
| Name, role, bio, tech list, socials | `src/data/site.ts` |
| Work history | `src/content/experience/*.md` (one file per job) |
| Projects | `src/content/projects/*.md` (one file per project) |
| Colors / theme | `@theme` block at the top of `src/styles/global.css` |
| The 3D scene | `src/components/react/HeroScene.tsx` |

Add a job = drop a new `.md` in `src/content/experience/`. The `order:` field sorts them (lower = shown first). The zod schema in `src/content.config.ts` catches typos at build time.

## Commands

```sh
npm install       # install deps
npm run dev       # local dev server → http://localhost:4321
npm run build     # production build → ./dist
npm run preview   # preview the production build
```

## How it's structured

```
src/
  pages/index.astro          # assembles the sections
  layouts/Base.astro         # <head>, fonts, scroll-reveal script
  components/*.astro          # static sections (Nav, About, Experience, …)
  components/react/HeroScene.tsx   # the ONE 3D island
  content/                    # editable Markdown (experience, projects)
  data/site.ts               # editable "about me" data
  styles/global.css          # theme tokens + helpers
```

## Notes

- The 3D uses a placeholder distorted icosahedron. Swap in a `.glb` model later via drei's `useGLTF`.
- `prefers-reduced-motion` is respected (animations disable for users who ask).
