# TODO

Rough order of value. Nothing here is started.

## 1. Rewrite the content

Every article is currently a sketch written from the CV and a set of notes,
and it reads like it. The voice is not yours and the detail is thin.

- 6 roles in `src/content/work/`, 3 projects, 3 hobbies.
- The frontmatter is fine. It is the **bodies** that need rewriting, plus the
  `summary` and `claim` lines that listings show.
- Work bullets stay verbatim from the CV. Everything else is fair game.
- Shake Shack has no article at all yet: it is `writeup: false` and carries
  two bullets. Give it a page or leave it deliberately short.

## 2. Real pictures

Every cover except the portrait and the three hobby photographs is a
placeholder, and some are cats.

- One `cover.jpg` per entry, in the entry's own folder.
- Gallery support is already built and tested. Four pictures give two columns
  with no extra work. See the `gallery` block in any template.
- Alt text is required by the schema, so the build fails without it. Good.

## 3. A personal log

New collection. The only item here that is real engineering rather than
writing.

- Decide first: is this a blog, a now page, or a changelog? They want
  different shapes and only one of them obliges you to keep posting.
- Needs a collection in `src/content.config.ts`, a folder, an index route and
  an article route. Roughly a copy of the hobbies pair.
- Add it to `src/config/site.ts` nav and to the search index.
- Pick the URL before writing anything. Renaming it later costs a redirect.

## 4. A skills graph

Hardest to do well, easiest to do badly.

- A chart of "proficiency" per technology invents numbers about yourself.
  Decide what it actually measures before drawing anything: years used,
  projects shipped, or where something sits in a stack.
- If it is a relationship diagram rather than a rating, it can be a static
  SVG and stay honest.
- Whatever it is, it must work without JavaScript or degrade to the current
  list.

## 5. Write-ups on skills and reflections

Related to 4 but separable, and more valuable.

- A paragraph on why you reach for a tool beats a bar chart of how well you
  know it.
- Could be a `note` field per technology in `src/data/technologies.ts`, or
  its own short article per group on `/skills`.

## 6. Seed real projects

- Only Kanta and Echo are real, and the Linux and Git exercise is thin.
- Anything added needs a cover, a claim, a summary, tags and a stack, or it
  will look unfinished next to the others.

## 7. Put the site on LinkedIn and the CV

The site is live and nothing points at it.

- LinkedIn has two places: the **Website** field in Contact info, and the
  **Featured** section, which shows a preview card. The Featured card is the
  one people actually click, and it will look bare until the SEO item below
  gives it an image.
- The CV header lists GitHub and LinkedIn but not the site. Add it beside
  them. Note the PDF at `public/cv.pdf` is the source of record and would need
  regenerating from whatever produced it.
- Anywhere else the same line appears: GitHub profile README, email signature.

## 8. SEO

Audited on the built output. Four things are already right and three are
missing.

Right: a sitemap with 19 URLs, a canonical link on every page, a unique
description per page, one `h1` per page.

Missing:

- **No `robots.txt`.** The sitemap integration does not write one. Without it
  crawlers have to guess where the sitemap is. One file in `public/`.
- **No `og:image`.** Every link to this site, on LinkedIn, in a message, in a
  Slack channel, renders as a bare text card. `SiteLayout` already accepts an
  `image` prop and nothing passes one. Needs one image made, roughly
  1200 by 630, plus a default wired into the layout.
- **No structured data.** No `Person` or `WebSite` JSON-LD, so a search engine
  has to infer who the site is about. This is what produces a rich result for
  a personal name. About twenty lines in `SiteLayout`.

Do the `og:image` before the LinkedIn item above, or the Featured card will
look unfinished.

---

## Also worth doing, not asked for

- **`reference()` for technology ids.** A typo in `stack:` currently ships a
  chip with the typo on it. See the known gap in `docs/astro-conventions.md`.
- **The NIE logo** is the full lockup, so the small type is unreadable at
  32px. A tighter crop would need the shield and the wordmark separated.
- **Cover images** are up to 256 KB. Worth a look once they are real photos
  rather than placeholders.
- **The crayon font costs 80 KB on every page.** Shantell Sans is downloaded
  for the Hobbies wordmark and nothing else. It is more than the HTML, the CSS
  and the JavaScript put together. Subsetting it to the letters actually used,
  or drawing the wordmark as an SVG, would remove it. I like the wordmark, so
  this is a trade rather than a bug.
