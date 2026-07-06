import { useEffect, useRef } from 'react'
import { scrollProgress } from '../scene/useScrollProgress'

/** Thin gradient "film scrubber" fixed at the top of the viewport. */
export function ScrollProgressBar() {
	const bar = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		let raf = 0
		const loop = () => {
			if (bar.current) bar.current.style.transform = `scaleX(${scrollProgress.value})`
			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(raf)
	}, [])

	return (
		<div
			ref={bar}
			aria-hidden
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				height: 3,
				zIndex: 30,
				transformOrigin: '0 50%',
				transform: 'scaleX(0)',
				background: 'var(--gradient)',
				pointerEvents: 'none',
			}}
		/>
	)
}
