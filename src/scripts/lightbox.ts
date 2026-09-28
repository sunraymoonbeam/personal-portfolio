/**
 * Click a picture to see it large.
 *
 * Every picture is already an anchor to a bigger version, so with no
 * JavaScript a click opens that file and nothing is lost. This replaces that
 * with an overlay, and adds arrow keys to move through the grid it belongs to.
 *
 * The dialog is built here rather than sitting in the HTML, so a page that
 * never opens it never pays for it. Like the rest of src/scripts, this is
 * re-bound on every navigation because the client router swaps the DOM.
 */
let panel: HTMLDialogElement | null = null;
let shots: HTMLAnchorElement[] = [];
let at = 0;

function build(): HTMLDialogElement {
  const el = document.createElement('dialog');
  el.className = 'lightbox';
  el.setAttribute('aria-label', 'Picture');
  el.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
    <figure class="lightbox-body">
      <img alt="" />
      <figcaption class="t-14"></figcaption>
    </figure>`;

  el.addEventListener('click', (e) => {
    // The backdrop is the dialog itself; the picture is a child.
    const hit = e.target as HTMLElement;
    if (hit === el || hit.closest('.lightbox-close')) el.close();
  });
  document.body.append(el);
  return el;
}

function show(i: number) {
  const link = shots[i];
  if (!panel || !link) return;
  at = i;

  const img = panel.querySelector('img');
  const cap = panel.querySelector('figcaption');
  if (img) {
    img.src = link.href;
    img.alt = link.dataset.alt ?? '';
  }
  if (cap) {
    const text = link.dataset.caption ?? '';
    cap.textContent = text;
    cap.hidden = text === '';
  }
  if (!panel.open) panel.showModal();
}

/** Arrow keys walk the grid the open picture came from, and stop at its ends. */
function step(by: number) {
  const here = shots[at];
  if (!here) return;
  const grid = here.closest('.photos');
  const siblings = shots.filter((s) => s.closest('.photos') === grid);
  const local = siblings.indexOf(here) + by;
  if (local < 0 || local >= siblings.length) return;
  const next = siblings[local];
  if (next) show(shots.indexOf(next));
}

let wired = false;

export function initLightbox() {
  shots = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];
  if (shots.length === 0) return;

  shots.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      // Let a modified click do what the person actually asked for.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      panel ??= build();
      show(i);
    });
  });

  if (wired) return;
  wired = true;

  document.addEventListener('keydown', (e) => {
    if (!panel?.open) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
}
