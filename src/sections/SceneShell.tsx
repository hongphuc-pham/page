import { Typography, type SxProps, type Theme } from '@mui/material'
import { type CSSProperties, type ReactNode, type RefObject } from 'react'
import { chapters } from '../data/cv'
import { fonts, tokens } from '../theme'

/**
 * Presentational building blocks for the six beats. The pin/scrub logic
 * lives in ./useSceneTimeline (kept separate so this file only exports
 * components — react-refresh friendly).
 *
 * ── A note on why the styles are hoisted ──────────────────────────────────
 * Every inline `sx={{ … }}` literal is checked against MUI's `SxProps<Theme>`,
 * which is already an enormous union; each responsive value (`{ xs, md }`)
 * multiplies it again. Enough of them in one file and the compiler gives up
 * with TS2590, "union type too complex to represent" — which is why this
 * project's `build` script runs Vite alone and keeps `tsc` in a separate
 * `typecheck` script.
 *
 * MUI's <Box> is the worst offender — it carries the whole system-props type
 * on top of sx — so the layout and decoration here are plain elements with
 * classes in theme.ts MuiCssBaseline, and only <Typography> (a much smaller
 * type) remains.
 * Its styles are hoisted into `SxProps<Theme>` constants so each is checked
 * once against a known annotation rather than re-inferred at every JSX site.
 * Keep both habits when adding to this file.
 */

/** id → "0N" index + chapter label, for the HUD section readout. */
function sectionMeta(id: string) {
	const i = chapters.findIndex((c) => c.id === id)
	return { num: String(i + 1).padStart(2, '0'), label: chapters[i]?.label ?? '' }
}

/**
 * L-shaped accent bracket clamped to one corner of the HUD panel.
 *
 * Plain inline style, and spread branches rather than computed keys: an `sx`
 * object keyed by a union (`[top ? 'top' : 'bottom']`) is a particularly bad
 * offender for the blow-up described above. Same reason GrainOverlay uses a
 * plain style object.
 */
const CORNER_BORDER = `2px solid ${tokens.primary}`

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
	const top = pos[0] === 't'
	const left = pos[1] === 'l'
	const style: CSSProperties = {
		position: 'absolute',
		width: 13,
		height: 13,
		opacity: 0.75,
		...(top ? { top: -1, borderTop: CORNER_BORDER } : { bottom: -1, borderBottom: CORNER_BORDER }),
		...(left ? { left: -1, borderLeft: CORNER_BORDER } : { right: -1, borderRight: CORNER_BORDER }),
	}
	return <div aria-hidden className="hud-corner" style={style} />
}

const SEC_LABEL_SX: SxProps<Theme> = {
	fontFamily: fonts.mono,
	fontSize: 10.5,
	letterSpacing: '0.22em',
	textTransform: 'uppercase',
	color: tokens.text.muted,
	whiteSpace: 'nowrap',
}

export function SceneShell({
	id,
	rootRef,
	children,
	maxWidth = 600,
}: {
	id: string
	rootRef: RefObject<HTMLElement>
	children: ReactNode
	maxWidth?: number
}) {
	const meta = sectionMeta(id)
	return (
		<section id={id} ref={rootRef} className="scene-section">
			{/* Contrast scrim, only active below 1100px where the canvas is still a
			    full-bleed backdrop. At and above that width the stage has its own
			    column and there is nothing to scrim. Styled in theme.ts — see above. */}
			<div aria-hidden className="scene-scrim" />

			{/* sci-fi HUD board: framed panel with corner brackets, a section
			    readout, and a faint scanline. Fades/moves in–out via the scene's
			    own GSAP timeline (it targets .scene-inner). */}
			<div className="scene-inner" style={{ maxWidth }}>
				{/* header readout */}
				<div className="hud-header">
					<div aria-hidden className="hud-dot" />
					<Typography sx={SEC_LABEL_SX}>
						SEC {meta.num}/{String(chapters.length).padStart(2, '0')} · {meta.label}
					</Typography>
					<div aria-hidden className="hud-rule" />
				</div>

				{children}

				{/* corner brackets */}
				<Corner pos="tl" />
				<Corner pos="tr" />
				<Corner pos="bl" />
				<Corner pos="br" />

				{/* faint scanline sheen */}
				<div aria-hidden className="hud-scanline" />
			</div>
		</section>
	)
}

const KICKER_SX: SxProps<Theme> = {
	fontFamily: fonts.mono,
	fontSize: 12,
	letterSpacing: '0.24em',
	textTransform: 'uppercase',
	color: tokens.primary,
	mb: 2.5,
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<Typography className={className} sx={KICKER_SX}>
			{children}
		</Typography>
	)
}

const HEADLINE_LG_SX: SxProps<Theme> = {
	fontSize: { xs: 44, sm: 62, md: 82 },
	lineHeight: 1.02,
	letterSpacing: '-0.02em',
	mb: 3,
}

const HEADLINE_MD_SX: SxProps<Theme> = {
	fontSize: { xs: 34, sm: 44, md: 56 },
	lineHeight: 1.02,
	letterSpacing: '-0.02em',
	mb: 3,
}

export function Headline({
	children,
	className,
	size = 'lg',
}: {
	children: ReactNode
	className?: string
	size?: 'lg' | 'md'
}) {
	return (
		<Typography variant="h2" className={className} sx={size === 'lg' ? HEADLINE_LG_SX : HEADLINE_MD_SX}>
			{children}
		</Typography>
	)
}

const BODY_SX: SxProps<Theme> = {
	color: tokens.text.secondary,
	fontSize: { xs: 16, md: 18 },
	lineHeight: 1.7,
	mb: 2,
}

export function Body({
	children,
	className,
	maxWidth = 620,
	centered = false,
}: {
	children: ReactNode
	className?: string
	maxWidth?: number
	centered?: boolean
}) {
	// Per-instance values go on `style` so BODY_SX stays a hoisted constant.
	const inline: CSSProperties = { maxWidth, marginInline: centered ? 'auto' : 0 }
	return (
		<Typography className={className} sx={BODY_SX} style={inline}>
			{children}
		</Typography>
	)
}
