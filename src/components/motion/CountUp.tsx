import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * Animates the first numeric segment of a stat string (e.g. "~10%" → counts 0→10,
 * "4–5" → counts 0→4 keeping the "–5" suffix). Strings without digits render as-is.
 */
export function CountUp({ value, duration = 1.4 }: { value: string; duration?: number }) {
	const match = value.match(/\d+(?:\.\d+)?/)
	const ref = useRef<HTMLSpanElement | null>(null)
	const inView = useInView(ref, { once: true, margin: '-40px 0px' })
	const reduced = useReducedMotion()
	const target = match ? parseFloat(match[0]) : 0
	const [display, setDisplay] = useState(reduced ? target : 0)

	useEffect(() => {
		if (!match || reduced || !inView) return
		const controls = animate(0, target, {
			duration,
			ease: [0.16, 1, 0.3, 1],
			onUpdate: (v) => setDisplay(Math.round(v)),
		})
		return () => controls.stop()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inView, reduced])

	if (!match) return <span ref={ref}>{value}</span>

	const prefix = value.slice(0, match.index)
	const suffix = value.slice((match.index ?? 0) + match[0].length)
	return (
		<span ref={ref}>
			{prefix}
			{reduced ? match[0] : display}
			{suffix}
		</span>
	)
}
