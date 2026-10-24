# renhwa.com

The personal site of Ren Hwa (Zack) Low: work case studies, projects, hobbies
and a CV. Live at [renhwa.com](https://renhwa.com).

A static [Astro](https://astro.build) site. MDX content, strict TypeScript and
plain CSS. There is no UI framework, no CSS framework and no CMS. The only
JavaScript is Astro's client router and a few small behaviour scripts.

## Quick start

Node 22.12 or newer. Use the committed lockfile.

```sh
npm ci
npm run dev        # http://localhost:4321
npm run verify     # everything the deploy runs
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload. |
| `npm run build` | Builds the site into `dist/`. |
| `npm run preview` | Serves `dist/` locally. |
| `npm run verify` | The deploy gate. See [Verify](#verify). |
| `npm run check` | `astro check`: types and templates. |
| `npm test` | Unit tests in `tests/`. |
| `npm run test:routes` | Builds a throwaway fixture site and checks the routing rules. |
| `npm run resume:preview` | Renders `public/resume.pdf` to the picture phones see on `/cv`. Run it after every CV change. |
| `npm run cursors` | Regenerates `src/styles/cursors.css` from the cursor PNGs. |
| `npm run font:crayon` | Rebuilds the crayon-font subset. Needs `fonttools`. |

## Project structure

Only `src/pages/` is reserved by Astro. Everything else is a convention.

```
src/
  pages/         one file per URL. Owns route generation and page composition.
  layouts/       the document shell (SiteLayout) and the article shell.
  components/    presentation, grouped by area. Never reads content directly.
  content/       the content collections, one folder per entry.
  copy/          page headings and prose that are not a collection entry.
  config/        identity, navigation, feature switches.
  data/          lookup tables: technologies and icons.
  lib/           pure functions: publication policy, dates, text.
  scripts/       browser behaviour: theme, menu, search, filters, cursor.
  styles/        tokens, global primitives, article prose.
  assets/        images and fonts used by components, not by one entry.
public/          files served as they are: CV, icons, share image, robots.txt.
scripts/         build-time tools, run by npm scripts.
tests/           unit tests, run by node --test.
docs/            how the site is written and designed. See below.
```

Imports use the `~/` alias for anything under `src`.

The rule that keeps this honest: **pages read content, components receive it.**
A component never calls `getCollection`, and exactly one file
(`src/lib/content.ts`) decides what is published.

## Adding content

Copy a template. The folder name becomes the URL.

```sh
cp -r src/content/_template/project src/content/projects/my-thing
# edit src/content/projects/my-thing/index.mdx, put images beside it
npm run verify
```

| Type | Template | Goes in | URL |
| --- | --- | --- | --- |
| Project | `_template/project` | `src/content/projects/<slug>/` | `/projects/<slug>` |
| Role | `_template/work` | `src/content/work/<company>/` | `/work/<company>` |
| Hobby | `_template/hobby` | `src/content/hobbies/<slug>/` | `/hobbies/<slug>` |

**The template is the documentation.** Every field, flag and default is
commented in the frontmatter you are editing, so it cannot drift from the code.

- **Technologies.** A `stack:` id must exist in `src/data/technologies.ts`, or
  the build fails. Add the technology there first.
- **Pictures in the body.** Use a `Photos` block of `Shot` elements under the
  paragraph it belongs to. Use `Figure` for diagrams and screenshots that must
  not be cropped, and `Clips` for short looping videos. The rules are in
  [`docs/design.md`](docs/design.md#articles-and-photos).
- **Pictures for the entry.** Use the `gallery` list in the frontmatter. The
  order in the file is the order on the page. Alt text is required.
- **Charts.** `StackBars` and `PairBars` draw simple bar charts from numbers in
  the MDX, so a chart cannot disagree with the text.

### Why there are schemas

`src/content.config.ts` validates every entry. Every nested object is
`.strict()`, because an outer `.strict()` does not propagate. A typo in a
field you touch once a year fails the build instead of silently disappearing.

Add a field only when a second surface needs the value. A one-off body layout
is an MDX component, not a schema field.

## Writing

Every sentence on the site follows [`docs/writing.md`](docs/writing.md): what
is verbatim from the CV, the patterns that make copy read as AI-written, and
the voice. Read it before you change any copy.

Work bullets are verbatim from the CV, with `**…**` marking emphasis and adding
no words, so the two cannot disagree. The CV is `public/resume.pdf`, which is
both the download and the source of record.

## SEO

- Every page has a unique title, a meta description and a canonical link.
- Every page shares `public/og.jpg` (1200 × 630) as its link preview, unless a
  page passes its own `image`. Case studies and essays are `og:type article`.
- The home page carries `Person` and `WebSite` JSON-LD, built from
  `src/config/site.ts`.
- `@astrojs/sitemap` writes the sitemap, and `public/robots.txt` points to it.
- Icons: `favicon.svg`, `favicon.ico` (32 px) and `apple-touch-icon.png`.

To change the share image, edit and re-export `public/og.jpg` at 1200 × 630,
under 300 KB. LinkedIn caches previews; use its Post Inspector to refresh them.

## Verify

`npm run verify` is the deploy gate. It runs inside the Docker image, so a
failure cannot ship. Check the exit code, not only the test summary.

| Step | What it proves |
| --- | --- |
| `astro check` | Types and templates across the whole site, with zero errors, warnings and hints. |
| `node --test` | Publication policy, date handling, text emphasis, the CV preview. |
| `check-routes.mjs` | A real build of a throwaway site: drafts and listing-only entries get no route, unlisted roles still get an article, ids can collide across collections, gallery order survives, the sitemap excludes what it should. |
| `generate-cursors.mjs --check` | The committed cursor CSS still matches its PNG sources. |
| `astro build` | The real site compiles. |

A green gate is not a visual check. After a layout change, look at every
affected route at phone and desktop width, in both themes, and check keyboard
focus and horizontal overflow.

## Conventions worth keeping

- `.wrap` owns the centred outer width. Do not also narrow that element with
  `max-width`; use `.wrap.measure-start` to constrain its children.
- A component's `<script>` runs **once per document**. The client router swaps
  the DOM on every navigation, so anything that binds to elements belongs in
  `src/scripts/` and is re-bound on `astro:page-load`. Search, the project
  filters and the mobile menu have each broken this way.
- Class names in an Astro component are scoped, but a class in a global
  stylesheet is not. `prose` belongs to `src/styles/article.css`; reusing that
  name on a page pulls those rules in.
- Scroll animations use a length range, not a percentage. A percentage of
  `entry` scales with element height and leaves tall blocks invisible after
  they are on screen.
- Dates are `YYYY-MM` strings and are never parsed into a `Date`, which would
  invent a day and shift the timezone.
- Optional props are written `prop?: T | undefined`, because the `strictest`
  TypeScript preset treats `prop?: T` as "absent" rather than "present and
  undefined".

The reasoning behind the structure, checked against Astro's own sites, is in
[`docs/astro-conventions.md`](docs/astro-conventions.md).

## Performance

Measured on the built output, gzipped.

| | |
| --- | --- |
| JavaScript, whole site | 7.7 KB |
| Home page HTML | 15.0 KB |
| Shared stylesheet, cached after the first page | 13.6 KB |
| Crayon font (the "Hobbies" wordmark) | 3.3 KB |

- The stylesheet is one shared file rather than inlined per page. Inlining
  saves about 400 bytes on a cold first paint and costs 9 to 13 KB on every
  page after it, which is the wrong trade when the router swaps documents.
- The crayon face is cut down to the letters it draws. A new crayon word needs
  its letters added in `scripts/subset-crayon-font.sh`.
- The font packages emit Cyrillic and Vietnamese subsets that are never
  downloaded, because each `@font-face` has a `unicode-range`.

## Deploy

Push `main`. Dokploy builds the Dockerfile, and nginx serves `dist/` behind
Traefik. The image runs `npm run verify`, so a failing gate stops the deploy.

- Keep `absolute_redirect off` in `nginx.conf`, or redirects downgrade HTTPS
  behind the proxy.
- Keep `try_files … =404`, so a missing page returns a real 404 instead of the
  home page.
- A changed slug needs a redirect in `astro.config.mjs` and in `nginx.conf`.

## Docs

| File | What it is for |
| --- | --- |
| [`docs/writing.md`](docs/writing.md) | How the copy is written. Read before changing any sentence. |
| [`docs/design.md`](docs/design.md) | The design rules the site follows, and which are Apple's. |
| [`docs/astro-conventions.md`](docs/astro-conventions.md) | Why the code is arranged this way. |
| [`docs/interview.md`](docs/interview.md) | Questions for Zack, page by page, and his answers so far. |
| [`docs/archive/`](docs/archive/) | Past reviews, kept for their history. Do not edit copy from them. |
| [`TODO.md`](TODO.md) | What is still open. |
| [`AGENTS.md`](AGENTS.md) | Instructions for coding agents. `CLAUDE.md` links to it. |

## Credits

The MapleStory cursors are Nexon artwork from an unlicensed source, kept at
Zack's request. Fonts are Geist, Geist Mono and Shantell Sans, under the SIL
Open Font License.
