/**
 * One theme owner. Both toggle buttons read from here.
 *
 * The race this is written to avoid: a queued `storage` event from another tab
 * carrying OLD data, arriving after a newer local click. Applying
 * `event.newValue` blindly would leave storage `dark` and the page `light`.
 * So a storage event is only ever a signal to RE-READ current storage.
 */
type Preference = 'system' | 'light' | 'dark';
type Resolved = 'light' | 'dark';

const KEY = 'theme';
const mq = () => window.matchMedia('(prefers-color-scheme: dark)');

const readStored = (): Preference => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    // A read error is not the same as an absent key: keep in-memory state.
    return preference;
  }
};

const resolve = (p: Preference): Resolved =>
  p === 'system' ? (mq().matches ? 'dark' : 'light') : p;

let preference: Preference = 'system';
let resolved: Resolved = 'light';

function apply(next: Resolved) {
  resolved = next;
  document.documentElement.dataset.theme = next;
}

/** Reconcile from whatever storage currently holds. */
function reconcile() {
  preference = readStored();
  apply(resolve(preference));
}

/** Two-state UX: choosing the current OS value means "system" (override removed). */
function toggle() {
  const osTheme = mq().matches ? 'dark' : 'light';
  const next: Resolved = resolved === 'dark' ? 'light' : 'dark';
  preference = next === osTheme ? 'system' : next;

  // Visible change first; persistence must never undo it for this session.
  apply(next);
  try {
    if (preference === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, preference);
  } catch { /* private mode: in-memory choice still stands */ }
  syncButtons();
}

function syncButtons() {
  for (const el of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    el.setAttribute('aria-pressed', String(resolved === 'dark'));
    el.setAttribute('aria-label', resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/**
 * Re-apply the stored theme to the document.
 *
 * With the client router the whole document is swapped, which drops the
 * `data-theme` attribute the head bootstrap set. This runs on `astro:after-swap`,
 * before the new page paints, so a navigation never flashes the wrong theme.
 */
export function syncDocument() {
  reconcile();
  syncButtons();
}

/** Per-page: the buttons are new DOM after every swap. */
function bindToggles() {
  for (const el of document.querySelectorAll('[data-theme-toggle]')) {
    el.addEventListener('click', toggle);
  }
  syncButtons();
}

/** Window-level listeners must be attached exactly once per document. */
let wired = false;

export function initTheme() {
  if (wired) { bindToggles(); return; }
  wired = true;

  // Listeners attach BEFORE the first reconcile, so a change between the head
  // bootstrap and this module starting is not lost.
  window.addEventListener('storage', (e) => {
    if (e.storageArea !== localStorage) return;
    if (e.key !== null && e.key !== KEY) return;   // null = clear()
    reconcile();                                    // re-read, never e.newValue
    syncButtons();
  });
  mq().addEventListener('change', () => {
    if (preference === 'system') { apply(resolve('system')); syncButtons(); }
  });
  window.addEventListener('pageshow', () => { reconcile(); syncButtons(); });

  reconcile();
  bindToggles();
}
