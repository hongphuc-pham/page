import { Box, type SxProps, type Theme } from '@mui/material'
import { useReducedMotion } from 'framer-motion'
import { useCallback, useRef, type ReactNode } from 'react'
import { tokens } from '../../theme'

/**
 * Card wrapper with a 3D perspective tilt + cursor spotlight.
 * Writes styles directly on the element (no re-renders per mousemove).
 * Both effects are disabled under prefers-reduced-motion.
 */
export function InteractiveCard({
	children,
	tiltMax = 5,
	spotlight = true,
	sx,
}: {
	children: ReactNode
	tiltMax?: number
	spotlight?: boolean
	sx?: SxProps<Theme>
}) {
	const ref = useRef<HTMLDivElement | null>(null)
	const raf = useRef<number | null>(null)
	const reduced = useReducedMotion()

	const onMove = useCallback(
		(e: React.MouseEvent) => {
			const el = ref.current
			if (!el || reduced) return
			const rect = el.getBoundingClientRect()
			const px = (e.clientX - rect.left) / rect.width - 0.5
			const py = (e.clientY - rect.top) / rect.height - 0.5
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			if (raf.current === null) {
				raf.current = requestAnimationFrame(() => {
					raf.current = null
					el.style.transform = `perspective(900px) rotateX(${(-py * tiltMax).toFixed(2)}deg) rotateY(${(px * tiltMax).toFixed(2)}deg)`
					el.style.setProperty('--spot-x', `${x}px`)
					el.style.setProperty('--spot-y', `${y}px`)
					el.style.setProperty('--spot-o', '1')
				})
			}
		},
		[reduced, tiltMax],
	)

	const onLeave = useCallback(() => {
		const el = ref.current
		if (!el) return
		if (raf.current !== null) {
			cancelAnimationFrame(raf.current)
			raf.current = null
		}
		el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
		el.style.setProperty('--spot-o', '0')
	}, [])

	return (
		<Box
			ref={ref}
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			sx={{
				position: 'relative',
				height: '100%',
				transformStyle: 'preserve-3d',
				transition: 'transform 180ms ease-out',
				willChange: 'transform',
				...sx,
			}}
		>
			{children}
			{spotlight && !reduced && (
				<Box
					aria-hidden
					sx={{
						position: 'absolute',
						inset: 0,
						borderRadius: 'inherit',
						pointerEvents: 'none',
						opacity: 'var(--spot-o, 0)',
						transition: 'opacity 260ms ease',
						background: `radial-gradient(240px 240px at var(--spot-x, 50%) var(--spot-y, 50%), ${tokens.spotlight}, transparent 65%)`,
					}}
				/>
			)}
		</Box>
	)
}
