import { Typography, type SxProps, type Theme } from '@mui/material'
import gsap from 'gsap'
import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { FrameScrub } from '../components/FrameScrub'
import { hook } from '../data/cv'
import { CELLS, CELLS_STILL } from '../scene/storyFrames'
import { fonts, tokens } from '../theme'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 1 — INTRO
 * The thesis: "I delete the manual step." Visible at load (a quiet entrance
 * tween — the page must never open blank), then scrubs OUT as the story
 * begins. The field in the stage is at its most disordered here; it only
 * starts organising once beat 2 gives it a reason to.
 */

/* Hoisted so each is checked once against a known annotation. Plain `style`
   for the decorative rule: a bare MUI <Box> is enough to trip TS2590 on its
   own — same reason SceneShell's Corner and GrainOverlay use plain elements. */
const META_SX: SxProps<Theme> = {
	fontFamily: fonts.mono,
	fontSize: 12,
	letterSpacing: '0.14em',
	color: tokens.text.muted,
	textTransform: 'uppercase',
	mt: 1,
}

const SCROLL_SX: SxProps<Theme> = {
	fontFamily: fonts.mono,
	fontSize: 10,
	letterSpacing: '0.3em',
	color: tokens.text.muted,
	mt: 1.5,
}

const RULE_STYLE: CSSProperties = {
	marginTop: 56,
	width: 2,
	height: 56,
	borderRadius: 2,
	background: `linear-gradient(180deg, ${tokens.primary}, transparent)`,
}

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
		{ reduced, isMobile, length: 110, beat: 0 },
	)

	return (
		<SceneShell
			id="hook"
			rootRef={root}
			// The manual step, drawn: a cursor filling cells by hand, slowing,
			// freezing on an unfinished one. The frozen cell is the debt beat 6
			// comes back to pay — see Scene6Contact, which plays the same grid.
			backdrop={<FrameScrub range={CELLS} beat={0} still={CELLS_STILL} reduced={reduced} opacity={0.55} />}
		>
			<Kicker className="line">{hook.kicker}</Kicker>
			<Headline className="line">{hook.headline}</Headline>
			<Body className="line" maxWidth={520}>
				{hook.positioning}
			</Body>
			<Typography className="line" sx={META_SX}>
				{hook.meta}
			</Typography>

			{/* scroll cue: a hairline that fades downward, then the word */}
			<div aria-hidden className="line" style={RULE_STYLE} />
			<Typography className="line" sx={SCROLL_SX}>
				SCROLL
			</Typography>
		</SceneShell>
	)
}
