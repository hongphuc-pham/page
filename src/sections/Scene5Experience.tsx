import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import { experience } from '../data/cv'
import { fonts, tokens } from '../theme'
import { ExpandableRoleCard } from './experience/ExpandableRoleCard'
import { Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 5 — EXPERIENCE · scroll 0.667–0.833
 * Two main roles (CREST + ANZ) as expandable cards that open in place. The ⋮
 * menu reveals the `more` roles — internships, research fellowship,
 * certifications & community.
 */
export function Scene5Experience({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)
	const [showMore, setShowMore] = useState(false)
	const prefersReduced = useReducedMotion()

	// Non-pinned: this scene is interactive (expandable cards + ⋮ menu) so its
	// content can grow and must scroll naturally rather than pin.
	useSceneTimeline(
		root,
		(tl, q) => {
			// durations are real seconds here (play-on-enter, not scrubbed)
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6 })
			tl.fromTo(q('.role'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.18, duration: 0.7 }, '-=0.3')
		},
		{ reduced, isMobile, beat: 4, pin: false },
	)

	return (
		<SceneShell id="experience" rootRef={root} maxWidth={660}>
			<Kicker className="line">{experience.kicker}</Kicker>
			<Stack className="line" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
				<Headline size="md">{experience.headline}</Headline>
				<Tooltip title={showMore ? 'Hide more' : 'More roles & background'} placement="left" arrow>
					<IconButton
						aria-label={showMore ? 'Hide more roles' : 'Show more roles'}
						aria-expanded={showMore}
						onClick={() => setShowMore((s) => !s)}
						sx={{
							flexShrink: 0,
							color: showMore ? tokens.primary : tokens.text.muted,
							border: `1px solid ${showMore ? tokens.primaryBorder : tokens.line}`,
							transition: 'color 180ms ease, border-color 180ms ease',
							'&:hover': { color: tokens.primary, borderColor: tokens.primaryBorder },
						}}
					>
						<MoreVertIcon />
					</IconButton>
				</Tooltip>
			</Stack>

			<Stack spacing={2} sx={{ mt: 3 }}>
				{experience.roles.map((role) => (
					<Box key={role.org} className="role">
						<ExpandableRoleCard role={role} />
					</Box>
				))}

				<AnimatePresence initial={false}>
					{showMore && (
						<Box
							component={motion.div}
							initial={prefersReduced ? undefined : { opacity: 0, height: 0 }}
							animate={prefersReduced ? undefined : { opacity: 1, height: 'auto', transition: { duration: 0.4 } }}
							exit={prefersReduced ? undefined : { opacity: 0, height: 0, transition: { duration: 0.25 } }}
							sx={{ overflow: 'hidden' }}
						>
							<Typography
								sx={{
									fontFamily: fonts.mono,
									fontSize: 10,
									letterSpacing: '0.18em',
									textTransform: 'uppercase',
									color: tokens.text.muted,
									mb: 1.5,
									mt: 0.5,
								}}
							>
								// more · internships · research · community
							</Typography>
							<Stack spacing={2}>
								{experience.more.map((role) => (
									<ExpandableRoleCard key={role.org + role.title} role={role} />
								))}
							</Stack>
						</Box>
					)}
				</AnimatePresence>
			</Stack>
		</SceneShell>
	)
}
