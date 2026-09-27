import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { isPublished, sortByMonthDesc, keyOf, type EntryKey } from './select';

// Pure policy lives in ./select.ts so it can be unit-tested without Astro.
export {
  keyOf, selectFeatured, getAdjacent, toArticleLinks,
  type EntryKey, type ArticleLink,
} from './select';

/**
 * The ONE place that decides what is published and in what order.
 *
 * Pages request content; this module applies publication policy; components
 * render whatever they are given. Nothing else calls getCollection().
 *
 * What must never live here: card presentation policy — truncating a title to
 * fit, picking a CSS class, choosing a dark-mode logo. Publication and ordering
 * only.
 *
 * Every function returns a fresh array, so no consumer can .sort() a shared one.
 */

export type Work = CollectionEntry<'work'>;
export type Project = CollectionEntry<'projects'>;
export type Play = CollectionEntry<'play'>;
export type ResolvedWork = { entry: Work; employer: CollectionEntry<'employers'> };

export async function resolveWork(entry: Work): Promise<ResolvedWork> {
  return { entry, employer: await getEntry(entry.data.employer) };
}

// ── projects ────────────────────────────────────────────────────────────────

export async function getPublishedProjects(): Promise<Project[]> {
  const all = await getCollection('projects', isPublished);
  return sortByMonthDesc(all, (e) => e.data.published);
}

/** Only entries that actually get a route. */
export async function getProjectArticles(): Promise<Project[]> {
  return (await getPublishedProjects()).filter((e) => e.data.writeup);
}

// ── work ────────────────────────────────────────────────────────────────────

/** All published roles, including ones with no article. Newest first. */
export async function getPublishedWork(): Promise<Work[]> {
  const all = await getCollection('work', isPublished);
  return sortByMonthDesc(all, (e) => e.data.start);
}

/** Roles shown in work surfaces (ledger, home rows, featured slot). */
export async function getWorkRows(): Promise<Work[]> {
  return (await getPublishedWork()).filter((e) => e.data.showInWork);
}

/** Roles with a route. May include roles hidden from the ledger. */
export async function getWorkArticles(): Promise<Work[]> {
  return (await getPublishedWork()).filter((e) => e.data.writeup);
}

/**
 * The latest VISIBLE role — not the latest with a write-up. If it has no
 * article or cover, the feature renders without them rather than silently
 * promoting an older employer.
 */
export async function getFeaturedRole(): Promise<Work | undefined> {
  return (await getWorkRows())[0];
}

/** Grouped by start year, newest first, for the ledger. */
export async function getWorkByYear(): Promise<Array<{ year: string; roles: Work[] }>> {
  const rows = await getWorkRows();
  const groups = new Map<string, Work[]>();
  for (const r of rows) {
    const y = r.data.start.slice(0, 4);
    (groups.get(y) ?? groups.set(y, []).get(y)!).push(r);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, roles]) => ({ year, roles }));
}

// ── play ────────────────────────────────────────────────────────────────────

export async function getPublishedPlay(): Promise<Play[]> {
  const all = await getCollection('play', isPublished);
  return sortByMonthDesc(all, (e) => e.data.published);
}

/**
 * The Play index: real play entries, plus any project that opted in via
 * `showInPlay`. Cross-listed projects keep their canonical /projects URL — the
 * body is never duplicated.
 */
export async function getPlayIndex(): Promise<
  Array<{ key: EntryKey; href: string; title: string; caption: string; cover?: ImageMetadata; coverAlt?: string }>
> {
  const [play, projects] = await Promise.all([getPublishedPlay(), getPublishedProjects()]);
  const fromPlay = play.map((e) => ({
    key: keyOf('play', e.id),
    href: e.data.writeup ? `/hobbies/${e.id}` : '',
    title: e.data.title,
    caption: e.data.caption,
    cover: e.data.cover,
    coverAlt: e.data.coverAlt,
  }));
  const crossListed = projects
    .filter((e) => e.data.showInPlay)
    .map((e) => ({
      key: keyOf('projects', e.id),
      href: e.data.writeup ? `/projects/${e.id}` : '',
      title: e.data.title,
      caption: e.data.claim,
      cover: e.data.cover,
      coverAlt: e.data.coverAlt,
    }));
  return [...fromPlay, ...crossListed];
}
