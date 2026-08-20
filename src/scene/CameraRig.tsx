import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { beatFraction, beatLerp } from './useScrollProgress'

/**
 * Camera path — one keyframe per beat, sampled by beat position through a
 * CatmullRomCurve3. Tweak these two arrays to re-block the film.
 *
 * ── Why the keyframes are gentle now ──────────────────────────────────────
 * The camera used to aim at `x = -1.7` to shove the object into the right
 * third of a full-bleed canvas. That never translated the object — it rotated
 * the entire scene, so the field sat at a skewed off-axis angle that could not
 * line up with any DOM edge. The canvas now has its own framed column
 * (<StageFrame/>), so placement is CSS's job and the camera can simply look at
 * the field, dead centre.
 *
 * The moves are also much smaller than before: this is a ~460px panel, not a
 * full viewport, and a sweeping orbit inside a small frame reads as jitter.
 */
// Distance is set to frame the portrait field in scene/LatticeField.tsx
// (±1.32 wide, ±1.78 tall) inside a narrow, tall panel.
const CAM_KEYFRAMES: [number, number, number][] = [
	[0, 0.0, 6.7],
	[0.6, 0.4, 6.2],
	[-0.55, 0.3, 5.9],
	[0.4, -0.35, 6.1],
	[-0.5, 0.2, 5.7],
	[0, 0.0, 6.9],
]

// Centred. Small vertical drift only, so the field never leaves the frame.
// Every keyframe must be DISTINCT: a centripetal Catmull-Rom divides by the
// distance between consecutive points, so two identical keyframes produce NaN
// and the camera ends up looking at nothing.
const LOOK_KEYFRAMES: [number, number, number][] = [
	[0, 0.0, 0],
	[0, 0.1, 0],
	[0, 0.02, 0],
	[0, 0.08, 0],
	[0, 0.01, 0],
	[0, 0.05, 0],
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
			target.x += state.pointer.x * 0.12
			target.y += state.pointer.y * 0.09
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
