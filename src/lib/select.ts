/**
 * Pure publication/selection policy. No Astro imports, so it is unit-testable
 * and has no way to reach the content store on its own.
 *
 * lib/content.ts loads entries and delegates every decision here.
 */

export type EntryKey = `${'projects' | 'work' | 'hobbies'}:${string}`;
export const keyOf = (collection: 'projects' | 'work' | 'hobbies', id: string): EntryKey =>
  `${collection}:${id}`;


/**
 * A neighbouring article. `title` is what the reader recognises it by — for a
 * role that is "AI Engineer · Carro", not the essay headline — and `sub` is
 * the one line that tells two similar titles apart.
 */
export type ArticleLink = {
  key: EntryKey; href: string; title: string;
  sub?: string | undefined; logo?: ImageMetadata | undefined;
};

export const isPublished = <T extends { data: { draft: boolean } }>(e: T) => !e.data.draft;

/** Newest first; the id breaks ties so equal months never shuffle between builds. */
export function sortByMonthDesc<T extends { id: string }>(entries: T[], month: (e: T) => string): T[] {
  const key = (m: string) => Number(m.slice(0, 4)) * 100 + Number(m.slice(5, 7));
  return [...entries].sort((a, b) => key(month(b)) - key(month(a)) || a.id.localeCompare(b.id));
}

/**
 * The only home-selection mechanism. Entries without `featuredOrder` are never
 * featured — there is no competing list anywhere in the codebase. Two entries
 * with the same order would make the home order depend on load order, so the
 * build stops and names both.
 */
export function selectFeatured<T extends { id: string; data: { featuredOrder?: number | undefined } }>(
  entries: T[],
  limit: number,
): T[] {
  const featured = entries.filter((e) => e.data.featuredOrder !== undefined);
  const seen = new Map<number, string>();
  for (const e of featured) {
    const order = e.data.featuredOrder!;
    const other = seen.get(order);
    if (other !== undefined) throw new Error(`Duplicate featuredOrder ${order}: ${other} and ${e.id}`);
    seen.set(order, e.id);
  }
  return featured.sort((a, b) => a.data.featuredOrder! - b.data.featuredOrder!).slice(0, limit);
}

/**
 * Previous/next within one collection, over entries that actually have routes.
 * Follows the order the index page lists them in: "next" is the card after
 * this one. Chronological prev/next made the first hobby show only "Previous".
 */
export function getAdjacent(
  ordered: ArticleLink[],
  current: EntryKey,
): { prev?: ArticleLink | undefined; next?: ArticleLink | undefined } {
  const i = ordered.findIndex((e) => e.key === current);
  if (i === -1) return {};
  return { prev: ordered[i - 1], next: ordered[i + 1] };
}

export const toArticleLinks = (
  collection: 'projects' | 'work' | 'hobbies',
  entries: Array<{ id: string; data: { title: string; shortTitle?: string | undefined } }>,
): ArticleLink[] =>
  entries.map((e) => ({
    key: keyOf(collection, e.id),
    href: `/${collection}/${e.id}`,
    title: e.data.shortTitle ?? e.data.title,
  }));
