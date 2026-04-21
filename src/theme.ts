import { createTheme } from '@mui/material/styles'

export const tokens = {
	bg: '#0A0D14',
	bgElevated: '#0E131C',
	surface: '#12161F',
	card: '#161B26',
	line: 'rgba(255,255,255,0.08)',
	lineSoft: 'rgba(255,255,255,0.04)',
	text: { primary: '#EDF1F7', secondary: '#A4ACBD', muted: '#6B7388' },
	primary: '#7CE7FF',
	accent: '#FFB02E',
	lime: '#C6FF3D',
	danger: '#FF6B6B',
	gradient: 'linear-gradient(135deg, #7CE7FF 0%, #C6FF3D 100%)',
}

export const fonts = {
	display: 'Inter, "Söhne", "Helvetica Neue", system-ui, -apple-system, "Segoe UI", sans-serif',
	body: 'Inter, "Söhne", "Helvetica Neue", system-ui, -apple-system, "Segoe UI", sans-serif',
	mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
}

export const theme = createTheme({
	palette: {
		mode: 'dark',
		background: { default: tokens.bg, paper: tokens.surface },
		primary: { main: tokens.primary, contrastText: '#06121A' },
		secondary: { main: tokens.accent, contrastText: '#1A1200' },
		text: { primary: tokens.text.primary, secondary: tokens.text.secondary },
		divider: tokens.line,
	},
	shape: { borderRadius: 14 },
	typography: {
		fontFamily: fonts.body,
		h1: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.02 },
		h2: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 },
		h3: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.025em' },
		h4: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.02em' },
		h5: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.015em' },
		h6: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.01em' },
		body1: { letterSpacing: '-0.005em' },
		body2: { letterSpacing: '-0.003em' },
		subtitle2: { fontWeight: 600 },
		button: { fontWeight: 500, letterSpacing: '0' },
		overline: { fontFamily: fonts.mono, fontWeight: 500, letterSpacing: '0.14em' },
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				html: { scrollBehavior: 'smooth' },
				body: {
					backgroundColor: '#05070D',
					fontFamily: fonts.body,
					fontFeatureSettings: '"cv11", "ss01", "ss03", "cv02"',
					WebkitFontSmoothing: 'antialiased',
					MozOsxFontSmoothing: 'grayscale',
					textRendering: 'optimizeLegibility',
				},
				'section[id]': { scrollMarginTop: '24px' },
				'*::selection': { background: 'rgba(124,231,255,0.25)' },
			},
		},
		MuiPaper: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: {
					backgroundColor: tokens.surface,
					backgroundImage: 'none',
					border: `1px solid ${tokens.line}`,
					boxShadow: 'none',
					transition: 'transform 160ms ease, border-color 160ms ease',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					backgroundColor: tokens.card,
					border: `1px solid ${tokens.line}`,
					fontFamily: fonts.mono,
					fontSize: 12,
					letterSpacing: '0.02em',
					borderRadius: 8,
				},
				colorPrimary: {
					backgroundColor: 'rgba(124,231,255,0.08)',
					borderColor: 'rgba(124,231,255,0.35)',
					color: tokens.primary,
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					borderRadius: 10,
					fontWeight: 600,
					paddingInline: 18,
					paddingBlock: 10,
				},
				containedPrimary: {
					backgroundColor: tokens.primary,
					color: '#06121A',
					'&:hover': { backgroundColor: '#5ED3EE' },
				},
				outlinedPrimary: {
					borderColor: tokens.line,
					color: tokens.text.primary,
					'&:hover': { borderColor: tokens.primary, backgroundColor: 'rgba(124,231,255,0.06)' },
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: { height: 6, borderRadius: 999, backgroundColor: tokens.card },
				bar: { borderRadius: 999, background: tokens.gradient },
			},
		},
		MuiDivider: { styleOverrides: { root: { borderColor: tokens.line } } },
		MuiTabs: {
			styleOverrides: {
				indicator: { height: 2, borderRadius: 2, background: tokens.primary },
			},
		},
	},
})

export type AppTheme = typeof theme
