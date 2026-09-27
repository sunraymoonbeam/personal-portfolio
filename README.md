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

The rule that keeps this honest: **pages read content, components receive it.**
A component never calls `getCollection`. Publication policy never leaks into a
card. If you want to know whether something is published, there is exactly one
place that decides, and it is `src/lib/select.ts`.

`src/content/` holds only collection entries, so that everything Astro loads as
content is content. Page copy is not content in that sense, so it lives in
`src/copy/`.

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
| Hobby | `_template/play` | `src/content/play/<slug>/` | `/hobbies/<slug>` |

The hobby collection is called `play` and is served at `/hobbies`. The map
between the two lives in `src/lib/select.ts`; change it in one place.

**The template is the documentation.** Every field, every flag and every
default is commented in the frontmatter you are already editing, so it cannot
drift from the code the way a table in a file like this one can.

### Pictures

Put image files in the entry's own folder. Two ways to use them:

- **In the body**, as a `Figure`, next to the paragraph it illustrates. This is
  for a picture that carries the narrative.
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
  belongs in `src/scripts/` and is re-bound on `astro:page-load`. Two features
  have already died this way.
- Class names in an Astro component are scoped, but a class defined in a global
  stylesheet is not. `prose` belongs to `src/styles/article.css`; reusing that
  name on a page pulls those rules in.
- Scroll animations use a length range, not a percentage. A percentage of
  `entry` scales with element height and leaves tall blocks invisible after
  they are on screen.
- Dates are `YYYY-MM` strings and are never parsed into a `Date`, which would
  invent a day and shift the timezone.

## Deploy

Push `main`. Dokploy builds the Dockerfile and nginx serves `dist/` behind
Traefik. The image runs `npm run verify`, so a failing gate stops the deploy.
A deploy is triggered from Dokploy; pushing alone does not release.

Keep `absolute_redirect off` in the nginx config, or redirects downgrade HTTPS
behind the proxy. Keep `try_files … =404` so a missing page returns a real 404
instead of the homepage. A changed slug needs a redirect in `astro.config.mjs`
and in `nginx.conf`.

## Provenance

`docs/source/notes.md` outranks the résumé for narrative; `docs/source/resume.pdf`
supplies titles and dates. Work bullets on the site are verbatim from the CV,
with `**…**` marking emphasis and adding no words, so the two cannot disagree.

The MapleStory cursors are Nexon artwork from an unlicensed source, kept at my
request. `npm run cursors` regenerates `src/styles/cursors.css` from the PNGs.
