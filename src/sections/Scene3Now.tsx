import NorthEastIcon from '@mui/icons-material/NorthEast'
import { Box, Link, Stack, Typography } from '@mui/material'
import { useRef } from 'react'
import { InteractiveCard } from '../components/motion/InteractiveCard'
import { recentWork } from '../data/cv'
import { fonts, tokens } from '../theme'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 3 — NOW · scroll 0.40–0.60 (the longest pin)
 * CREST intro scrubs in, then the project cards deal onto a deck ONE BY ONE
 * as you keep scrolling — the "gallery" beat. The shard fractures behind it.
 * GSAP animates the .deck-card wrapper; InteractiveCard supplies hover
 * tilt/spotlight on the inner element so their transforms never fight.
 */
export function Scene3Now({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)
	const projects = recentWork.projects

	useSceneTimeline(
		root,
		(tl, q) => {
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, stagger: 1.2, duration: 3.5 })
			// deal each card into a readable vertical list, one after another
			q('.deck-card').forEach((card, i) => {
				tl.fromTo(
					card,
					{ x: i % 2 ? 90 : -90, autoAlpha: 0, rotation: i % 2 ? 4 : -4 },
					{ x: 0, autoAlpha: 1, rotation: 0, duration: 2.4 },
					'>-1.4',
				)
			})
			tl.to(q('.scene-inner'), { autoAlpha: 0, y: -80, duration: 3 }, '+=2.5')
		},
		{ reduced, isMobile, length: 300 },
	)

	return (
		<SceneShell id="now" rootRef={root} maxWidth={640}>
			<Kicker className="line">{recentWork.kicker}</Kicker>
			<Headline className="line">{recentWork.headline}</Headline>
			<Body className="line">{recentWork.body}</Body>
			<Body className="line" maxWidth={560}>
				{recentWork.aiNote}
			</Body>

			<Typography
				className="line"
				sx={{
					fontFamily: fonts.mono,
					fontSize: 12,
					letterSpacing: '0.2em',
					textTransform: 'uppercase',
					color: tokens.text.muted,
					mt: 3,
					mb: 2,
				}}
			>
				{recentWork.showcaseHeading}
			</Typography>

			{/* Cards deal into a readable vertical list, one by one */}
			<Box className="deck" sx={{ display: 'grid', gap: 1.25 }}>
				{projects.map((proj, i) => (
					<Box key={proj.name} className="deck-card" sx={{ willChange: 'transform' }}>
						<InteractiveCard tiltMax={3} sx={{ borderRadius: 2.5 }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'baseline',
									gap: 2,
									p: { xs: 2, md: 2.5 },
									border: `1px solid ${tokens.line}`,
									borderRadius: 2.5,
									bgcolor: tokens.card,
									backdropFilter: 'blur(14px)',
									boxShadow: '0 24px 60px -30px rgba(0,0,0,0.55)',
								}}
							>
								<Typography
									sx={{ fontFamily: fonts.mono, fontSize: 12, color: tokens.primary, letterSpacing: '0.14em' }}
								>
									{String(i + 1).padStart(2, '0')}
								</Typography>
								<Box sx={{ minWidth: 0, flex: 1 }}>
									<Stack direction="row" alignItems="baseline" spacing={1.25} flexWrap="wrap">
										<Typography sx={{ fontWeight: 700, fontSize: { xs: 17, md: 19 } }}>{proj.name}</Typography>
										{proj.link && (
											<Link
												href={proj.link}
												target="_blank"
												rel="noreferrer"
												sx={{
													fontFamily: fonts.mono,
													fontSize: 11,
													letterSpacing: '0.08em',
													color: tokens.primary,
													display: 'inline-flex',
													alignItems: 'center',
													gap: 0.25,
													'&:hover': { textDecoration: 'underline' },
												}}
											>
												visit <NorthEastIcon sx={{ fontSize: 12 }} />
											</Link>
										)}
									</Stack>
									<Typography variant="body2" sx={{ color: tokens.text.secondary, lineHeight: 1.55, mt: 0.5 }}>
										{proj.detail}
									</Typography>
								</Box>
							</Box>
						</InteractiveCard>
					</Box>
				))}
			</Box>
		</SceneShell>
	)
}
