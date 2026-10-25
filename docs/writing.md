# Writing for this site

How the copy is written, and why. Learned the hard way in the October 2026
rewrite (commits `cc764b6` to `bedeb3a`): the first drafts read as AI-written,
and these rules are what fixed it. Read this before you touch any sentence.

## Where each piece of copy comes from

| Copy | Source of truth |
| --- | --- |
| Work bullets (`bullets:`) | The résumé PDF, word for word. `**…**` marks emphasis and adds no words. The site and the PDF must never disagree. |
| Home lede | The résumé summary, plus "Solving problems is what I do. Writing code is only one of the ways I do it." on its own line. Change one, change the other. |
| Metrics | Résumé numbers only. `context` says how or where (e.g. "across Singapore, Malaysia and Hong Kong"), never "reported in my résumé". |
| Reflections ("Looking back") | His own words: interview answers, or the behavioural notes in the Google Drive `portfolio/behavioural` folder. Never invented. |
| `public/resume.pdf` | Copied from `~/Documents/documents/portfolio/resume/resume.pdf`, then run `npm run resume:preview` (the picture phones see on /cv; a test fails until you do). |

If you need a fact you do not have, ask him. Do not guess and do not pad.
The questions, and his answers so far, are in [`interview.md`](interview.md).

## The patterns that made it read as AI

From Wikipedia's "Signs of AI writing" and the humanizer skills built on it.
One of these alone is fine; several together are what a reader notices.

1. **A moral at the end of every section.** "Progress is not always about
   trying harder." End on a concrete fact instead. A reflection is fine when it
   is his and it is earned by the paragraph before it; it is slop when every
   page has one in the same place.
2. **"Not X, it's Y"** and "X is not enough". State Y.
3. **Stacks of fragments.** "Same beans. Slightly different numbers. Hopefully
   better coffee." Write a sentence.
4. **A witty subtitle under every heading.** Keep the ones he likes (projects:
   "when I should probably be sleeping", hobbies: "more to life than
   `git push`"). Do not add more.
5. **Forced threes.** "making something, learning something, or obsessing…"
6. **No contractions.** The early site said "I have" and "does not"
   everywhere and sounded stiff. Use contractions in prose.
7. **Writing about the document.** "as recorded in my résumé", "described in
   my notes". Say the fact.
8. **The same opening, sentence after sentence.** "At AISG I… At NIE I… At
   DOS I…"
9. **Inflated words.** delve, crucial, robust, showcase, seamless, journey,
   passionate. Use the plain word.
10. **Clever headings and captions.** "Teaching it to dance", "Label a little
    before tuning a lot", "The fine-tuned model would rather dance". He calls
    these slop. Name the thing: "Fine-tuning", "Evaluation pipeline",
    "Ground truth first". A caption says what the picture shows.
11. **"Put together, that's an agent fleet."** A sentence that sums up the
    one before it. Cut it.

## What he wants instead

- **His voice:** first person, direct, a bit dry, sometimes funny. Singaporean
  details are welcome (kopi, hawker food, Singlish).
- **Jokes about himself stay.** "I can sing Titanium with a straight face
  now." Shake Shack's mock-résumé bullets ("optimal
  flip timing and acceptable levels of char") are a joke he chose to keep, with
  no bold.
- **Reflections keep their spirit.** When a reflective ending was cut, he asked
  for it back, rewritten. Keep the idea and the warmth; remove the formula.
- **Not a code monkey.** He enjoys talking to people, finding the real problem
  and translating pain points into requirements as much as writing code. The
  AI is one part of a carefully designed system. Interests: automation, and
  computer vision (segmentation, object detection).
- **Quotes from other people** are allowed when he asks for one (the Chris
  Sharma quote on climbing). Check the wording is real before using it.
- **British spelling** (specialise, organise, behaviour). One exception:
  "diarization", the standard technical spelling. Work bullets keep the
  résumé's American spelling because they are verbatim.

## How he likes an article to read

Learned over many rounds of edits in October 2026. Before writing a paragraph,
ask: does it tell the story, explain something so it clicks, or give context
the reader needs? If none, cut it.

- **A story and a reference at once.** Tell what happened: the problem, what
  was tried, what he decided ("I asked why…"), what he built, and the result
  with a real number. Then explain enough that he can come back and learn from
  his own page: "when I read my stuff I also want to understand wtf is SMPL".
  An analogy is welcome when it truly clarifies (the phone call for NeMo's
  window scales, the drinks in one glass for diarization).
- **Context he gives goes in.** What the company is, its markets and services,
  with a link. Link every company, tool, dataset and paper the first time.
- **Depth follows recency.** Carro gets the most, AI Singapore is deep, NIE,
  DOS and Tessaract are tighter. Hobbies stay short and personal.
- **Visual breaks.** An image, clip, chart or `<Flow>` between sections so a
  reader can picture the work, and a table for anything comparable
  (components, stages, datasets, settings, factors). Tables can hold bullets.
- **Lessons sit by their story.** A reflection can close the story it came
  from; the Reflections section is for qualities, each earned by an event.
- **Cut unneeded context:**
  - meta and disclaimer lines ("the recordings are of children, so this page
    shows none of them", "I ran this again in 2026");
  - defensive lines ("I didn't…", "where my job ends");
  - sections that don't serve the story ("Sharing it with the department");
  - long justifications. "MDM gave the best results for its training time"
    beats a paragraph.
- **Precise, not cute.** "The pelvis position (x, y, z) in world
  coordinates", not "where the pelvis is in the room".
- **Layout.** Bullets only for three or more short, parallel items.
  Paragraphs of two to four sentences, one idea each. Not cluttered, not a
  string of one-liners.

## Page shapes

- **Index pages:** h1 is the plain page name. One short lede, or none. No
  eyebrow repeating the h1.
- **Work rows on /work:** role, then the `tagline` (one line on what he did,
  in his words), then the bullets. Home rows show the longer `summary`.
- **Work articles:** "The role" (or "The project"), then "Noteworthy
  projects" when the role had separate projects (Carro, DOS) or "Highlights"
  when it was one project (AISG, NIE, Tessaract), with one plain-named `###`
  each. Technical roles follow the data's path: data format, data processing,
  pipeline or training, evaluation, fine-tuning or tuning, CI/CD, "Reflections" with one `###` per quality, named
  as the quality itself ("Attention to detail", not "Every word has weight").
  Each `###` opens with a numbered red rule that restarts per section (see
  `src/styles/article.css`). The Outcomes band holds at most three numbers.
  Carro and AI Singapore are the reference pages; NIE, DOS and Tessaract follow
  the same shape since the October 2026 rewrite. A table of four or more
  columns, or three with a sentence in any cell, turns into one card per row
  on a phone (`components/article/Table.astro`), so keep its first column a
  short title. Draw a process of three to five steps with `<Flow>`, not a
  picture of boxes and arrows: it follows the theme and turns vertical on a
  phone.
- **Sources for article facts:** nothing that only appears in the DOS deck
  marked RESTRICTED (internal FAQ tests, survey category counts, colleagues'
  workload). Reflections state what he did and learnt, not habits inferred
  from his files afterwards.
- **Numbers on work pages:** the bullets follow the résumé, even where the
  number is his call (Carro: 80% cost, 30% SOP deviations, 30% revenue). He
  also chose, on 24 Oct 2026, to show "30% fewer bot incidents and
  hallucinations" in Carro's Outcomes band and "grew 30%" for workshop revenue.
  Neither has a source doc; they are his call, like the résumé. Other prose
  numbers trace to a source doc (see each vault's `numbers.md`).
- **Hobby articles:** text first, each photo block under the paragraph it
  belongs to. See [`design.md`](design.md#articles-and-photos).

## How to change copy with him

Present the before and after, page by page, and wait for a yes before
changing wording he cares about. He answers in quick fragments; turn them into
clean sentences, and show the result before you ship it.
