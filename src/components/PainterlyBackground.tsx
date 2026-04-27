import { Box } from '@mui/material'
import { keyframes } from '@emotion/react'

const drift1 = keyframes`
	0% { transform: translate(0, 0) scale(1); }
	50% { transform: translate(40px, -30px) scale(1.08); }
	100% { transform: translate(0, 0) scale(1); }
`
const drift2 = keyframes`
	0% { transform: translate(0, 0) scale(1); }
	50% { transform: translate(-50px, 40px) scale(1.12); }
	100% { transform: translate(0, 0) scale(1); }
`
const drift3 = keyframes`
	0% { transform: translate(0, 0) scale(1); }
	50% { transform: translate(30px, 50px) scale(0.95); }
	100% { transform: translate(0, 0) scale(1); }
`
const drift4 = keyframes`
	0% { transform: translate(0, 0) scale(1); }
	50% { transform: translate(-40px, -50px) scale(1.06); }
	100% { transform: translate(0, 0) scale(1); }
`

const techBlobBase = {
	position: 'absolute' as const,
	borderRadius: '50%',
	filter: 'blur(120px)',
	mixBlendMode: 'screen' as const,
	willChange: 'transform',
}

export function PainterlyBackground() {
	return (
		<Box
			aria-hidden
			sx={{
				position: 'fixed',
				inset: 0,
				zIndex: 0,
				overflow: 'hidden',
				pointerEvents: 'none',
				isolation: 'isolate',
				background: 'var(--painter-bg)',
				transition: 'background 300ms ease',
			}}
		>
			<Box
				sx={{
					...techBlobBase,
					top: '-10%',
					left: '55%',
					width: '70vw',
					height: '70vw',
					maxWidth: 900,
					maxHeight: 900,
					background: 'var(--painter-blob-1)',
					animation: `${drift1} 22s ease-in-out infinite`,
				}}
			/>
			<Box
				sx={{
					...techBlobBase,
					top: '25%',
					left: '-20%',
					width: '60vw',
					height: '60vw',
					maxWidth: 800,
					maxHeight: 800,
					background: 'var(--painter-blob-2)',
					animation: `${drift2} 28s ease-in-out infinite`,
				}}
			/>
			<Box
				sx={{
					...techBlobBase,
					bottom: '-10%',
					left: '30%',
					width: '70vw',
					height: '70vw',
					maxWidth: 960,
					maxHeight: 960,
					background: 'var(--painter-blob-3)',
					animation: `${drift3} 30s ease-in-out infinite`,
				}}
			/>
			<Box
				sx={{
					...techBlobBase,
					top: '35%',
					right: '-10%',
					width: '55vw',
					height: '55vw',
					maxWidth: 720,
					maxHeight: 720,
					background: 'var(--painter-blob-4)',
					animation: `${drift4} 26s ease-in-out infinite`,
				}}
			/>

			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					opacity: 'var(--painter-noise-opacity)',
					mixBlendMode: 'overlay',
					backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
						'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>',
					)}")`,
					backgroundSize: '320px 320px',
					pointerEvents: 'none',
				}}
			/>

			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					background: 'var(--painter-vignette)',
					pointerEvents: 'none',
				}}
			/>
		</Box>
	)
}
