import NorthEastIcon from '@mui/icons-material/NorthEast'
import { Box, Chip, Link, Stack, Typography } from '@mui/material'
import { useRef } from 'react'
import { recentWork, type Project } from '../data/cv'
import { fonts, tokens } from '../theme'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 3 — NOW · scroll 0.333–0.500
 * The project cards are a scroll-driven STACK: they sit on top of one another
 * like a deck, and scrubbing swaps the front card off the top to reveal the
 * next (a "card swap" / model-viewer feel). Each card shows a live screenshot
 * thumbnail + links. The shard fractures behind it.
 *
 * Positioning is done in a single onUpdate from a proxy tween so the whole
 * stack moves as one continuous function of scroll (smooth, no per-card races).
 */

const CARD_H = 320 // px — fixed so the absolute stack has a stable footprint
const THUMB_H = 168 // px — thumbnail height (leaves room for name + links)

function positionStack(cards: Element[], active: number) {
	cards.forEach((el, i) => {
		const card = el as HTMLElement
		const d = i - active // <0 leaving/left, 0 front, >0 waiting behind
		let y: number, scale: number, opacity: number, rot: number, z: number
		if (d < 0) {
			const t = Math.min(1, -d) // 0→1 as it flies off the top
			y = -t * 220
			scale = 1 - t * 0.12
			opacity = 1 - t
			rot = -t * 5
			z = 500
		} else {
			const dd = Math.min(d, 3)
			y = dd * 20
			scale = 1 - dd * 0.05
			opacity = d > 3.2 ? 0 : 1 - dd * 0.16
			rot = 0
			z = 100 - Math.round(d * 10)
		}
		card.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`
		card.style.opacity = opacity.toFixed(3)
		card.style.zIndex = String(z)
		card.style.pointerEvents = d >= 0 && d < 0.5 ? 'auto' : 'none'
	})
}

export function Scene3Now({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)
	const projects = recentWork.projects

	useSceneTimeline(
		root,
		(tl, q) => {
			const cards = q('.deck-card')
			positionStack(cards, 0)
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, stagger: 1.1, duration: 3 })
			// scrub the stack from card 0 → last card
			const proxy = { active: 0 }
			tl.to(
				proxy,
				{
					active: projects.length - 1,
					duration: projects.length * 3,
					ease: 'none',
					onUpdate: () => positionStack(cards, proxy.active),
				},
				'>-0.5',
			)
			tl.to(q('.scene-inner'), { autoAlpha: 0, y: -70, duration: 3 }, '+=1.5')
		},
		{ reduced, isMobile, length: 320, beat: 2 },
	)

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

			{/* Card stack. Reduced motion → plain vertical list. */}
			{reduced ? (
				<Stack spacing={2}>
					{projects.map((p) => (
						<ProjectCard key={p.name} project={p} />
					))}
				</Stack>
			) : (
				<Box sx={{ position: 'relative', height: CARD_H + 70 }}>
					{projects.map((p, i) => (
						<Box
							key={p.name}
							className="deck-card"
							sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								willChange: 'transform, opacity',
								transformOrigin: '50% 0%',
							}}
						>
							<ProjectCard project={p} index={i} total={projects.length} height={CARD_H} />
						</Box>
					))}
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
