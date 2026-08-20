import { useAnimationFrame, useMotionValue, useMotionValueEvent } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FRAME_H, FRAME_W, frameRect, type FrameRange } from '../scene/storyFrames'
import { beatPos } from '../scene/useScrollProgress'
import { palettes } from '../theme'
import { useThemeMode } from '../utils/useThemeMode'

/**
 * Scroll-scrubbed comic frames — the technique Framer's VideoFrame plugin uses,
 * built on the scroll clock this site already has.
 *
 *   scroll → GSAP ScrollTrigger.onUpdate → beatPos   (existing, unchanged)
 *          → useAnimationFrame  → MotionValue<number>   (frame index)
 *          → useMotionValueEvent → ctx.drawImage(frame) (only when it changes)
 *
 * ── Why this and not a <video> seeking on scroll ──────────────────────────
 * Setting `video.currentTime` per scroll tick is jerky on Safari and iOS and is
 * never frame-accurate — the browser seeks to the nearest keyframe. drawImage
 * always lands on the exact frame, and the decode cost is paid once at preload
 * instead of on every tick. `VideoBackdrop` keeps a real <video> because that
 * one is ambient and never seeks, which is the case <video> is good at. Two
 * jobs, two mechanisms.
 *
 * ── Why it does not own a ScrollTrigger ───────────────────────────────────
 * `beatPos` is the single scroll clock (see scene/useScrollProgress). A second
 * trigger here would drift against the pins during scrub lag and the art would
 * disagree with the text it sits behind. This component only ever READS.
 *
 * ── Tinting ──────────────────────────────────────────────────────────────
 * The sheet is white-on-transparent line art. After drawing a frame we fill
 * with `source-in`, which keeps the frame's alpha and replaces its colour — so
 * one sheet serves both themes and can never drift from the palette.
 */

type Props = {
	/** Which slice of the sheet to play. */
	range: FrameRange
	/**
	 * 'scrub'  — frame index follows scroll position within `beat`.
	 * 'loop'   — frame index follows wall-clock time, `loopMs` per cycle.
	 *            Used where a frozen frame would read as broken (beat 6).
	 */
	mode?: 'scrub' | 'loop'
	/** Which beat this scrubs against. Ignored when mode is 'loop'. */
	beat?: number
	/** Cycle length for 'loop' mode. */
	loopMs?: number
	/** Page-level reduced-motion flag, threaded down from Story. */
	reduced: boolean
	/**
	 * The single frame shown under reduced motion, on phones, and on metered
	 * connections — and the frame drawn before the sheet finishes decoding.
	 *
	 * Defaults to the END of the range, which is right for a sequence that
	 * resolves into something. It is WRONG for one that resolves into nothing:
	 * CELLS ends fully dissolved, so defaulting there renders a blank panel.
	 * Pass the frame that carries the beat's meaning — for CELLS that is the
	 * freeze, not the exit.
	 */
	still?: number
	/** Peak layer opacity. The art sits behind body copy, so keep it low. */
	opacity?: number
	/**
	 * 'cover' fills the panel and crops — right for the grid, which is a
	 * repeating pattern that should read as continuing past the frame edge.
	 * 'contain' letterboxes; only correct if a frame has a subject that must
	 * stay whole.
	 */
	fit?: 'cover' | 'contain'
	style?: CSSProperties
}

/**
 * Same gate as VideoBackdrop: phones and metered connections get the still,
 * and the still is deliberately the SAME image, so the fallback is a calmer
 * version of the design rather than a different design.
 */
function useScrubEnabled(reduced: boolean): boolean {
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

/**
 * One decode per sheet, shared by every FrameScrub using it — beats 1 and 6
 * point at the same file, so beat 6 costs no extra bytes and no extra decode.
 * Keyed by URL rather than a single module-level promise, so a second sheet
 * (beat 2's) does not get handed beat 1's image.
 */
const sheetCache = new Map<string, Promise<HTMLImageElement>>()
function loadSheet(url: string): Promise<HTMLImageElement> {
	let p = sheetCache.get(url)
	if (!p) {
		p = new Promise((resolve, reject) => {
			const img = new Image()
			img.decoding = 'async'
			img.onload = () => resolve(img)
			img.onerror = reject
			img.src = url
		})
		sheetCache.set(url, p)
	}
	return p
}

export function FrameScrub({
	range,
	mode = 'scrub',
	beat = 0,
	loopMs = 1800,
	reduced,
	still,
	opacity = 0.5,
	fit = 'cover',
	style,
}: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const sheetRef = useRef<HTMLImageElement | null>(null)
	const themeMode = useThemeMode()
	const enabled = useScrubEnabled(reduced)
	const count = range.to - range.from + 1

	const stillFrame = still ?? range.to
	const frameIndex = useMotionValue(enabled ? range.from : stillFrame)

	/** Draw one absolute sheet frame, fitted and tinted. */
	const draw = (n: number) => {
		const canvas = canvasRef.current
		const sheet = sheetRef.current
		if (!canvas || !sheet) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const { width: w, height: h } = canvas
		ctx.clearRect(0, 0, w, h)

		const scale =
			fit === 'cover' ? Math.max(w / FRAME_W, h / FRAME_H) : Math.min(w / FRAME_W, h / FRAME_H)
		const dw = FRAME_W * scale
		const dh = FRAME_H * scale
		const dx = (w - dw) / 2
		const dy = (h - dh) / 2

		const { sx, sy, sw, sh } = frameRect(range.sheet, n)
		ctx.globalCompositeOperation = 'source-over'
		ctx.drawImage(sheet, sx, sy, sw, sh, dx, dy, dw, dh)

		// Keep the frame's alpha, replace its colour. The gradient runs
		// primary → lime, the same journey the lighting makes across the story.
		const p = palettes[themeMode]
		const g = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh)
		g.addColorStop(0, p.primary)
		g.addColorStop(1, p.lime)
		ctx.globalCompositeOperation = 'source-in'
		ctx.fillStyle = g
		ctx.fillRect(0, 0, w, h)
		ctx.globalCompositeOperation = 'source-over'
	}

	// Redraw whenever the value changes — MotionValue already de-dupes, and the
	// index is an integer, so this fires at most once per frame boundary rather
	// than once per scroll event.
	useMotionValueEvent(frameIndex, 'change', (n) => draw(n))

	// Preload, size to the box, and redraw on resize or theme change.
	useEffect(() => {
		let alive = true
		loadSheet(range.sheet.url)
			.then((img) => {
				if (!alive) return
				sheetRef.current = img
				draw(frameIndex.get())
			})
			.catch(() => {
				/* sheet missing → canvas simply never draws. Layout is unaffected. */
			})

		const canvas = canvasRef.current
		if (!canvas) return () => { alive = false }

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2)
			const rect = canvas.getBoundingClientRect()
			if (!rect.width || !rect.height) return
			canvas.width = Math.round(rect.width * dpr)
			canvas.height = Math.round(rect.height * dpr)
			draw(frameIndex.get())
		}
		resize()
		const ro = new ResizeObserver(resize)
		ro.observe(canvas)
		return () => {
			alive = false
			ro.disconnect()
		}
		// draw closes over themeMode; re-running on theme change is the point.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [themeMode, range.sheet.url])

	// The only moving part. Reads the shared clock; never writes it.
	useAnimationFrame((t) => {
		if (!enabled) return
		let n: number
		if (mode === 'loop') {
			n = range.from + (Math.floor((t / loopMs) * count) % count)
		} else {
			const local = Math.min(1, Math.max(0, beatPos.value - beat))
			n = range.from + Math.min(count - 1, Math.floor(local * count))
		}
		frameIndex.set(n)
	})

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			style={{
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: '100%',
				pointerEvents: 'none',
				// A still competes with body copy harder than a moving frame does —
				// the eye stops resolving it as motion and starts reading it as
				// texture behind the words. Phones also crop in tighter, which
				// thickens every rule. Pull the static layer back.
				opacity: enabled ? opacity : opacity * 0.62,
				...style,
			}}
		/>
	)
}
