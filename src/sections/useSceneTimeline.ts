import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger) // idempotent — also registered in lib/lenis

type SelectorFn = ReturnType<typeof gsap.utils.selector>

/**
 * Shared plumbing for the five pinned beats.
 *
 * Pins the section and hands you a scrubbed timeline. `length` = pin duration
 * as % of viewport height (mobile gets 60% of it). Everything animates with
 * ease 'none' — position in the timeline IS scroll position.
 *
 * Under prefers-reduced-motion the timeline is never created, nothing is
 * hidden, and the page reads top-to-bottom as a plain document.
 */
export function useSceneTimeline(
	root: RefObject<HTMLElement>,
	build: (tl: gsap.core.Timeline, q: SelectorFn) => void,
	opts: { reduced: boolean; isMobile: boolean; length?: number },
) {
	const { reduced, isMobile, length = 140 } = opts
	useLayoutEffect(() => {
		if (reduced || !root.current) return
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: {
					trigger: root.current,
					start: 'top top',
					end: `+=${isMobile ? Math.round(length * 0.6) : length}%`,
					scrub: true,
					pin: true,
					anticipatePin: 1,
				},
			})
			build(tl, gsap.utils.selector(root.current))
		}, root)
		return () => ctx.revert()
		// build is intentionally excluded — it's an inline closure, stable per scene.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reduced, isMobile, length])
}
