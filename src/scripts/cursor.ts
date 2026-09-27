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
const BUSY_FRAMES = 4;
const BUSY_MS = 200;

/** Spin the meso coin while something is loading. Returns a stop function. */
export function busy(): () => void {
  const root = document.documentElement;
  if (!root.classList.contains('ms')) return () => {};
  let i = 0;
  root.classList.add('busy-0');
  const timer = window.setInterval(() => {
    root.classList.remove(`busy-${i}`);
    i = (i + 1) % BUSY_FRAMES;
    root.classList.add(`busy-${i}`);
  }, BUSY_MS);
  return () => {
    window.clearInterval(timer);
    for (let f = 0; f < BUSY_FRAMES; f++) root.classList.remove(`busy-${f}`);
  };
}

/** The running frame timer, so a re-init after a navigation does not stack. */
let frameTimer: number | null = null;
let wired = false;

export function initCursor() {
  // Never on touch: a cursor nobody has is pure cost.
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const root = document.documentElement;
  root.classList.add('ms');
  if (frameTimer !== null) { window.clearInterval(frameTimer); frameTimer = null; }

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
  frameTimer = timer;

  if (wired) return;
  wired = true;

  // Stop the timer when the tab is hidden; nothing to animate.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frameTimer !== null) {
      window.clearInterval(frameTimer);
      frameTimer = null;
    }
  });

  // Spin the coin while a navigation is in flight, so a slow load has a cursor
  // that says "working" rather than nothing at all. The router's own events
  // cover every link, including ones added after this ran.
  let stop: (() => void) | null = null;
  const clear = () => { stop?.(); stop = null; };
  document.addEventListener('astro:before-preparation', () => { clear(); stop = busy(); });
  document.addEventListener('astro:page-load', clear);
  window.addEventListener('pageshow', clear);
}
