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

It is also why the hero has one button rather than three. The other two
repeated navigation that sat forty pixels above them.

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
