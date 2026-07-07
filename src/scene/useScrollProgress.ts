/**
 * Global scroll progress (0 → 1 across the whole story) — the single source
 * of truth for the 3D scene. Written by one ScrollTrigger in Story.tsx and
 * read every frame inside the R3F loop, so the canvas never re-renders on
 * scroll.
 *
 * Scene ↔ scroll mapping (6 equal beats):
 *   Beat 1 HOOK        0.000 – 0.167
 *   Beat 2 FOUNDATION  0.167 – 0.333
 *   Beat 3 NOW         0.333 – 0.500
 *   Beat 4 APPROACH    0.500 – 0.667
 *   Beat 5 EXPERIENCE  0.667 – 0.833
 *   Beat 6 CONTACT     0.833 – 1.000
 */
/** Linear scroll fraction 0→1 (drives the top progress bar only). */
export const scrollProgress = { value: 0 }

/**
 * Continuous BEAT position, 0 → SCENE_COUNT-1. Written by each scene's own
 * ScrollTrigger (beatIndex + that scene's local progress), so it stays in
 * sync with the scene actually on screen even though scenes have unequal pin
 * lengths. All 3D/visual state (shard color, camera, lighting, dots) reads
 * THIS, not the raw scroll fraction.
 */
export const beatPos = { value: 0 }

export const SCENE_COUNT = 6

/** beatPos as a 0→1 fraction across the whole story. */
export function beatFraction(): number {
	return clamp01(beatPos.value / (SCENE_COUNT - 1))
}

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
