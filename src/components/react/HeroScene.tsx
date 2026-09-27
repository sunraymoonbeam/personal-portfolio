import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import type { Mesh } from "three";

/**
 * The only heavy (WebGL) part of the whole site.
 * In index.astro this component is loaded with `client:visible`, which means
 * Astro ships ZERO of this JavaScript until the hero scrolls into view — that's
 * "lazy loading" / lazy hydration in action. Everything else on the page is
 * static HTML with no JS at all.
 */

function Knot() {
  const mesh = useRef<Mesh>(null);

  // Runs every frame: gentle continuous rotation.
  useFrame((_state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.15;
      mesh.current.rotation.y += delta * 0.2;
    }
  });

  return (
    // Offset to the right so it sits beside/behind the text, not over it.
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.4}>
      <mesh ref={mesh} scale={1.5} position={[2.2, 0.2, 0]}>
        {/* Placeholder geometry — swap for a loaded .glb model later. */}
        <icosahedronGeometry args={[1, 12]} />
        {/* metalness kept low: without an environment map, metal surfaces render
            near-black. This look relies on the point lights + a soft emissive. */}
        <MeshDistortMaterial
          color="#6d5bff"
          emissive="#4338ca"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.35}
          distort={0.45}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  // Under Astro's `client:visible`, r3f's resize observer can measure the
  // canvas parent as 0 on first paint and leave the canvas stuck at its 300x150
  // default. Nudging a resize after mount forces r3f to remeasure and fill.
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    // Fire a few times across the first paints — cheap, and guarantees r3f
    // remeasures once the parent has real dimensions.
    const timers = [0, 60, 200, 500].map((ms) => setTimeout(nudge, ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Canvas
      // dpr capped to keep GPU memory + battery use low on retina screens.
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={140} color="#c4b5fd" />
      <pointLight position={[-6, -3, 2]} intensity={90} color="#22d3ee" />
      <pointLight position={[0, 3, -4]} intensity={50} color="#ffffff" />
      <Suspense fallback={null}>
        <Knot />
        <Sparkles count={80} scale={10} size={2} speed={0.3} color="#9498ff" />
      </Suspense>
    </Canvas>
  );
}
