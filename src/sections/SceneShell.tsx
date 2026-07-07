import { Box, Typography } from '@mui/material'
import { type ReactNode, type RefObject } from 'react'
import { chapters } from '../data/cv'
import { fonts, tokens } from '../theme'

/**
 * Presentational building blocks for the six beats. The pin/scrub logic
 * lives in ./useSceneTimeline (kept separate so this file only exports
 * components — react-refresh friendly).
 */

/** id → "0N" index + chapter label, for the HUD section readout. */
function sectionMeta(id: string) {
	const i = chapters.findIndex((c) => c.id === id)
	return { num: String(i + 1).padStart(2, '0'), label: chapters[i]?.label ?? '' }
}

/** L-shaped accent bracket clamped to one corner of the HUD panel. */
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
	const top = pos[0] === 't'
	const left = pos[1] === 'l'
	return (
		<Box
			aria-hidden
			className="hud-corner"
			sx={{
				position: 'absolute',
				width: 13,
				height: 13,
				[top ? 'top' : 'bottom']: -1,
				[left ? 'left' : 'right']: -1,
				[top ? 'borderTop' : 'borderBottom']: `2px solid ${tokens.primary}`,
				[left ? 'borderLeft' : 'borderRight']: `2px solid ${tokens.primary}`,
				opacity: 0.75,
			}}
		/>
	)
}

export function SceneShell({
	id,
	rootRef,
	children,
	maxWidth = 600,
}: {
	id: string
	rootRef: RefObject<HTMLElement>
	children: ReactNode
	maxWidth?: number
}) {
	const meta = sectionMeta(id)
	return (
		<Box
			component="section"
			id={id}
			ref={rootRef}
			sx={{
				minHeight: '100vh',
				position: 'relative',
				zIndex: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
				px: { xs: 3, md: 10, lg: 14 },
				py: { xs: 8, md: 10 },
			}}
		>
			{/* left→right scrim keeps text readable over the right-side 3D shard */}
			<Box
				aria-hidden
				sx={{
					position: 'absolute',
					inset: 0,
					zIndex: -1,
					pointerEvents: 'none',
					background: { xs: tokens.scrimV, md: tokens.scrimH },
				}}
			/>

			{/* sci-fi HUD board: framed panel with corner brackets, a section
			    readout, and a faint scanline. Fades/moves in–out via the scene's
			    own GSAP timeline (it targets .scene-inner). */}
			<Box
				className="scene-inner"
				sx={{
					position: 'relative',
					width: '100%',
					maxWidth,
					px: { xs: 2.5, md: 3.5 },
					pt: { xs: 2.25, md: 2.75 },
					pb: { xs: 2.75, md: 3.25 },
					borderRadius: '10px',
					border: `1px solid ${tokens.primaryBorder}`,
					background: 'var(--sidebar-bg)',
					backdropFilter: 'blur(10px)',
					boxShadow: `0 24px 70px -34px rgba(0,0,0,0.75), inset 0 0 0 1px ${tokens.lineSoft}`,
				}}
			>
				{/* header readout */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: { xs: 2, md: 2.5 } }}>
					<Box
						sx={{
							width: 7,
							height: 7,
							borderRadius: '50%',
							flexShrink: 0,
							bgcolor: tokens.primary,
							boxShadow: `0 0 0 3px ${tokens.primaryGlow}`,
						}}
					/>
					<Typography
						sx={{
							fontFamily: fonts.mono,
							fontSize: 10.5,
							letterSpacing: '0.22em',
							textTransform: 'uppercase',
							color: tokens.text.muted,
							whiteSpace: 'nowrap',
						}}
					>
						SEC {meta.num}/{String(chapters.length).padStart(2, '0')} · {meta.label}
					</Typography>
					<Box sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${tokens.primaryBorder}, transparent)` }} />
				</Box>

				{children}

				{/* corner brackets */}
				<Corner pos="tl" />
				<Corner pos="tr" />
				<Corner pos="bl" />
				<Corner pos="br" />

				{/* faint scanline sheen */}
				<Box
					aria-hidden
					sx={{
						position: 'absolute',
						inset: 0,
						borderRadius: 'inherit',
						pointerEvents: 'none',
						background: 'repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.014) 3px 4px)',
					}}
				/>
			</Box>
		</Box>
	)
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<Typography
			className={className}
			sx={{
				fontFamily: fonts.mono,
				fontSize: 12,
				letterSpacing: '0.24em',
				textTransform: 'uppercase',
				color: tokens.primary,
				mb: 2.5,
			}}
		>
			{children}
		</Typography>
	)
}

export function Headline({
	children,
	className,
	size = 'lg',
}: {
	children: ReactNode
	className?: string
	size?: 'lg' | 'md'
}) {
	return (
		<Typography
			variant="h2"
			className={className}
			sx={{
				fontSize: size === 'lg' ? { xs: 44, sm: 62, md: 82 } : { xs: 34, sm: 44, md: 56 },
				lineHeight: 1.02,
				letterSpacing: '-0.02em',
				mb: 3,
			}}
		>
			{children}
		</Typography>
	)
}

export function Body({
	children,
	className,
	maxWidth = 620,
	centered = false,
}: {
	children: ReactNode
	className?: string
	maxWidth?: number
	centered?: boolean
}) {
	return (
		<Typography
			className={className}
			sx={{
				color: tokens.text.secondary,
				fontSize: { xs: 16, md: 18 },
				lineHeight: 1.7,
				maxWidth,
				mx: centered ? 'auto' : 0,
				mb: 2,
			}}
		>
			{children}
		</Typography>
	)
}
