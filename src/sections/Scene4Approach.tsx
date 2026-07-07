import { Box, Chip, Stack, Typography } from '@mui/material'
import { useRef } from 'react'
import { approach } from '../data/cv'
import { fonts, tokens } from '../theme'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 4 — APPROACH · scroll 0.500–0.667
 * The stack is a CV-style skill matrix: category rows, each row's chips fly in
 * from the side and settle. The whole scene scrubs out as you roll to the
 * Experience beat.
 */
export function Scene4Approach({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)

	useSceneTimeline(
		root,
		(tl, q) => {
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, stagger: 1.2, duration: 3 })
			// each category row slides in and its chips pop
			q('.skill-row').forEach((row, i) => {
				tl.fromTo(row, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 2 }, i === 0 ? '>-0.5' : '<0.5')
			})
			tl.fromTo(q('.skill-chip'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, stagger: 0.15, duration: 2 }, '<')
			tl.to(q('.scene-inner'), { autoAlpha: 0, y: -70, duration: 3 }, '+=2.5')
		},
		{ reduced, isMobile, length: 220, beat: 3 },
	)

	return (
		<SceneShell id="approach" rootRef={root} maxWidth={640}>
			<Kicker className="line">{approach.kicker}</Kicker>
			<Headline className="line" size="md">
				{approach.headline}
			</Headline>
			<Body className="line">{approach.body}</Body>

			<Stack spacing={1.75} sx={{ mt: 3 }}>
				{approach.stackGroups.map((g) => (
					<Box
						key={g.label}
						className="skill-row"
						sx={{
							display: { xs: 'block', sm: 'grid' },
							gridTemplateColumns: '140px 1fr',
							gap: 2,
							alignItems: 'start',
						}}
					>
						<Typography
							sx={{
								fontFamily: fonts.mono,
								fontSize: 11,
								letterSpacing: '0.14em',
								textTransform: 'uppercase',
								color: tokens.text.muted,
								pt: { sm: 0.75 },
								mb: { xs: 0.75, sm: 0 },
							}}
						>
							{g.label}
						</Typography>
						<Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
							{g.items.map((it) => (
								<Chip key={it} label={it} size="small" className="skill-chip" sx={{ willChange: 'transform' }} />
							))}
						</Stack>
					</Box>
				))}
			</Stack>
		</SceneShell>
	)
}
