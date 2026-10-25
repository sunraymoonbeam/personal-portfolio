# Deployment

## How a change reaches renhwa.com

1. Push `main`. GitHub Actions runs `npm run verify` (`.github/workflows/verify.yml`).
2. Dokploy builds the `Dockerfile`. The build stage runs `npm ci --include=dev`
   and `npm run verify` inside the image, so a failing gate produces no image,
   then gzips the HTML, CSS, JS, SVG and XML ahead of time.
3. The serve stage is nginx (`nginx.conf`) behind Traefik, serving `dist/`.

`--include=dev` is on purpose. If the platform sets `NODE_ENV=production`,
`npm ci` drops dev dependencies, `astro check` goes missing, and the type
check silently does nothing.

## nginx

- Keep `absolute_redirect off`, or redirects downgrade HTTPS behind the proxy.
- Keep `try_files … =404`, so a missing page returns a real 404 instead of the
  home page.
- `gzip_static on` serves the precompressed files.
- Hashed assets under `/_astro/` are cached for a year as immutable; pictures
  and fonts for 30 days; HTML is `no-cache`, so a deploy shows at once.

## Redirects

A changed slug needs a redirect in two places:

- `astro.config.mjs` `redirects`, for `astro dev` and `astro preview`;
- `nginx.conf`, as a `return 301`, for production.

Old year-suffixed work slugs (`/work/carro-2025`), `/resume` and the old
`/play/…` hobby URLs are already redirected.

## SEO

- Every indexable page has a unique title, a meta description and a canonical
  link. The 404 page has no canonical, on purpose.
- Pages share `public/og.jpg` (1200 × 630) as the link preview unless a page
  passes its own `image`. Articles are `og:type article`.
- The home page carries `Person` and `WebSite` JSON-LD, built from
  `src/config/site.ts`.
- `@astrojs/sitemap` writes the sitemap; `public/robots.txt` points to it.
- To change the share image, re-export `public/og.jpg` at 1200 × 630, under
  300 KB. LinkedIn caches previews; refresh them with its Post Inspector.

## Generated assets

| Asset | Regenerate with | Needs |
| --- | --- | --- |
| CV preview for phones (`public/resume.webp`) | `npm run resume:preview` after every change to `public/resume.pdf` | `pdftoppm` (poppler), `cwebp`, `shasum`. A test fails until you run it. |
| Cursor CSS (`src/styles/cursors.css`) | `npm run cursors` | Node only. The gate checks it matches the PNGs. |
| Crayon font subset (the "Hobbies" wordmark) | `npm run font:crayon`, after adding letters to `scripts/subset-crayon-font.sh` | `pip install fonttools brotli` |

The CV source of record is `~/Documents/documents/portfolio/resume/resume.pdf`,
copied to `public/resume.pdf`.

## Performance notes

Sizes and their budget are in [Verification](verification.md#size-budget).

- The stylesheet is shared and cached rather than inlined per page. Inlining
  saves a little on the first paint and costs the whole stylesheet again on
  every page after it, which is the wrong trade when the router swaps pages.
- The crayon face is cut down to the letters it draws.
- The font packages ship Cyrillic and Vietnamese subsets that are never
  downloaded, because each `@font-face` has a `unicode-range`.
