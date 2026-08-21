import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google'
import { contact, hero } from '@/lib/cv'
import './globals.css'

/**
 * next/font self-hosts these at build time — no render-blocking request to
 * Google, and no layout shift from a late swap.
 */
const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '700', '800', '900'],
	variable: '--font-inter',
	display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	weight: ['400', '600', '700'],
	variable: '--font-jakarta',
	display: 'swap',
})

const instrument = Instrument_Serif({
	subsets: ['latin'],
	weight: '400',
	style: ['normal', 'italic'],
	variable: '--font-instrument',
	display: 'swap',
})

export const metadata: Metadata = {
	title: `${contact.name} — ${contact.role}`,
	description: hero.lede,
	openGraph: {
		title: `${contact.name} — ${contact.role}`,
		description: hero.lede,
		type: 'profile',
	},
}

export const viewport: Viewport = {
	themeColor: '#070b0a',
	colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html className={`${inter.variable} ${jakarta.variable} ${instrument.variable}`} lang="en">
			{/* Material Symbols has no next/font equivalent, so it is the one font
			    still loaded by <link>.

			    `precedence` is REQUIRED, not decoration. React 19 only hoists a
			    stylesheet into <head> when it knows where to order it; without
			    precedence the tag stays exactly where it is written — as a direct
			    child of <html>, which is invalid HTML and throws a hydration
			    error plus "Cannot render a <link rel='stylesheet'> outside the
			    main document". `rel="preconnect"` needs no precedence; React
			    hoists those unconditionally.

			    The lint rule below is a Pages Router rule: it wants custom fonts
			    in `pages/_document.js`, and the App Router equivalent of that IS
			    the root layout, which is where this is. False positive. */}
			<link href="https://fonts.googleapis.com" rel="preconnect" />
			<link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
			{/* eslint-disable-next-line @next/next/no-page-custom-font */}
			<link
				href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
				precedence="default"
				rel="stylesheet"
			/>
			<body className="relative min-h-screen overflow-x-hidden bg-background font-body text-base text-on-background selection:bg-primary-container selection:text-background">
				{children}
			</body>
		</html>
	)
}
