# Request: fix the layout bugs, refactor, and rewrite all content

The site is live at **https://renhwa.com** and the code is in this repo. It
works, it deploys, and the content model is sound. What it is not is *finished*:
there are three real layout bugs, the copy is invented placeholder, and the
component layer has drifted from the design it was built to match.

Please take it from here. You have full latitude to refactor — including
disagreeing with decisions recorded in `DESIGN.md`, which is a plan, not scripture.

---

## 1. Three layout bugs, already diagnosed

I found the causes but have not fixed them. Fix them properly rather than
patching the symptom, because the first one is a pattern that will recur.

### (a) Page headers are indented relative to everything below them

**Visible on:** every article page, and the intro block on `/projects`,
`/work`, `/play`.

**Cause:** `.wrap` is `width: min(980px, …); margin-inline: auto`. Putting
`max-width: 760px` on that same element **re-centres the narrower box**, so the
header sits ~110px to the right of the image and body beneath it.

```css
/* src/styles/base.css */
.wrap { width: min(var(--content), 100% - var(--gutter) * 2); margin-inline: auto; }

/* src/layouts/ArticleLayout.astro — the bug */
.head { max-width: 760px; }          /* re-centres inside the centred wrap */
```

Same mistake in `src/pages/{projects,work,play}/index.astro` on `.intro`.

The fix is a measure that constrains width **without** re-centring — a separate
inner element, `margin-right: auto`, or a proper named grid. Whichever you pick,
apply it once so it cannot be got wrong again.

### (b) In-body `<Figure size="wide">` bleeds into the sidebar

`src/components/article/Figure.astro` breaks out with negative margins computed
against the **reading column**, but the article is a two-column grid
(`reading | aside`), so a wide figure overlaps the aside instead of the page
gutters.

```css
.wide { width: min(1100px, 92vw); margin-inline: calc((min(1100px, 92vw) - 100%) / -2); }
```

Ghost solves this with a named grid (`full-start / wide-start / main-start …`)
so break-out is declarative. Consider that, or drop `wide`/`full` entirely if
the article layout has a sidebar — a two-column article may simply not have room
for break-out images, and pretending otherwise is the actual bug.

### (c) Home project cards: image and text not aligned

`src/components/projects/ProjectCard.astro` carries `.hoverable`, which applies
`padding: 16px; margin: -16px`. Inside a `repeat(auto-fit, minmax(280px, 1fr))`
grid this makes each card wider than its cell. Please verify in a browser at
several widths and fix the hover affordance so it does not distort the grid.

**Verify all three visually.** They were not caught by the build, the tests, or
by me reading the code — only by looking at the rendered page.

---

## 2. Rewrite all of the content

**Everything currently on the site is invented placeholder.** I wrote it to make
the layouts read realistically. None of it is true. Do not preserve any of it.

### Sources, in order of authority

1. **`docs/source/notes.md`** — Zack's own interview notes, verbatim from his
   `.docx`. This is his voice and his facts, and it **outranks everything else**.
   It corrects things I got wrong: he positions himself as *"a software engineer
   specialising in data"*, not an AI engineer; the AI Singapore work was a GenAI
   MVP for a gaming company generating 3D animation from text prompts; NIE was
   speech and signal processing; the Department of Statistics was LLMs and text
   analytics.
2. **`docs/source/resume.pdf`** — dates, titles, employers. Authoritative for facts.
3. The LinkedIn dates already encoded in `src/content/work/*/index.mdx`
   frontmatter, which are correct.

### What to write

- Every `src/content/{work,projects,play}/*/index.mdx` body and frontmatter.
- `src/content/home.ts` and `src/content/pages.ts` — all section headings and
  ledes.
- The About page prose in `src/pages/about.astro`.
- The motto in `src/config/site.ts` is currently **lifted almost verbatim from
  devansdesign.com** ("builds real, good things"). It must become his own.

### Rules

- **Hobbies are climbing, coffee, and cooking.** Replace the Play entries
  accordingly — guitar and film photography were my inventions. (The notes
  mention guitar; the owner has since said climbing, coffee, cooking. Follow the
  owner.)
- Expand generously from the notes. Where a real number is missing, either use
  one from the notes or write a concrete placeholder like `[N]` — do **not**
  invent statistics that read as fact. I did, and it is the main thing being
  undone here.
- Kill the clever-but-empty register: *"Things I built because I wanted them to
  exist"*, *"Five roles, written like posts"*. Say what the thing is.
- First person, plain, specific. One idea per sentence. No em-dash pileups.

---

## 3. Refactor as you see fit

The content model (`content.config.ts`, `lib/select.ts`, `lib/content.ts`) is
the part I am most confident in — strict nested schemas, three visibility flags,
one selection mechanism, pure policy separated from Astro so it is testable.
**The component and style layer is where to be sceptical.**

Known smells:

- `.hoverable` in `base.css` is a global shortcut used by four unrelated
  components; it is also bug (c).
- `ScreenshotFrame` wraps every project image in macOS window chrome. That suits
  a UI screenshot and is wrong for a diagram or a photo. Make it opt-in.
- `ArticleLayout` has three slots (`hero`, `aside`, default) and each route
  fills them differently — check that is still the right seam.
- Page-level `<style>` blocks have accumulated one-off values that should be
  tokens, or should not exist.
- `src/styles/cursors.css` is generated, 6.7KB of inlined data URIs. Fine, but
  document that it is generated and how.

Also please **rewrite `README.md`** — it is still the Astro starter default.

---

## 4. Design and UX

The intended design is in **`docs/mockup/`** — 13 standalone HTML pages, one per
screen, openable directly in a browser. `Foundations.html` carries the type
ramp, colour tokens with contrast ratios, and the spacing scale. `Main.html`,
`Projects.html`, `WorkCarro.html` and `Play.html` are the ones the build has
drifted from.

Treat the mockup as intent, not gospel — if something in it is wrong, say so and
do better. But the current build differs from it in ways that are accidents
rather than decisions, and those should be reconciled.

Worth knowing about the visual system:

- Values are derived from apple.com's production CSS and Apple's HIG, including
  the 7:1 small-text contrast target. Two of Apple's own published values fail
  WCAG and are corrected in `tokens.css` — do not "fix" them back.
- Letter-spacing is **Geist's** table, not Apple's. Copying SF Pro's tracking
  onto Geist is wrong; the numbers differ by ~0.03em at display sizes.
- One accent, used only for things that respond to the cursor. Emphasis in prose
  is weight and ink, or a tinted highlight — never the link blue.

---

## 5. Constraints worth keeping

- **Static Astro, no framework runtime.** Initial paint is currently ~15KB gz.
- **`npm run verify`** (types + tests + build) must pass; it runs inside the
  Docker build, so a failing check cannot deploy.
- Publication policy is enforced and tested: drafts and `writeup: false` entries
  generate no routes. There are live fixtures for this — keep them working.
- nginx returns a real 404 (it used to serve the homepage at 200), and redirects
  must stay on HTTPS (`absolute_redirect off`, because nginx sits behind Traefik).
- The MapleStory cursors are Nexon sprites from an unlicensed repo. A knowing
  choice by the owner, recorded as a cost — not an oversight to fix.

## 6. How to check your work

```bash
npm run dev       # local
npm run verify    # types, tests, production build
npm test          # just the tests
```

Then **look at every page in a browser**, at desktop and phone widths, in both
themes. All three bugs above were invisible to the build and to code review.

Deployment is `git push origin main` → Dokploy → nginx. Live at renhwa.com.
