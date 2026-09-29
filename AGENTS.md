# Working in this repo

`CLAUDE.md` is a symlink to this file, so there is one set of instructions.

**Read `README.md` first.** It is the only document describing the structure,
the conventions and the verification gate, and it is kept in step with the
code.

- `docs/astro-conventions.md` — why the tree is arranged this way, checked
  against Astro's own sites and the Google TypeScript Style Guide.
- `docs/design/apple.md` — the design rules, and which are Apple's.
- `docs/design-review.md` — the 2026-09-30 design audit: what was found, what
  is already fixed and in which commit, and the gaps still open. Read this
  before starting any design work, so you do not redo a closed finding.
- `TODO.md` — what is unfinished.

## Before you claim something works

Run `npm run verify`. It is the same gate the Docker build runs, so a green
local run is the real signal and a red one cannot deploy. Check the exit code,
not just the test summary: the suite has more steps than `node --test`, and
filtering the output has hidden a failing step here before.

A green gate is not a visual check. After a layout change, look at the affected
routes at phone and desktop width, in both themes.

## Things that have broken before

- A component's `<script>` runs **once per document**. The client router swaps
  the DOM on every navigation, so anything binding to elements belongs in
  `src/scripts/` and must be re-bound on `astro:page-load`. Search, the project
  filters and the mobile menu have each died this way.
- Class names in an Astro component are scoped; a class from a global
  stylesheet is not. `prose` belongs to `src/styles/article.css`.
- A scroll animation range must be a length, not a percentage. A percentage
  scales with element height and leaves tall blocks invisible on screen.
- Work bullets are verbatim from the CV. `**…**` marks emphasis and adds no
  words. Do not paraphrase them.

## Dev server

```sh
astro dev --background         # then: astro dev status | logs | stop
```

Astro documentation: <https://docs.astro.build>. The guides worth opening are
[routing](https://docs.astro.build/en/guides/routing/),
[content collections](https://docs.astro.build/en/guides/content-collections/)
and [view transitions](https://docs.astro.build/en/guides/view-transitions/).
This site uses no UI framework and no CSS framework; do not add one.
