import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ThemeMode } from '../theme'
import { attachDisplacement, createDisplaceUniforms } from './displace'
import { beatFraction, clamp01 } from './useScrollProgress'

/**
 * The story object: a field of plates that begins as an unaligned scatter and
 * locks into structure as you scroll. It is the site's argument, rendered —
 * "I delete the manual step" is disorder becoming order, so that is literally
 * what the right-hand stage shows.
 *
 * Replaces the old HeroObject shard + Orbits orrery, which illustrated nothing
 * in the CV.
 *
 * ── How it works ──────────────────────────────────────────────────────────
 * One InstancedMesh, `COUNT` plates. Six FORMATIONS, one per beat, each a
 * precomputed set of per-instance transforms. Every frame we read `beatPos`
 * (via `beatFraction`), pick the two formations either side of it, and lerp.
 * No React re-render on scroll — same contract the rest of the scene keeps.
 *
 * Two details that make it read as *snapping into place* rather than sliding:
 *   - the blend is smoothstepped, not linear
 *   - each plate carries a `delay` from its vertical position, so the change
 *     ripples bottom-to-top instead of the whole field moving as one sheet
 *
 * `DISORDER` per formation drives the noise wobble in ./displace — the scatter
 * breathes, the lattice is dead crisp. Order is the thing that stops moving.
 */

const COUNT_DESKTOP = 224
const COUNT_MOBILE = 112

/** Formation index === beat index. */
const FORMATION_COUNT = 6

/** Where a non-animating (reduced-motion) render parks: 1/5 → formation 1, GRID. */
const REDUCED_REST = 0.2

/** How un-settled each formation is: drives shader wobble + idle drift. */
const DISORDER = [1, 0.16, 0.1, 0.08, 0.05, 0]

/** Plate colour per beat, per theme. Warm at the ends, cool through the middle. */
const COLOR_STOPS: Record<ThemeMode, string[]> = {
	dark: ['#8E8A80', '#7CE7FF', '#C6FF3D', '#B482FF', '#7CE7FF', '#FFB02E'],
	light: ['#8A8E96', '#0091B5', '#4F8A12', '#7A4FC9', '#0091B5', '#C25E00'],
}

/** Deterministic PRNG — the scatter must be identical on every load and reload. */
function mulberry32(seed: number) {
	let a = seed >>> 0
	return () => {
		a = (a + 0x6d2b79f5) >>> 0
		let t = Math.imul(a ^ (a >>> 15), 1 | a)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

type Formation = {
	/** xyz per instance */
	pos: Float32Array
	/** euler xyz per instance */
	rot: Float32Array
	/** uniform scale per instance */
	scale: Float32Array
}

function emptyFormation(n: number): Formation {
	return { pos: new Float32Array(n * 3), rot: new Float32Array(n * 3), scale: new Float32Array(n) }
}

/**
 * Field extents. The stage panel is a tall portrait box, so the formations are
 * built taller than they are wide — a square field would leave dead air at the
 * top and bottom of the frame.
 */
const HALF_W = 1.32
const HALF_H = 1.78

/** 0 — SCATTER. The manual state: nothing aligned, nothing the same size. */
function buildScatter(n: number): Formation {
	const f = emptyFormation(n)
	const rnd = mulberry32(0x5eed)
	for (let i = 0; i < n; i++) {
		f.pos[i * 3] = (rnd() * 2 - 1) * (HALF_W + 0.55)
		f.pos[i * 3 + 1] = (rnd() * 2 - 1) * (HALF_H + 0.35)
		f.pos[i * 3 + 2] = (rnd() * 2 - 1) * 1.15
		f.rot[i * 3] = rnd() * Math.PI * 2
		f.rot[i * 3 + 1] = rnd() * Math.PI * 2
		f.rot[i * 3 + 2] = rnd() * Math.PI * 2
		f.scale[i] = 0.55 + rnd() * 0.95
	}
	return f
}

/** Grid dimensions that exactly consume `n` instances. */
function gridDims(n: number): [cols: number, rows: number] {
	// portrait: more rows than columns
	const cols = Math.max(1, Math.round(Math.sqrt(n * 0.62)))
	return [cols, Math.ceil(n / cols)]
}

/** 1 — GRID. The spreadsheet, made regular: rows and columns, one size. */
function buildGrid(n: number): Formation {
	const f = emptyFormation(n)
	const [cols, rows] = gridDims(n)
	const dx = (HALF_W * 2) / Math.max(1, cols - 1)
	const dy = (HALF_H * 2) / Math.max(1, rows - 1)
	for (let i = 0; i < n; i++) {
		const c = i % cols
		const r = Math.floor(i / cols)
		f.pos[i * 3] = -HALF_W + c * dx
		f.pos[i * 3 + 1] = -HALF_H + r * dy
		f.pos[i * 3 + 2] = 0
		f.scale[i] = 1
	}
	return f
}

/** 2 — LAYERS. The pattern repeating: the same structure, four platforms deep. */
function buildLayers(n: number): Formation {
	const f = emptyFormation(n)
	const layers = 4
	const per = Math.ceil(n / layers)
	const [cols, rows] = gridDims(per)
	const dx = (HALF_W * 1.7) / Math.max(1, cols - 1)
	const dy = (HALF_H * 1.7) / Math.max(1, rows - 1)
	for (let i = 0; i < n; i++) {
		const l = Math.floor(i / per)
		const k = i % per
		const c = k % cols
		const r = Math.floor(k / cols)
		f.pos[i * 3] = -HALF_W * 0.85 + c * dx
		f.pos[i * 3 + 1] = -HALF_H * 0.85 + r * dy
		f.pos[i * 3 + 2] = (l - (layers - 1) / 2) * 0.62
		// each plane tips a little so the stack reads as depth, not one sheet
		f.rot[i * 3] = 0.16
		f.rot[i * 3 + 1] = (l - (layers - 1) / 2) * 0.1
		f.scale[i] = 0.92
	}
	return f
}

/** 3 — LANES. The method: everything moving through the same four checks. */
function buildLanes(n: number): Formation {
	const f = emptyFormation(n)
	const lanes = 4
	const per = Math.ceil(n / lanes)
	const dy = (HALF_H * 2) / Math.max(1, per - 1)
	for (let i = 0; i < n; i++) {
		const l = Math.floor(i / per)
		const k = i % per
		const t = k / Math.max(1, per - 1)
		const laneX = (l - (lanes - 1) / 2) * (HALF_W * 0.72)
		f.pos[i * 3] = laneX + Math.sin(t * Math.PI) * 0.12
		f.pos[i * 3 + 1] = -HALF_H + k * dy
		f.pos[i * 3 + 2] = Math.sin(t * Math.PI * 2 + l) * 0.14
		f.rot[i * 3 + 2] = Math.PI / 4 // plates on-edge — reads as flow, not tiles
		f.scale[i] = 0.78
	}
	return f
}

/** 4 — HELIX. The record: one continuous run, stacked in order. */
function buildHelix(n: number): Formation {
	const f = emptyFormation(n)
	const turns = 4.5
	for (let i = 0; i < n; i++) {
		const t = i / Math.max(1, n - 1)
		const a = t * Math.PI * 2 * turns
		const r = 0.72 + Math.sin(t * Math.PI) * 0.36
		f.pos[i * 3] = Math.cos(a) * r
		f.pos[i * 3 + 1] = -HALF_H + t * HALF_H * 2
		f.pos[i * 3 + 2] = Math.sin(a) * r
		f.rot[i * 3 + 1] = -a
		f.scale[i] = 0.8
	}
	return f
}

/** 5 — SLAB. Settled. Tighter than the grid, with a slow depth ripple. */
function buildSlab(n: number): Formation {
	const f = emptyFormation(n)
	const [cols, rows] = gridDims(n)
	const dx = (HALF_W * 1.55) / Math.max(1, cols - 1)
	const dy = (HALF_H * 1.55) / Math.max(1, rows - 1)
	for (let i = 0; i < n; i++) {
		const c = i % cols
		const r = Math.floor(i / cols)
		f.pos[i * 3] = -HALF_W * 0.775 + c * dx
		f.pos[i * 3 + 1] = -HALF_H * 0.775 + r * dy
		f.pos[i * 3 + 2] = Math.sin(c * 0.55) * Math.cos(r * 0.4) * 0.16
		f.scale[i] = 0.96
	}
	return f
}

function buildFormations(n: number): Formation[] {
	return [buildScatter(n), buildGrid(n), buildLayers(n), buildLanes(n), buildHelix(n), buildSlab(n)]
}

/** Bottom-to-top ripple offsets, so a formation change lands as a wave. */
function buildDelays(n: number, grid: Formation): Float32Array {
	const d = new Float32Array(n)
	for (let i = 0; i < n; i++) {
		// normalise the grid's y into 0→1; the scatter has no meaningful order
		d[i] = clamp01((grid.pos[i * 3 + 1] + HALF_H) / (HALF_H * 2))
	}
	return d
}

const RIPPLE = 0.4 // fraction of the blend spent staggering
function smoothstep(x: number): number {
	return x * x * (3 - 2 * x)
}

export function LatticeField({
	mode,
	animate,
	isMobile,
}: {
	mode: ThemeMode
	animate: boolean
	isMobile: boolean
}) {
	const mesh = useRef<THREE.InstancedMesh>(null)
	const group = useRef<THREE.Group>(null)

	const count = isMobile ? COUNT_MOBILE : COUNT_DESKTOP
	const formations = useMemo(() => buildFormations(count), [count])
	const delays = useMemo(() => buildDelays(count, formations[1]), [count, formations])

	const stops = COLOR_STOPS[mode]
	const colors = useMemo(() => stops.map((c) => new THREE.Color(c)), [stops])

	const dummy = useMemo(() => new THREE.Object3D(), [])
	const uniforms = useMemo(() => createDisplaceUniforms(), [])

	const geometry = useMemo(() => new THREE.BoxGeometry(0.15, 0.15, 0.022), [])
	const material = useMemo(() => {
		const m = new THREE.MeshStandardMaterial({
			flatShading: true,
			roughness: 0.34,
			metalness: 0.16,
			transparent: true,
			opacity: 0.94,
		})
		attachDisplacement(m, uniforms)
		return m
	}, [uniforms])

	useLayoutEffect(() => {
		return () => {
			geometry.dispose()
			material.dispose()
		}
	}, [geometry, material])

	// Static per-instance brightness variation. Set once — recolouring 224
	// instances every frame is per-frame work for an effect nobody can see; the
	// beat colour is driven through the shared material instead.
	useLayoutEffect(() => {
		const m = mesh.current
		if (!m) return
		const rnd = mulberry32(0xc0ffee)
		const c = new THREE.Color()
		for (let i = 0; i < count; i++) {
			const v = 0.72 + rnd() * 0.55
			c.setRGB(v, v, v)
			m.setColorAt(i, c)
		}
		if (m.instanceColor) m.instanceColor.needsUpdate = true
	}, [count])

	useFrame((state, delta) => {
		const m = mesh.current
		if (!m) return

		// Reduced motion renders one frame and stops (frameloop="demand"), so the
		// resting image matters: park it on GRID rather than SCATTER. A permanently
		// disordered field would be the wrong last word for a page arguing the
		// opposite.
		const p = animate ? beatFraction() : REDUCED_REST
		const s = p * (FORMATION_COUNT - 1)
		const i = Math.min(FORMATION_COUNT - 2, Math.max(0, Math.floor(s)))
		const blend = clamp01(s - i)
		const A = formations[i]
		const B = formations[i + 1]

		const time = state.clock.elapsedTime
		const disorder = DISORDER[i] + (DISORDER[i + 1] - DISORDER[i]) * blend

		uniforms.uTime.value = time
		uniforms.uAmp.value = disorder * 0.5

		for (let n = 0; n < count; n++) {
			// per-plate ripple: late plates start after early ones have arrived
			const t = smoothstep(clamp01((blend - delays[n] * RIPPLE) / (1 - RIPPLE)))
			const n3 = n * 3

			// idle drift — only the disordered state is restless
			const drift = disorder * 0.09
			const wobble = drift * Math.sin(time * 0.7 + n * 1.7)

			dummy.position.set(
				A.pos[n3] + (B.pos[n3] - A.pos[n3]) * t + wobble,
				A.pos[n3 + 1] + (B.pos[n3 + 1] - A.pos[n3 + 1]) * t + drift * Math.cos(time * 0.6 + n),
				A.pos[n3 + 2] + (B.pos[n3 + 2] - A.pos[n3 + 2]) * t,
			)
			dummy.rotation.set(
				A.rot[n3] + (B.rot[n3] - A.rot[n3]) * t,
				A.rot[n3 + 1] + (B.rot[n3 + 1] - A.rot[n3 + 1]) * t + drift * 2,
				A.rot[n3 + 2] + (B.rot[n3 + 2] - A.rot[n3 + 2]) * t,
			)
			const sc = A.scale[n] + (B.scale[n] - A.scale[n]) * t
			dummy.scale.setScalar(sc)
			dummy.updateMatrix()
			m.setMatrixAt(n, dummy.matrix)
		}
		m.instanceMatrix.needsUpdate = true

		// beat colour on the shared material
		const ci = Math.min(colors.length - 2, Math.max(0, Math.floor(s)))
		material.color.copy(colors[ci]).lerp(colors[ci + 1], clamp01(s - ci))
		material.emissive.copy(material.color).multiplyScalar(disorder < 0.2 ? 0.18 : 0.06)

		// the whole field breathes very slightly; keeps it from reading as a poster
		if (group.current && animate) {
			group.current.rotation.y += (Math.sin(time * 0.11) * 0.13 - group.current.rotation.y) * delta * 1.4
			group.current.rotation.x += (Math.sin(time * 0.08) * 0.05 - group.current.rotation.x) * delta * 1.4
		}
	})

	return (
		<group ref={group}>
			<instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />
		</group>
	)
}
