import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { beatFraction, beatLerp } from './useScrollProgress'

/**
 * Camera path — one keyframe per beat, sampled by global scroll progress
 * through a CatmullRomCurve3. Tweak these two arrays to re-block the film:
 *
 *   index 0 → HOOK        (0.00–0.20)  front-on, object centered
 *   index 1 → FOUNDATION  (0.20–0.40)  orbit right, look past the shard
 *   index 2 → NOW         (0.40–0.60)  orbit left + closer (fracture beat)
 *   index 3 → APPROACH    (0.60–0.80)  crane up, calm overview
 *   index 4 → CONTACT     (0.80–1.00)  pull back to a quiet wide shot
 */
// The shard sits at world origin. We look at a point to its LEFT so the object
// renders in the RIGHT third of the screen, leaving the left clear for text.
// One keyframe per beat: hook, foundation, now, approach, experience, contact.
const CAM_KEYFRAMES: [number, number, number][] = [
	[0, 0.1, 6.6],
	[1.4, 0.9, 5.6],
	[-1.6, 0.6, 5.0],
	[0.6, 1.8, 6.0],
	[-1.2, 1.0, 5.4],
	[0, 0.0, 7.0],
]

// Look-at biased left (negative x) → object drifts right of screen-center.
const LOOK_KEYFRAMES: [number, number, number][] = [
	[-1.7, 0.05, 0],
	[-1.5, 0.15, 0],
	[-1.9, 0.0, 0],
	[-1.6, 0.25, 0],
	[-1.7, 0.1, 0],
	[-1.7, 0.0, 0],
]

/** Lighting temperature per beat — warm open/close, cooler mid-story. */
const WARM_INTENSITY = [1.1, 0.4, 0.35, 0.5, 0.7, 1.2]
const COOL_INTENSITY = [0.55, 1.1, 1.2, 1.0, 0.9, 0.55]

export function CameraRig({ animate, warmColor, coolColor }: { animate: boolean; warmColor: string; coolColor: string }) {
	const camera = useThree((s) => s.camera)
	const warmRef = useRef<THREE.PointLight>(null)
	const coolRef = useRef<THREE.PointLight>(null)
	const lookAt = useRef(new THREE.Vector3())

	const curve = useMemo(
		() => new THREE.CatmullRomCurve3(CAM_KEYFRAMES.map((k) => new THREE.Vector3(...k)), false, 'centripetal'),
		[],
	)
	const lookCurve = useMemo(
		() => new THREE.CatmullRomCurve3(LOOK_KEYFRAMES.map((k) => new THREE.Vector3(...k)), false, 'centripetal'),
		[],
	)

	useFrame((state) => {
		const p = animate ? beatFraction() : 0
		const target = curve.getPoint(p)
		// gentle pointer parallax on top of the spline position
		if (animate) {
			target.x += state.pointer.x * 0.25
			target.y += state.pointer.y * 0.18
		}
		camera.position.lerp(target, 0.07)
		lookAt.current.lerp(lookCurve.getPoint(p), 0.09)
		camera.lookAt(lookAt.current)

		if (warmRef.current) warmRef.current.intensity = beatLerp(WARM_INTENSITY, p) * 14
		if (coolRef.current) coolRef.current.intensity = beatLerp(COOL_INTENSITY, p) * 14
	})

	return (
		<>
			<ambientLight intensity={0.6} />
			{/* warm key light — beats 1 & 5 */}
			<pointLight ref={warmRef} position={[4, 3, 5]} color={warmColor} intensity={14} decay={2} />
			{/* cool rim light — beats 2–4 */}
			<pointLight ref={coolRef} position={[-5, -2, 4]} color={coolColor} intensity={7} decay={2} />
		</>
	)
}
