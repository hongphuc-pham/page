import { useAnimationFrame } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CELLS, CELLS_STILL, EMPTY, FRAME_H, FRAME_W, frameRect, RECORD, REPLICATE, SCHEMA, VERIFY, type FrameRange } from './storyFrames'
import { beatPos, SCENE_COUNT } from './useScrollProgress'
import { palettes } from '../theme'
import { useThemeMode } from '../utils/useThemeMode'

/**
 * The film in the stage.
 *
 * ── Why this replaced the 3D lattice ──────────────────────────────────────
 * `LatticeField` morphed 224 plates through SCATTER → GRID → LAYERS → LANES →
 * HELIX → SLAB. Those are adjectives, not events. It was the same mistake
 * STORY.md called out when it deleted `HeroObject` — "generic sci-fi that
 * illustrated nothing in the CV" — just better executed, and it competed with
 * the frame art that was actually telling the story.
 *
 * The stage is a FRAME. Frames hold films. So it holds one:
 *
 *   1 CELLS      a cursor fills a spreadsheet by hand, slows, freezes
 *   2 SCHEMA     those same cells fly into tables; foreign keys draw
 *   3 REPLICATE  the one schema shrinks and four more arrive — five projects
 *   4 VERIFY     a scan sweeps the set; each is ticked as it passes
 *   5 RECORD     the five collapse into dated rows on a ledger
 *   6 EMPTY      the grid again, cleared, one cursor blinking
 *
 * ONE SUBJECT throughout. The grid becomes the schema becomes the set becomes
 * the record. Nothing ever cuts to an unrelated object — that continuity is
 * the difference between a film and six clips, and it is what lets the last
 * shot pay off the first.
 *
 * ── What makes it read as video and not as a stepped diagram ─────────────
 * The frame sequence quantises the SUBJECT to N frames. The CAMERA does not:
 * it is computed from the fractional scroll position every frame and applied
 * at drawImage time. So the subject advances in steps while the camera pushes
 * in continuously — which is exactly what live-action footage looks like, and
 * what a frame-stepped diagram never does. It costs nothing: it is two numbers
 * in the destination rect.
 */

type Shot = {
	range: FrameRange
	/** Frame shown when motion is off. Defaults to the end of the range. */
	still?: number
	/**
	 * Camera push for this shot, as scale at the start and end of the beat.
	 * Every shot pushes IN — a film that pulls back reads as retreating from
	 * its subject, and this story never retreats. Kept small: past ~1.08 the
	 * crop starts eating the composition.
	 */
	push: [number, number]
	/** Vertical drift across the shot, in fractions of frame height. */
	drift: [number, number]
	/** Ambient loop instead of a scrub — see beat 6. */
	loop?: boolean
}

const SHOTS: Shot[] = [
	{ range: CELLS, still: CELLS_STILL, push: [1.0, 1.06], drift: [0, 0.012] },
	{ range: SCHEMA, push: [1.03, 1.0], drift: [0.01, -0.008] },
	{ range: REPLICATE, push: [1.0, 1.05], drift: [0, 0.01] },
	{ range: VERIFY, push: [1.04, 1.0], drift: [0.008, 0] },
	{ range: RECORD, push: [1.0, 1.04], drift: [0, 0.01] },
	// The last shot holds still. Order is the thing that stops moving.
	{ range: EMPTY, push: [1.0, 1.0], drift: [0, 0], loop: true },
]

const LOOP_MS = 2200

/** Same gate as VideoBackdrop: phones and metered connections get a still. */
function useFilmEnabled(reduced: boolean): boolean {
	const [enabled] = useState(() => {
		if (reduced) return false
		if (typeof window === 'undefined') return false
		if (window.matchMedia('(max-width: 767px)').matches) return false
		const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
		if (conn?.saveData) return false
		return true
	})
	return enabled
}

/** One decode per sheet, shared across shots. Beats 1 and 6 share a file. */
const sheetCache = new Map<string, Promise<HTMLImageElement>>()
const sheets = new Map<string, HTMLImageElement>()
function ensureSheet(url: string) {
	if (sheetCache.has(url)) return
	const p = new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image()
		img.decoding = 'async'
		img.onload = () => resolve(img)
		img.onerror = reject
		img.src = url
	})
	sheetCache.set(url, p)
	p.then((img) => sheets.set(url, img)).catch(() => {
		/* missing sheet → that shot simply never draws; the frame still holds */
	})
}

function smoothstep(t: number) {
	const c = Math.min(1, Math.max(0, t))
	return c * c * (3 - 2 * c)
}

export function StageFilm({ reduced }: { reduced: boolean }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const themeMode = useThemeMode()
	const enabled = useFilmEnabled(reduced)
	// Last thing drawn, so a resize or theme change can repaint without waiting
	// for the next scroll tick.
	const lastRef = useRef<{ shot: number; local: number }>({ shot: 0, local: 0 })

	const draw = (shotIndex: number, local: number) => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const shot = SHOTS[shotIndex]
		const sheet = sheets.get(shot.range.sheet.url)
		const { width: w, height: h } = canvas
		ctx.clearRect(0, 0, w, h)
		if (!sheet || !w || !h) return

		const count = shot.range.to - shot.range.from + 1
		let n: number
		if (!enabled) {
			n = shot.still ?? shot.range.to
		} else if (shot.loop) {
			n = shot.range.from + (Math.floor((performance.now() / LOOP_MS) * count) % count)
		} else {
			n = shot.range.from + Math.min(count - 1, Math.floor(local * count))
		}

		// Camera: continuous, from fractional scroll — NOT from the frame index.
		const e = enabled ? smoothstep(local) : 1
		const push = shot.push[0] + (shot.push[1] - shot.push[0]) * e
		const drift = shot.drift[0] + (shot.drift[1] - shot.drift[0]) * e

		const cover = Math.max(w / FRAME_W, h / FRAME_H) * push
		const dw = FRAME_W * cover
		const dh = FRAME_H * cover
		const dx = (w - dw) / 2
		const dy = (h - dh) / 2 + h * drift

		const { sx, sy, sw, sh } = frameRect(shot.range.sheet, n)
		ctx.globalCompositeOperation = 'source-over'
		ctx.drawImage(sheet, sx, sy, sw, sh, dx, dy, dw, dh)

		// Keep the frame's alpha, replace its colour — one sheet, both themes.
		const p = palettes[themeMode]
		const g = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh)
		g.addColorStop(0, p.primary)
		g.addColorStop(1, p.lime)
		ctx.globalCompositeOperation = 'source-in'
		ctx.fillStyle = g
		ctx.fillRect(0, 0, w, h)
		ctx.globalCompositeOperation = 'source-over'
	}

	// Size to the frame; repaint on resize and on theme change.
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2)
			const rect = canvas.getBoundingClientRect()
			if (!rect.width || !rect.height) return
			canvas.width = Math.round(rect.width * dpr)
			canvas.height = Math.round(rect.height * dpr)
			draw(lastRef.current.shot, lastRef.current.local)
		}
		resize()
		const ro = new ResizeObserver(resize)
		ro.observe(canvas)
		return () => ro.disconnect()
		// draw closes over themeMode; re-running on theme change is the point.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [themeMode])

	useAnimationFrame(() => {
		const pos = Math.min(SCENE_COUNT - 1, Math.max(0, beatPos.value))
		const shotIndex = Math.min(SHOTS.length - 1, Math.floor(pos))
		const local = Math.min(1, pos - shotIndex)

		// Load this shot, and the next one once we are a third into this one.
		// Not both up front: that would put every sheet in the first paint,
		// which is the whole reason they are separate files.
		ensureSheet(SHOTS[shotIndex].range.sheet.url)
		if (local > 0.33 && shotIndex + 1 < SHOTS.length) {
			ensureSheet(SHOTS[shotIndex + 1].range.sheet.url)
		}

		lastRef.current = { shot: shotIndex, local }
		draw(shotIndex, local)
	})

	return (
		<div className="stage-film-box">
			<canvas ref={canvasRef} aria-hidden className="stage-film" />
		</div>
	)
}
