import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ThemeMode } from '../theme'
import { holoState } from './Orbits'
import { beatFraction, beatLerp, beatPos, range } from './useScrollProgress'

/**
 * The hero object: a low-poly icosahedron shard — crystal / compiled artifact.
 * ~80 faces core + wireframe shell + 8 fracture fragments + a 260-point halo.
 * All state (rotation, displacement amplitude, wireframe opacity, color,
 * fracture amount) is a pure function of global scroll progress.
 *
 * Beat mapping (tweak the *_STOPS arrays):
 *   1 HOOK        calm, faint wireframe
 *   2 FOUNDATION  wireframe reveals — structure under the surface
 *   3 NOW         displacement peaks + shard fractures into fragments
 *   4 APPROACH    fragments reassemble, surface calms
 *   5 CONTACT     still, warm
 */

// displacement amplitude per beat (6 beats)
const AMP_STOPS = [0.05, 0.08, 0.16, 0.06, 0.05, 0.03]
// wireframe shell opacity per beat
const WIRE_STOPS = [0.12, 0.5, 0.35, 0.3, 0.4, 0.15]

// color stops per beat, per theme (cyan → lime → violet → cyan → amber journey)
const COLOR_STOPS: Record<ThemeMode, string[]> = {
	dark: ['#7CE7FF', '#7CE7FF', '#C6FF3D', '#B482FF', '#7CE7FF', '#FFB02E'],
	light: ['#0091B5', '#0091B5', '#4F8A12', '#7A4FC9', '#0091B5', '#C25E00'],
}

// deterministic fragment directions (unit-ish vectors)
const FRAGMENT_DIRS: [number, number, number][] = [
	[0.9, 0.3, 0.2],
	[-0.7, 0.6, 0.3],
	[0.2, -0.9, 0.4],
	[-0.4, -0.5, -0.7],
	[0.6, 0.7, -0.4],
	[-0.9, -0.1, 0.5],
	[0.1, 0.8, 0.6],
	[0.5, -0.4, -0.8],
]

/** Cheap layered-sine noise — stable per base position, no deps. */
function noise3(x: number, y: number, z: number, t: number): number {
	return (
		Math.sin(x * 2.1 + t) * 0.45 +
		Math.sin(y * 1.7 + t * 1.3 + x) * 0.35 +
		Math.sin(z * 2.6 + t * 0.7 + y) * 0.2
	)
}

export function HeroObject({ mode, animate, detail }: { mode: ThemeMode; animate: boolean; detail: 0 | 1 }) {
	const group = useRef<THREE.Group>(null)
	const core = useRef<THREE.Mesh>(null)
	const wire = useRef<THREE.Mesh>(null)
	const frags = useRef<THREE.Group>(null)
	const halo = useRef<THREE.Points>(null)

	const stops = COLOR_STOPS[mode]
	const colors = useMemo(() => stops.map((c) => new THREE.Color(c)), [stops])
	const tmpColor = useMemo(() => new THREE.Color(), [])

	// base (undisplaced) vertex positions of the core geometry
	const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.15, detail), [detail])
	const basePositions = useMemo(() => Float32Array.from(geometry.attributes.position.array), [geometry])

	const haloGeometry = useMemo(() => {
		const count = 260
		const positions = new Float32Array(count * 3)
		for (let i = 0; i < count; i++) {
			// deterministic spherical shell (no Math.random for repeatability)
			const a = i * 2.399963, r = 2.6 + Math.sin(i * 12.9898) * 0.9
			const y = Math.sin(i * 78.233) * 1.8
			positions[i * 3] = Math.cos(a) * r
			positions[i * 3 + 1] = y
			positions[i * 3 + 2] = Math.sin(a) * r
		}
		const g = new THREE.BufferGeometry()
		g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
		return g
	}, [])

	useFrame((state) => {
		// p = 0→1 across the whole story, derived from the true on-screen beat
		const p = animate ? beatFraction() : 0.05
		const t = animate ? state.clock.elapsedTime : 0

		// ---- rotation: slow idle spin + half a turn across the whole story
		if (group.current) {
			group.current.rotation.y = t * 0.12 + p * Math.PI
			group.current.rotation.x = Math.sin(t * 0.2) * 0.08 + p * 0.5
			group.current.position.y = Math.sin(t * 0.55) * 0.08
		}

		// ---- surface displacement along radial direction
		const amp = beatLerp(AMP_STOPS, p)
		const mesh = core.current
		if (mesh) {
			const pos = mesh.geometry.attributes.position as THREE.BufferAttribute
			for (let i = 0; i < pos.count; i++) {
				const bx = basePositions[i * 3]
				const by = basePositions[i * 3 + 1]
				const bz = basePositions[i * 3 + 2]
				const n = 1 + amp * noise3(bx, by, bz, t * 0.6)
				pos.setXYZ(i, bx * n, by * n, bz * n)
			}
			pos.needsUpdate = true
			mesh.geometry.computeVertexNormals()

			// ---- color drift across beats
			const s = p * (colors.length - 1)
			const ci = Math.min(colors.length - 2, Math.floor(s))
			tmpColor.copy(colors[ci]).lerp(colors[ci + 1], s - ci)
			const coreMat = mesh.material as THREE.MeshStandardMaterial
			coreMat.color.copy(tmpColor)
			// Focus-pull: while the featured hologram is on screen it is the hero,
			// so the shard recedes — dimmer core, softer wireframe & halo.
			const recede = holoState.present
			coreMat.emissive.copy(tmpColor).multiplyScalar(0.15 * (1 - recede * 0.85))
			coreMat.opacity = 0.16 * (1 - recede * 0.82)
			if (wire.current) {
				const wireMat = wire.current.material as THREE.MeshBasicMaterial
				wireMat.color.copy(tmpColor)
				wireMat.opacity = beatLerp(WIRE_STOPS, p) * (1 - recede * 0.82)
			}
			if (halo.current) {
				const haloMat = halo.current.material as THREE.PointsMaterial
				haloMat.color.copy(tmpColor)
				haloMat.opacity = (mode === 'dark' ? 0.5 : 0.7) * (1 - recede * 0.75)
			}
		}

		// ---- fracture: explode mid-NOW (beat index 2), reassemble before APPROACH
		const bp = animate ? beatPos.value : 0
		const fracture = range(bp, 2.15, 2.45) * (1 - range(bp, 2.55, 2.85))
		if (frags.current) {
			frags.current.children.forEach((child, i) => {
				const dir = FRAGMENT_DIRS[i]
				const dist = 0.2 + fracture * 2.4
				child.position.set(dir[0] * dist, dir[1] * dist, dir[2] * dist)
				child.rotation.x = t * (0.4 + i * 0.07) + i
				child.rotation.y = t * 0.3 + i * 2
				const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
				m.opacity = fracture
				m.color.copy(tmpColor)
				child.visible = fracture > 0.01
			})
		}
		if (core.current) {
			const squeeze = 1 - fracture * 0.18
			core.current.scale.setScalar(squeeze)
			wire.current?.scale.setScalar(squeeze * 1.02)
		}

		if (halo.current) halo.current.rotation.y = -t * 0.03
	})

	return (
		<group ref={group}>
			{/* translucent faceted core — glass, not a solid ball */}
			<mesh ref={core} geometry={geometry}>
				<meshStandardMaterial
					flatShading
					transparent
					opacity={0.16}
					roughness={0.5}
					metalness={0}
					depthWrite={false}
				/>
			</mesh>
			{/* bright edge wireframe — the crystal's structure */}
			<mesh ref={wire} geometry={geometry} scale={1.001}>
				<meshBasicMaterial wireframe transparent opacity={mode === 'dark' ? 0.55 : 0.9} depthWrite={false} />
			</mesh>
			<group ref={frags}>
				{FRAGMENT_DIRS.map((_, i) => (
					<mesh key={i} visible={false}>
						<tetrahedronGeometry args={[0.14 + (i % 3) * 0.04, 0]} />
						<meshStandardMaterial flatShading transparent opacity={0} roughness={0.4} />
					</mesh>
				))}
			</group>
			<points ref={halo} geometry={haloGeometry}>
				<pointsMaterial
					size={0.022}
					transparent
					opacity={mode === 'dark' ? 0.5 : 0.7}
					sizeAttenuation
					depthWrite={false}
				/>
			</points>
		</group>
	)
}
