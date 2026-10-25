# Working in this repo

`CLAUDE.md` is a symlink to this file, so there is one set of instructions.

**Read `README.md` first**, then [`docs/README.md`](docs/README.md), which
maps every doc by task: adding content, MDX components, verification,
deployment, writing and design.

- `docs/authoring.md`: adding a role, project or hobby, step by step.
- `docs/mdx-components.md`: the article components and their props.
- `docs/verification.md` and `docs/deployment.md`: the gate, and how a change
  ships.
- `docs/astro-conventions.md`: why the tree is arranged this way, checked
  against Astro's own sites and the Google TypeScript Style Guide.
- `docs/writing.md`: how the copy is written and why. Read it before you
  change any sentence: what is verbatim from the résumé, the AI-writing
  patterns to avoid, and his voice.
- `docs/interview.md`: questions to ask him, page by page, and the answers
  so far. Interview before writing any reflection; never invent one.
- `docs/design.md`: the design rules, and which are Apple's.
- `docs/archive/`: past reviews (copy, 2026-09; design audit, 2026-09-30).
  Read the design audit before design work, so you do not redo a closed
  finding. Never edit copy from the copy review; it is out of date.
- `TODO.md`: what is unfinished.

## Before you claim something works

Run `npm run verify`. It is the same gate GitHub Actions and the Docker build
run, so a green local run is the real signal and a red one cannot deploy. Check the exit code,
not just the test summary: the suite has more steps than `node --test`, and
filtering the output has hidden a failing step here before.

A green gate is not a visual check. After a layout change, look at the affected
routes at phone and desktop width, in both themes.

## Things that have broken before

- A component's `<script>` runs **once per document**. The client router swaps
  the DOM on every navigation, so anything binding to elements belongs in
  `src/scripts/` and must be re-bound on `astro:page-load`. Search, the project
  filters, the mobile menu and the contact page have each died this way.
- A form whose handler never bound submits by GET and puts its fields in the
  URL. The contact form starts `hidden` and `src/scripts/contact.ts` shows it
  only after binding.
- Class names in an Astro component are scoped; a class from a global
  stylesheet is not. `prose` belongs to `src/styles/article.css`.
- A scroll animation range must be a length, not a percentage. A percentage
  scales with element height and leaves tall blocks invisible on screen.
- Work bullets are verbatim from the CV. `**…**` marks emphasis and adds no
  words. Do not paraphrase them.
- After a schema or frontmatter change, a build can fail with
  `UnknownContentCollectionError` on an entry that is fine. That is Astro's
  stale content cache: `rm -rf .astro` and build again.

## Dev server

```sh
astro dev --background         # then: astro dev status | logs | stop
```

Astro documentation: <https://docs.astro.build>. The guides worth opening are
[routing](https://docs.astro.build/en/guides/routing/),
[content collections](https://docs.astro.build/en/guides/content-collections/)
and [view transitions](https://docs.astro.build/en/guides/view-transitions/).
This site uses no UI framework and no CSS framework; do not add one.
