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
| `public/resume.pdf` | Copied from `~/Documents/documents/portfolio/resume/resume.pdf`. |

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

## What he wants instead

- **His voice:** first person, direct, a bit dry, sometimes funny. Singaporean
  details are welcome (kopi, hawker food, Singlish).
- **Jokes about himself stay.** "I can sing Titanium with a straight face
  now." "I stand by the clams." Shake Shack's mock-résumé bullets ("optimal
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

## Page shapes

- **Index pages:** h1 is the plain page name. One short lede, or none. No
  eyebrow repeating the h1.
- **Work rows on /work:** role, then the `tagline` (one line on what he did,
  in his words), then the bullets. Home rows show the longer `summary`.
- **Work articles:** "The role" (or "The project"), "What I built" with one
  `###` per project, "Looking back". The Outcomes band holds at most three
  numbers.
- **Hobby articles:** text first, each photo block under the paragraph it
  belongs to. See [`design/apple.md`](design/apple.md#articles-and-photos).

## How to change copy with him

Present the before and after, page by page, and wait for a yes before
changing wording he cares about. He answers in quick fragments; turn them into
clean sentences, and show the result before you ship it.
