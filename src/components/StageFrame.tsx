import { useEffect, useRef, type ReactNode } from 'react'
import { beatPos, SCENE_COUNT } from '../scene/useScrollProgress'

/**
 * The framed right-hand column that holds the film.
 *
 * It exists so the canvas has an *edge*. Previously the canvas was
 * `position: fixed; inset: 0` while the content was a hard-bordered card —
 * two elements with nothing in common, joined only by a gradient. Here the
 * frame takes .scene-inner's border/radius/blur language and sits in the same
 * derived grid (see --content-w / --stage-w / --rail in theme.ts), so the page
 * reads as one instrument.
 *
 * The readout is written straight to the DOM from a rAF loop — no React state
 * on scroll, matching how the canvas itself consumes `beatPos`.
 */

/** One label per shot in scene/StageFilm.tsx — the story, not the geometry. */
const STATE_LABELS = ['MANUAL', 'STRUCTURED', 'REPLICATED', 'VERIFIED', 'SHIPPED', 'SETTLED']

export function StageFrame({ children }: { children: ReactNode }) {
	const stateRef = useRef<HTMLSpanElement>(null)
	const orderRef = useRef<HTMLSpanElement>(null)
	const barRef = useRef<HTMLElement>(null)

	useEffect(() => {
		let raf = 0
		let lastLabel = ''
		let lastPct = -1
		const loop = () => {
			const pos = Math.min(SCENE_COUNT - 1, Math.max(0, beatPos.value))
			const i = Math.min(STATE_LABELS.length - 1, Math.floor(pos))
			const frac = pos - Math.floor(pos)
			const pct = Math.round((pos / (SCENE_COUNT - 1)) * 100)

			// textContent only when it actually changed — this runs every frame
			if (STATE_LABELS[i] !== lastLabel) {
				lastLabel = STATE_LABELS[i]
				if (stateRef.current) stateRef.current.textContent = lastLabel
			}
			if (pct !== lastPct) {
				lastPct = pct
				if (orderRef.current) orderRef.current.textContent = `ORDER ${pct}%`
			}
			if (barRef.current) barRef.current.style.width = `${(frac * 100).toFixed(1)}%`

			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(raf)
	}, [])

	return (
		<div className="story-stage" aria-hidden>
			<div className="story-stage-glow" />
			{children}
			<div className="story-stage-bar">
				<i ref={barRef} />
			</div>
			<div className="story-stage-readout">
				<span ref={stateRef}>{STATE_LABELS[0]}</span>
				<span ref={orderRef}>ORDER 0%</span>
			</div>
		</div>
	)
}
