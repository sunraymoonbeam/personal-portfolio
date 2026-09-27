import {
  Scene, PerspectiveCamera, WebGLRenderer, IcosahedronGeometry,
  MeshStandardMaterial, Mesh, AmbientLight, PointLight, Color,
} from 'three';
import { subscribe, type Resolved } from './theme';

/**
 * Vanilla three.js — no react-three-fiber, no drei, no React. That stack was
 * ~1.1MB; this is ~70KB gzipped and tree-shaken to the classes used here.
 *
 * Decoration that REACTS to the theme. It is never a control: a <canvas> has no
 * accessible name, no focus ring and no keyboard path.
 */
export function initHeroScene(host: HTMLElement) {
  const canvas = host.querySelector('canvas');
  const poster = host.querySelector<HTMLElement>('[data-poster]');
  if (!(canvas instanceof HTMLCanvasElement)) return;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return; // no WebGL: the poster stays, which is the whole point of having one
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.4;

  const geometry = new IcosahedronGeometry(1.45, 5);
  // Low metalness on purpose: without an environment map a metal surface has
  // nothing to reflect and renders near-black.
  const material = new MeshStandardMaterial({ roughness: 0.22, metalness: 0.28, flatShading: true });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const ambient = new AmbientLight(0xffffff, 0.55);
  const key = new PointLight(0xc4b5fd, 90);
  const fill = new PointLight(0x22d3ee, 55);
  const rim = new PointLight(0xffffff, 35);
  key.position.set(3.5, 3.5, 4);
  fill.position.set(-4, -2.5, 2.5);
  rim.position.set(0, 2.5, -3.5);
  scene.add(ambient, key, fill, rim);

  // Theme changes SWAP material/light values in place. Rebuilding the scene per
  // toggle is how people leak WebGL memory — and dropping resources without
  // dispose() leaks just as badly.
  const unsubscribe = subscribe((theme: Resolved) => {
    material.color = new Color(theme === 'dark' ? 0x6d5bff : 0x8b8cff);
    material.emissive = new Color(theme === 'dark' ? 0x2a2a6a : 0x4338ca);
    material.emissiveIntensity = theme === 'dark' ? 0.5 : 0.35;
    material.needsUpdate = true;
    ambient.intensity = theme === 'dark' ? 0.35 : 0.5;
  });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    // dpr capped: a retina phone does not need 3x pixels for a decorative blob.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  let raf = 0;
  let running = false;
  const frame = () => {
    const t = performance.now() * 0.00016;
    mesh.rotation.x = t * 0.7;
    mesh.rotation.y = t;
    mesh.position.y = Math.sin(t * 2.2) * 0.06;   // slow float
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!running) { running = true; frame(); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  // Pause off-screen and when the tab is hidden.
  const vis = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.01 });
  vis.observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  poster?.setAttribute('hidden', '');
  canvas.removeAttribute('hidden');

  return () => {
    stop(); ro.disconnect(); vis.disconnect(); unsubscribe();
    geometry.dispose(); material.dispose(); renderer.dispose();
  };
}
