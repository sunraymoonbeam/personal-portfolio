/**
 * Pure publication/selection policy. No Astro imports, so it is unit-testable
 * and has no way to reach the content store on its own.
 *
 * lib/content.ts loads entries and delegates every decision here.
 */

export type EntryKey = `${'projects' | 'work' | 'hobbies'}:${string}`;
export const keyOf = (collection: 'projects' | 'work' | 'hobbies', id: string): EntryKey =>
  `${collection}:${id}`;

export type ArticleLink = { key: EntryKey; href: string; title: string };

export const isPublished = <T extends { data: { draft: boolean } }>(e: T) => !e.data.draft;

/** Newest first; the id breaks ties so equal months never shuffle between builds. */
export function sortByMonthDesc<T extends { id: string }>(entries: T[], month: (e: T) => string): T[] {
  const key = (m: string) => Number(m.slice(0, 4)) * 100 + Number(m.slice(5, 7));
  return [...entries].sort((a, b) => key(month(b)) - key(month(a)) || a.id.localeCompare(b.id));
}

/**
 * The only home-selection mechanism. Entries without `featuredOrder` are never
 * featured — there is no competing list anywhere in the codebase.
 */
export function selectFeatured<T extends { data: { featuredOrder?: number | undefined } }>(
  entries: T[],
  limit: number,
): T[] {
  return entries
    .filter((e) => e.data.featuredOrder !== undefined)
    .sort((a, b) => a.data.featuredOrder! - b.data.featuredOrder!)
    .slice(0, limit);
}

/** Previous/next within one collection, over entries that actually have routes. */
export function getAdjacent(
  ordered: ArticleLink[],
  current: EntryKey,
): { prev?: ArticleLink | undefined; next?: ArticleLink | undefined } {
  const i = ordered.findIndex((e) => e.key === current);
  if (i === -1) return {};
  return { prev: ordered[i + 1], next: ordered[i - 1] };
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
