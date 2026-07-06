/**
 * Global scroll progress (0 → 1 across the whole story) — the single source
 * of truth for the 3D scene. Written by one ScrollTrigger in Story.tsx and
 * read every frame inside the R3F loop, so the canvas never re-renders on
 * scroll.
 *
 * Scene ↔ scroll mapping (5 equal beats):
 *   Beat 1 HOOK        0.00 – 0.20
 *   Beat 2 FOUNDATION  0.20 – 0.40
 *   Beat 3 NOW         0.40 – 0.60
 *   Beat 4 APPROACH    0.60 – 0.80
 *   Beat 5 CONTACT     0.80 – 1.00
 */
export const scrollProgress = { value: 0 }

export const SCENE_COUNT = 5

export function clamp01(v: number): number {
	return Math.min(1, Math.max(0, v))
}

/** Remap global progress p from [a, b] → [0, 1], clamped. */
export function range(p: number, a: number, b: number): number {
	return clamp01((p - a) / (b - a))
}

/**
 * Interpolate across per-beat stops (stops.length === SCENE_COUNT).
 * e.g. stops [1, 0.3, 0.3, 0.4, 1] gives warm→cool→warm lighting.
 */
export function beatLerp(stops: number[], p: number): number {
	const s = clamp01(p) * (stops.length - 1)
	const i = Math.min(stops.length - 2, Math.floor(s))
	const f = s - i
	return stops[i] + (stops[i + 1] - stops[i]) * f
}
