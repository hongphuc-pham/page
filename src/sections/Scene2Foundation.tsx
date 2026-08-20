import { Typography, type SxProps, type Theme } from '@mui/material'
import { useRef } from 'react'
import { FrameScrub } from '../components/FrameScrub'
import { foundation } from '../data/cv'
import { SCHEMA } from '../scene/storyFrames'
import { fonts, tokens } from '../theme'
import { Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 2 — PROOF
 * The origin story told the way it actually happened: a manual Excel workflow,
 * the platform that replaced it, and what changed. Three rows on a rail rather
 * than a paragraph — the shape of the argument should be visible before a word
 * is read, because every later beat repeats this same shape.
 *
 * Timeline: headline → the three rows, one at a time → award + degrees → out.
 */

/**
 * The two degree cards used to be <Stack><Box sx={…}>. That pair tipped the
 * whole program over TS2590 ("union type too complex") once another hoisted
 * SxProps landed in Scene4Approach — the threshold is program-wide, so the
 * error surfaces at the worst offender rather than at whatever pushed it over.
 * MUI v5's <Box> carries the entire system-props type on top of SxProps and is
 * that offender; Stack's responsive `direction` union is the runner-up.
 *
 * Layout is now plain elements with classes in theme.ts GLOBAL_CSS, and only
 * <Typography> (a far smaller type) remains — the same habit SceneShell.tsx
 * documents. Keep it when adding to this file.
 */
const EDU_TITLE_SX: SxProps<Theme> = { fontWeight: 650, mb: 0.25 }

const EDU_ORG_SX: SxProps<Theme> = {
	fontFamily: fonts.mono,
	fontSize: 11,
	letterSpacing: '0.1em',
	color: tokens.primary,
	mb: 1,
}

const EDU_DETAIL_SX: SxProps<Theme> = { color: tokens.text.secondary, lineHeight: 1.6 }

/** Row order is the argument; don't reorder without a reason. */
const ROWS = [
	{ key: 'before', data: foundation.before },
	{ key: 'after', data: foundation.after },
	{ key: 'result', data: foundation.result },
] as const

export function Scene2Foundation({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)

	useSceneTimeline(
		root,
		(tl, q) => {
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, stagger: 1.5, duration: 4 })
				// each row lands on its own — before, then after, then the result
				.fromTo(q('.ba-row'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, stagger: 2.4, duration: 3.5 }, '-=1')
				.fromTo(q('.detail'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 1.5, duration: 4 }, '-=1')
				.to(q('.scene-inner'), { autoAlpha: 0, y: -80, duration: 4 }, '+=3')
		},
		{ reduced, isMobile, length: 190, beat: 1 },
	)

	return (
		<SceneShell
			id="foundation"
			rootRef={root}
			// One continuous shot under three captions: the grid beat 1 froze on
			// holds, then its cells fly into table rows and the foreign keys draw
			// themselves — timed to land as BEFORE → AFTER → RESULT arrive above it.
			backdrop={<FrameScrub range={SCHEMA} beat={1} reduced={reduced} opacity={0.34} />}
		>
			<Kicker className="line">{foundation.kicker}</Kicker>
			<Headline className="line">{foundation.headline}</Headline>

			<div className="ba">
				{ROWS.map((r) => (
					<div key={r.key} className={`ba-row ba-row--${r.key}`}>
						<div className="ba-label">{r.data.label}</div>
						<div className="ba-text">{r.data.text}</div>
					</div>
				))}
			</div>

			<div className="line award-pill">
				<span aria-hidden>★</span>
				<span>{foundation.award}</span>
			</div>

			<div className="edu-grid">
				{foundation.education.map((e) => (
					<div key={e.title} className="detail edu-card">
						<Typography sx={EDU_TITLE_SX}>{e.title}</Typography>
						<Typography sx={EDU_ORG_SX}>{e.org}</Typography>
						<Typography variant="body2" sx={EDU_DETAIL_SX}>
							{e.detail}
						</Typography>
					</div>
				))}
			</div>
		</SceneShell>
	)
}
