import type { CSSProperties } from 'react'

const NOISE_SVG = encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>',
)

// Plain inline style (not MUI sx) — all values are static CSS variables, so no
// theme callback is needed, and this avoids MUI's sx union-type blowup (TS2590).
const grainStyle: CSSProperties = {
	position: 'fixed',
	inset: 0,
	zIndex: 2,
	pointerEvents: 'none',
	// half the painterly-background strength — this grain sits over text
	opacity: 'calc(var(--painter-noise-opacity) * 0.5)' as unknown as number,
	mixBlendMode: 'overlay',
	backgroundImage: `url("data:image/svg+xml;utf8,${NOISE_SVG}")`,
	backgroundSize: '320px 320px',
}

/** Subtle film-grain overlay above the canvas, below the UI chrome. */
export function GrainOverlay() {
	return <div aria-hidden style={grainStyle} />
}
