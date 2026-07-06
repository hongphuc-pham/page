import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Registered once here; every module that needs ScrollTrigger imports it
// from gsap/ScrollTrigger after this file has been evaluated.
gsap.registerPlugin(ScrollTrigger)

export let lenis: Lenis | null = null

function tick(time: number) {
	lenis?.raf(time * 1000)
}

/** Create Lenis and drive it from GSAP's ticker (single rAF loop). */
export function initSmoothScroll(): Lenis {
	lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
	lenis.on('scroll', ScrollTrigger.update)
	gsap.ticker.add(tick)
	gsap.ticker.lagSmoothing(0)
	return lenis
}

export function destroySmoothScroll() {
	gsap.ticker.remove(tick)
	lenis?.destroy()
	lenis = null
}

/** Scroll to a section by element id — Lenis when active, native otherwise. */
export function scrollToSection(id: string) {
	const el = document.getElementById(id)
	if (!el) return
	if (lenis) lenis.scrollTo(el)
	else el.scrollIntoView({ behavior: 'smooth' })
}
