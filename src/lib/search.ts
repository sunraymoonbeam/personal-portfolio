/**
 * The site search index, as a pure function: what can be found, in which
 * group, and where it leads. lib/content.ts loads the published entries and
 * calls this; components/site/Search.astro only renders the result. No Astro
 * imports, so it is unit-testable.
 */

export type SearchItem = { group: string; title: string; sub: string; href: string };

export type SearchInputs = {
  nav: ReadonlyArray<{ label: string; href: string }>;
  projects: Array<{ id: string; title: string; claim: string; writeup: boolean }>;
  /** `title` is "Role · Employer": two roles share "AI Engineer", the company tells them apart. */
  work: Array<{ id: string; title: string; sub: string; writeup: boolean }>;
  hobbies: Array<{ title: string; caption: string; href: string }>;
};

/** Pages first, then articles. Only entries with a page of their own are listed. */
export function buildSearchItems({ nav, projects, work, hobbies }: SearchInputs): SearchItem[] {
  const items: SearchItem[] = [
    ...nav.map((n) => ({ group: 'Pages', title: n.label, sub: '', href: n.href })),
    { group: 'Pages', title: 'CV', sub: '', href: '/cv/' },
    { group: 'Pages', title: 'Contact', sub: '', href: '/contact/' },
    ...projects.filter((p) => p.writeup).map((p) => ({
      group: 'Projects', title: p.title, sub: p.claim, href: `/projects/${p.id}/`,
    })),
    ...work.filter((w) => w.writeup).map((w) => ({
      group: 'Work experience', title: w.title, sub: w.sub, href: `/work/${w.id}/`,
    })),
    ...hobbies.filter((h) => h.href).map((h) => ({
      group: 'Hobbies', title: h.title, sub: h.caption, href: h.href,
    })),
  ];
  // A project cross-listed under Hobbies has one URL; list it once.
  const seen = new Set<string>();
  return items.filter((it) => !seen.has(it.href) && seen.add(it.href));
}
