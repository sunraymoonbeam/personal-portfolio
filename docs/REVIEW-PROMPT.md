# Review prompt

Paste this to the reviewing agent, in the repo root.

---

You are reviewing the design and build plan for a personal portfolio website
before any implementation code is written. Nothing has been built yet — this is
a plan review, and it is much cheaper to change now than in a month.

**Read first:** `DESIGN.md` (the full plan) and `docs/STRUCTURE.md` (the code
map). The interactive mockup of every page is at
https://claude.ai/artifact/9Ye1seZLWo2ED4fmThk71r

**Context.** The owner is a software engineer specialising in AI, based in
Singapore, currently at Carro. The site's one job is to convince a hiring
engineer or manager — usually on a phone, usually in under a minute — that he
finds real problems and ships working systems. It is a static Astro site with
long-form write-ups per role, per project, and per hobby. He writes Python daily
and is deliberately using this project to learn TypeScript and front-end
craft, so the code has to be something he can still read and extend in six
months, alone, after not touching it for a while.

Work through the two priorities **in this order**. Spend roughly 60% of your
effort on the first.

## Priority 1 — Code structure: clean, readable, maintainable

This matters more than the design, because he has to live in it.

1. **Is the four-layer rule (`pages → blocks → ui → tokens`, dependencies
   downward only) the right cut for a site this size?** Is it over-engineered
   for ~10 pages, or about right? Where will it leak first?
2. **Is the frontmatter-vs-body split correct?** Frontmatter drives cards,
   filters, sidebars and SEO; the MDX body is free-form. Name the specific
   field that will end up in the wrong place, and what happens when a project
   needs something the schema doesn't have.
3. **Six MDX components (`Figure`, `Gallery`, `Quote`, `Sidenote`, `Stat`,
   `Window`).** Too few — will he end up writing raw HTML in MDX within a
   month? Too many? Which is missing?
4. **Content as folder-per-item with images beside the post.** Compare against
   a flat `content/projects/*.mdx` + `public/images/`. Which survives 30 items
   better?
5. **Config split**: `config/site.ts` (copy), `config/stack.ts` (tech list),
   `styles/tokens.css` (design values). Is copy-in-a-TS-file right, or should
   page copy also be MDX/JSON? Where is the boundary between "config" and
   "content" genuinely unclear?
6. **Tailwind vs ~400 lines of hand-written CSS** (see §5.1 — he plans to
   remove Tailwind). Argue the other side properly. What does he lose in
   consistency and iteration speed, and does the per-size letter-spacing
   argument actually hold up?
7. **Three hand-written TypeScript islands instead of a framework.** At what
   point does this become worse than importing something? Look specifically at
   the theme toggle syncing state between a nav button, a footer button and a
   3D object — is that where hand-rolled state falls over?
8. **Naming, discoverability, and the "no copy in components" rule.** Will a
   future reader find where anything lives? What would you rename?
9. **What is missing entirely** — testing, error handling, a 404, CI, a
   content linter, redirects, `astro check` in CI, dependency updates?

Be concrete. "Consider extracting X into Y because Z will happen when he adds
the fourth project" beats "consider better separation of concerns."

## Priority 2 — Design

10. Read §4 (philosophy) and §5 (design system). **Are the Apple-derived
    decisions applied correctly, or cargo-culted?** Particularly: the 980px
    content width, one-accent-only rule, and the claim that Geist needs its own
    letter-spacing table rather than Apple's.
11. **§11 lists seven open questions the author already has doubts about.**
    Answer them directly — especially whether the 70KB 3D hero earns its place,
    whether the pull-cord bulb in the hero is charming or clutter, and whether
    Play on the home page dilutes the hire-me read.
12. **Information architecture.** Home is: hero → 3D → projects → work → tech
    stack → play → CTA. Is that the right order for the one-minute reader? What
    would you cut?
13. **Does each page have a reason to look different from the others,** or is
    the Work page's sticky year ledger a solution in search of a problem?
14. **Accessibility and performance** (§7, §9): find the claim that will not
    survive contact with reality.

## How to respond

- Lead with the **three things you would change before a line is written**,
  ranked.
- Then work through the numbered points. Skip any where you have nothing
  useful; do not pad.
- Disagree where you disagree, and say why. A review that approves everything
  is not useful to him.
- Flag anything that is **wrong**, not just suboptimal — especially factual
  claims about Astro, CSS, WCAG contrast, or browser behaviour.

**Two things not to critique:** all copy in the mockup (metrics, anecdotes,
"1,200 rolls", the Malay-reply story, the wok attempts) is **fabricated
placeholder** so the layouts read realistically — it will be replaced with true
content, so do not review it as fact. And the personal motto is a known
placeholder, already flagged.
