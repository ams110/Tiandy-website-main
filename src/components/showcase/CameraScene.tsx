// Interactive 3D scene for the homepage camera showcase.
//
// The camera is modeled procedurally from Three.js primitives (no external
// .glb / textures), so it ships with zero binary assets, has no licensing
// strings attached, and stays tiny. The form factor mirrors a real Tiandy
// flagship PTZ "speed dome" (TC-H389M): a metal canister housing, a tinted
// glass dome, and a pan/tilt lens head that continuously "patrols" — echoing
// the camera's AI auto-tracking, just like the AI traffic scene in the hero.
//
// IMPORTANT: this module is loaded lazily and only mounted on the client
// (see Camera3DShowcase.tsx). It must never be imported during SSG/prerender,
// because @react-three/fiber touches WebGL / `window` at runtime.

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  PresentationControls,
  ContactShadows,
  Environment,
  Lightformer,
  Float,
  Html,
} from '@react-three/drei'
import * as THREE from 'three'

// Brand palette (kept in sync with tailwind.config.js `brand`/`accent`).
const BRAND = '#42d229'
const ACCENT = '#6ee84f'

/**
 * Stylized model of the real Tiandy TC-H389M laser PTZ "speed dome":
 *   - white upper dome (static housing) with a top mount + brand-green accent,
 *   - a black collar band carrying two small sensors,
 *   - a black lower pan/tilt head with twin lenses (main + laser) and an IR LED
 *     strip, which continuously patrols to echo the AI auto-tracking.
 * Proportions/colors are matched to Tiandy's official product photos.
 */
function PtzCamera({ animate }: { animate: boolean }) {
  const head = useRef<THREE.Group>(null)
  const led = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (!animate) return
    const t = state.clock.elapsedTime
    if (head.current) {
      // Pan back and forth (~±45°) with a gentle tilt sweep, so the lenses read
      // as actively scanning the scene.
      head.current.rotation.y = Math.sin(t * 0.5) * 0.8
      head.current.rotation.x = Math.sin(t * 0.9) * 0.06
    }
    if (led.current) {
      // Blinking status LED.
      led.current.emissiveIntensity = 1.1 + (Math.sin(t * 4) * 0.5 + 0.5) * 1.4
    }
  })

  return (
    <group position={[0, -0.32, 0]} rotation={[0, -0.28, 0]}>
      {/* ── Static upper assembly ───────────────────────────────────────── */}

      {/* Top mount connector */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.095, 0.2, 24]} />
        <meshStandardMaterial color="#3a3f47" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Mount cap */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.26, 0.1, 48]} />
        <meshStandardMaterial color="#eceef0" metalness={0.1} roughness={0.4} />
      </mesh>

      {/* White upper dome (static housing) */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.62, 56, 40, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f2f3f5" metalness={0.12} roughness={0.3} />
      </mesh>

      {/* Brand-green accent ring at the white/black seam */}
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.625, 0.012, 14, 90]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={1.3} toneMapped={false} />
      </mesh>

      {/* Black collar band */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.585, 0.22, 48]} />
        <meshStandardMaterial color="#1a1c20" metalness={0.35} roughness={0.45} />
      </mesh>

      {/* Two sensor domes on the collar front */}
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.35, 0.55]} castShadow>
          <sphereGeometry args={[0.05, 18, 18]} />
          <meshStandardMaterial color="#0a0a0c" metalness={0.3} roughness={0.12} />
        </mesh>
      ))}

      {/* Blinking status LED on the collar */}
      <mesh position={[0, 0.35, 0.585]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial ref={led} color={ACCENT} emissive={ACCENT} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>

      {/* ── Pan/tilt head (the part that moves) ─────────────────────────── */}
      <group ref={head} position={[0, 0.25, 0]}>
        {/* Black lower dome */}
        <mesh castShadow>
          <sphereGeometry args={[0.56, 48, 36, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#16181c" metalness={0.35} roughness={0.42} />
        </mesh>

        {/* Lens face, sat on the lower-front of the sphere and tilted down */}
        <group position={[0, -0.24, 0.46]} rotation={[0.5, 0, 0]}>
          {/* Recessed dark faceplate */}
          <mesh position={[0, -0.01, -0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.29, 0.3, 0.06, 44]} />
            <meshStandardMaterial color="#101216" metalness={0.4} roughness={0.5} />
          </mesh>

          {/* Main lens (magenta-coated glass) */}
          <group position={[-0.1, 0.05, 0]}>
            <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.115, 0.125, 0.16, 32]} />
              <meshStandardMaterial color="#0a0b0d" metalness={0.55} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.145]}>
              <circleGeometry args={[0.1, 32]} />
              <meshStandardMaterial color="#2a1733" emissive="#a855f7" emissiveIntensity={0.55} metalness={0.9} roughness={0.07} toneMapped={false} />
            </mesh>
          </group>

          {/* Secondary / laser lens (cooler tint, slightly smaller) */}
          <group position={[0.13, 0.05, 0]}>
            <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.1, 0.14, 28]} />
              <meshStandardMaterial color="#0a0b0d" metalness={0.55} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.125]}>
              <circleGeometry args={[0.078, 28]} />
              <meshStandardMaterial color="#1a2330" emissive="#7dd3fc" emissiveIntensity={0.4} metalness={0.9} roughness={0.08} toneMapped={false} />
            </mesh>
          </group>

          {/* IR / white LED strip below the lenses */}
          {[-0.12, -0.04, 0.04, 0.12].map((x) => (
            <mesh key={x} position={[x, -0.13, 0.03]}>
              <sphereGeometry args={[0.028, 16, 16]} />
              <meshStandardMaterial color="#dfe7ef" emissive="#cfe0ff" emissiveIntensity={0.7} metalness={0.4} roughness={0.2} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>

      {/* In-scene AI badge that floats above the unit */}
      <Html position={[0, 1.28, 0]} center distanceFactor={5.5} className="pointer-events-none select-none" zIndexRange={[20, 0]}>
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-accent-400/50 bg-black/55 px-2.5 py-1 backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
          <span className="text-[10px] font-bold tracking-wide text-accent-400">AI&nbsp;LIVE · 44×</span>
        </div>
      </Html>
    </group>
  )
}

export default function CameraScene({ animate = true }: { animate?: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0.4, 0.25, 3.95], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // When animation is disabled (off-screen / reduced motion) we still want a
      // crisp first frame, so render on demand instead of every tick.
      frameloop={animate ? 'always' : 'demand'}
    >
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#ffffff', '#3a3f4a', 0.55]} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 2, 3]} intensity={0.8} color={BRAND} />

      <PresentationControls
        global
        snap
        config={{ mass: 1, tension: 170, friction: 26 }}
        rotation={[0.08, 0.3, 0]}
        polar={[-0.35, 0.35]}
        azimuth={[-0.9, 0.9]}
      >
        {animate ? (
          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
            <PtzCamera animate={animate} />
          </Float>
        ) : (
          <PtzCamera animate={false} />
        )}
      </PresentationControls>

      <ContactShadows position={[0, -0.72, 0]} opacity={0.5} scale={6} blur={2.4} far={3} color="#000000" />

      {/* Reflections without any external HDR file: a few light cards baked once. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 3, 2]} scale={[5, 5, 1]} />
        <Lightformer intensity={1.4} color={BRAND} position={[-3, 1, 2]} scale={[2, 5, 1]} />
        <Lightformer intensity={1} position={[3, 1, -2]} scale={[4, 4, 1]} />
      </Environment>
    </Canvas>
  )
}
