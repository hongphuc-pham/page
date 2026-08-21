import { motion, useMotionTemplate, useReducedMotion, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'

/**
 * Makes its child gently follow the cursor while hovered ("magnetic" button).
 * No-op under prefers-reduced-motion.
 */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
	const ref = useRef<HTMLDivElement | null>(null)
	const reduced = useReducedMotion()
	const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 })
	const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 })
	// Motion's `x`/`y` shorthand is driven from requestAnimationFrame on the
	// main thread, so it drops frames exactly when the page is busiest — which
	// here is during scroll, with GSAP timelines running. A composed
	// translate3d string is handed to the compositor instead.
	const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`

	if (reduced) return <>{children}</>

	const onMove = (e: React.MouseEvent) => {
		const el = ref.current
		if (!el) return
		const rect = el.getBoundingClientRect()
		x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
		y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
	}
	const onLeave = () => {
		x.set(0)
		y.set(0)
	}

	return (
		<motion.div
			ref={ref}
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			style={{ transform, display: 'inline-flex' }}
		>
			{children}
		</motion.div>
	)
}
