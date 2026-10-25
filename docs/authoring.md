# Adding content

How to add a role, a project or a hobby, from an empty folder to a checked
page. The schema in `src/content.config.ts` is the contract; the templates in
`src/content/_template/` are worked examples with every field commented.

## Before you write

Read [Writing](writing.md), including
[how he likes an article to read](writing.md#how-he-likes-an-article-to-read).
Work bullets are copied word for word from the CV. Reflections come from his
own answers ([interview notes](interview.md)) and are never invented. If a
fact is missing, ask him.

## Steps

1. **Choose the slug.** It is the folder name and the URL, and it should not
   change later. Roles use the company name (`/work/carro`). A second tenure
   at the same company needs its own folder, such as `carro-2028`.
2. **Copy the template.**

   ```sh
   cp -r src/content/_template/work src/content/work/<slug>
   ```

3. **Add the employer** (roles only) if it is new: a
   `src/content/employers/<id>.json` with its logo beside it.

   ```json
   { "name": "Carro", "url": "https://www.carro.co", "logo": "./carro.png" }
   ```

   The role's `employer:` must match the file name. A second tenure reuses the
   same employer.
4. **Fill in the frontmatter.** The required fields are:

   | Type | Required |
   | --- | --- |
   | Role | `title`, `summary`, `employer`, `role`, `kind`, `location`, `start` |
   | Project | `title`, `claim`, `summary`, `published`, `tags` (one or more) |
   | Hobby | `title`, `summary`, `published`, `caption` |

   Months are `YYYY-MM`, and a role's `end` can't be before its `start`.
   Every id in `stack:` must exist in `src/data/technologies.ts`; add the
   technology there first. A role shows at most three `metrics`.
5. **Write the body in MDX.** Keep pictures in the entry's folder and import
   them. Short videos and their posters go in `public/work/<slug>/`. The
   components are in [MDX components](mdx-components.md); where photos go is
   in [Design](design.md#articles-and-photos).
6. **Check it.** Run `npm run verify`, then look at the page at phone and
   desktop width, in both themes. Also check the listing, the home page if it
   is featured, search, the previous and next links, and the keyboard.
7. **If a slug ever changes,** add a redirect in `astro.config.mjs` (dev and
   static preview) and a 301 in `nginx.conf` (production). See
   [Deployment](deployment.md#redirects).

## Publication flags

| Flag | Default | Effect |
| --- | --- | --- |
| `draft` | `false` | `true` removes the entry from every listing and gives it no page. |
| `writeup` | `true` | `false` keeps the listing but makes no article page. |
| `featuredOrder` | none | A positive number puts it on the home page, in that order. Two entries in one collection with the same number stop the build. Hobbies also use it on About. |
| `showInWork` | `true` | Roles only. `false` hides the row on /work and the home page, but the article can still be public. |
| `showInHobbies` | `false` | Projects only. Also lists the project under Hobbies, linking to its project URL. |

`showInWork: false` is not privacy: the article keeps its URL and stays in
the sitemap. To hide something, use `draft: true`.

## Why the schemas are strict

Every object in `src/content.config.ts` is `.strict()`, nested ones included,
because an outer `.strict()` does not reach inside. A typo in a field you
touch once a year then fails the build instead of quietly disappearing.

Add a schema field only when a second surface needs the value. A one-off
layout inside an article is an MDX component, not a field.
