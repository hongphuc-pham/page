import { Box } from '@mui/material'
import { useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useState } from 'react'
import { AudioToggle } from '../components/AudioToggle'
import { ChapterDots } from '../components/ChapterDots'
import { ScrollProgressBar } from '../components/ScrollProgressBar'
import { StageFrame } from '../components/StageFrame'
import { StageFilm } from '../scene/StageFilm'
import { VideoBackdrop } from '../components/VideoBackdrop'
import { destroySmoothScroll, initSmoothScroll } from '../lib/lenis'
import { beatPos, scrollProgress, SCENE_COUNT } from '../scene/useScrollProgress'
import { Scene1Hook } from '../sections/Scene1Hook'
import { Scene2Foundation } from '../sections/Scene2Foundation'
import { Scene3Now } from '../sections/Scene3Now'
import { Scene4Approach } from '../sections/Scene4Approach'
import { Scene5Experience } from '../sections/Scene5Experience'
import { Scene6Contact } from '../sections/Scene6Contact'
import { useThemeMode } from '../utils/useThemeMode'

// The stage used to hold a lazy three.js canvas (scene/CanvasRoot + LatticeField).
// It now holds the film — see scene/StageFilm for why. The 3D files are still in
// the tree but nothing imports them, so three.js no longer ships.

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
				const p = max > 0 ? window.scrollY / max : 0
				scrollProgress.value = p
				beatPos.value = p * (SCENE_COUNT - 1)
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
			<VideoBackdrop mode={mode} reduced={reduced} />

			{/* The stage owns the film's box — see components/StageFrame and the
			    --stage-* variables in theme.ts. The frame draws with or without the
			    film, so a shot that has not loaded yet still leaves a deliberate
			    part of the layout rather than a hole. */}
			<StageFrame>
				<StageFilm reduced={reduced} />
			</StageFrame>

			<ScrollProgressBar />
			<ChapterDots />
			<AudioToggle />

			<Box component="main" sx={{ position: 'relative', zIndex: 1 }}>
				<Scene1Hook reduced={reduced} isMobile={isMobile} />
				<Scene2Foundation reduced={reduced} isMobile={isMobile} />
				<Scene3Now reduced={reduced} isMobile={isMobile} />
				<Scene4Approach reduced={reduced} isMobile={isMobile} />
				<Scene5Experience reduced={reduced} isMobile={isMobile} />
				<Scene6Contact reduced={reduced} isMobile={isMobile} />
			</Box>
		</>
	)
}
