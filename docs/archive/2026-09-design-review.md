# Design review — findings, fixes and open gaps

A full design audit of renhwa.com run on 2026-09-30 with the Impeccable skill,
using two independent assessments: a design review and a deterministic
detector plus measured browser evidence. This file is the handoff: what was
found, what has been fixed, and what is genuinely still open.

The raw snapshot is beside this file, in `2026-09-29-design-critique-raw.md`.
Re-run the audit with `/impeccable critique` or `/impeccable audit`.

**Score at time of review: 20/32** on Nielsen's heuristics (7 and 10 are `n/a`
on an Experience surface). Consistency scored 1/4 and was the whole story —
the system is well specified and was unevenly executed.

---

## What is already fixed

Do not redo these. Each line names the commit.

| # | Finding | Commit |
|---|---|---|
| P0 | Work rows collapsed into a 190px ribbon above 800px. A chevron placed before `.body` with only `grid-column: 3` pushed `.body` to row 2 col 1; the 670px middle column was empty on every row. Invisible below 801px. | `c0663c6` |
| P1 | `/cv/` had no heading of any level, the only page with no outline, while `pages.cv` defined eyebrow/title/lede and nothing imported it. | `c564c85` |
| P1 | `/cv/` was a black slab on mobile. The `<object>` fallback only fires when the browser says it cannot render the type; mobile Chrome says it can, then paints black. Embed hidden under 734px, download card in its place. | `c564c85` |
| P1 | Tap targets failed on every page — always on height, never width. Footer links 20px, wordmark 26px, `.link-arrow` 25px, contact rows 19px, filter pills 36px. | `c564c85` |
| P2 | `/work/` skipped h1 → h3 six times. `WorkList` now takes a `headingLevel` prop. | `c564c85` |
| P2 | Wordmark sat 46px outside the content edge — header bar was 1152px inside a 980px column. | `c564c85` |
| P2 | Nav index numbers rendered at 9.9px, below the 11px functional floor. | `c564c85` |
| — | Below 880px the whole IA was one unlabelled hamburger alone in an empty bar. It now reads `Menu`, and Contact stays visible on a phone. | `c564c85` |
| — | Bare URL as the accessible name on the `/contact/` GitHub row. | `c564c85` |
| — | `site.features` had no consumer anywhere in `src/` — `hero3d`, `bulb`, `cursors`, `commandPalette` all dead, plus a `ThemeToggle` comment about a hero bulb that does not exist. | `c564c85` |


### Polish pass, 2026-10-10 (uncommitted at time of writing)

Read against Anthropic frontend-design, Vercel Web Interface Guidelines,
ui-ux-pro-max and Impeccable polish. Refinement only: identity kept.

- Header: nav numbers gone, every item 34px high on one line, search trigger
  is a labelled pill. Search rows read "AI Engineer · Carro".
- Work articles open on an outcome sentence built from `metrics`, with the
  cover image below it; the duplicate "In short" box is gone. The cat covers
  are kept on purpose as slots until real images land (owner's call).
- Prev/next are cards naming the role and company, with logo and dates, and
  ← → move between articles (ignored while typing or with search open).
- `ScreenshotFrame` chrome is opt-in, so photographs no longer wear fake
  window chrome. (Gap 2, chrome half.)
- Eyebrows are sentence-case sans with no leading rule (no orphan); home
  section numbers 01–04 and project numbers removed; middle-dot meta strings
  on article eyebrows replaced by prose.
- `/skills/`: chips used somewhere carry a count and open to show where, with
  links. Built from the `stack` of roles and projects (`getSkillEvidence`).
  (Gap 5, first bullet.)
- `/work/`: chevron level with the title, durations in sentence case, Carro's
  summary not repeated by its first bullet. Home work rows show metrics.
- Projects: filters hidden under four projects; image first on mobile.
- Prose figures get their own rhythm (Figure/Shot no longer zero the margin).
- Contact: copy-email button with a polite live region; placeholders end in
  "…"; labels sentence case; 1px neutral quote rule.
- Footer: the divider becomes a line break on phones. Headings balance,
  paragraphs `text-wrap: pretty` site-wide. SectionHead tighter on phones.

Still open from below: real work imagery (gap 1), the Kanta screenshot,
promoting Echo's `chat.jpg` (gap 2), the cursor explanation (gap 3), theme
toggle only in the footer.

---

### Layout and copy pass, 2026-10-20

- Copy rewritten site-wide against `docs/writing.md`.
- Articles: no cover above the text; sidebar-less articles are one centred
  column; every photo block is two across and square (`4c0b669`, `bedeb3a`).
  Rules in `docs/design.md#articles-and-photos`.
- Skills chips are plain again; the evidence dropdown is gone.
- Gap 2 below is half closed: article pages no longer show the stock covers in
  a screenshot frame. Project cards on the home and /projects still do.

## Open gaps

Ordered by impact. Each one names the files and the concrete change.

### 1. The site has almost no evidence of the work — P1, blocked on assets

This is the largest gap and it cannot be closed without real images.

- All six `src/content/work/*/cover.jpg` carry `coverAlt: Placeholder image`.
- `dos/cover.jpg` and `shakeshack/cover.jpg` are byte-identical.
- `work/ai-singapore/cover.jpg` is a photograph of a sleeping cat, rendered
  directly under the title "Generating 3D animation from a text prompt".
- `src/content/projects/kanta/` has no screenshot of the application. The repo
  at `github.com/sunraymoonbeam/kanta` has none either — `docs`, `assets`,
  `frontend/public` and `.github` were checked and contain only the stock
  Next.js SVGs.

**What to do.** `work/[slug].astro` already guards the hero with
`{d.cover && …}`, so deleting the `cover:` key from the six work entries makes
the article open on the "In short" block instead, which is stronger than
opening on a placeholder. Then add a content test failing any entry whose
`coverAlt` matches `/placeholder/i` so this cannot come back.

**Needs a decision from the owner**, because it deletes visible content.

### 2. Project covers are stock photography, and the frame asserts otherwise — P1

`kanta/cover.jpg` (a flat-lay of single-use cameras) and `echo/cover.jpg` (a
figure facing a glowing wireframe double) are both stock. The Echo image is a
Getty comp download; the licence risk was raised and the owner chose to ship
it, so leave that decision alone.

The separate, still-open problem is `ScreenshotFrame` with `chrome: true`: it
draws macOS traffic lights and a title bar reading "Kanta" / "Echo" around
those photographs, which asserts *this is a screenshot of the application*.
That is a factual claim, not a matter of taste, and it is false.

**What to do.** Either pass `chrome: false` for covers that are not screenshots,
or make `chrome` default off and opt in only where the image really is a screen.

Worth knowing: `src/content/projects/echo/chat.jpg` already exists — the
fine-tuned model replying in Singlish about Kovan food. It is the most
unfakeable image on the site and it currently sits third on the page. Promoting
it to the cover costs one line and closes this gap outright.

### 3. The composition is transcribed rather than authored — P2, needs direction

The components say so themselves: `Header.astro` "Geometry copied from the
reference header", `WorkList.astro` "as on the reference page", `ProjectRow.astro`
"Row order follows the reference", `contact.astro` "as on the reference contact
page". See `docs/design.md`.

Nothing in the composition says *AI systems engineer*. There is no number at
display size, no architecture diagram, no trace, no dashboard. The work is
described in grey body copy.

Two things are genuinely authored and both are mishandled:

- **The MapleStory cursor set** (`src/scripts/cursor.ts`, `src/styles/cursors.css`)
  is desktop-only and unexplained, so it reads as a bug to anyone who did not
  play the game. Either let the visitor in on it with one line somewhere, or
  drop it.
- **The crayon wordmark** (`CrayonWord.astro`) is the only non-derivative
  typographic idea on the site, and it is missing from the mobile menu, where
  Hobbies renders as flat mono text.

**The prompt that unlocks this:** the climbing essay works because it has a
broken arm, two X-rays and a joke. `/work/carro/` has 12 agentic workflows,
60,000 tickets a month and an 80% cost reduction — and a placeholder image.
Find the equivalent turning point in each role and the work pages will
outperform the hobby pages.

### 4. One page versus multiple routes — decided: keep the routes

The owner asked whether the index pages should collapse into one scrolling
page, because visitors did not realise there was a menu. **The review argues
against it, and the evidence supports that.**

- The home page already *is* that scrolling page: Projects (01), Work (02),
  Skills (03), Hobbies (04) and Contact in sequence, each with a "see all" link.
  Merging would mostly inline a chip wall that is already duplicated verbatim,
  onto a page that is already 6,729px tall at 390px wide.
- The real cause of the menu complaint was the mobile header, now fixed in
  `c564c85`.
- Article routes have to exist regardless, so landing on `/projects/echo/` from
  a shared link is a wayfinding problem the merge would not solve.

**The one merge worth doing:** fold `/skills/` into `/work/` or into the home
section and drop it from `site.nav`. It is 25 logo chips and nothing else, it
is duplicated on the home page, and it spends a nav slot without adding
content.

### 5. Smaller items, not yet done

- `/skills/`: `TechChip` should link to the evidence. Extend
  `src/data/technologies.ts` with an optional `evidence: { href, label }` per id
  (`langfuse → /work/carro`, `pytorch → /work/ai-singapore`, `fastapi →
  /projects/echo`) and render the chip as an `<a>` when present. Right now
  LangGraph and Bash carry identical weight.
- `/projects/`: five filter pills over two projects. The control makes the
  library look larger than it is and then proves it is not.
- Cmd-K search returns two rows both reading "AI Engineer", separated only by a
  14px grey subtitle.
- The header search trigger is a 200px empty bordered box with the word
  "Search" deliberately visually hidden. It has field affordance and button
  behaviour. Shrink it to the icon button it actually is.
- `ArticleLayout` `.eyebrow` is `inline-flex` with a 28px `::before` rule; long
  work eyebrows wrap and orphan the rule beside the first line.
- `SectionHead` `padding-bottom: var(--s-9)` plus section padding leaves 150px+
  between a heading and its first card on mobile.
- The theme toggle lives only in the footer, so most visitors never find a dark
  mode that is better balanced than the light one.
- `formatDuration` renders "1 YR 2 MOS" at 11px uppercase with 0.15em tracking,
  which reads as a part number.
- The home Work section runs in `compact` mode, which drops the bullets — so a
  40-second skim of the home page shows three job titles and no numbers.

---

## What is working — do not regress it

- **The token layer.** `src/styles/tokens.css` computes and comments every
  contrast ratio, defines dark as a separately tuned ramp rather than an
  inversion, and refuses `#000` as canvas. Measurement confirms it: zero
  contrast failures across six pages, tightest margin `#6e6e73` on `#f5f5f7` at
  4.66:1 against a 4.5 threshold.
- **Motion that fails safe.** Scroll reveals sit inside
  `@supports (animation-timeline: view())`, so an unsupported browser renders
  the content rather than sticking at opacity 0. The reveal range is a fixed
  length, not a percentage, so a tall work row and a 60px tile behave alike.
- **Zero horizontal overflow** across 6 pages × 3 widths (320/390/768).
- **Focus ring renders everywhere**: `outline: solid 2px #0071e3`, offset 2px,
  confirmed by screenshot rather than by reading the CSS.
- **Zero empty link accessible names.**
- **The climbing essay** is the model for every article on this site: real
  material, and a shape — setup, injury, return, transfer back to the
  professional claim.

---

## Detector notes

`impeccable detect --json src` exits 2 with 4 findings across 3 rules. Two are
worth acting on (`bounce-easing` in `src/pages/index.astro:133` and
`src/styles/base.css:111`; `gradient-text` at `src/pages/index.astro:120`),
both stylistic.

These were verified as **false positives** — do not "fix" them:

- `broken-image` at `src/scripts/lightbox.ts:23`. The `<img alt="" />` is in a
  template literal for the dialog shell; `show()` assigns `src` and `alt` at
  runtime. Static string match.
- `dark-glow` on `body`, reported on every page. The detector is matching its
  own injected overlay stylesheet — `#ffba00` appears nowhere in this project.
- `gradient-text` counted twice on `/`. There is exactly one
  `background-clip: text` rule in the codebase.
- Empty `alt` on work company logos. Correct decorative treatment: the company
  name is in the adjacent heading, so a non-empty alt would duplicate it.
- `input.trap` as an undersized tap target on `/contact/`. It is the spam
  honeypot — `aria-hidden`, `tabindex="-1"`, positioned off-screen.

One environment note for whoever runs this next: `resize_window` does not
change `window.innerWidth` in the Chrome extension, which renders at a fixed
2560px. Use a same-origin iframe at an exact CSS width instead; media queries
resolve against the iframe viewport correctly.
