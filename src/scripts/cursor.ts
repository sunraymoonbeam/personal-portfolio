/**
 * MapleStory cursors.
 *
 * These animate at 200–500ms per frame, which is slow enough to swap the REAL
 * CSS cursor on a timer. That means the native pointer with zero lag — not a
 * div chasing the mouse, which is what makes most custom cursors feel bad.
 *
 * Frames are inlined as data URIs in cursors.css: 4.5 KB gzipped, no requests.
 */
const POINTER_FRAMES = 2;
const POINTER_MS = 500;

export function initCursor() {
  // Never on touch: a cursor nobody has is pure cost.
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const root = document.documentElement;
  root.classList.add('ms');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('pointer-0');   // static first frame
    return;
  }

  let i = 0;
  root.classList.add('pointer-0');
  const tick = () => {
    root.classList.remove(`pointer-${i}`);
    i = (i + 1) % POINTER_FRAMES;
    root.classList.add(`pointer-${i}`);
  };
  const timer = window.setInterval(tick, POINTER_MS);

  // Stop the timer when the tab is hidden; nothing to animate.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearInterval(timer);
  });
}
