# Code structure

Full reasoning in [`../DESIGN.md`](../DESIGN.md). This is the working map.

## The one rule

**Pages request content → `lib/` decides what is published → components render
props.** Nothing else calls `getCollection()`.

```
src/
  content.config.ts    three strict schemas (nested strict too) + employers
  content/
    home.ts            home page copy
    projects/<slug>/index.mdx + images
    work/<tenure>/index.mdx + images
    play/<slug>/index.mdx + images
    employers/<id>.json + logo
    _template/         copy these to add content
  config/site.ts       name, motto, nav, socials, feature flags
  data/technologies.ts stable tech ids -> label -> optional icon slug
  lib/
    select.ts          PURE publication policy — unit-tested, no Astro imports
    content.ts         loads entries, delegates every decision to select.ts
    date.ts            YYYY-MM formatting; never constructs a Date
    icons.ts           simple-icons adapter with a text fallback
  layouts/
    SiteLayout.astro   head, theme bootstrap, header, footer
    ArticleLayout.astro 660px reading column, aside slot, prev/next
  components/
    site/              Header, Footer, Logo, ThemeToggle, PlayWord, Bulb, HeroScene
    projects/          ProjectCard, ProjectGrid, ScreenshotFrame
    work/              RoleRow, YearLedger
    play/              PlayGrid
    ui/                SectionHead, ArrowLink, TechChip
  scripts/             theme.ts, cursor.ts, hero-scene.ts  (plain TS, no framework)
  styles/              tokens.css, base.css, article.css, cursors.css
  pages/               routes
tests/                 content policy + date regressions
```

## Why `select.ts` is separate from `content.ts`

`content.ts` imports `astro:content`, which cannot resolve outside an Astro
build — so anything in it is untestable. All the decisions (what is published,
what is featured, what is adjacent) live in `select.ts`, which is pure and
covered by `tests/`.

## Client scripts

| File | Gz | Loads |
|---|---|---|
| `theme.ts` | 0.6 KB | immediately (plus a ~150 B inline head script) |
| `cursor.ts` | in layout boot | immediately, `pointer: fine` only |
| `hero-scene.ts` | **130 KB** | only on desktop, only when scrolled to |

Measured, not estimated: **initial paint 14.9 KB gz**, **article page 11.2 KB gz**.

## Commands

```bash
npm run dev      # local
npm run verify   # types + tests + build — the gate the Docker image runs
npm test         # just the tests
```
