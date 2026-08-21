'use client'

import { useEffect, useRef } from 'react'

/**
 * Ambient hero film.
 *
 * hls.js is imported dynamically so it never lands in the initial bundle —
 * it is only needed on browsers without native HLS, and only once the page
 * has decided to play at all.
 *
 * TODO(owner): this is still the stock stream from the original template.
 * Swap `src` for real footage, or drop this component and let the gradient
 * carry the hero.
 */
export function HeroVideo({ src }: { src: string }) {
	const ref = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const video = ref.current
		if (!video) return
		// Never autoplay motion at someone who asked for less of it.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		let hls: { destroy(): void } | null = null
		let cancelled = false

		/**
		 * hls.js FIRST, native second — order matters and getting it backwards
		 * silently breaks playback in Chrome.
		 *
		 * `canPlayType('application/vnd.apple.mpegurl')` returns "maybe" there,
		 * which is truthy, so a native-first check happily assigns the .m3u8 to
		 * video.src and then never decodes it: readyState stays 0, the element
		 * stays paused, and nothing errors. Only Safari genuinely plays HLS
		 * natively, and it is also the case where Hls.isSupported() is false —
		 * so testing hls.js first routes both correctly.
		 */
		void import('hls.js')
			.then(({ default: Hls }) => {
				if (cancelled) return
				if (Hls.isSupported()) {
					const instance = new Hls()
					hls = instance
					instance.loadSource(src)
					instance.attachMedia(video)
					instance.on(Hls.Events.MANIFEST_PARSED, () => void video.play().catch(() => {}))
				} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
					video.src = src
					video.addEventListener('loadedmetadata', () => void video.play().catch(() => {}))
				}
			})
			.catch(() => {
				/* No hls.js → no ambient film. The gradient hero still reads. */
			})

		return () => {
			cancelled = true
			hls?.destroy()
		}
	}, [src])

	return <video aria-hidden className="h-full w-full object-cover opacity-60" loop muted playsInline ref={ref} />
}
