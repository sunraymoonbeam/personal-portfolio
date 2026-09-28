# renhwa.com

My portfolio. A static [Astro](https://astro.build) site: MDX content, strict
TypeScript, plain CSS. No UI framework, no CSS framework, no CMS. One JavaScript
bundle, which is Astro's client router.

```sh
npm ci
npm run dev        # http://localhost:4321
npm run verify     # everything the deploy will run
```

Node 22.12 or newer. Use the committed lockfile.

## Where things live

Only `src/pages/` is reserved by Astro. Everything else is a convention, and
this is the one used here.

```
src/
  pages/         one file per URL. Owns route generation and page composition.
  layouts/       the document shell and the article shell.
  components/    presentation. Never reads content directly.
  content/       the content collections, and nothing else.
  copy/          page headings and prose that are not a collection entry.
  config/        identity, navigation, feature switches.
  data/          lookup tables. Technology names and icons.
  lib/           pure functions. Publication policy, dates, text.
  scripts/       browser behaviour. Theme, menu, search, filters, cursor.
  styles/        tokens, global primitives, article prose.
  assets/        images used by components rather than by a content entry.
```

Imports use the `~/` alias for anything under `src`.

The rule that keeps this honest: **pages read content, components receive it.**
A component never calls `getCollection`, and exactly one file decides what is
published.

**[`docs/astro-conventions.md`](docs/astro-conventions.md)** has the reasoning:
what Astro actually requires, what this repo chose, how it compares to the
sites the Astro team ships, and the one known gap.

## Adding something

Copy a template. The folder name becomes the URL.

```sh
cp -r src/content/_template/project src/content/projects/my-thing
# edit src/content/projects/my-thing/index.mdx, drop images beside it
npm run verify
```

| Type | Template | Goes in | URL |
| --- | --- | --- | --- |
| Project | `_template/project` | `src/content/projects/<slug>/` | `/projects/<slug>` |
| Role | `_template/work` | `src/content/work/<company>/` | `/work/<company>` |
| Hobby | `_template/hobby` | `src/content/hobbies/<slug>/` | `/hobbies/<slug>` |

A collection is named after the URL it serves, so there is no mapping to keep
in step. The folder name is the slug.

**The template is the documentation.** Every field, every flag and every
default is commented in the frontmatter you are already editing, so it cannot
drift from the code the way a table in a file like this one can.

### Pictures

Put image files in the entry's own folder. Two ways to use them:

- **In the body**, as a `Figure`, next to the paragraph it illustrates. This is
  for a picture that carries the narrative. A set that belongs together goes in
  a `Photos` row of `Shot` elements. The crop shape belongs to the row, not to
  each picture, so a row never comes out ragged.
- **In the `gallery` list** in the frontmatter, for pictures that belong to the
  entry rather than to a sentence. The order in the file is the order on the
  page, so re-arranging means moving a block. Alt text is required.

There is no carousel. Every picture is visible, and the gallery needs no
JavaScript.

## Why there are schemas

`src/content.config.ts` validates every entry, and every nested object is
`.strict()` because an outer `.strict()` does not propagate. A typo in a field
you touch once a year fails the build instead of silently disappearing.

This is also the on-ramp to a CMS rather than a detour from one. Keystatic
builds its editor from a schema, so the model here translates rather than
needing a re-think.

Add a field only when a second surface needs the value. A one-off body layout
is an MDX component, not a schema field.

## TypeScript

`tsconfig.json` extends `astro/tsconfigs/strictest` and adds a path alias.
Nothing else needs setting; Astro's presets cover the rest. The site checks
with zero errors, warnings and hints, and the check runs in the deploy gate.

Optional props are written `prop?: T | undefined`, because `strictest` treats
`prop?: T` as "absent" rather than "present and undefined". The reasoning is in
[`docs/astro-conventions.md`](docs/astro-conventions.md).

## Verify

`npm run verify` is the deploy gate. It runs inside the Docker image, so a
failure cannot ship.

| Step | What it proves |
| --- | --- |
| `astro check` | Types and templates across the whole site. |
| `node --test` | Publication policy, date handling, text emphasis. |
| `check-routes.mjs` | A real build of a throwaway site: drafts and listing-only entries get no route, unlisted roles still get an article, ids can collide across collections, gallery order survives, the sitemap excludes what it should. |
| `generate-cursors.mjs --check` | The committed cursor CSS still matches its PNG sources. |
| `astro build` | The real site compiles. |

A green gate is not a visual check. After a layout change, look at every route
at phone and desktop width, in both themes, and check keyboard focus and
horizontal overflow.

## Conventions worth keeping

- `.wrap` owns the centred outer width. Do not also narrow that element with
  `max-width`; use `.wrap.measure-start` to constrain its children.
- A component's `<script>` runs **once per document**. With the client router
  the DOM is swapped on every navigation, so anything binding to elements
  belongs in `src/scripts/` and is re-bound on `astro:page-load`. Search, the
  project filters and the mobile menu have each died this way.
- Class names in an Astro component are scoped, but a class defined in a global
  stylesheet is not. `prose` belongs to `src/styles/article.css`; reusing that
  name on a page pulls those rules in.
- Scroll animations use a length range, not a percentage. A percentage of
  `entry` scales with element height and leaves tall blocks invisible after
  they are on screen.
- Dates are `YYYY-MM` strings and are never parsed into a `Date`, which would
  invent a day and shift the timezone.

## Performance notes

Measured, gzipped, on the built output.

| | |
| --- | --- |
| JavaScript, whole site | 7.3 KB |
| Home page HTML | 20.7 KB |
| Shared stylesheet, cached after first page | 9.5 KB |

The stylesheet is one shared file rather than inlined per page. Inlining made
a cold first paint about 400 bytes cheaper and every page after it 9 to 13 KB
more expensive, which is the wrong trade for a site whose router swaps
documents on every navigation.

The font packages emit subsets for Cyrillic and Vietnamese that this site will
never use. They are never downloaded, because each `@font-face` carries a
`unicode-range`, so this costs build output rather than bandwidth.

## Deploy

Push `main`. Dokploy builds the Dockerfile and nginx serves `dist/` behind
Traefik. The image runs `npm run verify`, so a failing gate stops the deploy.
A deploy is triggered from Dokploy; pushing alone does not release.

Keep `absolute_redirect off` in the nginx config, or redirects downgrade HTTPS
behind the proxy. Keep `try_files … =404` so a missing page returns a real 404
instead of the homepage. A changed slug needs a redirect in `astro.config.mjs`
and in `nginx.conf`.

## Provenance

Work bullets on the site are verbatim from the CV, with `**…**` marking
emphasis and adding no words, so the two cannot disagree. The CV itself is
`public/cv.pdf`, which is both the downloadable file and the source of record.

`docs/design/apple.md` records the design rules the site follows, what is
Apple's and what is a judgement made here.

The MapleStory cursors are Nexon artwork from an unlicensed source, kept at my
request. `npm run cursors` regenerates `src/styles/cursors.css` from the PNGs.
