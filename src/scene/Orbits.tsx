import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ThemeMode } from '../theme'
import { beatPos, SCENE_COUNT } from './useScrollProgress'

/**
 * An orrery of section orbits nested around the shard-globe. One tilted ring
 * per story beat, each carrying a holographic wireframe glyph representative of
 * that section. Scroll position (`beatPos`) focuses the matching orbit: it
 * brightens, swells, and lifts toward the viewer while the rest stay dim in the
 * background. The globe itself (HeroObject) is untouched and keeps turning.
 *
 * All reaction is a pure per-frame function of `beatPos` — no React re-renders
 * on scroll, matching the rest of the scene.
 */

type Shape = 'ico' | 'box' | 'octa' | 'tetra' | 'torus' | 'cone'

// per-beat: intro, foundation, now, approach, experience, contact
const RADII = [1.95, 2.25, 2.55, 2.9, 3.2, 3.55]
const TILTS: [number, number, number][] = [
	[1.4, 0.0, 0.1],
	[0.6, 0.4, -0.5],
	[1.1, -0.6, 0.6],
	[0.3, 0.9, 0.3],
	[1.5, 0.5, -0.7],
	[0.8, -0.3, 0.9],
]
const SHAPES: Shape[] = ['ico', 'box', 'octa', 'tetra', 'torus', 'cone']
// accent per beat — mirrors the shard's colour journey, per theme
const COLORS: Record<ThemeMode, string[]> = {
	dark: ['#7CE7FF', '#C6FF3D', '#7CE7FF', '#B482FF', '#FFB02E', '#7CE7FF'],
	light: ['#0091B5', '#4F8A12', '#0091B5', '#7A4FC9', '#C25E00', '#0091B5'],
}

/**
 * Live state of the featured hologram, read by the postprocessing stack to
 * pull depth-of-field focus onto it (and blur the background) only while it's
 * on screen. `present` 0→1, `world` = its world position.
 */
export const holoState = { present: 0, world: new THREE.Vector3() }

function nodeGeometry(shape: Shape, s = 1): THREE.BufferGeometry {
	switch (shape) {
		case 'ico':
			return new THREE.IcosahedronGeometry(0.2 * s, 0)
		case 'box':
			return new THREE.BoxGeometry(0.26 * s, 0.26 * s, 0.26 * s)
		case 'octa':
			return new THREE.OctahedronGeometry(0.24 * s, 0)
		case 'tetra':
			return new THREE.TetrahedronGeometry(0.26 * s, 0)
		case 'torus':
			return new THREE.TorusGeometry(0.17 * s, 0.05 * s, 8, 22)
		case 'cone':
			return new THREE.ConeGeometry(0.17 * s, 0.34 * s, 6)
	}
}

function smoothstep(x: number): number {
	const t = Math.min(1, Math.max(0, x))
	return t * t * (3 - 2 * t)
}

function Orbit({
	index,
	radius,
	tilt,
	color,
	shape,
	speed,
	phase,
	mobile,
}: {
	index: number
	radius: number
	tilt: [number, number, number]
	color: string
	shape: Shape
	speed: number
	phase: number
	mobile: boolean
}) {
	const spin = useRef<THREE.Group>(null)
	const ringMat = useRef<THREE.MeshBasicMaterial>(null)
	const pivot = useRef<THREE.Group>(null)
	const node = useRef<THREE.Group>(null)
	const nodeFill = useRef<THREE.MeshBasicMaterial>(null)
	const nodeWire = useRef<THREE.MeshBasicMaterial>(null)

	const col = useMemo(() => new THREE.Color(color), [color])
	const geo = useMemo(() => nodeGeometry(shape), [shape])

	useFrame((state) => {
		const t = state.clock.elapsedTime
		// A scene's content fills the whole [index, index+1] beat range and is
		// fully on screen near its CENTRE (index + 0.5). Peak the ring there so
		// the highlight correlates with the info board being shown — not with the
		// between-scene boundary.
		const f = smoothstep(1 - Math.abs(beatPos.value - (index + 0.5)) / 0.55)

		// the whole orrery is background too — recede it while the featured
		// hologram is up front so the glyph clearly reads as the hero.
		const dim = 1 - holoState.present * 0.55

		if (spin.current) {
			spin.current.scale.setScalar(1 + f * 0.16)
			spin.current.position.z = f * 0.55
			spin.current.rotation.z += 0.0016 + index * 0.0004 // slow precession
		}
		if (ringMat.current) {
			ringMat.current.opacity = (0.08 + f * 0.5) * dim
			ringMat.current.color.copy(col).multiplyScalar(0.5 + f * 0.9)
		}
		if (pivot.current) pivot.current.rotation.y = t * speed + phase
		if (node.current) {
			node.current.rotation.x = t * 0.6
			node.current.rotation.y = t * 0.85
			// ambient marker only — the FEATURED hologram (below) is the star,
			// so keep the ring-riding glyph subtle even when its orbit is active.
			node.current.scale.setScalar(0.5 + f * 0.3)
		}
		if (nodeFill.current) nodeFill.current.opacity = (0.04 + f * 0.14) * dim
		if (nodeWire.current) {
			nodeWire.current.opacity = (0.2 + f * 0.4) * dim
			nodeWire.current.color.copy(col).multiplyScalar(0.55 + f * 0.9)
		}
	})

	return (
		<group rotation={tilt}>
			<group ref={spin}>
				{/* the orbit ring — thin + lightly faceted (low tubular count) to echo
				    the shard's low-poly wireframe rather than a smooth neon hoop */}
				<mesh rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[radius, mobile ? 0.005 : 0.006, 4, mobile ? 22 : 30]} />
					<meshBasicMaterial ref={ringMat} color={color} transparent opacity={0.1} depthWrite={false} toneMapped={false} />
				</mesh>
				{/* holographic glyph riding the ring */}
				<group ref={pivot}>
					<group position={[radius, 0, 0]}>
						<group ref={node}>
							<mesh geometry={geo}>
								<meshBasicMaterial ref={nodeFill} color={color} transparent opacity={0.1} depthWrite={false} toneMapped={false} />
							</mesh>
							<mesh geometry={geo} scale={1.02}>
								<meshBasicMaterial
									ref={nodeWire}
									color={color}
									wireframe
									transparent
									opacity={0.4}
									depthWrite={false}
									toneMapped={false}
								/>
							</mesh>
						</group>
					</group>
				</group>
			</group>
		</group>
	)
}

/**
 * The featured hologram — the representative glyph of the ACTIVE section,
 * parked in the foreground and locked to the camera so it always reads clearly
 * (never lost behind the globe). It fades/shrinks out through a section change
 * and blooms back in on the new section's glyph. All six glyphs are pre-built
 * and only the active one is shown.
 */
function FeaturedHologram({ mode }: { mode: ThemeMode }) {
	const camera = useThree((s) => s.camera)
	const rig = useRef<THREE.Group>(null)
	const spin = useRef<THREE.Group>(null)
	const glyphs = useRef<(THREE.Group | null)[]>([])
	const fills = useRef<(THREE.MeshBasicMaterial | null)[]>([])
	const wires = useRef<(THREE.MeshBasicMaterial | null)[]>([])

	const colors = COLORS[mode]
	const cols = useMemo(() => colors.map((c) => new THREE.Color(c)), [colors])
	// built ~1.6× the ambient glyphs — this is the section's hero object
	const geos = useMemo(() => SHAPES.map((s) => nodeGeometry(s, 1.6)), [])

	useFrame((state) => {
		const t = state.clock.elapsedTime
		const bp = beatPos.value
		// The scene on screen is floor(bp); it owns the whole [idx, idx+1] range.
		const idx = Math.min(SCENE_COUNT - 1, Math.max(0, Math.floor(bp)))
		// present is a plateau over the scene: full across the middle (while the
		// info board is up), dipping to 0 only at the boundaries so the glyph swap
		// happens off-screen. This keeps hologram ↔ info board in lockstep.
		const local = bp - idx
		const present = Math.min(smoothstep(local / 0.16), smoothstep((1 - local) / 0.16))

		if (rig.current) {
			// lock to the camera, then float it centre-right in the foreground
			rig.current.position.copy(camera.position)
			rig.current.quaternion.copy(camera.quaternion)
			rig.current.translateX(0.7)
			rig.current.translateY(-0.05)
			rig.current.translateZ(-2.9)
			// publish for the depth-of-field focus (parents are identity, so the
			// local position is already the world position)
			holoState.world.copy(rig.current.position)
		}
		holoState.present = present
		if (spin.current) {
			spin.current.rotation.x = t * 0.3
			spin.current.rotation.y = t * 0.5
			spin.current.scale.setScalar(0.45 + present * 1.15)
		}
		for (let i = 0; i < SCENE_COUNT; i++) {
			const g = glyphs.current[i]
			if (g) g.visible = i === idx
			if (i !== idx) continue
			const fill = fills.current[i]
			const wire = wires.current[i]
			if (fill) fill.opacity = present * 0.16
			if (wire) {
				wire.opacity = present * 0.9
				wire.color.copy(cols[i]).multiplyScalar(0.7 + present * 0.7)
			}
		}
	})

	return (
		<group ref={rig}>
			<group ref={spin}>
				{SHAPES.map((_, i) => (
					<group
						key={i}
						ref={(el) => {
							glyphs.current[i] = el
						}}
						visible={false}
					>
						<mesh geometry={geos[i]}>
							<meshBasicMaterial
								ref={(el) => {
									fills.current[i] = el
								}}
								color={colors[i]}
								transparent
								opacity={0}
								depthWrite={false}
								toneMapped={false}
							/>
						</mesh>
						<mesh geometry={geos[i]} scale={1.03}>
							<meshBasicMaterial
								ref={(el) => {
									wires.current[i] = el
								}}
								color={colors[i]}
								wireframe
								transparent
								opacity={0}
								depthWrite={false}
								toneMapped={false}
							/>
						</mesh>
					</group>
				))}
			</group>
		</group>
	)
}

export function Orbits({ mode, isMobile }: { mode: ThemeMode; isMobile: boolean }) {
	const colors = COLORS[mode]
	return (
		<group>
			{RADII.map((radius, i) => (
				<Orbit
					key={i}
					index={i}
					radius={radius}
					tilt={TILTS[i]}
					color={colors[i]}
					shape={SHAPES[i]}
					speed={0.12 + i * 0.03}
					phase={i * 1.3}
					mobile={isMobile}
				/>
			))}
			<FeaturedHologram mode={mode} />
		</group>
	)
}
