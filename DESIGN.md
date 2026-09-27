# renhwa.com — design and build plan

**Owner:** Renhwa (Zack) Low · Software Engineer, AI · Singapore
**Domain:** renhwa.com (apex; `www` retired after launch)
**Repo:** [sunraymoonbeam/personal-portfolio](https://github.com/sunraymoonbeam/personal-portfolio)
**Status:** design settled. The repo holds an **earlier** implementation
(React hero, flat content, Tailwind); this is a deliberate migration, replacing
one concern at a time, not a greenfield build
**Interactive mockup:** https://claude.ai/artifact/9Ye1seZLWo2ED4fmThk71r

This document is written to be reviewed and argued with. Every non-obvious
decision has a stated reason and a link. Where I am unsure, I say so — see
[§11 Open questions](#11-open-questions-for-the-reviewer).

---

## 1. What this site is for

One job: **convince a reader — usually a hiring engineer or manager, often on a
phone, usually in under a minute — that I find real problems and ship working
systems.**

Three consequences that drive every decision below:

1. **Proof before prose.** Projects sit above everything except the
   positioning line. The résumé page is real HTML text with a PDF download beside it.
2. **Text is the product.** The long-form writing (per-role and per-project
   posts) is the differentiator. Everything else exists to get people into it.
3. **Speed is a feature.** A recruiter forwarding a link on hotel wifi should
   see content in under a second. This rules out the SPA portfolio template
   pattern outright.

Non-goals: a CMS, a blog with an RSS-driven audience, comments, analytics
dashboards, i18n.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 7**, `output: 'static'` | Zero JS by default. Islands let me pay for interactivity only where it exists. Content Collections give typed Markdown with `getStaticPaths` — the exact shape this site needs. |
| Language | **TypeScript**, `astro/tsconfigs/strict` | A learning goal, and Zod-typed frontmatter means a typo in a content file fails the build instead of rendering blank. |
| Content | **MDX** (`@astrojs/mdx`) | Long-form posts need images, galleries and pull quotes mid-article. Plain Markdown can't; MDX lets me expose a small set of components without giving up plain text. |
| Styling | **Plain CSS + custom properties.** No Tailwind. | See [§5.1](#51-why-not-tailwind). |
| 3D | **three.js, vanilla, tree-shaken** | No react-three-fiber, no drei, no React. See [§8.1](#81-the-3d-hero). |
| Icons | **[simple-icons](https://simpleicons.org/)** (CC0-1.0) at build time | 3,300+ brand marks as raw SVG paths. Inlined at build, so zero requests and only the icons actually used. |
| Images | **`astro:assets`** (sharp) | Responsive `srcset` and intrinsic `width`/`height`. AVIF/WebP is **configured** via `<Picture>`/`formats`, not automatic. |
| Fonts | **Geist + Geist Mono**, self-hosted, subset | See [§5.3](#53-typography). |
| Hosting | **Docker → nginx → Dokploy** on Hetzner | Already running the box. Static files from nginx is the cheapest, fastest possible serve. |

**Deliberately not used:** React, Vue, Svelte, Tailwind, a component library, a
CMS, GSAP, Framer Motion, Lenis. Each was considered; each would have cost more
KB than the problem it solved.

---

## 3. Code structure

```
src/
  config/
    site.ts            identity, canonical origin, nav, socials, feature flags
  content/
    home.ts            hero, section intros, closing CTA — grouped by section
    work/carro/index.mdx + cover.jpg + logo.png
    projects/kanta/index.mdx + cover.jpg
    play/wok-hei/index.mdx + cover.jpg
    about.mdx
  content.config.ts    Zod schemas (current Astro location, .strict())
  data/
    technologies.ts    stable IDs → display name → optional icon slug
  lib/
    content.ts         published / featured / adjacent — ONE definition
    date.ts            YYYY-MM formatting, no Date() on month strings
    icons.ts           icon adapter, with a text fallback when a slug is gone
  layouts/
    SiteLayout.astro   document shell, header, footer, theme bootstrap
    ArticleLayout.astro  reading grid, slots for facts / TOC / prev-next
  components/
    ui/                Section · Chip · Button · ScreenshotFrame · Figure
                       Gallery · Video · Sidenote · Stat
    work/              RoleRow · YearLedger · FeaturedRole
    project/           ProjectCard · ProjectFacts · ProjectFilters
    play/              PlayGrid
  scripts/             theme.ts · hero-scene.ts · bulb.ts · cursor.ts · lightbox.ts
  pages/
    index.astro
    projects/index.astro · projects/[slug].astro
    work/index.astro    · work/[slug].astro
    play/index.astro    · play/[slug].astro
    about.astro · resume.astro · contact.astro · 404.astro
  styles/
    tokens.css · base.css · article.css
public/
  resume.pdf
```

Renamed on review: `Base`→`SiteLayout`, `Post`→`ArticleLayout`,
`Window`→`ScreenshotFrame`, `Filter`→`ProjectFilters`, `KeyFacts`→`ProjectFacts`,
`cmdk.ts`→`command-palette.ts`, `hero3d.ts`→`hero-scene.ts`. `components/islands/`
became `scripts/` — it held no components. `Chip` and `Tag` merged: one is a
link, one is a filter *button*, and a styled `<span>` must never impersonate a
control.

### 3.1 Boundaries (not a universal layer rule)

An earlier draft of this document declared a strict four-layer hierarchy with
dependencies pointing only downward. Review found that rule both
over-specified and under-specified: it says nothing about where `ArticleLayout`
sits, or whether a card queries content or receives it — which is the question
that actually matters. Replaced with five boundaries that can be enforced:

| Layer | May do | May not do |
|---|---|---|
| **Pages** (`pages/`) | Select content, sort it, compose layouts and components. May use primitives directly. | — |
| **Layouts** (`layouts/`) | Own document and article framing, expose slots. | Know any collection's schema. |
| **Domain components** (`components/work/`, `components/project/`) | Render typed props. | Query collections; decide publication policy. |
| **Primitives** (`components/ui/`) | Presentation from props. | Know collections, routes or content. |
| **Helpers** (`lib/`) | Shared selection, sorting, date formatting, URL building. | Render. |

**No component fetches its own content.** Pages query, helpers decide, components
render. That single invariant is worth more than forbidding an import direction,
because it is the one that breaks when the fourth project arrives.

`lib/` exists only where there are multiple callers — not a speculative service
layer. At launch:

```ts
// lib/content.ts — ONE definition of "what is published, and in what order"
getPublishedProjects()            // route + list candidates, ordered
getPublishedWork()                // includes roles with no write-up
getWorkArticles()                 // writeup: true only
selectWorkRows(entries)           // applies showInWork
selectFeatured(entries, limit)    // applies featuredOrder
getAdjacent(orderedArticles, key) // key is `${collection}:${id}`
// Returns fresh arrays — no consumer ever .sort()s a shared one.
// lib/date.ts   — YYYY-MM in, formatted parts out. No Date() on month strings.
// lib/icons.ts  — icon adapter; a missing slug falls back to a text label.
```

Home, `/projects` and prev/next all call the same functions.

**What must never enter `lib/content.ts`:** card presentation policy — truncating
a title to fit a card, choosing a CSS class, or picking a dark-mode logo variant.
Publication and ordering belong there; rendering and browser theme do not.

### 3.1.1 The content-to-route contract

Settled **before** any component is written, because this is where portfolios
actually rot:

| Concern | Decision |
|---|---|
| **Identity** | `(collection, id)`, never a bare slug — `projects/homelab` and `play/homelab` must not collide in helpers. Folder names validated lowercase-kebab, single-level `*/index.mdx` only. |
| **ID → URL** | `projects/kanta/index.mdx` → `/projects/kanta`. Renaming a folder changes the URL; record redirects. |
| **Duplicates** | Must set **`prerenderConflictBehavior: "error"`** — Astro 7.3.5 defaults to `"warn"` (verified), so duplicates would otherwise ship silently. |
| **Re-joining an employer** | Entry IDs carry the tenure: `work/carro-2025`, `work/carro-2029`. Shared employer name/logo lives in `data/employers.ts`. Concurrent roles are legal and not rejected. |
| **Cross-listing** | One canonical entry and one URL. A project shown under Play sets `showInPlay` and links to its existing `/projects/...` page. The body is never duplicated. |
| **Hero media** | Cards and social previews always take a **static image**. A video-led project keeps the video in the article; a `HeroMedia` union is introduced only if an article header itself must play video. |
| **Drafts** | `draft: true` excludes an item from every surface, including sitemap and prev/next. Enforced in `lib/content.ts`, never at a call site. |
| **Visibility** | Three independent fields, because one cannot express all cases: `draft` (hidden everywhere, no route), `writeup` (does an article route exist), `showInWork` (does it appear in work surfaces). A published article hidden from the ledger is still public and indexed — this is *unlisted*, **not** privacy. |
| **A role with no write-up** | `writeup: false`: renders in the ledger with no link, generates no route. `writeup: true` requires a non-empty body. |
| **Home selection** | One mechanism: optional positive integer `featuredOrder`, unique among published entries within a section; selectors take the first N. No competing list anywhere. Cross-listed projects are featured only in their canonical section. |
| **Dates** | Validated `YYYY-MM`, formatted by parts, never parsed into `Date`. `end >= start`. Ordering fields are named per collection (`start` for work, `published` for projects and play) with the entry ID as a stable tie-breaker. |
| **Cover images** | Optional. Where present, `coverAlt` is required unless explicitly `decorative: true`. |
| **Unknown keys** | Every object is `.strict()`, **including nested ones** — verified that an outer `.strict()` accepts and silently strips a typo inside a nested `metrics` entry. A fixture tests this. |

Three separate schemas — work, project, play — sharing a small `common` base.
One generic schema with optional fields for everything would let a project
declare a `company`.

### 3.1.2 Frontmatter fields, constrained

Review's sharpest structural catch: a loose `highlights` array becomes a second
article stored in YAML. Constraints:

- `cardHighlights` (renamed from `highlights`) — named for its consumer, max 3 entries, max ~60 chars each.
  Anything longer is a paragraph and belongs in the body.
- `metrics` — `{ value, label, context? }`. A number without a baseline or
  period is decoration. **Not required**; a hobby needs no KPIs.
- `shortTitle` — added only when a narrative title is too long for a card, with
  `title` as the fallback. Not present by default.
- A one-off need (a video, an interactive demo) gets **an article component**,
  not `customFields: Record<string, any>` and not a growing `layoutVariant` enum.

### 3.2 Content vs configuration vs presentation

This is the one idea the whole repo is organised around, taken from
[once-ui-system/magic-portfolio](https://github.com/once-ui-system/magic-portfolio),
which separates `content.tsx` (copy) from `once-ui.config.ts` (design knobs)
from the components (presentation) — so a non-developer edits two files and
never opens a component.

| You want to change | You edit |
|---|---|
| A sentence on the home page | `content/home.ts` |
| Add a project / role / play item | Drop a new folder with `index.mdx` under `content/` |
| Reorder or retitle nav | `config/site.ts` |
| Add a tool | `data/technologies.ts` (stable ID + label + optional icon slug) |
| Colours, type scale, spacing | `styles/tokens.css` |
| How a project card looks | `components/project/ProjectCard.astro` |
| A UI label ("Close", "Copy link") | the component that owns it |

### 3.3 Frontmatter vs body — where the line sits

The split that makes this maintainable, and the thing most worth reviewing:

- **Frontmatter is the structured surface.** Title, date, company, role, tags,
  stack, links, metrics, highlights, cover. It feeds the cards, the ledger, the
  filters, the sidebar and the SEO tags. It is Zod-validated with `.strict()`,
  so an unknown or misspelled key fails the build (plain object schemas
  **silently strip** unknown keys — verified).
- **The body is free.** Your headings, your order, images wherever you want
  them. Delete "Context", add "The messy bit", reorder at will.

This is **Ghost's model rendered as files**: the theme owns the frame (title,
byline, feature image, cards), the author owns the body. Medium sits at one
extreme (fixed template, zero control); a page builder sits at the other
(total control, no consistency). Ghost's split is the one that stays coherent
across 30 posts, which is why the editor is a
[block editor inside a fixed post template](https://ghost.org/docs/themes/).

Example (`content/work/carro/index.mdx`):

```mdx
---
company: Carro
role: Software Engineer
kind: Full-time
start: 2025-07
end: null                  # null = Present
location: Singapore · On-site
title: Twelve agents, 60k tickets a month, and an 80% smaller LLM bill
summary: I joined to build one support agent. It turned into a platform.
stack: [langgraph, litellm, langfuse, n8n, googlecloud]
metrics:
  - { value: "12",   label: "agents" }
  - { value: "60k",  label: "tickets / month" }
  - { value: "−80%", label: "LLM cost" }
cover: ./cover.jpg
coverAlt: The Carro ops floor during a release
writeup: true
showInWork: true
featuredOrder: 1
---
import architecture from './architecture.png'


## The setup

Carro sells and services cars across four countries…

<Figure src={architecture} caption="The platform in one picture." size="wide" />

<Sidenote>The Malay reply was a language-detection prompt firing on a
customer's surname.</Sidenote>
```

A **starting vocabulary**, not a ceiling: `Figure`, `Gallery`, `Video`,
`Sidenote`, `Stat`, `ScreenshotFrame`. `Figure` and `Gallery` take
`size="normal | wide | full"` — Ghost's three widths.

Changes from the first draft, all from review:
- **`Quote` dropped.** A styled Markdown `>` blockquote does the same job.
- **`Video` added.** An AI portfolio needs a demo with a poster, controls and
  no autoplay long before it needs another text wrapper.
- **`Sidenote` is an inline aside on narrow screens**, not a real footnote.
  Genuine footnotes need references, stable IDs, an ordered destination and
  backlinks — not worth it until something needs that navigation.
- Fenced code, tables and headings are styled by `article.css`, not components.
- The rule for adding one: *a repeated styled wrapper in MDX is the signal.*
  One `<details>` inline is fine; the third copy becomes a component.

`docs/SAMPLE-ARTICLE.mdx` will show one complete article end to end — image
import, alt text, caption, code block, sidenote — which is worth more than a
component count.

---

## 3.5 Is this how portfolios are normally built?

A fair question, since "bespoke" and "over-engineered" look identical from the
outside. Where this sits against common practice:

| Aspect | Common practice | This site | Why |
|---|---|---|---|
| Framework | Next.js or Astro | **Astro** | Astro is the mainstream choice for content-led static sites. Nothing exotic. |
| Content | MDX in Content Collections | **Same** | This is the standard Astro pattern, not an invention. |
| Styling | Tailwind (majority) | **Plain CSS + tokens** | The deliberate minority choice. Justified by a learning goal, not by performance (§5.1). |
| Interactivity | React islands | **Plain TS in `scripts/`** | Justified because there are ~4 behaviours, none of which manage a DOM tree. If that changes, use a framework for that widget. |
| Deployment | Vercel / Netlify | **Self-hosted Docker + nginx** | He already runs the server. A static bundle behind nginx is boring and fast. |

**Where this is more rigorous than a typical portfolio:** a typed content
contract with drafts and explicit publication state, one definition of
"featured", contrast ratios computed rather than eyeballed, and a written plan
before code. Most personal sites skip all four and regret the first two by the
tenth item.

**Where it is deliberately less:** no CMS, no tests beyond smoke checks, no
analytics, no i18n, no component library. Those are costs a 12-page personal
site does not need to carry.

**The honest risk** is the middle column above: two minority choices (plain CSS,
no framework) taken for good reasons that stop being good reasons if the site
grows. Both are reversible — Tailwind can be added later, and a single widget
can adopt a framework without rewriting the site.

## 4. Design philosophy

### 4.1 Apple: restraint, hierarchy, one focal point

The visual system is derived from **apple.com's production CSS**, not from an
impression of it. References:
[HIG — Typography](https://developer.apple.com/design/human-interface-guidelines/typography) ·
[HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color) ·
[HIG — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) ·
[HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout)

The principles actually applied:

- **One focal element per screen.** The hero is type-led. The 3D object gets
  its own section below, where it is that section's single subject. This is
  also why the portrait lives on About, not next to the 3D: a face and a 3D
  object are both high-salience, and side by side they read as two widgets.
- **Max three type sizes per viewport**, with the fourth level carried by
  *colour* (`--ink` → `--ink-2`), not size.
- **Exactly one accent**, used only on things that respond to the cursor.
  Emphasis inside body text is weight + ink, or a tinted highlight — never the
  link blue, so blue keeps meaning "clickable".
- **Whitespace is the trust signal.** 120px between sections, 980px content
  width. Apple's real content width is 980px, not 1280.

### 4.2 Ghost: how long-form should read

The Work, Project and Play posts follow **Ghost Casper's** article anatomy —
[Casper](https://github.com/TryGhost/Casper) ·
[Ghost themes](https://ghost.org/docs/themes/):

- **One measure: ~660–720px** for text (~65 characters). Images may break out
  to `wide` or `full`; text never does. This single rule is most of why a blog
  feels calm.
- Feature image sits **after** the title and byline, so the title is the first
  thing read.
- Vertical rhythm as `> * + * { margin-top: … }`, not per-element margins.
- Captions 13–14px, grey, and for full-bleed images pulled back into the
  reading column.
- Hover states are nearly invisible: opacity, or a 4px arrow nudge.

### 4.3 Structure I borrowed, and from where

| Element | Source | What I took |
|---|---|---|
| Content/config/component split | [magic-portfolio](https://github.com/once-ui-system/magic-portfolio) | Two editable files + drop-in MDX; `display` flags |
| Per-project case-study pages | [sunnypatel.net](https://www.sunnypatel.net) | Problem → decisions → outcome, with a sticky facts sidebar |
| Post anatomy and measure | [Ghost Casper](https://github.com/TryGhost/Casper) | Reading column, feature image placement, caption style |
| Work-page year ledger | [Primer Timeline](https://primer.style/product/components/timeline/), [shadcnblocks changelog](https://www.shadcnblocks.com/block/changelog1) | Sticky date gutter; `:target` for deep links |
| Play grid → article | [devansdesign.com](https://www.devansdesign.com) | Square grid of hobbies, each opening a real write-up |
| Header mark + motto | [devansdesign.com](https://www.devansdesign.com) | Personal mark top and bottom, one-line motto |
| Dark-mode colour, elevation, image softening | [HIG — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) | 7:1 for small custom text; base/elevated ladder; darken white-bg images |
| Theme toggle correctness | [web.dev theme switch](https://web.dev/articles/building/a-theme-switch-component) | Inline head script, `color-scheme`, `prefers-color-scheme` default |

### 4.4 What the site deliberately does not do

No skill percentage bars. No logo wall. No testimonials I can't attribute. No
scroll-jacking, no cursor-follow glow, no magnetic buttons, no alternating
zig-zag timeline, no horizontal scroll sections. Each of these is either
noise, or it breaks "it should always be obvious where to click".

---

## 5. The design system

### 5.1 Why not Tailwind

Tailwind is installed today and will be **removed**.

**The reason is the learning goal, and nothing else.** Writing the CSS is part
of why this project exists. That is a legitimate reason and it is the only one
claimed here.

An earlier draft argued that the per-size tracking table forced eleven
arbitrary-value classes. **That was wrong** — Tailwind v4 font-size tokens carry
line-height, letter-spacing and weight together, so a single named token encodes
the whole recipe
([docs](https://tailwindcss.com/docs/font-size#customizing-your-theme)). The
bundle argument was also weak: Tailwind outputs CSS, so removing it removes no
browser runtime, and "~400 lines" was a guess made before responsive articles,
focus states and two themes existed.

So: a deliberate minority choice, taken for practice, not performance. If
iteration speed ever matters more than the exercise, adding Tailwind back is a
config change. What plain CSS must earn in exchange is **structure**:
`tokens.css`, `base.css`, `article.css`, and scoped styles per component — with
named type recipes rather than ad-hoc declarations, and no global selectors that
accidentally restyle every nested heading.

### 5.2 Colour

Apple's neutrals, **with two measured contrast failures fixed**. Ratios
computed with the WCAG relative-luminance formula.

| Token | Light | Dark | Note |
|---|---|---|---|
| `--canvas` | `#FFFFFF` | `#161618` | Never `#000` — see below |
| `--surface` | `#F5F5F7` | `#1D1D1F` | Alternating bands |
| `--border` | `#D2D2D7` | `#424245` | |
| `--ink` | `#1D1D1F` | `#F5F5F7` | 16.8:1 — AAA |
| `--ink-2` | `#6E6E73` | `#A1A1A6` | 5.1:1 — AA |
| `--ink-3` | `#515155` | `#ABABB1` | small text; meets Apple's 7:1 (see §5.2.1) |
| `--link` | `#0066CC` | `#2997FF` | 5.57:1 on white, 5.11:1 on the grey band |
| `--fill` | `#0071E3` | `#0071E3` | Buttons on white only |

**The two fixes, both of which Apple itself gets wrong on the web:**

1. `#86868B` is **3.6:1** on white — it fails WCAG AA for body text. Apple
   uses it only for captions and legal. Small text here uses `#57575B` (7.2:1).
2. `#0071E3` as *link text* on `#F5F5F7` is **4.31:1** — fails. Links use
   `#0066CC` (5.57:1 on white, 5.11:1 on `#F5F5F7`). Apple's own hover colour `#0077ED` gives white-on-blue of
   **4.32:1**, also failing, so hover *darkens* to `#0066CC` instead.

**Dark canvas is `#161618`, never pure black.** The defensible reason is
**elevation**, not physiology: `#000 → #0A0A0A` is 1.06:1, so a
"subtle" raised surface is either invisible or a slab. From `#161618` you get a
working ladder. Both [Radix](https://www.radix-ui.com/colors) and
[Vercel Geist](https://vercel.com/geist/colors) start their dark scales the
same way.


### 5.2.1 Dark mode, per Apple's own guidance

Source: [HIG — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode).
The points below are taken from that page and applied here.

**Contrast — Apple is stricter than WCAG.** The HIG says: *"At a minimum, make
sure the contrast ratio between colors is no lower than 4.5:1. For custom
foreground and background colors, strive for a contrast ratio of **7:1**,
especially in small text."* Every colour on this site is custom, so 7:1 is the
bar for small text, not 4.5:1. That moved two tokens:

| Token | Was | Now | Ratios (canvas / surface / subtle) |
|---|---|---|---|
| `--ink-3` light | `#57575B` | **`#515155`** | 7.90 / 7.26 / 7.57 ✓ |
| `--ink-3` dark | `#8E8E94` | **`#ABABB1`** | 7.91 / 7.37 / 7.03 ✓ |

`--ink` clears 7:1 comfortably in both themes. `--ink-2` (body, 17px) and
`--link` sit between 4.5:1 and 7:1, which is within the HIG's minimum for
non-small text.

**Dark is not an inversion.** *"these colors aren't necessarily inversions of
their light counterparts: while many colors are inverted, some are not."* The
dark palette here is tuned separately — which is why `--fill` stays `#0071E3`
in both themes while the text colours are not mirror images.

**Base and elevated.** iOS *"uses two sets of background colors — called base
and elevated — to enhance the perception of depth when one dark interface is
layered above another. The base colors are dimmer… the elevated colors are
brighter."* Our three-step ladder is the web equivalent:
`--canvas #161618` → `--surface #1D1D1F` → `--subtle #212124`. This is also the
concrete reason pure black is wrong: from `#000`, `#000 → #0A0A0A` is 1.06:1 and
the ladder collapses.

**Soften white-background images.** *"If you display a content image that
includes a white background, consider slightly darkening the image to prevent
the background from glowing in the surrounding Dark Mode context."* This matters
here because most project screenshots are light UI. Dimming is applied **per image via an explicit `dim` flag**, not globally: a
bright UI screenshot wants it, a photograph and a contrast-test diagram do not.
The lightbox always shows the original. Ghost Casper does the same
thing (images to `opacity: .9` in dark).

**Icons may need separate treatment.** *"an icon that depicts a full moon might
need a subtle dark outline to contrast well with a light background, but need no
outline when it displays on a dark background."* Applies to the brand marks:
several company logos and simple-icons glyphs are near-black and will disappear
on `#161618`. Each logo needs checking in both themes, with a light variant or a
hairline ring where it vanishes.

**Semantic, not hardcoded.** *"Avoid using hard-coded color values or colors
that don't adapt."* The web equivalent is the token layer: components reference
`--ink`, never a hex. This is enforceable by review — no hex values outside
`tokens.css`.

**Test both appearances, including with Increase Contrast.** The HIG warns that
*"turning on Increase Contrast in Dark Mode can result in reduced visual
contrast between dark text and a dark background."* Test plan: both themes ×
`prefers-contrast: more` × `prefers-reduced-motion`.

**The one place this site knowingly departs from the HIG.** Apple says
*"Avoid offering an app-specific appearance setting,"* because *"they may think
your app is broken because it doesn't respond to their systemwide appearance
choice."* We ship a toggle anyway. The objection is answered rather than
ignored:

- The site **defaults to `prefers-color-scheme`**, so with no interaction it
  always matches the OS — the failure Apple describes cannot happen on a first
  visit.
- The toggle stores an **override**, not a preference. Pressing it back to the
  system value **deletes** the stored key, returning control to the OS.
- With no override stored, the page **follows live OS changes** via
  `matchMedia(...).addEventListener('change')`, including Auto's sunrise switch.

That guidance is also written for native apps, where the OS setting is one
swipe away. On the web there is no such affordance, which is why essentially
every well-built developer site ships a toggle.

### 5.3 Typography

**Geist + Geist Mono**, both SIL OFL for the fonts; simple-icons is CC0.
[Specimen](https://fonts.google.com/specimen/Geist) ·
[Source](https://github.com/vercel/geist-font)

SF Pro is not licensable for the web — Apple's licence forbids embedding it in
website content. Geist is the closest open metric match that exists: x-height
0.530 vs SF Pro Text's 0.5264 (within 0.7%), x-height/cap ratio 0.746 vs 0.747.
Geist Mono shares its x-height and cap-height *exactly*, so a mono label and a
sans label at the same px sit on the same baseline with no compensation.

**Tracking is Geist's own table, not Apple's.** This matters more than it
sounds: Apple's negative tracking on big headlines is a manual override tuned
for SF Pro's optical-size curve. Copying those numbers onto a different
typeface is the single most common way this look goes wrong.

| Size | Line-height | Weight | Letter-spacing | Apple/SF for comparison |
|---|---|---|---|---|
| 80 | 1.05 | 600 | **−0.047em** | −0.015em |
| 64 | 1.0625 | 600 | **−0.041em** | −0.009em |
| 48 | 1.0834 | 600 | **−0.035em** | −0.003em |
| 32 | 1.125 | 600 | **−0.028em** | +0.004em |
| 21 | 1.381 | 400 | **−0.024em** | +0.011em |
| 17 | 1.4706 | 400 | **−0.016em** | −0.022em |
| 14 | 1.4286 | 400 | **−0.010em** | −0.016em |
| 12 | 1.3334 | 400 | **−0.004em** | −0.010em |

A third face, **[Shantell Sans](https://fonts.google.com/specimen/Shantell+Sans)**,
is used for exactly one word — "Play" in the nav — with each letter in a
different colour. It is loaded as a 4-character subset (~2KB).

### 5.4 Layout and spacing

- Content **980px**; reading column **660px**; header/footer gutters **40px**,
  header **72px** tall, header mark **36px**, footer mark **56px** above a
  divider rule — the chrome is deliberately wider than the content.
- 980px is a starting maximum, not a law: gutters are fluid and breakpoints
  follow real cards and titles, not Apple's numbers.
- Spacing scale `4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 120`.
- Section padding 120 / 80 / 56 at desktop / tablet / mobile.
- Breakpoints **1068px** and **734px** (Apple's own).
- Radii `6 · 10 · 12 · 18 · 980` (980 = pill). Buttons are 44px tall,
  `padding: 12px 22px`, and hover changes **only** `background-color`, 100ms.
- Shadows almost nowhere. Separation comes from the grey band.

---

## 6. Pages

| Route | Purpose | Notes |
|---|---|---|
| `/` | Positioning, then proof | Hero (type-led, with résumé + contact links) → **Projects** (3-up) → Work (3 rows) → 3D → Play (2) → CTA |
| `/projects` | Full list | Vertical, each in a macOS window frame; tag filter pills |
| `/projects/[slug]` | Case study | Result-first, then problem → what I built → decisions → outcome; sticky sidebar |
| `/work` | Career chronology | **Sticky year ledger** — see §6.1 |
| `/work/[slug]` | Role story | Ghost post anatomy + margin sidenotes |
| `/play` | Hobbies | 4-up square grid with captions |
| `/play/[slug]` | Hobby article | Same post template |
| `/about` | Who I am | Full-bleed portrait, prose, Play preview. **No tech stack, no work list** — those live on their own pages |
| `/resume` | The résumé | **Real HTML text** (headings, dates, roles) + a PDF download. Images supplement it; they never replace it. |
| `/contact` | Reach me | Large mailto, copy button, optional form |

The CTA block (*"Have something worth building?"*) appears **only on the home
page** — but every article keeps a contact link in its footer, so a reader who
finishes a case study never has to navigate home to reach you.

**Home order changed on review.** The first draft ran hero → 3D → projects,
which contradicts this document's own "proof before prose": lazy-loading the 3D
saves bytes but does not refund the reader's scroll. Projects now come
immediately after the positioning line, the 3D moved below the professional
evidence, the home tech-stack section was **removed** (it duplicated card
metadata and was drifting toward the logo wall the philosophy rejects), and Play
is a 2-item preview rather than 4 tiles.

### 6.1 The Work page

The page opens with the **latest role featured** — cover image, headline, logo,
read link — then "All roles" as a two-column ledger: a 112px date gutter and the
content column, one `<section>` per year, the year `position: sticky; top: 72px`
so it parks while you scroll its roles. Hairline-separated rows, no drawn rail.

**Honest justification.** Review was right that a flat list can also group two
2023 roles and omit links for roles without articles — those are not unique
capabilities of a sticky gutter. The real reason is **visual differentiation**:
Projects already uses a card grid and articles use the Ghost layout, so a third
page reusing either reads as a template. A live date gutter is a structural
device no other page uses, for ~40 lines of CSS and zero JS. That is a design
preference with a small cost, not a functional necessity.

**Grouping ambiguity, fixed.** Grouping by start year puts an ongoing 2025 role
under "2025" forever. Every row therefore shows the **full range and duration**
prominently (`Jul 2025 — Present · 1 yr 3 mos`), so the year is an index, never
the only date information.

**"Latest featured role" means the latest *visible* role**, not the latest with a
write-up. If it has no article or cover, the feature renders without the read
link or image rather than silently promoting an older employer.

Semantics: `<ol>` per year, `<h2>` year, `<h3>` role, `<time datetime>`,
`aria-current` on the present role. The gutter is visual convenience; every fact
also exists in text. On narrow screens the year becomes an ordinary heading.

## 7. Performance

### 7.1 Where the current repo stands

| | Today | After |
|---|---|---|
| JS shipped | **1.11 MB** uncompressed (three.js via r3f + React) | see §7.2 |
| `node_modules` | 332 MB | ~60 MB |
| `dist` | 1.1 MB | ~250 KB |

The 1.11MB was never three.js's fault — it was React, react-three-fiber and
drei *around* three.js. Rebuilding the scene in vanilla three.js and deleting
React removes ~1MB.

### 7.2 Budget

| Metric | Target |
|---|---|
| LCP | **< 1.2s** on 4G (Google's "good" is ≤2.5s) |
| CLS | < 0.05 |
| HTML per page | < 25 KB |
| CSS | < 15 KB gzipped, one file, inlined critical |
| Article page, initial | ~4 KB (theme bootstrap + controller + cursor) |
| Article page, activated | + lightbox ~2 KB, TOC ~1 KB |
| Home, initial paint | < 10 KB |
| Home, after scrolling to the 3D | **+130 KB gz — measured**, not the ~70 KB first estimated. Desktop only, lazy, below the fold. |
| Initial paint (home) | **14.9 KB gz — measured** |
| Article page | **11.2 KB gz — measured** |
| Lighthouse | 100 / 100 / 100 / 100 |

### 7.3 How

- **Static generation.** Every page is prerendered HTML.
- **No framework runtime.** Islands are hand-written TypeScript modules.
- **The 3D is kept off the LCP path** (an observer can still fire on a tall
  viewport or a restored scroll position, so this is verified by a cold-load
  waterfall, not asserted). It sits below the fold and is `import()`ed by an
  `IntersectionObserver`. It pauses on `document.hidden` and when off-screen,
  caps `dpr` at 1.5, and falls back to a static WebP on `save-data`,
  `prefers-reduced-motion`, missing WebGL, and a failed module load.
  (`hardwareConcurrency` reports logical cores — it is a weak proxy, not a
  low-power detector.)
  Materials and lights are **swapped, not rebuilt**, on theme change, and every
  abandoned geometry/material/texture is explicitly disposed. Rebuilding is not
  inherently a leak — *failing to dispose* is, and swapping leaks too if the old
  resources are dropped without disposal.
- **Images** through `astro:assets`: AVIF with WebP fallback, `srcset` at
  600/1000/1600/2000w, intrinsic `width`/`height` always set. Below-the-fold
  images are `loading="lazy"`; **the LCP image never is** — that mistake affects
  ~16% of sites.
- **Fonts** self-hosted, `woff2`, Latin subset, `font-display: swap`,
  preloaded. ~26 KB for both families.
- **Icons** inlined at build from simple-icons. No icon font, no sprite request.
- **Cursors** inlined as data URIs (~4.5 KB gzipped, zero requests).
- **nginx** serves precompressed `.br`/`.gz`, immutable caching for
  `/_astro/*` (content-hashed), `no-cache` for HTML.

---

## 8. Interactive elements

Everything interactive, with its cost. These are **estimates to be verified
against a real bundle**, not measurements. Summed, the five scripts are 83 KB (70+8+2+1+2) before the bulb and TOC, so they
are budgeted in three tiers (§7.2) rather than quoted as one total.

### 8.1 The 3D hero

Vanilla three.js, tree-shaken. **Measured at 130 KB gzipped** — nearly double the initial estimate, which is exactly why it was measured. A single procedural object. Lazy,
paused off-screen, poster fallback. It is **decoration that reacts to the
theme** — it is not a control.

### 8.2 Theme toggle — one owner

There are three surfaces that change the theme (footer button, hero bulb, and
the 3D scene which must *react*). Review was right that this is where
hand-rolled state falls over, so ownership is explicit:

1. **Head bootstrap** (`is:inline`, plain browser JS, before any stylesheet):
   reads the override inside `try/catch`, else falls back to the OS, sets
   `data-theme` before first paint.
2. **One controller** in `scripts/theme.ts` owns resolved state, storage and
   subscribers. Every button calls it; it never reads the DOM for truth.
3. **Subscribers get the current value immediately on subscribing** — which is
   how the lazily-loaded 3D scene gets the right theme when it arrives late.
4. OS changes apply only when no override is stored.
5. **A `storage` event triggers a re-read of current storage — never a blind
   apply of `event.newValue`.** This is the real race: a queued stale event from
   another tab would otherwise overwrite a newer local choice, leaving storage
   `dark` and the page `light`. Handle removal and `clear()`; ignore other keys.
6. Listeners attach *before* the controller's first reconciliation, so a change
   between head bootstrap and module start is not lost. Reconcile on `pageshow`
   for back/forward cache.
7. The scene subscribes *after* creation and applies whatever the first callback
   gives it — it never captures a theme before `await import()` and re-applies
   that stale snapshot. Unsubscribe on disposal.
8. Buttons derive `aria-pressed` from the controller. A failed write must not
   undo the visible choice for that session.
5. A CSS-only `prefers-color-scheme` fallback covers JS-disabled.


~2 KB. Two-state, storing an **override** in `localStorage` and defaulting to
`prefers-color-scheme` when absent. Lives in the **footer** (owner's call — not
the header), plus the pull-cord bulb in the hero (§8.3).

Correctness details that are easy to get wrong:

- A tiny **`<script is:inline>` in `<head>`, before any stylesheet**, sets
  `data-theme` on `<html>`. Without this you get a flash of the wrong theme on
  every load. `is:inline` is what stops Astro bundling and deferring it.
- `color-scheme: light dark` on `:root` advertises support; it does **not** make
  native controls follow a manual `data-theme`. The explicit selectors must each
  set `color-scheme: light` / `dark`.
- A real `<button>` with `aria-pressed`. Never inside the `<canvas>`.
- Transition `background-color`/`color`/`border-color` only, never `all`.

### 8.3 Pull-cord bulb

~5 KB, hand-written spring, no GSAP (GSAP + Draggable + MorphSVG would be
40–45 KB). Hangs from the top edge of the hero **in the right margin, outside
the 980px column**, so it doesn't compete with the 3D object inside the column.
Pointer Events so it works on touch; `click` activates it so keyboard works;
under `prefers-reduced-motion` it snaps instead of swinging.

No well-known production site ships this, which makes it genuinely
distinctive — and is also why it needs care rather than a copied CodePen.

### 8.4 MapleStory cursors

Extracted from [zaytri/maplestory-cursors](https://github.com/zaytri/maplestory-cursors),
converted from Windows `.cur`/`.ani` to PNG frames, cropped to 32×32 at **native
resolution** (the art occupies the top-left ~30px of a 48px canvas, so no
scaling and no blur), hotspots preserved.

The animation works because these cursors run at **200–500ms per frame**, slow
enough to swap the *real* CSS cursor on a timer. That means the native pointer,
with zero lag — not a div chasing the mouse. 4.5 KB gzipped, zero requests,
disabled on touch, static frame under reduced motion, native I-beam preserved
in inputs.

⚠️ **These are Nexon's game sprites from an unlicensed repo.** Fine on a
personal site in practice, but it is a deliberate choice, not an oversight.

### 8.5 Deferred to after launch

**The `⌘K` palette.** A real palette needs keyboard navigation, focus
management and async results — the point where a small library beats
hand-written code, and it is not worth either on a site with ~12 pages. Revisit
when there is enough content to search.

### 8.6 Smaller things

scroll progress bar (CSS
scroll-driven, 0 JS) · sticky table of contents (~1 KB) · image lightbox
(native `<dialog>`, ~2 KB) · copy-link button · cross-document View Transitions
(0 KB, progressive).

---

## 9. Accessibility

Treated as correctness, not a checklist at the end.

- Semantic HTML first: `<ol>` for the timeline, `<time datetime>` for dates,
  real `<button>` and `<a href>`, `<figure>`/`<figcaption>` for images.
- **4.5:1 minimum** for body text, verified in *both* themes — light-mode ratios
  do not carry over. The two Apple fixes in §5.2 exist because of this.
- Never colour alone: the current role has a blue dot **and** the word
  "Present".
- Decorative lines are `aria-hidden` and carry no meaning.
- `prefers-reduced-motion` honoured for the 3D idle, the bulb swing, the cursor
  animation, scroll reveals and view transitions.
- Visible focus rings; 44×44px minimum targets; tab order equals visual order.
- The site works with **JavaScript disabled** — which is also why it is
  crawlable.

---

## 10. Build, deploy, and making changes

### 10.1 Deployment

Push to `main` → GitHub webhook → Dokploy rebuilds the Docker image → nginx
serves `dist/`. Multi-stage build: `node:22-alpine` compiles, `nginx:alpine`
serves. Nothing but static files reaches production.

Live on the Hetzner box, Dokploy project `portfolio`, fronted by Traefik with
Let's Encrypt.

⚠️ **Open item:** the apex `renhwa.com` has no A record yet. It needs
`A @ → 46.225.229.63` at the registrar before it resolves or gets a
certificate. `www` works today and stays up until then.

### 10.2 Day-to-day changes

| Task | Steps |
|---|---|
| Add a project | Copy `src/content/_template/project/`, rename the folder to the slug, edit `index.mdx`, drop images beside it, push. It appears only on the surfaces its metadata allows (see §3.1.1). |
| Add a role | Same under `content/work/`. It sorts into the right year group on the ledger by its `start` date. |
| Add a Play item | Same under `content/play/`. Appears in the grid on `/play`, `/about` and home. |
| Fix a typo on the home page | `content/home.ts` |
| Add a tool | `data/technologies.ts`. An ID carries the label; a missing icon falls back to text. |
| Change the accent colour | One value in `styles/tokens.css` |
| Update the résumé | Edit the HTML résumé **and** replace `public/resume.pdf`. They are maintained in parallel; the release checklist checks both. No automatic generation is promised. |

**Convention over registration:** there is no registration list. A new folder is
picked up automatically — but whether it gets a *page* is decided by `draft`
and `writeup`, not by existing (§3.1.1).

### 10.3 Quality gates

One command, `npm run verify`, is the authority. It runs `astro check`
(diagnostics — separate from the build), a production build, and content and
link validation. A push that fails it must not deploy.

**Content checks:** unknown keys (`.strict()`), duplicate slugs, invalid or
reversed dates, missing local assets, unresolved internal links, drafts
excluded everywhere, and `writeup: true` entries whose route was generated.
External links are checked on a schedule, not per deploy — a third party being
down should not block a release.

**Smoke checks, in a real browser:** home → project → contact; theme agrees
after reload; OS fallback with storage unavailable; a lightbox opens and closes
by keyboard; every article is reachable with JS disabled. Run at a narrow
viewport, in both themes, with reduced motion.

**Delivery:** nginx must return a real `404` — the current `try_files $uri $uri/ /index.html` serves the homepage with **status 200** for a missing article (verified), which is wrong for a static site and bad for search. Fix to `=404`. Then: **`www` 301-redirects to the
apex preserving path and query**, and keeps its DNS and certificate so old
links survive — "retiring www" must not mean breaking it. Dokploy must deploy
only a verified artifact, not whatever a webhook pushed; a rollback path is
written down.

## 11. Settled decisions

Two review rounds are complete (`docs/review-1`, `docs/review-2`). The debate is
preserved there; this section records only what was decided.

| Question | Decision |
|---|---|
| Tailwind | **Removed.** For the learning goal only — the tracking and bundle arguments were wrong and are withdrawn. Reversible. |
| The 3D hero | **Kept**, as an accepted owner preference, moved *below* the professional evidence so it is not a toll before the first project. Its cost is stated, not defended as free. Poster-only on mobile. |
| Pull-cord bulb | **Kept**, hero top-right, outside the content column. Real `<button>`, tap works without drag, no double-toggle on release. |
| MapleStory cursors | **Kept.** Nexon sprites from an unlicensed repo — a knowing choice, recorded as a cost. Off on touch. |
| Play on home | **2-item preview**, after the professional evidence. |
| Motto | Placeholder. Must become his own before launch. |
| Invented content | All mockup metrics and anecdotes are fabricated placeholders. Replace before launch. |
| Work ledger | **Kept**, justified as visual differentiation, not as a unique capability. |
| Command palette | **Deferred** until there is enough content to search. |
| Tests | **Not "smoke only".** Content-policy fixtures and theme-ordering regressions are worth real tests. |

## 12. The mockups

**https://claude.ai/artifact/9Ye1seZLWo2ED4fmThk71r** — 13 artboards, at 1440px,
clickable: press Play and use the nav.

`Home` · `Home — dark` · `Projects` · `Project: Kanta` · `Work experience` ·
`Work: Carro` · `About` · `Play` · `Play — Wok hei` · `Résumé` · `Contact` ·
`Home, phone` · `Foundations`

The **Foundations** board carries the type ramp, colour tokens with their
contrast ratios, the spacing scale, the emphasis styles and the content model —
it is the visual counterpart to §5.

Every artboard height was measured in a real browser rather than estimated.
That check caught two earlier boards that were clipping content by 400–700px.
