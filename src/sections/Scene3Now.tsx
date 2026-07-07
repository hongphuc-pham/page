import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import { Box, Chip, IconButton, Link, Stack, Typography } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import { recentWork, type Project } from '../data/cv'
import { fonts, tokens } from '../theme'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 3 — NOW · scroll 0.333–0.500
 * The project work is an interactive CAROUSEL: the front card is shown in full
 * and arrows / dots browse all five at any time, decoupled from scroll — every
 * card is always reachable and readable. Non-pinned (like Experience) so the
 * content is naturally scrollable; a scrub trigger just tracks the beat.
 */

const CARD_H = 336 // px — fixed so the swap doesn't reflow the page
const THUMB_H = 176 // px — thumbnail height (leaves room for name + links)

export function Scene3Now({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)
	const projects = recentWork.projects
	const prefersReduced = useReducedMotion()
	const [active, setActive] = useState(0)
	const [dir, setDir] = useState(1)

	useSceneTimeline(
		root,
		(tl, q) => {
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6 })
			tl.fromTo(q('.deck'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.3')
		},
		{ reduced, isMobile, beat: 2, pin: false },
	)

	const goTo = (next: number) => {
		setDir(next > active || (active === projects.length - 1 && next === 0) ? 1 : -1)
		setActive((next + projects.length) % projects.length)
	}

	return (
		<SceneShell id="now" rootRef={root} maxWidth={560}>
			<Kicker className="line">{recentWork.kicker}</Kicker>
			<Headline className="line" size="md">
				{recentWork.headline}
			</Headline>
			<Body className="line">{recentWork.body}</Body>

			<Typography
				className="line"
				sx={{
					fontFamily: fonts.mono,
					fontSize: 12,
					letterSpacing: '0.2em',
					textTransform: 'uppercase',
					color: tokens.text.muted,
					mt: 2,
					mb: 2,
				}}
			>
				{recentWork.showcaseHeading}
			</Typography>

			{reduced ? (
				<Stack spacing={2}>
					{projects.map((p) => (
						<ProjectCard key={p.name} project={p} />
					))}
				</Stack>
			) : (
				<Box className="deck">
					{/* front card — re-mounts and slides in on each change (keyed by
					    active, so it can never get stuck on a stale card) */}
					<Box sx={{ position: 'relative', minHeight: CARD_H, overflow: 'hidden', borderRadius: 3 }}>
						<Box
							key={active}
							component={motion.div}
							initial={prefersReduced ? false : { opacity: 0, x: dir * 44 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, ease: 'easeOut' }}
						>
							<ProjectCard project={projects[active]} index={active} total={projects.length} height={CARD_H} />
						</Box>
					</Box>

					{/* controls: prev · dots · next */}
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={1.25} sx={{ mt: 2 }}>
						<IconButton
							aria-label="Previous project"
							onClick={() => goTo(active - 1)}
							sx={{ color: tokens.text.secondary, border: `1px solid ${tokens.line}`, '&:hover': { borderColor: tokens.primaryBorder, color: tokens.primary } }}
						>
							<ChevronLeftIcon />
						</IconButton>
						<Stack direction="row" alignItems="center" spacing={1}>
							{projects.map((p, i) => (
								<Box
									key={p.name}
									component="button"
									type="button"
									aria-label={`Show ${p.name}`}
									aria-current={i === active}
									onClick={() => goTo(i)}
									sx={{
										p: 0,
										border: 'none',
										cursor: 'pointer',
										background: 'transparent',
										display: 'grid',
										placeItems: 'center',
										width: 18,
										height: 18,
									}}
								>
									<Box
										sx={{
											width: i === active ? 20 : 8,
											height: 8,
											borderRadius: 999,
											bgcolor: i === active ? tokens.primary : tokens.text.muted,
											opacity: i === active ? 1 : 0.45,
											transition: 'all 220ms ease',
										}}
									/>
								</Box>
							))}
						</Stack>
						<IconButton
							aria-label="Next project"
							onClick={() => goTo(active + 1)}
							sx={{ color: tokens.text.secondary, border: `1px solid ${tokens.line}`, '&:hover': { borderColor: tokens.primaryBorder, color: tokens.primary } }}
						>
							<ChevronRightIcon />
						</IconButton>
					</Stack>
				</Box>
			)}
		</SceneShell>
	)
}

function ProjectCard({
	project,
	index,
	total,
	height,
}: {
	project: Project
	index?: number
	total?: number
	height?: number
}) {
	return (
		<Box
			sx={{
				height: height ?? 'auto',
				display: 'flex',
				flexDirection: 'column',
				border: `1px solid ${tokens.line}`,
				borderRadius: 3,
				overflow: 'hidden',
				bgcolor: tokens.card,
				backdropFilter: 'blur(14px)',
				boxShadow: '0 30px 70px -34px rgba(0,0,0,0.7)',
			}}
		>
			{/* thumbnail / model-viewer preview */}
			<Box
				sx={{
					position: 'relative',
					height: height ? THUMB_H : 168,
					flexShrink: 0,
					background: project.gradient,
					borderBottom: `1px solid ${tokens.line}`,
					overflow: 'hidden',
				}}
			>
				{project.image && (
					<Box
						component="img"
						src={project.image}
						alt={`${project.name} preview`}
						loading="lazy"
						sx={{
							position: 'absolute',
							inset: 0,
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							objectPosition: 'top center',
						}}
					/>
				)}
				{!project.image && (
					<Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
						<Typography
							sx={{
								fontFamily: fonts.display,
								fontSize: 72,
								fontWeight: 600,
								color: 'rgba(255,255,255,0.16)',
								letterSpacing: '-0.03em',
							}}
						>
							{project.initials}
						</Typography>
					</Box>
				)}
				{/* status + index pill */}
				<Box
					sx={{
						position: 'absolute',
						top: 12,
						left: 12,
						px: 1.1,
						py: 0.4,
						borderRadius: 999,
						bgcolor: 'rgba(7,7,8,0.6)',
						backdropFilter: 'blur(8px)',
						border: `1px solid rgba(255,255,255,0.12)`,
						fontFamily: fonts.mono,
						fontSize: 10,
						letterSpacing: '0.12em',
						textTransform: 'uppercase',
						color: '#F1ECE2',
					}}
				>
					{project.status}
				</Box>
				{index !== undefined && total !== undefined && (
					<Box
						sx={{
							position: 'absolute',
							top: 12,
							right: 12,
							px: 1.1,
							py: 0.4,
							borderRadius: 999,
							bgcolor: 'rgba(7,7,8,0.6)',
							backdropFilter: 'blur(8px)',
							border: `1px solid rgba(255,255,255,0.12)`,
							fontFamily: fonts.mono,
							fontSize: 10,
							letterSpacing: '0.12em',
							color: '#F1ECE2',
						}}
					>
						{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
					</Box>
				)}
				{/* whole thumbnail opens the primary link in a new tab */}
				{project.links[0] && (
					<Link
						href={project.links[0].url}
						target="_blank"
						rel="noreferrer"
						aria-label={`Open ${project.name}`}
						sx={{ position: 'absolute', inset: 0, zIndex: 2 }}
					/>
				)}
			</Box>

			{/* body */}
			<Box sx={{ p: 2.25, display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minHeight: 0, position: 'relative' }}>
				<Stack direction="row" alignItems="baseline" spacing={1.25} flexWrap="wrap">
					<Typography sx={{ fontWeight: 700, fontSize: 20, fontFamily: fonts.body }}>{project.name}</Typography>
					<Typography
						sx={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.1em', color: project.accent, textTransform: 'uppercase' }}
					>
						{project.tagline}
					</Typography>
				</Stack>
				<Typography variant="body2" sx={{ color: tokens.text.secondary, lineHeight: 1.55 }}>
					{project.detail}
				</Typography>
				<Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
					{project.tech.map((t) => (
						<Chip key={t} label={t} size="small" />
					))}
				</Stack>
				{project.links.length > 0 && (
					<Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 'auto', pt: 1 }}>
						{project.links.map((l) => (
							<Link
								key={l.url}
								href={l.url}
								target="_blank"
								rel="noreferrer"
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 0.4,
									fontFamily: fonts.mono,
									fontSize: 12,
									letterSpacing: '0.04em',
									color: project.accent,
									'&:hover': { textDecoration: 'underline' },
								}}
							>
								{l.label}
								<NorthEastIcon sx={{ fontSize: 13 }} />
							</Link>
						))}
					</Stack>
				)}
			</Box>
		</Box>
	)
}
