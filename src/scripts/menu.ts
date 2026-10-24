/**
 * The mobile menu.
 *
 * This lives outside the component because the header is swapped on every
 * client-side navigation, and a component's module script runs only once per
 * document. The layout calls this on `astro:page-load`, which fires on the
 * first load and after every swap, so the new buttons are always wired.
 */
let wired = false;
const wide = () => window.matchMedia('(min-width: 880px)');

export function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const sheet = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !sheet) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  // A swap can leave the body locked if the menu was open when a link was hit.
  setOpen(false);

  toggle.addEventListener('click', () =>
    setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  if (wired) return;
  wired = true;

  // Bound once and looked up at event time, so a swap leaves no stale copies.
  const current = () => document.querySelector<HTMLButtonElement>('[data-menu-toggle][aria-expanded="true"]');
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = current();
    if (!open) return;
    open.click();
    open.focus();
  });

  // Rotating a phone or widening a window past 880px hides the sheet and the
  // burger in CSS, which would leave the body scroll-locked with no way out.
  wide().addEventListener('change', (e) => { if (e.matches) current()?.click(); });
}
