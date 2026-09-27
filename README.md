# Zack Low's portfolio

[renhwa.com](https://renhwa.com) is a static Astro site: MDX articles, strict TypeScript, plain CSS, and small browser scripts. No React runtime, CMS or Tailwind. The current implementation has no 3D hero; the older design documents describe proposals, not shipped features.

## Develop and verify

Use Node 22.12+ and the committed npm lockfile.

```sh
npm ci
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run verify
npm run astro -- dev stop
```

Use the local URL printed by Astro (it selects another port if 4321 is occupied). `npm run preview` serves the production output after a build.

`verify` runs the Astro/TypeScript checker, policy unit tests, actual route-generation tests in a disposable checkout, cursor-source consistency, and the production build. The route tests cover drafts, listing-only entries, unlisted work articles, colliding IDs across collections, cross-listing, and sitemap exclusions. They never add test stories to the production checkout.

Build checks are not visual checks. After layout changes, inspect every route at phone and desktop widths in light and dark themes. Check keyboard focus, filtering, theme switching, text enlargement and horizontal overflow. Test nginx responses separately; Astro preview is not nginx.

## Find the right file

| Change | Location |
| --- | --- |
| Identity, motto, contact and navigation | `src/config/site.ts` |
| Home headings and introduction | `src/content/home.ts` |
| Index-page headings and introductions | `src/content/pages.ts` |
| Stories, dates, card summaries and metrics | `src/content/{work,projects,play}/<slug>/index.mdx` |
| Shared employer identity and logos | `src/content/employers/` |
| Technology labels/icons and About grouping | `src/data/technologies.ts` |
| Strict frontmatter schemas | `src/content.config.ts` |
| Content loading and publication policy | `src/lib/content.ts`, `src/lib/select.ts` |
| Page composition and route generation | `src/pages/` |
| Document shell / article shell | `src/layouts/` |
| Reusable presentation | `src/components/` |
| Design values / global primitives / prose | `src/styles/{tokens,base,article}.css` |
| Theme and cursor behaviour | `src/scripts/` |
| Downloadable résumé | `public/resume.pdf` |

Pages load content and pass it to components. Components do not call the content store. Keep publication policy out of card components. The article shell owns the header, reading column, aside and adjacent links; routes own the meaning of those slots. Do not introduce a universal component with flags for every page variation.

## Add a story

Copy the appropriate folder from `src/content/_template/` into the collection, rename it to the URL slug, then replace all sample text. Keep local images beside the MDX and use the Astro image pipeline. Set descriptive alt text. `Figure` is available in MDX through `components/article/mdx.ts`.

Frontmatter is for values reused outside the story: listing summaries, dates, tags, stack IDs, metrics and links. The body is for the narrative. Add a schema field only when a real second surface needs it; use an MDX component for a one-off body layout.

- `draft: true`: absent from listings and routes.
- `writeup: false`: can appear in listings, but has no article link or route.
- `showInWork: false`: hides a work entry from the ledger, not from the public web. Use `draft` for unpublished material.
- `showInPlay: true`: cross-lists a project using its original project URL.
- `featuredOrder`: home selection order; omitted means not featured. Keep ranks distinct within a collection.
- Dates are `YYYY-MM` strings. Work uses `start`/`end`; omit `end` for a current role. Projects and Play use `published` for ordering.

Unknown fields, including nested metric/link typos, fail validation. Technology IDs should come from `src/data/technologies.ts`; unknown IDs render as text rather than breaking the page. A changed slug needs a redirect in `nginx.conf`.

## Layout rules that prevent the old bugs

- `.wrap` owns the centered outer width. Never also narrow that same element with `max-width`. Use `.wrap.measure-start` to constrain its children while preserving the left alignment.
- Cards stay inside their grid cells. Hover changes colour, not padding or negative margins. There is no global `.hoverable` or `.row` shortcut.
- Article `Figure` stays inside the reading column, preserves the image's ratio, and has no `wide`/`full` escape hatch. A full-width image belongs in the article's `hero` slot.
- `ScreenshotFrame` window chrome is opt-in (`chrome={true}`), not a default decoration for diagrams or photos. Missing project covers use `ProjectVisual`, which is explicitly typography, not a pretend screenshot.
- `[hidden]` must override component display rules so project filters actually hide rows and stay absent without JavaScript.

## Content provenance

`REQUEST.md` governs the rewrite. `docs/source/notes.md` outranks the résumé for narrative facts; `docs/source/resume.pdf` supplies titles and dates. The owner's explicit hobbies are climbing, coffee and cooking. Those entries are deliberately short because no detailed first-person hobby stories were supplied.

Work dates were corrected against the résumé: Carro Aug 2025, NIE Oct 2023–Mar 2024, DOS May–Aug 2023. Kanta and Echo use the last month of their Apr–May 2025 project period. Onboarding uses Apr 2025 for ordering, the end of its AISG period; this is not a claim about an exact release date. Play uses the website rewrite month. Confirm publication dates if actual release chronology matters.

The unsupported homelab story was replaced with the Linux/Git onboarding exercise described in the notes. Invented project metrics, hobby stories, stock covers and the cat labelled as a portrait were removed. Git history preserves them. The downloadable PDF remains the supplied source, unchanged; its hobby line predates the owner's corrected website interests.

## Generated MapleStory cursors

`src/assets/cursors/` contains eight native 32×32 PNG frames and a CSS template with selectors, hotspots and fallbacks. The sprites were recovered losslessly from the previously approved inlined stylesheet; this does not resolve their licensing. They are Nexon artwork from an unlicensed source, retained at the owner's explicit request.

```sh
npm run cursors
node scripts/generate-cursors.mjs --check
```

Edit the PNGs/template, regenerate `src/styles/cursors.css`, and commit both. Frame order is default, pointer ×2, busy ×4, grab. Animation timing is in `src/scripts/cursor.ts`. No external asset request is made for a cursor. `--extract-legacy` is a one-time recovery mode and refuses to overwrite existing source.

## Deploy

Commit and push `main` to `origin`; Dokploy builds the Dockerfile and serves `dist/` through nginx behind Traefik. The image build runs `npm run verify`, so a failed gate stops deployment. No Sites/Cloudflare deployment is involved.

Keep `absolute_redirect off` to avoid HTTP downgrades behind the TLS proxy. Keep `try_files … =404` and `error_page 404 /404.html` so missing pages return a real 404. Retired placeholder slugs have relative redirects. Verify the live homepage, a changed article, an old URL and a deliberately missing path after deployment. To roll back, revert the relevant commit and push a new commit; do not force-push shared history.
