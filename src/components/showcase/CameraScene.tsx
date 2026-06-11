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

/** A stylized Tiandy PTZ dome camera with a patrolling pan/tilt lens head. */
function PtzCamera({ animate }: { animate: boolean }) {
  const head = useRef<THREE.Group>(null)
  const led = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (!animate) return
    const t = state.clock.elapsedTime
    if (head.current) {
      // Pan back and forth (~±45°) and add a gentle downward tilt sweep, so the
      // lens reads as actively scanning the scene.
      head.current.rotation.y = Math.sin(t * 0.5) * 0.8
      head.current.rotation.x = 0.42 + Math.sin(t * 0.9) * 0.07
    }
    if (led.current) {
      // Blinking status LED.
      led.current.emissiveIntensity = 1.1 + (Math.sin(t * 4) * 0.5 + 0.5) * 1.4
    }
  })

  return (
    <group position={[0, -0.25, 0]} rotation={[0, -0.3, 0]}>
      {/* Ceiling mount plate */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.64, 0.14, 56]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.45} />
      </mesh>

      {/* Main housing canister (brushed metal) */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.56, 0.59, 0.44, 56]} />
        <meshStandardMaterial color="#e5e9ef" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Glowing brand trim ring at the seam */}
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.575, 0.022, 18, 96]} />
        <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>

      {/* Tinted glass dome (lower hemisphere) */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.57, 56, 36, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial
          color="#0b1220"
          metalness={0.2}
          roughness={0.05}
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pan/tilt lens head, inside the dome */}
      <group ref={head} position={[0, 0.5, 0]}>
        {/* Gimbal ball */}
        <mesh castShadow>
          <sphereGeometry args={[0.31, 40, 28]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.38} />
        </mesh>

        {/* Lens assembly — barrel along +Z, tilted slightly down */}
        <group rotation={[0.5, 0, 0]}>
          <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.135, 0.16, 0.34, 40]} />
            <meshStandardMaterial color="#020617" metalness={0.55} roughness={0.5} />
          </mesh>
          {/* Lens hood ring */}
          <mesh position={[0, 0, 0.41]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.13, 0.022, 14, 40]} />
            <meshStandardMaterial color="#0b0f17" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Front glass element (faint blue coating glow) */}
          <mesh position={[0, 0, 0.405]}>
            <circleGeometry args={[0.12, 40]} />
            <meshStandardMaterial
              color="#0ea5e9"
              emissive="#38bdf8"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.08}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Blinking status LED */}
        <mesh position={[0.2, 0.08, 0.18]}>
          <sphereGeometry args={[0.028, 16, 16]} />
          <meshStandardMaterial ref={led} color={ACCENT} emissive={ACCENT} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      </group>

      {/* In-scene AI badge that floats above the unit */}
      <Html position={[0, 1.3, 0]} center distanceFactor={5.5} className="pointer-events-none select-none" zIndexRange={[20, 0]}>
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
      camera={{ position: [0.2, 0.5, 3.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // When animation is disabled (off-screen / reduced motion) we still want a
      // crisp first frame, so render on demand instead of every tick.
      frameloop={animate ? 'always' : 'demand'}
    >
      <ambientLight intensity={0.6} />
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

      <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={6} blur={2.4} far={3} color="#000000" />

      {/* Reflections without any external HDR file: a few light cards baked once. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 3, 2]} scale={[5, 5, 1]} />
        <Lightformer intensity={1.4} color={BRAND} position={[-3, 1, 2]} scale={[2, 5, 1]} />
        <Lightformer intensity={1} position={[3, 1, -2]} scale={[4, 4, 1]} />
      </Environment>
    </Canvas>
  )
}
