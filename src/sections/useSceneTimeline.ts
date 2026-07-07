import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'
import { beatPos } from '../scene/useScrollProgress'

gsap.registerPlugin(ScrollTrigger) // idempotent — also registered in lib/lenis

type SelectorFn = ReturnType<typeof gsap.utils.selector>

/**
 * Shared plumbing for the pinned beats.
 *
 * Pins the section and hands you a scrubbed timeline. `length` = pin duration
 * as % of viewport height (mobile gets 60% of it). Everything animates with
 * ease 'none' — position in the timeline IS scroll position.
 *
 * `beat` (0-based scene index) is written to the shared beatPos store as
 * `beat + localProgress` so the 3D scene tracks the on-screen beat regardless
 * of unequal pin lengths.
 *
 * Under prefers-reduced-motion the timeline is never created, nothing is
 * hidden, and the page reads top-to-bottom as a plain document.
 */
export function useSceneTimeline(
	root: RefObject<HTMLElement>,
	build: (tl: gsap.core.Timeline, q: SelectorFn) => void,
	opts: { reduced: boolean; isMobile: boolean; length?: number; beat?: number; pin?: boolean },
) {
	const { reduced, isMobile, length = 140, beat = 0, pin = true } = opts
	useLayoutEffect(() => {
		if (reduced || !root.current) return
		const ctx = gsap.context(() => {
			const q = gsap.utils.selector(root.current)
			if (pin) {
				// Pinned scene: holds fixed while its timeline scrubs with scroll.
				const tl = gsap.timeline({
					defaults: { ease: 'none' },
					scrollTrigger: {
						trigger: root.current,
						start: 'top top',
						end: `+=${isMobile ? Math.round(length * 0.6) : length}%`,
						scrub: true,
						pin: true,
						anticipatePin: 1,
						onUpdate: (self) => {
							beatPos.value = beat + self.progress
						},
					},
				})
				build(tl, q)
				// Trailing "breath": the scene's exit (last tween) now finishes ~14%
				// before the pin ends, so its content is fully cleared before the next
				// scene enters — no mid-transition blend, even on fast scroll / scrub
				// lag. Harmless for the final scene (no exit; just holds a bit longer).
				tl.to({}, { duration: Math.max(1.2, tl.duration() * 0.16) })
			} else {
				// Non-pinned interactive scene (content can grow): the reveal plays
				// once on enter, and a separate scrub trigger just tracks the beat.
				ScrollTrigger.create({
					trigger: root.current,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
					onUpdate: (self) => {
						beatPos.value = beat + self.progress
					},
				})
				const tl = gsap.timeline({
					defaults: { ease: 'power3.out' },
					scrollTrigger: { trigger: root.current, start: 'top 72%', toggleActions: 'play none none reverse' },
				})
				build(tl, q)
			}
		}, root)
		return () => ctx.revert()
		// build is intentionally excluded — it's an inline closure, stable per scene.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reduced, isMobile, length, beat, pin])
}
