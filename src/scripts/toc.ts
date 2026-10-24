/**
 * Marks the contents entry for the section being read. The current section is
 * the last heading that has scrolled above a line a third of the way down the
 * viewport, which matches where the eye is rather than the top edge.
 */
let onScroll: (() => void) | null = null;

export function initToc() {
  if (onScroll) window.removeEventListener('scroll', onScroll);
  onScroll = null;
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  if (links.length === 0) return;
  const targets = links
    .map((a) => document.getElementById(a.dataset.tocLink ?? ''))
    .filter((h): h is HTMLElement => h !== null);

  let frame = 0;
  const update = () => {
    frame = 0;
    const line = window.innerHeight / 3;
    let current = targets[0]?.id;
    for (const h of targets) if (h.getBoundingClientRect().top <= line) current = h.id;
    for (const a of links) a.setAttribute('aria-current', String(a.dataset.tocLink === current));
  };
  onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}
