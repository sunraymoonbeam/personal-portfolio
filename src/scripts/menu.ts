/**
 * The mobile menu.
 *
 * This lives outside the component because the header is swapped on every
 * client-side navigation, and a component's module script runs only once per
 * document. The layout calls this on `astro:page-load`, which fires on the
 * first load and after every swap, so the new buttons are always wired.
 */
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

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    setOpen(false);
    toggle.focus();
  });
}
