import * as simpleIcons from 'simple-icons';
import { TECHNOLOGIES } from '~/data/technologies';

/** Resolved at build time. A missing icon degrades to a text label, never an error. */
export type ResolvedTech = { label: string; path?: string; hex?: string };

const bySlug = new Map(
  Object.values(simpleIcons as Record<string, { slug: string; path: string; hex: string }>)
    .filter((i) => i && typeof i.slug === 'string')
    .map((i) => [i.slug, i]),
);

export function resolveTech(id: string): ResolvedTech {
  const tech = TECHNOLOGIES[id];
  if (!tech) return { label: id };            // unknown id still renders readably
  if (!tech.icon) return { label: tech.label };
  const icon = bySlug.get(tech.icon);
  return icon ? { label: tech.label, path: icon.path, hex: icon.hex } : { label: tech.label };
}
