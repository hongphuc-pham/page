import { Box, Stack, Typography } from '@mui/material'
import { useRef } from 'react'
import { foundation } from '../data/cv'
import { fonts, tokens } from '../theme'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 2 — FOUNDATION · scroll 0.20–0.40
 * ANZ NZ + the award, then (late in the pin) the two degrees.
 * Timeline: lines scrub in → detail cards scrub in → everything scrubs out.
 */
export function Scene2Foundation({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)

	useSceneTimeline(
		root,
		(tl, q) => {
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, stagger: 1.5, duration: 4 })
				.fromTo(q('.detail'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 1.5, duration: 4 }, '-=1')
				.to(q('.scene-inner'), { autoAlpha: 0, y: -80, duration: 4 }, '+=3')
		},
		{ reduced, isMobile, length: 160, beat: 1 },
	)

	return (
		<SceneShell id="foundation" rootRef={root}>
			<Kicker className="line">{foundation.kicker}</Kicker>
			<Headline className="line">{foundation.headline}</Headline>
			<Body className="line">{foundation.body}</Body>
			<Body className="line" maxWidth={560}>
				{foundation.proof}
			</Body>

			<Box
				className="line"
				sx={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 1,
					px: 1.75,
					py: 0.75,
					mt: 1,
					mb: 4,
					borderRadius: 999,
					border: `1px solid ${tokens.pillLime.border}`,
					bgcolor: tokens.pillLime.bg,
				}}
			>
				<Typography component="span" sx={{ fontSize: 14 }}>
					★
				</Typography>
				<Typography sx={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.08em', color: tokens.text.primary }}>
					{foundation.award}
				</Typography>
			</Box>

			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
				{foundation.education.map((e) => (
					<Box
						key={e.title}
						className="detail"
						sx={{
							flex: 1,
							p: 2.5,
							border: `1px solid ${tokens.line}`,
							borderRadius: 2.5,
							bgcolor: tokens.surface,
							backdropFilter: 'blur(10px)',
						}}
					>
						<Typography sx={{ fontWeight: 650, mb: 0.25 }}>{e.title}</Typography>
						<Typography
							sx={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.1em', color: tokens.primary, mb: 1 }}
						>
							{e.org}
						</Typography>
						<Typography variant="body2" sx={{ color: tokens.text.secondary, lineHeight: 1.6 }}>
							{e.detail}
						</Typography>
					</Box>
				))}
			</Stack>
		</SceneShell>
	)
}
