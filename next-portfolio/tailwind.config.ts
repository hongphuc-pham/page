import type { Config } from 'tailwindcss'

/**
 * The Material-derived palette from the original design, lifted verbatim so
 * the port is a port and not a redesign.
 *
 * Only the tokens actually used on the page are kept; the export carried a
 * few dozen more that nothing referenced, and an unused token is a decision
 * nobody made.
 */
const config: Config = {
	darkMode: 'class',
	content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				background: '#070b0a',
				'on-background': '#e0e3e1',
				surface: '#101413',
				'surface-container': '#1c201f',
				'surface-container-high': '#262b2a',
				'surface-container-lowest': '#0b0f0e',
				'on-surface': '#e0e3e1',
				'on-surface-variant': '#bccac0',
				outline: '#87948b',
				primary: '#7befb6',
				'primary-container': '#5ed29c',
				'primary-fixed': '#85f9c0',
				'primary-fixed-dim': '#68dca5',
				secondary: '#d3fbff',
				'secondary-container': '#00eefc',
				'secondary-fixed-dim': '#00dbe9',
				tertiary: '#cbddd4',
				'tertiary-container': '#b0c1b9',
				error: '#ffb4ab',
				terminal: '#0b1a15',
			},
			borderRadius: { DEFAULT: '0.125rem', lg: '0.25rem', xl: '0.5rem', full: '0.75rem' },
			spacing: {
				base: '8px',
				'margin-mobile': '20px',
				'margin-desktop': '64px',
				gutter: '24px',
				'stack-sm': '12px',
				'stack-md': '24px',
				'stack-lg': '48px',
			},
			maxWidth: { 'container-max': '1440px' },
			fontFamily: {
				display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
				body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
				label: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
				accent: ['var(--font-instrument)', 'Georgia', 'serif'],
			},
			transitionTimingFunction: {
				// The built-in easings are too weak to read as intentional.
				out: 'cubic-bezier(0.23, 1, 0.32, 1)',
				'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
			},
		},
	},
	plugins: [],
}

export default config
