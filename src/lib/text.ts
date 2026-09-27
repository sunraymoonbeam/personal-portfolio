/**
 * Splits `**bold**` runs out of a string.
 *
 * Résumé bullets are stored verbatim; the only thing the markers add is where
 * the emphasis falls, so the words on the site and the words in the PDF stay
 * identical. Nothing else in the string is interpreted.
 */
export type TextRun = { text: string; em?: true };

export function splitEmphasis(input: string): TextRun[] {
  const runs: TextRun[] = [];
  let rest = input;

  while (rest.length > 0) {
    const open = rest.indexOf('**');
    if (open === -1) break;
    const close = rest.indexOf('**', open + 2);
    if (close === -1) break;               // unclosed marker: leave it as text

    if (open > 0) runs.push({ text: rest.slice(0, open) });
    runs.push({ text: rest.slice(open + 2, close), em: true });
    rest = rest.slice(close + 2);
  }

  if (rest.length > 0) runs.push({ text: rest });
  return runs;
}

/** The plain string, as it appears in the résumé. */
export const stripEmphasis = (input: string): string => input.replaceAll('**', '');
