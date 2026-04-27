import { createTheme } from '@mui/material/styles'

// Concrete color values per mode. Drive everything else off these.
export const palettes = {
	dark: {
		bg: '#0A0D14',
		bgElevated: '#0E131C',
		surface: '#12161F',
		card: '#161B26',
		bodyBg: '#05070D',
		line: 'rgba(255,255,255,0.08)',
		lineSoft: 'rgba(255,255,255,0.04)',
		textPrimary: '#EDF1F7',
		textSecondary: '#A4ACBD',
		textMuted: '#6B7388',
		primary: '#7CE7FF',
		accent: '#FFB02E',
		lime: '#C6FF3D',
		danger: '#FF6B6B',
		gradient: 'linear-gradient(135deg, #7CE7FF 0%, #C6FF3D 100%)',
		// painter
		painterBg: 'radial-gradient(140% 100% at 50% 0%, #0D1220 0%, #070A12 55%, #05070D 100%)',
		painterBlob1: 'radial-gradient(circle, rgba(124,231,255,0.45) 0%, rgba(124,231,255,0) 65%)',
		painterBlob2: 'radial-gradient(circle, rgba(198,255,61,0.22) 0%, rgba(198,255,61,0) 60%)',
		painterBlob3: 'radial-gradient(circle, rgba(255,176,46,0.22) 0%, rgba(255,107,107,0.08) 40%, rgba(255,107,107,0) 70%)',
		painterBlob4: 'radial-gradient(circle, rgba(180,130,255,0.28) 0%, rgba(124,231,255,0.08) 55%, rgba(124,231,255,0) 80%)',
		painterVignette: 'radial-gradient(120% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.7) 100%)',
		painterNoiseOpacity: 0.22,
		buttonContainedHover: '#5ED3EE',
		buttonOutlinedHoverBg: 'rgba(124,231,255,0.06)',
		chipPrimaryBg: 'rgba(124,231,255,0.08)',
		chipPrimaryBorder: 'rgba(124,231,255,0.35)',
		selectionBg: 'rgba(124,231,255,0.25)',
		sidebarBg: 'rgba(7,10,18,0.62)',
		chromeBarBg: 'rgba(7,10,18,0.65)',
		togglePillBg: 'rgba(7,10,18,0.45)',
	},
	light: {
		bg: '#F6F7FA',
		bgElevated: '#FFFFFF',
		surface: '#FFFFFF',
		card: '#FAFBFD',
		bodyBg: '#EDEFF4',
		line: 'rgba(15,20,30,0.10)',
		lineSoft: 'rgba(15,20,30,0.05)',
		textPrimary: '#0F1419',
		textSecondary: '#475061',
		textMuted: '#7A8194',
		primary: '#0091B5',
		accent: '#C25E00',
		lime: '#4F8A12',
		danger: '#D03A3F',
		gradient: 'linear-gradient(135deg, #0091B5 0%, #4F8A12 100%)',
		painterBg: 'radial-gradient(140% 100% at 50% 0%, #FFFFFF 0%, #EEF2F7 55%, #E4E9F0 100%)',
		painterBlob1: 'radial-gradient(circle, rgba(0,145,181,0.18) 0%, rgba(0,145,181,0) 65%)',
		painterBlob2: 'radial-gradient(circle, rgba(79,138,18,0.12) 0%, rgba(79,138,18,0) 60%)',
		painterBlob3: 'radial-gradient(circle, rgba(194,94,0,0.10) 0%, rgba(208,58,63,0.06) 40%, rgba(208,58,63,0) 70%)',
		painterBlob4: 'radial-gradient(circle, rgba(150,90,210,0.12) 0%, rgba(0,145,181,0.04) 55%, rgba(0,145,181,0) 80%)',
		painterVignette: 'radial-gradient(120% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.06) 100%)',
		painterNoiseOpacity: 0.05,
		buttonContainedHover: '#007D9C',
		buttonOutlinedHoverBg: 'rgba(0,145,181,0.06)',
		chipPrimaryBg: 'rgba(0,145,181,0.08)',
		chipPrimaryBorder: 'rgba(0,145,181,0.30)',
		selectionBg: 'rgba(0,145,181,0.18)',
		sidebarBg: 'rgba(255,255,255,0.55)',
		chromeBarBg: 'rgba(247,249,252,0.82)',
		togglePillBg: 'rgba(255,255,255,0.65)',
	},
} as const

export type ThemeMode = keyof typeof palettes

// All tokens resolve through CSS variables so a single data-theme switch flips everything.
export const tokens = {
	bg: 'var(--bg)',
	bgElevated: 'var(--bg-elevated)',
	surface: 'var(--surface)',
	card: 'var(--card)',
	line: 'var(--line)',
	lineSoft: 'var(--line-soft)',
	text: {
		primary: 'var(--text-primary)',
		secondary: 'var(--text-secondary)',
		muted: 'var(--text-muted)',
	},
	primary: 'var(--primary)',
	accent: 'var(--accent)',
	lime: 'var(--lime)',
	danger: 'var(--danger)',
	gradient: 'var(--gradient)',
}

export const fonts = {
	display: 'Inter, "Söhne", "Helvetica Neue", system-ui, -apple-system, "Segoe UI", sans-serif',
	body: 'Inter, "Söhne", "Helvetica Neue", system-ui, -apple-system, "Segoe UI", sans-serif',
	mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
}

type Palette = { [K in keyof (typeof palettes)['dark']]: (typeof palettes)['dark'][K] | (typeof palettes)['light'][K] }
function paletteToVars(p: Palette) {
	return {
		'--bg': p.bg,
		'--bg-elevated': p.bgElevated,
		'--surface': p.surface,
		'--card': p.card,
		'--body-bg': p.bodyBg,
		'--line': p.line,
		'--line-soft': p.lineSoft,
		'--text-primary': p.textPrimary,
		'--text-secondary': p.textSecondary,
		'--text-muted': p.textMuted,
		'--primary': p.primary,
		'--accent': p.accent,
		'--lime': p.lime,
		'--danger': p.danger,
		'--gradient': p.gradient,
		'--painter-bg': p.painterBg,
		'--painter-blob-1': p.painterBlob1,
		'--painter-blob-2': p.painterBlob2,
		'--painter-blob-3': p.painterBlob3,
		'--painter-blob-4': p.painterBlob4,
		'--painter-vignette': p.painterVignette,
		'--painter-noise-opacity': String(p.painterNoiseOpacity),
		'--button-contained-hover': p.buttonContainedHover,
		'--button-outlined-hover-bg': p.buttonOutlinedHoverBg,
		'--chip-primary-bg': p.chipPrimaryBg,
		'--chip-primary-border': p.chipPrimaryBorder,
		'--selection-bg': p.selectionBg,
		'--sidebar-bg': p.sidebarBg,
		'--chrome-bar-bg': p.chromeBarBg,
		'--toggle-pill-bg': p.togglePillBg,
	}
}

export const theme = createTheme({
	palette: {
		mode: 'dark',
		background: { default: palettes.dark.bg, paper: palettes.dark.surface },
		primary: { main: palettes.dark.primary, contrastText: '#06121A' },
		secondary: { main: palettes.dark.accent, contrastText: '#1A1200' },
		text: { primary: palettes.dark.textPrimary, secondary: palettes.dark.textSecondary },
		divider: palettes.dark.line,
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
				':root': paletteToVars(palettes.dark),
				'[data-theme="dark"]': paletteToVars(palettes.dark),
				'[data-theme="light"]': paletteToVars(palettes.light),
				html: { scrollBehavior: 'smooth' },
				body: {
					backgroundColor: 'var(--body-bg)',
					color: 'var(--text-primary)',
					fontFamily: fonts.body,
					fontFeatureSettings: '"cv11", "ss01", "ss03", "cv02"',
					WebkitFontSmoothing: 'antialiased',
					MozOsxFontSmoothing: 'grayscale',
					textRendering: 'optimizeLegibility',
					transition: 'background-color 240ms ease, color 240ms ease',
				},
				'section[id]': { scrollMarginTop: '24px' },
				'*::selection': { background: 'var(--selection-bg)' },
			},
		},
		MuiPaper: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: {
					backgroundColor: 'var(--surface)',
					backgroundImage: 'none',
					border: `1px solid var(--line)`,
					boxShadow: 'none',
					transition: 'transform 160ms ease, border-color 160ms ease, background-color 200ms ease',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					backgroundColor: 'var(--card)',
					border: `1px solid var(--line)`,
					fontFamily: fonts.mono,
					fontSize: 12,
					letterSpacing: '0.02em',
					borderRadius: 8,
					color: 'var(--text-primary)',
				},
				colorPrimary: {
					backgroundColor: 'var(--chip-primary-bg)',
					borderColor: 'var(--chip-primary-border)',
					color: 'var(--primary)',
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
					backgroundColor: 'var(--primary)',
					color: '#06121A',
					'&:hover': { backgroundColor: 'var(--button-contained-hover)' },
				},
				outlinedPrimary: {
					borderColor: 'var(--line)',
					color: 'var(--text-primary)',
					'&:hover': { borderColor: 'var(--primary)', backgroundColor: 'var(--button-outlined-hover-bg)' },
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: { height: 6, borderRadius: 999, backgroundColor: 'var(--card)' },
				bar: { borderRadius: 999, background: 'var(--gradient)' },
			},
		},
		MuiDivider: { styleOverrides: { root: { borderColor: 'var(--line)' } } },
		MuiTabs: {
			styleOverrides: {
				indicator: { height: 2, borderRadius: 2, background: 'var(--primary)' },
			},
		},
	},
})

export type AppTheme = typeof theme
