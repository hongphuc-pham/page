import { Box } from '@mui/material'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lazy, Suspense, useLayoutEffect, useState } from 'react'
import { AudioToggle } from '../components/AudioToggle'
import { ChapterDots } from '../components/ChapterDots'
import { ScrollProgressBar } from '../components/ScrollProgressBar'
import { destroySmoothScroll, initSmoothScroll } from '../lib/lenis'
import { scrollProgress } from '../scene/useScrollProgress'
import { Scene1Hook } from '../sections/Scene1Hook'
import { Scene2Foundation } from '../sections/Scene2Foundation'
import { Scene3Now } from '../sections/Scene3Now'
import { Scene4Approach } from '../sections/Scene4Approach'
import { Scene5Contact } from '../sections/Scene5Contact'
import { useThemeMode } from '../utils/useThemeMode'

// three.js + fiber live in their own lazy chunk — the DOM story is readable
// before (and without) WebGL.
const CanvasRoot = lazy(() => import('../scene/CanvasRoot'))

gsap.registerPlugin(ScrollTrigger)

export function Story() {
	const reduced = useReducedMotion() ?? false
	const mode = useThemeMode()
	const [isMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches)

	// Scroll plumbing. Runs AFTER the scenes' own effects (children first),
	// so every pin exists before the global tracker measures max scroll.
	useLayoutEffect(() => {
		if (reduced) {
			// Plain page + native scroll; still feed the progress store so the
			// top bar and chapter dots work.
			const onScroll = () => {
				const max = document.documentElement.scrollHeight - window.innerHeight
				scrollProgress.value = max > 0 ? window.scrollY / max : 0
			}
			onScroll()
			window.addEventListener('scroll', onScroll, { passive: true })
			return () => window.removeEventListener('scroll', onScroll)
		}

		initSmoothScroll()
		const tracker = ScrollTrigger.create({
			start: 0,
			end: () => ScrollTrigger.maxScroll(window),
			onUpdate: (self) => {
				scrollProgress.value = self.progress
			},
		})
		// Re-measure once webfonts/layout settle.
		const onLoad = () => ScrollTrigger.refresh()
		window.addEventListener('load', onLoad)
		return () => {
			window.removeEventListener('load', onLoad)
			tracker.kill()
			destroySmoothScroll()
		}
	}, [reduced])

	return (
		<>
			<Suspense
				fallback={
					<Box
						aria-hidden
						sx={{ position: 'fixed', inset: 0, zIndex: 0, background: 'var(--painter-bg)' }}
					/>
				}
			>
				<CanvasRoot mode={mode} animate={!reduced} isMobile={isMobile} />
			</Suspense>

			<ScrollProgressBar />
			<ChapterDots />
			<AudioToggle />

			<Box component="main" sx={{ position: 'relative', zIndex: 1 }}>
				<Scene1Hook reduced={reduced} isMobile={isMobile} />
				<Scene2Foundation reduced={reduced} isMobile={isMobile} />
				<Scene3Now reduced={reduced} isMobile={isMobile} />
				<Scene4Approach reduced={reduced} isMobile={isMobile} />
				<Scene5Contact reduced={reduced} isMobile={isMobile} />
			</Box>
		</>
	)
}
