import NorthEastIcon from '@mui/icons-material/NorthEast'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Link, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import type { Project, Role } from '../../data/cv'
import { fonts, tokens } from '../../theme'

/**
 * A CV role card that expands in place to reveal the full content (bullets +
 * project quick-shots). Height animates smoothly via framer-motion `layout`;
 * honors prefers-reduced-motion (instant, no layout animation).
 */
export function ExpandableRoleCard({ role }: { role: Role }) {
	const reduced = useReducedMotion()
	const [expanded, setExpanded] = useState(false)

	const toggle = () => setExpanded((e) => !e)

	return (
		<Box sx={{ position: 'relative' }}>
			<Box
				component={motion.div}
				layout={!reduced}
				onClick={toggle}
				sx={{
					position: 'relative',
					zIndex: 1,
					cursor: 'pointer',
					p: { xs: 2.25, md: 2.75 },
					border: `1px solid ${expanded ? tokens.primaryBorder : tokens.line}`,
					borderRadius: 2.5,
					bgcolor: tokens.surface,
					backdropFilter: 'blur(12px)',
					transition: 'border-color 200ms ease',
					'&:hover': { borderColor: tokens.primaryBorder },
				}}
			>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					justifyContent="space-between"
					alignItems={{ xs: 'flex-start', sm: 'baseline' }}
					spacing={0.5}
					sx={{ mb: 1 }}
				>
					<Box>
						<Typography sx={{ fontWeight: 700, fontSize: { xs: 17, md: 19 } }}>{role.title}</Typography>
						<Typography sx={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.06em', color: tokens.primary }}>
							{role.org}
						</Typography>
					</Box>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Box sx={{ textAlign: { sm: 'right' } }}>
							<Typography
								sx={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.1em', color: tokens.text.muted, textTransform: 'uppercase' }}
							>
								{role.range}
							</Typography>
							<Typography sx={{ fontFamily: fonts.mono, fontSize: 11, color: tokens.text.muted }}>{role.location}</Typography>
						</Box>
						<IconButton
							size="small"
							aria-label={expanded ? 'Collapse role' : 'Expand role'}
							sx={{ color: expanded ? tokens.primary : tokens.text.muted }}
						>
							{expanded ? <CloseIcon sx={{ fontSize: 18 }} /> : <UnfoldMoreIcon sx={{ fontSize: 18 }} />}
						</IconButton>
					</Stack>
				</Stack>

				{!expanded && (
					<Typography variant="body2" sx={{ color: tokens.text.secondary, lineHeight: 1.6 }}>
						{role.blurb}
					</Typography>
				)}

				<AnimatePresence initial={false}>
					{expanded && (
						<Box
							component={motion.div}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.1 } }}
							exit={{ opacity: 0, transition: { duration: 0.15 } }}
							sx={{ mt: 0.5 }}
						>
							<Stack component="ul" spacing={0.75} sx={{ m: 0, mb: role.projects ? 2 : 0, pl: 0, listStyle: 'none' }}>
								{role.points.map((pt) => (
									<Stack key={pt} component="li" direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
										<Box sx={{ flexShrink: 0, mt: '0.55em', width: 5, height: 5, borderRadius: '50%', bgcolor: tokens.primary }} />
										<Typography variant="body2" sx={{ color: tokens.text.secondary, lineHeight: 1.6 }}>
											{pt}
										</Typography>
									</Stack>
								))}
							</Stack>

							{role.projects && role.projects.length > 0 && (
								<>
									<Typography
										sx={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: tokens.text.muted, mb: 1 }}
									>
										Projects
									</Typography>
									<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25 }}>
										{role.projects.map((p) => (
											<MiniProject key={p.name} project={p} />
										))}
									</Box>
								</>
							)}

							{role.award && (
								<Box
									sx={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 1,
										mt: 2,
										px: 1.5,
										py: 0.6,
										borderRadius: 999,
										border: `1px solid ${tokens.pillLime.border}`,
										bgcolor: tokens.pillLime.bg,
									}}
								>
									<Typography component="span" sx={{ fontSize: 13 }}>
										★
									</Typography>
									<Typography sx={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.06em', color: tokens.text.primary }}>
										{role.award}
									</Typography>
								</Box>
							)}
						</Box>
					)}
				</AnimatePresence>
			</Box>
		</Box>
	)
}

/** Compact project "quick-shot" — thumbnail + name; whole tile opens the link. */
function MiniProject({ project }: { project: Project }) {
	const href = project.links[0]?.url
	const inner = (
		<Box
			sx={{
				border: `1px solid ${tokens.line}`,
				borderRadius: 2,
				overflow: 'hidden',
				bgcolor: tokens.card,
				height: '100%',
				transition: 'border-color 180ms ease, transform 180ms ease',
				...(href && { '&:hover': { borderColor: `${project.accent}88`, transform: 'translateY(-2px)' } }),
			}}
		>
			<Box sx={{ position: 'relative', height: 84, background: project.gradient, overflow: 'hidden' }}>
				{project.image ? (
					<Box
						component="img"
						src={project.image}
						alt={`${project.name} preview`}
						loading="lazy"
						sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
					/>
				) : (
					<Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
						<Typography sx={{ fontFamily: fonts.display, fontSize: 30, fontWeight: 600, color: 'rgba(255,255,255,0.22)' }}>
							{project.initials}
						</Typography>
					</Box>
				)}
			</Box>
			<Box sx={{ px: 1.25, py: 1 }}>
				<Stack direction="row" alignItems="center" spacing={0.5}>
					<Typography sx={{ fontWeight: 650, fontSize: 13 }}>{project.name}</Typography>
					{href && <NorthEastIcon sx={{ fontSize: 12, color: project.accent }} />}
				</Stack>
				<Typography
					sx={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.06em', color: tokens.text.muted, mt: 0.25 }}
				>
					{project.status}
				</Typography>
			</Box>
		</Box>
	)
	if (!href) return inner
	return (
		<Link
			href={href}
			target="_blank"
			rel="noreferrer"
			onClick={(e) => e.stopPropagation()}
			sx={{ display: 'block', height: '100%', textDecoration: 'none' }}
		>
			{inner}
		</Link>
	)
}
