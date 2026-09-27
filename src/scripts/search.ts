/**
 * The ⌘K search panel.
 *
 * This lives outside the component for the same reason the menu does: the
 * header is swapped on every client-side navigation, and a component's module
 * script runs only once per document. Bound inside the component, the panel
 * worked on a hard load and was dead after the first navigation.
 *
 * The shortcut listener is attached once, to `document`, and looks the panel up
 * at press time so it always finds the current one.
 */
const panelOf = () => document.querySelector<HTMLDialogElement>('[data-search-panel]');

function openPanel() {
  const panel = panelOf();
  const input = document.querySelector<HTMLInputElement>('[data-search-input]');
  if (!panel || !input) return;
  panel.showModal();
  input.value = '';
  applyFilter('');
  input.focus();
}

function applyFilter(query: string) {
  const needle = query.trim().toLowerCase();
  const items = document.querySelectorAll<HTMLElement>('[data-item]');
  let shown = 0;
  for (const li of items) {
    const hit = !needle || (li.dataset.text ?? '').includes(needle);
    li.hidden = !hit;
    if (hit) shown++;
  }
  const empty = document.querySelector<HTMLElement>('[data-search-empty]');
  if (empty) empty.hidden = shown > 0;
}

let wired = false;

export function initSearch() {
  const openBtn = document.querySelector<HTMLButtonElement>('[data-search-open]');
  const panel = panelOf();
  const input = document.querySelector<HTMLInputElement>('[data-search-input]');
  if (!openBtn || !panel || !input) return;

  // Per page: these three elements are new DOM after every swap.
  openBtn.addEventListener('click', openPanel);
  input.addEventListener('input', () => applyFilter(input.value));

  // Click the backdrop to dismiss. Escape is handled by <dialog> itself.
  panel.addEventListener('click', (e) => { if (e.target === panel) panel.close(); });

  // Arrow keys move through the visible results.
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const links = [...document.querySelectorAll<HTMLElement>('[data-item]')]
      .filter((li) => !li.hidden)
      .map((li) => li.querySelector('a'))
      .filter((a): a is HTMLAnchorElement => a !== null);
    if (!links.length) return;
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === 'ArrowDown' ? at + 1 : at - 1;
    // Indexing an array is not a guarantee, even after the length check above.
    links[(next + links.length) % links.length]?.focus();
  });

  if (wired) return;
  wired = true;

  document.addEventListener('keydown', (e) => {
    if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
    e.preventDefault();
    openPanel();
  });
}
