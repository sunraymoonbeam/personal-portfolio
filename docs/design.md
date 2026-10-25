# The Apple rules this site follows

Everything here is applied somewhere in the code, and the code points back at
this file when the reason is not obvious. Where a rule is Apple's, it is
Apple's. Where it is a judgement made for this site, it says so.

## The one that decides everything else

**Prioritise content over chrome.** Apple's Human Interface Guidelines put this
first, and most of the rules below are consequences of it. If an element is not
content, it has to earn its space.

This is why the site has no sidebar. The Guidelines reserve a sidebar for an
app with many peer content categories to browse, like Mail or Music. Six pages
is not that, so a sidebar would be chrome solving a problem the site does not
have. Apple's own site uses one row of links and no sidebar.

It is also why the home page opens with text and a portrait and no button row:
buttons there repeated navigation that sat forty pixels above them.

## Colour

**Contrast.** Apple asks for a minimum of 4.5:1, and says to strive for 7:1,
especially in small text. Every value in `src/styles/tokens.css` is computed
rather than eyeballed, and the ratio is written next to it.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--ink` | 16.8:1 | 16.6:1 | body text |
| `--ink-2` | 5.1:1 | 7.0:1 | secondary text |
| `--ink-3` | 7.9:1 | 7.9:1 | small text, which is where 7:1 matters |

**Dark mode is not an inversion.** Apple: these colours "aren't necessarily
inversions of their light counterparts". The dark palette here is tuned
separately, not flipped.

**Never pure black.** The dark canvas is `#161618`, not `#000`. From pure black
the elevation ladder collapses: `#000` to `#0A0A0A` is a contrast ratio of
1.06:1, so a raised surface cannot be seen. Apple's own dark base is a near
black for the same reason.

**One accent.** Blue means "this is a link" and nothing else. This is why the
primary button is ink-filled rather than blue: a blue pill made the single
accent do two jobs, and the button stopped reading as anything in particular.

The exception is deliberate and small: the Hobbies wordmark is a rainbow in a
crayon face. It is a signature, not a control, and it never appears next to
something clickable that it could be confused with.

The second exception is the brand red (`--mark`) on article section openers:
each `###` under an `##` gets a hairline, a 32px red lead and a red count.
It marks structure, never a link, so blue keeps its one job.

## Articles and photos

A judgement for this site, iterated in Oct 2026 against Linear, Stripe,
Vercel, Rauno and Paco (one column of 620 to 710px, pictures exactly as wide as
the text) and Josh Comeau (a sticky contents rail beside the column). An
earlier try put pictures wider than the text, Apple Newsroom style; it looked
off at this scale, so pictures never break out.

- **One frame, one column.** Every article (work, project, hobby) sits in the
  nav's 980px frame. The header (title, outcomes, facts, links) spans it.
  Below, text, photos, clips, figures and tables share one 700px column
  (`--measure`), so their edges always agree.
- **The rail.** Beside the column on screens over 1000px: "On this page" for
  work and projects (`Toc.astro`, the current section marked in brand red by
  `src/scripts/toc.ts`, counts matching the red rules in the text). Hobbies
  have no rail and use one centred column. Below 1001px the rail goes, and
  work and project articles get the same list folded into an "On this page"
  disclosure above the text.
- **No cover above the text.** The page opens with the title and the summary
  (or a quote, via `quoteBy`). The cover is the card image on the grids.
- **Text first, then photos.** Each photo block sits under the paragraph that
  mentions it.
- **One photo shape.** Every `Photos` block is two across, square, with an 8px
  gap. A single photo spans the column at 3:2.
- **Clips, not GIFs.** Short loops are `<Clips>`/`<Clip>`: H.264 MP4 in
  `public/`, a WebP poster beside it, one alone or two side by side. They play
  only on screen and never with reduced motion (`src/scripts/clips.ts`).
- **Dense diagrams zoom.** `<Figure zoom>` opens a full-size copy in the lightbox.
- **Few captions.** Only a joke, a place, or the prompt behind a clip.
- **Colour comes from the photos.** The page around them stays neutral.

## Type

**Apple's tracking table is for Apple's typeface.** The values in the HIG are
tuned to SF Pro's optical size curve and are wrong on anything else. This site
sets Geist, so it uses Geist's own tracking. At 80px the difference is large:
Geist wants about `-0.047em` where SF Pro wants about `-0.015em`.

The type scale lives in `src/styles/base.css` as `t-80` down to `t-12`, each
with its own size, line height and tracking, because those three are one
decision and not three.

## Motion

**Motion should explain, not decorate.** A project screenshot morphs into the
article it opens, which says the two are the same thing. A scroll reveal says
an element has arrived. Nothing moves that is not telling you something.

Everything respects `prefers-reduced-motion`. Astro's client router disables
its own transitions automatically; the scroll animations are wrapped in a
`no-preference` query.

## Controls

**44px minimum target.** Apple's number for a comfortable tap. Buttons here
have `min-height: 44px`.

**`color-scheme` advertises, it does not force.** Setting `color-scheme: light
dark` tells the browser the page supports both, so form controls and scrollbars
follow the *system*. It does not make them follow a manual theme toggle. Both
values are set explicitly per theme for that reason.

## Sources

- [Human Interface Guidelines: Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Human Interface Guidelines: Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Human Interface Guidelines: Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
