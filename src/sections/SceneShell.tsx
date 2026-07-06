import { Box, Typography } from '@mui/material'
import { type ReactNode, type RefObject } from 'react'
import { fonts, tokens } from '../theme'

/**
 * Presentational building blocks for the five beats. The pin/scrub logic
 * lives in ./useSceneTimeline (kept separate so this file only exports
 * components — react-refresh friendly).
 */
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
			<Box className="scene-inner" sx={{ width: '100%', maxWidth }}>
				{children}
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
