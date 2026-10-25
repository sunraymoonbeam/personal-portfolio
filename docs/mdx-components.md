# MDX components

Every article (work, projects, hobbies) gets these components without an
import: the routes pass `articleComponents` from
`src/components/article/mdx.ts`. Import only your own pictures.

```mdx
import diagram from './pipeline.png';

<Figure src={diagram} zoom alt="What the diagram shows." caption="What it is." />
```

## Reference

| Component | Required props | Optional props and behaviour |
| --- | --- | --- |
| `Figure` | `src` (imported image), `alt` | `caption`; `zoom` for a dense diagram (opens full size in the lightbox); `dim` to soften a bright screenshot in dark mode; `priority` for the first picture on the page. Never cropped. SVGs are served as they are. |
| `Photos` + `Shot` | `Shot`: `src`, `alt` | `Shot` `caption`, only when it says something the picture doesn't. Photos are cropped: one `Shot` is 3:2, a pair are squares. Put the block under the paragraph it belongs to. |
| `Clips` + `Clip` | `Clip`: `src`, `poster` (paths under `public/`), `alt` | `Clips` `caption`; `Clip` `label` (shown above it) and `wide` (16:9 instead of square). One wide clip or a pair. They loop silently; with reduced motion they show controls instead. |
| `StackBars` | `bands`, `rows: { label, values }[]` | `caption`. Each row is a 100% bar: one value per band, none negative, adding up to 100. The last band takes the accent. The build stops on bad numbers. |
| `PairBars` | `series: [string, string]`, `rows: { label, a, b }[]` | `caption`. Two bars per row on one true 0–100% scale. The build stops on a value outside 0–100. |
| `Timeline` | `items: { when, title, text }[]` | The last item is "now" and takes the brand mark. `text` is HTML, so it can hold links. |
| `Flow` | `steps: { title, text, hot? }[]` | `caption`. Three to five short steps: across the column on desktop, down the page on a phone. `hot` marks the step the story is about. `text` is HTML. Use it instead of a picture of boxes and arrows. |
| `table` | none | Every Markdown or HTML table goes through `Table.astro`. A table of four or more columns, or three with a sentence in a cell, becomes one card per row on a phone, so keep the first column a short title. An HTML `<table>` can hold `<ul>` bullets and `colSpan` group rows. |

A quote (`>`) that holds a list renders as a quiet card, for a recipe or a
method, instead of a centred pull quote.

## Trusted HTML

`Timeline` and `Flow` render `text` with `set:html`. That's safe because the
text is written in this repository. Never pass them text from a user or a
remote source.

## Adding a component

1. Create it in `src/components/article/`, with a typed `Props` interface and
   a comment saying what it is for and why it exists.
2. MDX props are not checked by the content schema. If a wrong value would
   draw something false (a chart), check it in the component and throw a
   clear error at build time, as `StackBars` and `PairBars` do.
3. Register it in `mdx.ts` and add a row to the table above.
4. Use it in an article, run `npm run verify`, and look at it at phone and
   desktop width in both themes.
