---
target: entire portfolio design
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/Users/lowrenhwa/dev/personal-portfolio/src/pages/index.astro"
target_fingerprint: "sha256:2bbb686502f89db71e8cfca6fcd46be11d4f646bd2ed2ff95ea01c68f8195665"
target_path: /Users/lowrenhwa/dev/personal-portfolio/src/pages/index.astro
timestamp: 2026-09-29T19-08-12Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active nav, `aria-current`, live search all solid. Filter pills never say how many items match; `/cv/` PDF has no loading or failure state. |
| 2 | Match System / Real World | 3 | Copy is plain and human. Undercut by `ScreenshotFrame` putting macOS chrome + a "Kanta"/"Echo" title bar around stock photographs. |
| 3 | User Control and Freedom | 3 | Back links, prev/next, redirects preserve old URLs, Escape closes overlays. No route from a work article to the related project. |
| 4 | Consistency and Standards | 1 | `/cv/` has zero headings while `pages.cv` defines eyebrow/title/lede and is never imported. `/work/` skips h1→h3 six times. Hobbies is crayon in header/footer, flat text in the mobile sheet. Wordmark sits 46px outside the content edge. Dead feature flags. |
| 5 | Error Prevention | 3 | Form validates before `mailto:`, honeypot, `aria-invalid`/`aria-describedby` wired. `<object>` PDF fallback never fires because Chrome claims it can render the type. |
| 6 | Recognition Rather Than Recall | 2 | Two search results both read "AI Engineer". Search trigger is a 200px empty field-shaped button with the word "Search" visually hidden. Project covers are stock, so nothing in the grid is recognisable as the thing it links to. |
| 7 | Flexibility and Efficiency | n/a | Experience surface; no repeat-use workflow to accelerate. |
| 8 | Aesthetic and Minimalist Design | 3 | Token system is genuinely disciplined — contrast ratios computed and commented, dark mode tuned not inverted. Loses a point for 5 filter pills over 2 projects and a `/skills/` page that is 25 chips and nothing else. |
| 9 | Error Recovery | 2 | 404 is fine. The black PDF box on mobile gives no message and no visible route to the download sitting above it. |
| 10 | Help and Documentation | n/a | Experience surface; no documentation warranted. |
| **Total** | | **20/32** | Bottom of the normal band |

## Design Specificity Verdict

**Mostly generic, with two flashes of authorship that are hidden or undercut.**

The composition is transcribed rather than authored, and the components say so in their own comments: `Header.astro` "Geometry copied from the reference header", `WorkList.astro` "as on the reference page", `ProjectRow.astro` "Row order follows the reference", `contact.astro` "as on the reference contact page". The visual language is the current dev-portfolio default set — mono eyebrows with a 28px rule, zero-padded section numbers, a gradient name, a pill CTA, macOS traffic-light frames, a Cmd-K palette.

Nothing in the composition says *AI systems engineer*. Agent fleets, LLM cost curves, model routing, 60,000 tickets a month, a diffusion model trained on motion data — none of it becomes form. There is not one number at display size on the home page, not one diagram, not one artefact of the work itself.

Two things are authored and both are mishandled: the MapleStory cursor set (desktop-only, unexplained, reads as a bug to anyone who did not play it) and the crayon Hobbies wordmark (the only non-derivative typographic idea on the site, and it is missing from the mobile menu).

**Deterministic scan.** `impeccable detect --json src` exited 2 with 4 findings across 3 rules: `bounce-easing` ×2 (`src/pages/index.astro:133`, `src/styles/base.css:111`), `gradient-text` ×1 (`src/pages/index.astro:120`), `broken-image` ×1 (`src/scripts/lightbox.ts:23`). In-page injection on 5 pages added: `undersized-ui-text` ×11 per page (9.9px `span.idx.tabular` in nav and sheet, floor is 11px), `pulsing-dot` (7×7px infinite animation — warning on `/`, error on `/work/`), `skipped-heading` on `/work/`, `kicker-above-heading` on `/work/` and `/projects/`, `line-length` ×3 on `/work/` at ~88 chars.

**Accessibility measured clean where it counts.** Zero horizontal overflow across 6 pages × 3 widths (320/390/768). Zero contrast failures — tightest is `#6e6e73` on `#f5f5f7` at 4.66:1 (needs 4.5) and the `#2997ff` gradient stop at 3.02:1 (needs 3.0). Focus ring renders everywhere: `outline: solid 2px #0071e3, offset 2px`, confirmed by screenshot not by CSS grep. Zero empty link accessible names.

## Overall Impression

The engineering under this site is better than the design on top of it. The token layer computes and documents its own contrast ratios; the scroll animations are wrapped in `@supports` so they fail safe; the header uses a CSS scroll-timeline specifically because a listener went stale across router swaps. Someone thought about failure modes.

What is missing is evidence. The premise is "Things I've built, end to end" and the site contains almost no artefacts of building anything — six work covers are placeholders (two byte-identical, one a photograph of a sleeping cat under the title "Generating 3D animation from a text prompt"), both project covers are stock, and `/skills/` is a logo wall.

The single biggest opportunity: the emotional peak of this portfolio is a bouldering essay. Real photographs, a real arc — started 2018, broke both arms, two X-rays captioned "I can sing Titanium with a straight face now", came back, Hampi. It has tension, surprise, humour and a resolution. That proves the craft exists and was not applied to the work.

## What's Working

1. **The token layer, and it shows in the pixels.** `tokens.css` computes and comments every contrast ratio, defines dark as a separately tuned ramp rather than an inversion, and refuses `#000` as canvas because "from pure black the elevation ladder collapses". Measurement confirms it: zero contrast failures across six pages.
2. **Motion built to fail safe.** Scroll reveals sit inside `@supports (animation-timeline: view())`, so an unsupported browser renders content rather than getting stuck at opacity 0 — the classic IntersectionObserver failure. Reveal range is a fixed length, not a percentage, so a tall work row and a 60px tile behave identically.
3. **The climbing essay is proof of authorial voice.** Non-substitutable material with a shape: setup, injury, return, transfer back to the professional claim. It is the template every work article should follow.

## Priority Issues

**[P0] Work rows collapsed into a 190px ribbon above 800px — FIXED THIS SESSION (c0663c6).** The chevron added for click affordance sat before `.body` in the DOM with only `grid-column: 3`; auto-placement pushed `.body` to row 2 column 1 at 190px while the 670px middle column stayed empty. Invisible below 801px. All three children now placed explicitly, with a test that fails on the broken version.

**[P1] Every work cover is a placeholder and both project covers are stock.** All six `src/content/work/*/cover.jpg` carry `coverAlt: Placeholder image`; `dos` and `shakeshack` are byte-identical; `ai-singapore` is a sleeping cat under "Generating 3D animation from a text prompt". `ScreenshotFrame` with `chrome: true` wraps the stock project covers in macOS traffic lights and a title bar reading the product name, which converts a taste problem into a factual claim. Meanwhile `echo/chat.jpg` — the fine-tuned model replying in Singlish about Kovan food — already exists and sits third on the page. Fix: promote `chat.jpg` to Echo's cover; drop `cover:` from the six work entries (`work/[slug].astro` already guards with `{d.cover && …}`); add a content test failing any `coverAlt` matching `/placeholder/i`. Suggested command: `/impeccable polish`

**[P1] `/cv/` has no heading at all and is a black rectangle on mobile.** Confirmed: zero `<h1>`–`<h6>` in the built page, the only page in the set with no outline. `pages.cv = { eyebrow: 'CV', title: 'One page.', lede: 'Read it here, or take a copy.' }` is defined in `src/copy/pages.ts:55` and never imported. The `<object>` fallback never fires because Chrome reports it can handle `application/pdf`, so mobile gets a ~70vh black slab. This is the highest-intent page for a recruiter. Fix: render the intro block like every other index page; hide the embed under 734px and show a download card instead; give `.pdf` a `background: var(--surface)` placeholder. Suggested command: `/impeccable clarify`

**[P1] Tap targets fail on every page, all on height.** Eight footer links measure 20–22.9px tall on all six pages; `a.brand` is 26px; `a.link-arrow` 25px; `/projects/` filter pills 36px; `/contact/` rows 19.1–23.3px. None fail on width. Counts: `/` 15, `/projects/` 18, `/contact/` 13, `/work/` `/about/` `/cv/` 10 each. Fix: `min-height: 44px` with `display: inline-flex; align-items: center` on footer links, `.link-arrow`, `.act` and the contact rows; pills to 44px. Suggested command: `/impeccable adapt`

**[P2] `/work/` skips h1 → h3 six times, and nav index numbers are 9.9px.** Six consecutive `<h3>` role headings under the `<h1>` with no `<h2>` — flagged independently by the detector and by a DOM walk. Separately, `span.idx.tabular` ("01"–"05") renders at 9.9px in both the desktop nav and the mobile sheet, below the 11px functional-text floor, 10 instances per page. Fix: promote role headings to `<h2>`; raise the index spans to 11px or drop them on mobile. Suggested command: `/impeccable audit`

**[P2] The wordmark is 46px out of alignment with every content edge.** `Header.astro` `.bar` is `min(1152px, 100%)`; `.wrap` is `min(980px, …)`. On a site whose only structural gesture is a strong left edge, the name hangs outside it on every viewport ≥1232px. Fix: `.bar { width: min(var(--content), 100%) }`. Suggested command: `/impeccable layout`

## Persona Red Flags

**Recruiter, 40-second skim.** `/cv/` has no heading and, on mobile, is a black rectangle with no indication the black area is the CV. Cmd-K search returns two rows both titled "AI Engineer", separated only by a 14px grey subtitle. The home Work section runs in `compact` mode, which drops the bullets — so the 40-second skim shows three job titles and three one-line summaries, with none of the numbers (60,000 tickets/month, 80% cost reduction, 30% revenue growth). Less signal than a LinkedIn headline. Shake Shack is `writeup: false`, so its row has a blank chevron column and no destination while five others are clickable.

**First-time visitor from a link, landing on `/projects/echo/`.** The hero is a stock render inside a macOS window frame, so the first inference is "this is a screenshot of the app" and it is false. No author line, no one-line "who is Zack", no link to `/about/` — the only identification is a 15px wordmark. Below 880px the entire information architecture is one unlabelled 44px hamburger alone in an empty bar, because `Search`, `CV` and `Contact` are all `display: none`. `/projects/` shows 5 filter pills over 2 projects. The MapleStory cursor changes under them with no explanation and becomes a spinning coin during navigation.

**Hiring engineer evaluating depth.** Not one code sample, architecture diagram, trace screenshot or dashboard anywhere in `/work/` — six roles, six placeholder covers — while `echo/architecture.jpg` and `kanta/storage.svg` prove these can be made. `work/ai-singapore/index.mdx` cites "as recorded in my résumé" as the source for its metrics, which reads as unverified. On `/skills/`, LangGraph and Bash carry identical visual weight.

## Minor Observations

- `ArticleLayout` `.eyebrow` is `inline-flex` with a 28px `::before` rule; long work eyebrows wrap and orphan the rule beside the first line.
- `SectionHead` `padding-bottom: var(--s-9)` plus section padding produces 150px+ between a heading and its first card on mobile — reads as "did it fail to load".
- Mobile sheet renders all seven items at `--ink-2` 14px mono; nothing reads as primary, not even Contact.
- `site.features.hero3d` and `bulb` have no consumer anywhere in `src/`; `ThemeToggle.astro` comments refer to a "hero bulb" that does not exist. `commandPalette: false` is set with a comment saying the palette is deferred, while a Cmd-K palette ships.
- `formatDuration` renders "1 YR 2 MOS" at 11px uppercase with 0.15em tracking — reads as a part number.
- One bare-URL link name: `github.com/sunraymoonbeam` on `/contact/`. The LinkedIn sibling reads correctly.
- The theme toggle lives only in the footer, so most visitors will never find a dark mode that is better balanced than the light one.
- Detector false positives confirmed and discarded: `broken-image` in `lightbox.ts` (attributes assigned at runtime), `dark-glow` on `body` (matching the detector's own injected stylesheet — `#ffba00` appears nowhere in the project), `gradient-text` double-counted, empty `alt` on work logos (correct decorative treatment; the company name is in the adjacent `<h3>`), `input.trap` tap target (honeypot, `aria-hidden`, off-screen).

## Questions to Consider

1. The climbing essay has a broken arm, two X-rays and a joke. `/work/carro/` has 12 agentic workflows, 60,000 tickets a month and an 80% cost reduction — and a placeholder image. What is the broken arm of the Carro story?
2. What happens if a number is the largest thing in the first viewport instead of the name? "60,000 tickets a month" at `t-80` is the one composition move no other portfolio could borrow.
3. Is the MapleStory cursor a signature or a private joke? If it is a signature it needs one line somewhere letting the visitor in on it.
4. If you could only keep three destinations, which three? That answer is the information architecture.
5. `ScreenshotFrame` puts macOS chrome around everything, including things that never ran in a window. What would a frame built for a Langfuse trace, a terminal, or a training curve look like?
6. What is the smallest thing on this site a visitor could actually operate? On an Experience surface one operable element outweighs six well-written paragraphs.
