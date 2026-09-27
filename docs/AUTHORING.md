# Adding and editing content

Everything below is a folder and a file. No registration list, no CMS, no build
step to remember.

## Add a project, role, or play item

```bash
cp -r src/content/_template/project src/content/projects/my-thing
# edit src/content/projects/my-thing/index.mdx
# drop images in that same folder
npm run verify
```

The folder name becomes the URL: `projects/my-thing` → `/projects/my-thing`.
Renaming the folder changes the URL, so pick it deliberately.

| Type | Copy from | Into |
|---|---|---|
| Project | `_template/project` | `src/content/projects/<slug>/` |
| Role | `_template/work` | `src/content/work/<company>-<year>/` |
| Play | `_template/play` | `src/content/play/<slug>/` |

A role folder is one **tenure**, not one company — rejoining an employer later
is a new folder (`carro-2025`, `carro-2029`) pointing at the same
`src/content/employers/carro.json`.

## Visibility: three flags, not one

One flag cannot express every case, so there are three.

| You want | Set |
|---|---|
| Not ready — hide it completely | `draft: true` |
| Listed, but no article to link to | `writeup: false` |
| Article exists, but keep it off the work page | `showInWork: false` |
| Show it on the home page | `featuredOrder: 1` (or 2, 3…) |

`featuredOrder` is the **only** way something reaches the home page. There is no
second list anywhere.

⚠️ `showInWork: false` means **unlisted, not private**. The page is still public
and indexed. Do not use it for anything confidential.

## Where to change other things

| Change | File |
|---|---|
| Home page sentences | `src/content/home.ts` |
| Name, motto, nav, socials | `src/config/site.ts` |
| Add a tool / tech chip | `src/data/technologies.ts` |
| Colours, type sizes, spacing | `src/styles/tokens.css` |
| A company's name or logo | `src/content/employers/<id>.json` |
| Résumé | `src/pages/resume.astro` **and** `public/resume.pdf` — both, by hand |

## Inside an article

Plain Markdown: `##` headings, `**bold**`, lists, links, `` `code` ``, fenced
blocks, tables, `>` quotes. Plus:

```mdx
import shot from './architecture.png'

<Figure src={shot} caption="The platform in one picture." size="wide" />
```

Sizes are `normal` (the 660px reading column), `wide`, and `full`. Text never
leaves the reading column; images may.

## Before you push

```bash
npm run verify   # types, tests, production build
```

This is the same command the Docker build runs, so if it passes locally it will
not fail the deploy. Push to `main` and Dokploy rebuilds.

## What will fail the build, on purpose

- A misspelled frontmatter key, including inside a nested `metrics` entry.
- A date that is not `YYYY-MM`, or an `end` before its `start`.
- Two entries resolving to the same URL.
- `writeup: true` with an empty body.
