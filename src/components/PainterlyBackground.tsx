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
				background:
					'radial-gradient(140% 100% at 50% 0%, #0D1220 0%, #070A12 55%, #05070D 100%)',
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
					background: 'radial-gradient(circle, rgba(124,231,255,0.45) 0%, rgba(124,231,255,0) 65%)',
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
					background:
						'radial-gradient(circle, rgba(198,255,61,0.22) 0%, rgba(198,255,61,0) 60%)',
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
					background:
						'radial-gradient(circle, rgba(255,176,46,0.22) 0%, rgba(255,107,107,0.08) 40%, rgba(255,107,107,0) 70%)',
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
					background:
						'radial-gradient(circle, rgba(180,130,255,0.28) 0%, rgba(124,231,255,0.08) 55%, rgba(124,231,255,0) 80%)',
					animation: `${drift4} 26s ease-in-out infinite`,
				}}
			/>

			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					opacity: 0.22,
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
					background:
						'radial-gradient(120% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.7) 100%)',
					pointerEvents: 'none',
				}}
			/>
		</Box>
	)
}
