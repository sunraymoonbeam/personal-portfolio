/**
 * Plays article clips (`video[data-clip]`) while they are on screen and pauses
 * them off screen, so a page of loops does not burn a phone's battery.
 *
 * With reduced motion the clips never autoplay; they get controls instead, so
 * the person can still choose to watch.
 */
let seen: IntersectionObserver | null = null;

export function initClips() {
  seen?.disconnect();
  const clips = [...document.querySelectorAll<HTMLVideoElement>('video[data-clip]')];
  if (clips.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (const v of clips) v.controls = true;
    return;
  }

  seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement;
      // play() rejects when the browser refuses autoplay; the poster stays.
      if (e.isIntersecting) v.play().catch(() => { v.controls = true; });
      else v.pause();
    }
  }, { threshold: 0.25 });
  for (const v of clips) seen.observe(v);
}
