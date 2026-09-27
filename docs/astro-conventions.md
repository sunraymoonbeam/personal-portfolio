# Conventions

Why the code is arranged the way it is, and what was checked rather than
assumed. The README has the short version; this is the reasoning.

Checked against [Astro's project structure
guide](https://docs.astro.build/en/basics/project-structure/), the [content
collections guide](https://docs.astro.build/en/guides/content-collections/),
the [Google TypeScript Style
Guide](https://google.github.io/styleguide/tsguide.html), and the source of
two sites the Astro team ships, `withastro/astro.build` and `withastro/docs`.

## What Astro actually requires

**One directory.** `src/pages/` is the only reserved name. Astro's words: "the
only directory reserved by Astro is `src/pages/`. You are free to rename and
reorganize any other directories in a way that works best for you."

Everything below is therefore a choice, not a rule. It is written down so it
stays a choice that was made once rather than drifting.

**`src/content/` is no longer special.** That changed in Astro 5. Collections
must be declared in `src/content.config.ts`, and a loader's `base` decides
where the files live. Scanning the directory is deprecated. Anything claiming
that Astro picks up folders in `src/content/` automatically is describing
Astro 4.

## The tree

```
src/
  pages/       one file per URL. Route generation and page composition.
  layouts/     the document shell and the article shell.
  components/  presentation. Never reads content directly.
  content/     collection entries.
  copy/        page headings and prose that are not a collection entry.
  config/      identity, navigation, feature switches.
  data/        lookup tables.
  lib/         pure functions. Publication policy, dates, text.
  scripts/     browser behaviour. Theme, menu, search, filters, cursor.
  styles/      tokens, global primitives, article prose.
  assets/      images a component uses directly.
```

For comparison, what the Astro team ships:

```
astro.build/src/   assets components content.config.ts content data
                   env.d.ts fetch.ts helpers icons layouts pages styles types
docs/src/          assets components content.config.ts content.ts content
                   data languages.ts pages routeData.ts util
```

The names that matter all match: config at the source root, `assets`,
`content`, `data`, `components`, `layouts`, `pages`, `styles`. They use
`helpers` and `util` where this uses `lib`, which is naming, not structure.

## The four directories people confuse

- **`content/`** — an entry that has its own URL, or that a schema validates.
  Its pictures live in its own folder, beside its MDX file.
- **`assets/`** — an image a component reaches for directly, with no entry
  behind it. The portrait, the cursor frames. Astro processes these, which is
  why they are not in `public/`.
- **`data/`** — a lookup table. One shape, repeated. Currently the technology
  list and nothing else.
- **`public/`** — bytes served exactly as they are. The CV, the favicon.

## Choices that differ from Astro's own sites

**Page copy is in `src/copy/`, not a collection.** `astro.build` models its
page copy as collections called `pages` and `partials`. Both work. Copy here
is TypeScript, so the compiler already catches a typo in a heading key and
gives autocomplete on the way in. A collection would trade that for runtime
validation, which is the weaker deal for a file a human edits directly.

**One folder per entry, not flat files.** `astro.build` keeps blog posts as
flat `.mdx` files with one shared `_images/` directory. This repo gives each
entry a folder with its own pictures. For a blog where most posts have no
images, flat is simpler. For entries with a gallery, a folder means deleting
an entry deletes its pictures and moving one never breaks a path.

**The underscore prefix is shared practice.** `_template/` here, `_images/`
and `_resolveImage.ts` in Astro's blog. A leading underscore marks a file
inside a content directory that is not an entry.

## The rule that holds it together

**Pages read content, components receive it.** No component calls
`getCollection`. Publication policy lives in exactly one file,
`src/lib/select.ts`, which has no Astro imports so it can be unit-tested.

If you want to know whether something is published, there is one place to
look. That is the whole point of the arrangement.

## TypeScript

`tsconfig.json` extends `astro/tsconfigs/strictest` and adds only a path
alias. Nothing else needs setting: Astro's base preset already turns on
`verbatimModuleSyntax`, `isolatedModules`, `skipLibCheck`, `esModuleInterop`
and `resolveJsonModule`, and `strictest` adds `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noUnusedLocals` and the rest.

`strictest` is worth the friction. It found a real defect: an array index used
without a guard in the search script.

`exactOptionalPropertyTypes` means `prop?: T` is "absent", not "present and
undefined". Component props here are genuinely both, because a page passes a
value that may be undefined, so they are written `prop?: T | undefined`.

**Imports use `~/` for anything under `src`.** This is not decoration. The
Google guide prefers relative imports but warns to "limit the number of parent
steps, as those can make module and path structures hard to understand". There
were eighty-six imports going up two or more levels.

**No default exports** in any TypeScript file, which is the Google guide's
firmest rule. Astro components are exempt: the framework defines their export.

**Export only what is used outside the module.** `noUnusedLocals` cannot catch
a violation here, because an export always counts as used. It needs a manual
pass, and one found an entire theme subscriber API left behind by a feature
that had been deleted.

One Google rule is deliberately ignored: it asks for `snake_case` filenames.
That is a Google-internal convention the JavaScript ecosystem never adopted,
and Astro's own projects use PascalCase for components.

## Known gap

Nothing checks that a technology id in `stack:` exists in the lookup table. A
typo passes the schema, because the schema only requires a non-empty string,
and the icon lookup falls back to rendering the raw text. You would ship a
chip labelled `fastpi` with a green build.

The fix is Astro's `reference()`, which fails the build when the target is
missing. The cost is moving the technology list out of TypeScript and into
data files. Not done, because it is a trade rather than a strict improvement.
