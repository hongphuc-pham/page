import { createTheme } from '@mui/material/styles'

const tokens = {
	bg: '#0f1115',
	surface: '#171a21',
	card: '#1f232b',
	text: { primary: '#e6eaf2', secondary: '#b0b6c3', muted: '#8a90a0' },
	accent: '#ffb02e',
}

export const theme = createTheme({
	palette: {
		mode: 'dark',
		background: { default: tokens.bg, paper: tokens.surface },
		primary: { main: tokens.accent },
		text: { primary: tokens.text.primary, secondary: tokens.text.secondary },
	},
	shape: { borderRadius: 16 },
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: tokens.card,
					boxShadow:
						'0 1px 1px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
					transition: 'transform 120ms ease, box-shadow 120ms ease',
					'&:hover': {
						transform: 'translateY(-1px)',
						boxShadow:
							'0 2px 2px rgba(0,0,0,0.45), 0 16px 40px rgba(0,0,0,0.45)',
					},
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: { minHeight: 48 },
				indicator: { height: 3, borderRadius: 3, background: tokens.accent },
			},
		},
		MuiChip: {
			styleOverrides: {
				root: { backgroundColor: tokens.surface },
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: { height: 8, borderRadius: 999 },
				bar: { borderRadius: 999, background: tokens.accent },
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					borderRadius: 12,
					'&:focus-visible': {
						boxShadow: `0 0 0 3px rgba(255,176,46,0.35)`,
					},
				},
			},
		},
	},
})

export type AppTheme = typeof theme
