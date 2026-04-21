import { Box, Typography } from '@mui/material'
import { keyframes } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'
import { fonts, tokens } from '../theme'

const antennaPulse = keyframes`
	0%, 100% { opacity: 0.85; transform: scale(1); }
	50% { opacity: 1; transform: scale(1.15); }
`

const floatY = keyframes`
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-4px); }
`

const MAX_PUPIL_OFFSET = 2.5

type Pupil = { cx: number; cy: number }

const LEFT_EYE = { cx: 47, cy: 66 }
const RIGHT_EYE = { cx: 73, cy: 66 }

export function MascotToon() {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const [leftPupil, setLeftPupil] = useState<Pupil>(LEFT_EYE)
	const [rightPupil, setRightPupil] = useState<Pupil>(RIGHT_EYE)
	const [blink, setBlink] = useState(false)

	useEffect(() => {
		let raf: number | null = null
		const target = { l: LEFT_EYE, r: RIGHT_EYE }

		const onMove = (e: MouseEvent) => {
			const svg = svgRef.current
			if (!svg) return
			const rect = svg.getBoundingClientRect()
			const scaleX = 120 / rect.width
			const scaleY = 120 / rect.height
			const cursorSvgX = (e.clientX - rect.left) * scaleX
			const cursorSvgY = (e.clientY - rect.top) * scaleY
			target.l = clampToward(LEFT_EYE, cursorSvgX, cursorSvgY)
			target.r = clampToward(RIGHT_EYE, cursorSvgX, cursorSvgY)
			if (raf === null) {
				raf = requestAnimationFrame(() => {
					raf = null
					setLeftPupil(target.l)
					setRightPupil(target.r)
				})
			}
		}
		window.addEventListener('mousemove', onMove, { passive: true })
		return () => {
			window.removeEventListener('mousemove', onMove)
			if (raf !== null) cancelAnimationFrame(raf)
		}
	}, [])

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>
		const tick = () => {
			setBlink(true)
			setTimeout(() => setBlink(false), 140)
			timer = setTimeout(tick, 3500 + Math.random() * 3500)
		}
		timer = setTimeout(tick, 2500)
		return () => clearTimeout(timer)
	}, [])

	return (
		<Box
			aria-hidden
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				gap: 0.25,
				pl: 0.5,
				userSelect: 'none',
				animation: `${floatY} 5.5s ease-in-out infinite`,
			}}
		>
			<Box
				component="svg"
				ref={svgRef}
				viewBox="0 0 120 120"
				sx={{ width: 88, height: 88, overflow: 'visible' }}
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<linearGradient id="mascotFill" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#1B2230" />
						<stop offset="100%" stopColor="#0C111B" />
					</linearGradient>
					<radialGradient id="mascotGlow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="rgba(124,231,255,0.4)" />
						<stop offset="70%" stopColor="rgba(124,231,255,0)" />
					</radialGradient>
				</defs>

				<ellipse cx="60" cy="108" rx="26" ry="3.5" fill="rgba(124,231,255,0.14)" />
				<circle cx="60" cy="70" r="48" fill="url(#mascotGlow)" opacity="0.35" />

				<line x1="60" y1="42" x2="60" y2="26" stroke={tokens.primary} strokeWidth="2" strokeLinecap="round" />
				<circle
					cx="60"
					cy="22"
					r="4"
					fill={tokens.lime}
					style={{ animation: `${antennaPulse} 2.4s ease-in-out infinite`, transformOrigin: '60px 22px' }}
				/>

				<path
					d="M30 70 Q30 42 60 42 Q90 42 90 70 L90 92 Q90 100 82 100 L38 100 Q30 100 30 92 Z"
					fill="url(#mascotFill)"
					stroke={tokens.primary}
					strokeWidth="2"
				/>

				<circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="10" fill="#060912" stroke={tokens.primary} strokeWidth="2" />
				<circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="10" fill="#060912" stroke={tokens.primary} strokeWidth="2" />
				<line x1="57" y1="66" x2="63" y2="66" stroke={tokens.primary} strokeWidth="2" />

				{blink ? (
					<>
						<line x1="39" y1="66" x2="55" y2="66" stroke={tokens.primary} strokeWidth="2.5" strokeLinecap="round" />
						<line x1="65" y1="66" x2="81" y2="66" stroke={tokens.primary} strokeWidth="2.5" strokeLinecap="round" />
					</>
				) : (
					<>
						<circle cx={leftPupil.cx} cy={leftPupil.cy} r="3.2" fill="#EDF1F7" />
						<circle cx={rightPupil.cx} cy={rightPupil.cy} r="3.2" fill="#EDF1F7" />
						<circle cx={leftPupil.cx + 0.9} cy={leftPupil.cy - 0.9} r="0.9" fill={tokens.primary} />
						<circle cx={rightPupil.cx + 0.9} cy={rightPupil.cy - 0.9} r="0.9" fill={tokens.primary} />
					</>
				)}

				<circle cx="36" cy="82" r="3" fill="rgba(255,176,46,0.4)" />
				<circle cx="84" cy="82" r="3" fill="rgba(255,176,46,0.4)" />
				<path d="M49 84 Q60 92 71 84" stroke={tokens.accent} strokeWidth="2" fill="none" strokeLinecap="round" />

				<g transform="translate(92 48)">
					<rect x="0" y="0" width="26" height="16" rx="4" fill="#060912" stroke={tokens.primary} strokeWidth="1.5" />
					<text
						x="13"
						y="12"
						fontFamily="JetBrains Mono, ui-monospace, monospace"
						fontSize="9"
						fontWeight="600"
						fill={tokens.primary}
						textAnchor="middle"
					>
						{'</>'}
					</text>
				</g>
			</Box>
			<Typography
				sx={{
					fontFamily: fonts.mono,
					fontSize: 9,
					color: tokens.text.muted,
					letterSpacing: '0.18em',
					textTransform: 'uppercase',
					pl: 1,
					mt: -0.5,
				}}
			>
				<Box component="span" sx={{ color: tokens.primary }}>//</Box> hi, i'm byte
			</Typography>
		</Box>
	)
}

function clampToward(eye: Pupil, cursorX: number, cursorY: number): Pupil {
	const dx = cursorX - eye.cx
	const dy = cursorY - eye.cy
	const dist = Math.hypot(dx, dy)
	if (dist === 0) return eye
	const clamped = Math.min(dist, dist < 40 ? MAX_PUPIL_OFFSET * 0.6 : MAX_PUPIL_OFFSET)
	const k = clamped / dist
	return { cx: eye.cx + dx * k, cy: eye.cy + dy * k }
}
