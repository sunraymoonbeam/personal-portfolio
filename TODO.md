# TODO

What is still open, roughly in order of value. Finished work is in the git
log, not here.

## 1. Questions for Zack

The site cannot move on these without his answer. Ask, then record the
answer in [`docs/interview.md`](docs/interview.md).

- **Kanta's origin.** Was it built for a wedding? The cover suggests so.
- **Echo's privacy line** ("Half of every chat is someone else's messages").
  Does he agree with it?
- **AI Singapore rig clip.** Third-party, source unknown. Keep it or swap it.
- **Facts to confirm:** the Batu Caves caption, his water temperature and
  brew method for the coffee table, and whether "sprint retros and spec
  reviews" (AI Singapore) is a claim he can defend.
- **CV claims with no source in the vault:** AI Singapore +20%, NIE ASR 30%,
  the Tessaract title and "10+ firms", the DOS wording.

## 2. Put the site on LinkedIn and the CV

The site is live and the share card is ready (`public/og.jpg`).

- LinkedIn: the **Website** field in Contact info, and a **Featured** link,
  which shows the share card.
- The CV header already links renhwa.com. Nothing to do there.
- GitHub profile README and email signature.

## 3. Real pictures

- Carro and AI Singapore: the team, the office, a screen that is safe to show.
- Project covers are stock. `echo/chat.jpg` is the honest one; consider it.
- Work covers are real figures from each role now, except Shake Shack's, which
  is still a placeholder cat. It only matters if a page starts showing it.

## 4. Seed real projects

- Only Kanta and Echo are real.
- Anything added needs a cover, a claim, a summary, tags and a stack, or it
  will look unfinished next to the others.

## 5. A personal log

A new collection. The only item here that is real engineering rather than
writing.

- Decide first: a blog, a now page or a changelog. They want different shapes,
  and only one of them obliges you to keep posting.
- Needs a collection in `src/content.config.ts`, a folder, an index route and
  an article route. Roughly a copy of the hobbies pair.
- Add it to the nav in `src/config/site.ts` and to the search index.
- Pick the URL before writing anything. Renaming it later costs a redirect.

## 6. Write-ups on skills

- A paragraph on why he reaches for a tool beats a bar chart of how well he
  knows it.
- Could be a `note` field per technology in `src/data/technologies.ts`, or a
  short article per group on `/skills`.

## 7. Interactive ideas (later)

His list, 2026-10-24.

- **Skills as a game-style skill tree.** Nodes per skill, edges for "built
  on", each unlocked node linking to the roles and projects that used it.
  Decide what it measures before drawing anything: a chart of "proficiency"
  invents numbers. A relationship diagram can be a static SVG and stay honest.
  It must work without JavaScript or fall back to the current list.
- **3D model of him on the home page.** Replaces the "More about me" link under
  the portrait: pops up, invites a click (to About), rotates on drag. Needs a
  scan or a modelled glTF, a lazy-loaded viewer, a still fallback and
  reduced-motion support.
- **Personal logo.** Replace the current mark with one he designs or
  commissions. The favicon, touch icon and share image would follow it.
- **Coffee animation.** For the coffee page: a pour or a bloom, CSS or Lottie,
  off under reduced motion.
- **Pokédex-style design.** A card collection: each entry with a sprite, a type
  and stats. Decide which collection it fits (hobbies? skills?) first.
- **More 3D models.** Small models for projects or hobbies, lazy-loaded, with
  still fallbacks.
