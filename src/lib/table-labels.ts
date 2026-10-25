/**
 * Label every body cell of a rendered table with its column header, so a phone
 * can show a wide table as one stacked card per row (see `.prose table.stack`
 * in src/styles/article.css). Used by components/article/Table.astro, which MDX
 * renders for every Markdown table.
 *
 * Works on the table's inner HTML, as MDX renders it: one <thead> row of <th>,
 * then <tbody> rows of <td>. A row with a single cell (a group heading spanning
 * the table) is left alone. Tables narrower than STACK_FROM columns are
 * returned unchanged: two or three columns still read fine side by side.
 */

/** The fewest columns at which a table stacks on a phone. */
export const STACK_FROM = 4;

const stripTags = (html: string): string =>
  html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const escapeAttr = (text: string): string =>
  text.replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/"/g, '&quot;');

export function labelTableHtml(inner: string): { html: string; stack: boolean } {
  const head = /<thead[^>]*>([\s\S]*?)<\/thead>/i.exec(inner);
  if (!head) return { html: inner, stack: false };
  const labels = [...head[1]!.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => stripTags(m[1]!));
  if (labels.length < STACK_FROM) return { html: inner, stack: false };

  const html = inner.replace(/<tbody\b[^>]*>[\s\S]*?<\/tbody>/gi, (body) =>
    body.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi, (row) => {
      const cells = row.match(/<t[dh]\b/gi) ?? [];
      if (cells.length <= 1) return row; // a group heading row spans the table
      let i = 0;
      return row.replace(/<td\b([^>]*)>/gi, (_tag, attrs: string) => {
        const label = labels[i++];
        return label && !/data-label=/.test(attrs)
          ? `<td${attrs} data-label="${escapeAttr(label)}">`
          : `<td${attrs}>`;
      });
    }),
  );
  return { html, stack: true };
}
