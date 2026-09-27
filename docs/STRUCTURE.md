# Code structure — the short version

Full rationale in [`../DESIGN.md`](../DESIGN.md). This page is the map you
actually need open while working.

## The rule

```
pages/        compose blocks into a route
  ↓
blocks/       domain-aware  (knows what a "role" is)
  ↓
ui/           domain-agnostic (knows what a "chip" is)
  ↓
tokens.css    values only
```

Dependencies point **downward only**. A `ui/` component never imports a
`blocks/` component. **No component ever contains copy.** If you are editing a
`.astro` file to change a sentence, something is in the wrong place.

## Where things live

```
src/config/site.ts     name, motto, nav, socials, flags   ← page copy
src/config/stack.ts    tech-stack groups (icon slugs)
src/content/           work/ · projects/ · play/ · about.mdx
src/content/config.ts  Zod schemas — a bad field fails the build
src/styles/tokens.css  every colour, size and space, light + dark
```

## Adding content

One folder per item. No index to update — a new folder is a new page.

```
src/content/projects/my-thing/
  index.mdx     frontmatter (cards, filters, sidebar, SEO) + free body
  cover.jpg     images live beside the post that uses them
```

**Frontmatter** drives everything structured. **The body is yours** — your
headings, your order, images anywhere.

## MDX components (six, deliberately)

| Component | Use |
|---|---|
| `<Figure src caption size>` | One image. `size="normal \| wide \| full"` |
| `<Gallery images caption>` | 2–3 up row, one shared caption |
| `<Quote>` | Pull quote |
| `<Sidenote>` | Margin note (becomes a footnote on mobile) |
| `<Stat value label>` | One number |
| `<Window title>` | macOS window frame around a screenshot |

## Islands

Plain TypeScript, no framework. Each is lazy and optional.

| File | KB (gz) | Loads when |
|---|---|---|
| `hero3d.ts` | ~70 | Hero scrolls into view |
| `cmdk.ts` | ~8 | First `⌘K` |
| `theme.ts` | ~2 | Immediately (inline in `<head>`) |
| `cursor.ts` | ~1 | Immediately, `pointer: fine` only |
| `lightbox.ts` | ~2 | First image click |

A page with no images and no hero ships **0 KB of JavaScript**.
