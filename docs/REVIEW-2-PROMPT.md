# Review round 2 — prompt and response to round 1

Paste everything below to the reviewing agent.

---

Thank you — that review was genuinely useful and most of it has been adopted.
`DESIGN.md` has been substantially rewritten. Below is what changed, what was
verified, and what was rejected. Then a shorter second-round brief.

## Factual corrections — all verified before accepting

Each was checked against the installed packages or recomputed, not taken on
trust. **You were right on all five:**

| Your correction | Verification |
|---|---|
| Simple Icons is **CC0**, not SIL OFL | `simple-icons@16.32.0` reports `"license": "CC0-1.0"`. Doc corrected. |
| Current location is **`src/content.config.ts`** | Confirmed; the repo already used the correct path — the *document* was wrong. Corrected. |
| **Zod strips unknown keys silently** | Ran it: `{title, sumary: 'typo'}` parsed as **success** with the key dropped. `.strict()` rejects it. The doc's claim that "a typo fails the build" was false; schemas are now `.strict()` and the claim is scoped. |
| **The JS arithmetic fails** | `STRUCTURE.md`'s own table sums to **85 KB**, not "~75 KB total". Replaced with three tiered budgets (initial paint / after scrolling to the 3D / all features), each marked *to be measured*. |
| **`#0066CC` on `#F5F5F7` is 5.11, not 5.6** | Recomputed: 5.567 on white, 5.112 on the grey band. The doc conflated the two. Corrected. |

Also accepted without dispute: `color-scheme: light dark` does not force native
controls to follow a manual `data-theme` (each explicit selector now sets its
own `color-scheme`); "0 KB on a text page" was false while a global theme script
exists; rebuilding a three.js scene is not *inherently* a leak — failing to
dispose is, and swapping leaks too if the old resources are dropped;
`hardwareConcurrency` is not a low-power detector; AVIF/WebP is configured, not
automatic; the OLED-halation claim was removed and the soft-black canvas is now
justified by elevation alone.

## Structural changes adopted

1. **The four-layer rule is gone.** Replaced with five boundaries plus one real
   invariant: *no component fetches its own content — pages query, helpers
   decide, components render.* Layouts are now in the diagram.
2. **A content-to-route contract exists** (§3.1.1), settled before components:
   slug rules, duplicate detection, `draft`, explicit `writeup: false` for a
   listed role with no article, one `featuredOrder` mechanism with no competing
   list, `YYYY-MM` dates formatted by parts with `end >= start` validation, and
   required alt text unless explicitly decorative.
3. **`lib/content.ts` owns published/featured/adjacent** so home, `/projects`
   and prev/next cannot drift.
4. **Frontmatter constrained** (§3.1.2): `highlights` → `cardHighlights`, max 3,
   ~60 chars; `metrics` gains optional `context` and is not required;
   `shortTitle` only when needed; one-off needs get an article component, never
   `customFields` or a `layoutVariant` enum.
5. **"Six MDX components and no more" is gone.** `Quote` dropped (a styled
   blockquote does it), **`Video` added**, `Sidenote` specified as an inline
   aside rather than a real footnote. A sample article will be written.
6. **"No copy in components" is gone.** Editorial content stays out of reusable
   presentation; stable UI labels live with their behavior.
7. **Renames applied**: `SiteLayout`, `ArticleLayout`, `ScreenshotFrame`,
   `ProjectFilters`, `ProjectFacts`, `hero-scene.ts`, `command-palette.ts`.
   `components/islands/` → `scripts/`. `Chip`/`Tag` merged.
8. **One theme controller** (§8.2) with a head bootstrap, subscribers that
   receive current state on subscribe (so the late-loading 3D is correct),
   `storage` sync, and a CSS-only fallback.
9. **Command palette deferred** entirely, per your reasoning.
10. **Home reordered** to positioning → projects → work → 3D → Play preview →
    CTA. The home tech-stack section was **deleted**. Articles keep a contact
    link so no one must return home.
11. **Résumé is real HTML text** plus a PDF download; images only supplement.
12. **Quality gates specified** as one `npm run verify`, with `www` 301ing to
    the apex while keeping DNS and certificate.

## Rejected, with reasons

- **"Drop the 3D and the cursors."** Correct on the merits; overruled by the
  owner. This is a personal site, not a product, and enjoying it is a valid
  goal. Both are now documented as *stated costs* rather than defended as free.
  The 3D moved below the professional evidence, which addresses your real
  objection — that it was a toll before the first project.
- **The Work-page sticky ledger.** You're right that a flat list can also show
  two 2023 roles and omit links. The justification is now stated honestly as
  *visual differentiation between three pages that would otherwise share
  furniture*, not as a unique capability. Your grouping ambiguity was real and
  is fixed: the full range is shown prominently on every row, and the page now
  leads with a featured latest role.
- **One correction to your review:** it states the plan has "footer + bulb, with
  no nav toggle". That was one revision's state; the toggle placement has since
  changed at the owner's request. A doc-sync failure on our side, not your
  error.

---

# Round 2 brief

`DESIGN.md` is rewritten; `docs/STRUCTURE.md` still needs updating to match and
is **not** authoritative. Mockups: https://claude.ai/artifact/9Ye1seZLWo2ED4fmThk71r

Round 1 was broad. Round 2 should be narrow and adversarial, because
implementation starts after it. **Priority is code structure; design only where
it constrains structure.**

1. **Attack the content contract (§3.1.1) specifically.** It is the thing you
   said would rot. Walk it through four concrete scenarios and name where it
   breaks: (a) a project that is also a hobby; (b) a role at a company he
   returns to later, so two entries share one employer; (c) a write-up that
   should be published but whose role should not appear in the ledger; (d) a
   project whose cover image is a video.
2. **Is `lib/content.ts` the right seam,** or does "pages query, helpers decide,
   components render" just relocate coupling? What is the first thing that will
   want to live there and shouldn't?
3. **Three schemas sharing a `common` base** — is that right, or is one schema
   with a discriminated union better? Consider prev/next across collections.
4. **The theme controller (§8.2).** Find the race. A late-loading 3D scene, a
   `storage` event from another tab, and a click all arriving close together —
   does the described design hold, and what is the minimum test that proves it?
5. **Verify the corrections landed properly,** rather than trusting this summary.
   In particular check whether removing the `⌘K` palette and the home
   tech-stack section left any dangling references.
6. **What is still missing that you did not flag in round 1?** You called the
   content contract the real gap. Assuming it is now fixed, what is the next one?
7. **The first milestone** is proposed as: one complete project article + its
   card, one listed role without an article, both themes, a narrow viewport, and
   the real deploy path. Is that the right slice? What would you cut or add to
   make it expose more seams earlier?

Respond as before: three ranked changes first, then the numbered points, skipping
anything without substance. Disagree freely — including with the rejections
above, if you think the reasoning is weak. Placeholder copy and the motto remain
out of scope.
