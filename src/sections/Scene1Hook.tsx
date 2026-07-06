import { Box, Typography } from '@mui/material'
import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'
import { hook } from '../data/cv'
import { fonts, tokens } from '../theme'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 1 — HOOK · scroll 0.00–0.20
 * Content is visible at load (a quiet entrance tween), then scrubs OUT as
 * the story begins. The shard sits front and center behind the type.
 */
export function Scene1Hook({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)

	// One-time entrance on load (not scroll-driven — the page must not open blank).
	useLayoutEffect(() => {
		if (reduced || !root.current) return
		const ctx = gsap.context(() => {
			gsap.from('.line', {
				autoAlpha: 0,
				y: 42,
				duration: 1.1,
				stagger: 0.12,
				ease: 'power3.out',
				delay: 0.15,
			})
		}, root)
		return () => ctx.revert()
	}, [reduced])

	// Scrubbed exit while pinned.
	useSceneTimeline(
		root,
		(tl, q) => {
			tl.to(q('.scene-inner'), { autoAlpha: 0, y: -90, scale: 0.97, duration: 5 }, 3)
		},
		{ reduced, isMobile, length: 110 },
	)

	return (
		<SceneShell id="hook" rootRef={root}>
			<Box>
				<Kicker className="line">{hook.kicker}</Kicker>
				<Headline className="line">{hook.headline}</Headline>
				<Body className="line" maxWidth={520}>
					{hook.positioning}
				</Body>
				<Typography
					className="line"
					sx={{
						fontFamily: fonts.mono,
						fontSize: 12,
						letterSpacing: '0.14em',
						color: tokens.text.muted,
						textTransform: 'uppercase',
						mt: 1,
					}}
				>
					{hook.meta}
				</Typography>
				<Box
					className="line"
					aria-hidden
					sx={{
						mt: 7,
						width: '2px',
						height: 56,
						borderRadius: 2,
						background: `linear-gradient(180deg, ${tokens.primary}, transparent)`,
					}}
				/>
				<Typography
					className="line"
					sx={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.3em', color: tokens.text.muted, mt: 1.5 }}
				>
					SCROLL
				</Typography>
			</Box>
			{/* Body centering wrapper uses SceneShell; textAlign handled above */}
		</SceneShell>
	)
}
