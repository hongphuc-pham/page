'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

/**
 * Scroll-reveal wrapper.
 *
 * `once` is not optional in spirit: a card that re-animates every time it
 * scrolls back into view stops reading as an entrance and starts reading as a
 * glitch. It unobserves itself on first intersection.
 *
 * Under reduced motion it renders in its final state immediately — fewer and
 * gentler, not "no content".
 */
export function Reveal({
	children,
	as: Tag = 'div',
	delay = 0,
	className = '',
}: {
	children: ReactNode
	as?: ElementType
	delay?: number
	className?: string
}) {
	const ref = useRef<HTMLElement>(null)
	const [shown, setShown] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		if (
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			!('IntersectionObserver' in window)
		) {
			setShown(true)
			return
		}

		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return
				setShown(true)
				io.disconnect()
			},
			// Trigger a little before the element is fully in view, so the
			// motion finishes around the time it reaches comfortable reading
			// position rather than starting there.
			{ rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
		)
		io.observe(el)
		return () => io.disconnect()
	}, [])

	return (
		<Tag
			className={`reveal ${className}`}
			data-in={shown ? 'true' : 'false'}
			ref={ref}
			style={delay ? ({ '--d': `${delay}ms` } as React.CSSProperties) : undefined}
		>
			{children}
		</Tag>
	)
}
