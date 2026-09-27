/**
 * The tag filter on /projects.
 *
 * The bar ships hidden and this reveals it, so a browser without scripting
 * never sees a filter that cannot filter. That reveal has to run again after
 * every client-side navigation, or arriving at /projects from another page
 * leaves the bar hidden for good.
 */
export function initFilters() {
  const bar = document.querySelector<HTMLElement>('[data-filters]');
  if (!bar) return;
  bar.hidden = false;

  bar.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.pill');
    if (!btn) return;
    const tag = btn.dataset.tag!;

    for (const p of bar.querySelectorAll<HTMLButtonElement>('.pill')) {
      const on = p === btn;
      p.classList.toggle('on', on);
      p.setAttribute('aria-pressed', String(on));
    }
    for (const row of document.querySelectorAll<HTMLElement>('[data-tags]')) {
      const tags = (row.dataset.tags ?? '').split('|');
      row.hidden = tag !== 'all' && !tags.includes(tag);
    }
  });
}
