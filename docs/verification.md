# Verification

`npm run verify` is the deploy gate. GitHub Actions runs it on every push and
pull request, and the Docker build runs it again inside the image, so a
failure cannot ship. Check the exit code, not only the test summary: the gate
has more steps than `node --test`, and filtering the output has hidden a
failing step before.

## What the gate runs

| Step | What it proves |
| --- | --- |
| `eslint` | No lint errors or warnings in `.ts`, `.mjs` and `.astro`, and no component calls `getCollection` (only `src/lib/content.ts` may). |
| `prettier --check` | Config files (package.json, tsconfig, ESLint, Prettier, GitHub YAML) are formatted. Source formatting is not gated yet; `npm run format:source:check` reports it. |
| `astro check` | Types and templates across the site, failing on any error, warning or hint. |
| `node --test` | Publication policy (featured order, neighbours), dates, text emphasis, table labels, the search index, the CV preview. |
| `check-routes.mjs` | A real build of a throwaway site: drafts and listing-only entries get no route, unlisted roles still get an article, ids can collide across collections, gallery order survives, the sitemap leaves out what it should. |
| `generate-cursors.mjs --check` | The committed cursor CSS still matches its PNG sources. |
| `astro build` | The real site compiles. Bad chart numbers in MDX stop it here. |
| `check-budgets.mjs` | Gzipped transfer size stays under budget (below). |

## Size budget

Measured on 26 October 2026, gzip level 9, counting every `.js` file plus each
distinct inline script:

| Measure | Now | Budget |
| --- | --- | --- |
| JavaScript, whole site | 9.1 KiB | 16 KiB |
| CSS, whole site | 18.4 KiB | 24 KiB |
| Home page HTML | 14.7 KiB | 24 KiB |

These are this site's own headroom, not industry numbers. If honest growth
crosses one, raise it in a commit that says why. Reproduce with
`npm run build && npm run check:budgets`.

## What the gate does not prove

A green gate is not a visual check. After a layout or behaviour change, look
at every affected route:

- at phone (390 px) and desktop (1280 px) width, in light and dark;
- with the keyboard: focus visible, nothing trapped;
- for horizontal overflow on a phone;
- after a client-side navigation as well as a direct visit, for anything with
  a script (menu, search, contact, filters, lightbox, clips). A script that
  binds only the first page is the bug this site has had most often.

Run `npm audit` after a dependency change. Dependabot opens weekly update
pull requests for npm and Docker and monthly ones for GitHub Actions.
