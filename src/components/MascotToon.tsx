import { Box, Typography } from '@mui/material'
import { keyframes } from '@emotion/react'
import { fonts, tokens } from '../theme'

const blinkPulse = keyframes`
	0%, 92%, 100% { opacity: 1; transform: scale(1); }
	94%, 98% { opacity: 0.3; transform: scale(0.96); }
`

const antennaPulse = keyframes`
	0%, 100% { r: 4; opacity: 0.9; }
	50% { r: 4.8; opacity: 1; }
`

const floatY = keyframes`
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-4px); }
`

export function MascotToon() {
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
				viewBox="0 0 120 120"
				sx={{ width: 84, height: 84 }}
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<linearGradient id="mascotFill" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#161B26" />
						<stop offset="100%" stopColor="#0E131C" />
					</linearGradient>
				</defs>

				<ellipse cx="60" cy="108" rx="26" ry="3.5" fill="rgba(124,231,255,0.14)" />

				<line x1="60" y1="42" x2="60" y2="26" stroke={tokens.primary} strokeWidth="2" strokeLinecap="round" />
				<circle cx="60" cy="22" r="4" fill={tokens.lime} style={{ animation: `${antennaPulse} 2.4s ease-in-out infinite` }} />

				<path
					d="M30 70 Q30 42 60 42 Q90 42 90 70 L90 92 Q90 100 82 100 L38 100 Q30 100 30 92 Z"
					fill="url(#mascotFill)"
					stroke={tokens.primary}
					strokeWidth="2"
				/>

				<circle cx="47" cy="66" r="10" fill="#0A0D14" stroke={tokens.primary} strokeWidth="2" />
				<circle cx="73" cy="66" r="10" fill="#0A0D14" stroke={tokens.primary} strokeWidth="2" />
				<line x1="57" y1="66" x2="63" y2="66" stroke={tokens.primary} strokeWidth="2" />
				<g style={{ animation: `${blinkPulse} 5.2s ease-in-out infinite`, transformOrigin: '60px 66px' }}>
					<circle cx="47" cy="66" r="2.6" fill="#EDF1F7" />
					<circle cx="73" cy="66" r="2.6" fill="#EDF1F7" />
				</g>

				<circle cx="36" cy="82" r="3" fill="rgba(255,176,46,0.35)" />
				<circle cx="84" cy="82" r="3" fill="rgba(255,176,46,0.35)" />

				<path d="M49 84 Q60 92 71 84" stroke={tokens.accent} strokeWidth="2" fill="none" strokeLinecap="round" />

				<g transform="translate(92 48)">
					<rect x="0" y="0" width="26" height="16" rx="4" fill="#0A0D14" stroke={tokens.primary} strokeWidth="1.5" />
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
