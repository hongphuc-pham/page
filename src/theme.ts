import { createTheme } from '@mui/material/styles'

// Concrete color values per mode. Drive everything else off these.
export const palettes = {
	dark: {
		bg: '#0A0A0B',
		bgElevated: '#101012',
		surface: '#131315',
		card: '#17171A',
		bodyBg: '#070708',
		line: 'rgba(240,236,226,0.10)',
		lineSoft: 'rgba(240,236,226,0.05)',
		textPrimary: '#F1ECE2',
		textSecondary: '#ABA79D',
		textMuted: '#726E66',
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
		pillLimeBg: 'rgba(198,255,61,0.06)',
		pillLimeBorder: 'rgba(198,255,61,0.28)',
		primaryTint: 'rgba(124,231,255,0.05)',
		primaryBorder: 'rgba(124,231,255,0.25)',
		primaryGlow: 'rgba(124,231,255,0.14)',
		spotlight: 'rgba(124,231,255,0.16)',
		scrimH: 'linear-gradient(90deg, rgba(7,7,8,0.88) 0%, rgba(7,7,8,0.55) 38%, rgba(7,7,8,0) 62%)',
		scrimV: 'linear-gradient(180deg, rgba(7,7,8,0.55), rgba(7,7,8,0.1) 55%, rgba(7,7,8,0.78))',
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
		pillLimeBg: 'rgba(79,138,18,0.08)',
		pillLimeBorder: 'rgba(79,138,18,0.32)',
		primaryTint: 'rgba(0,145,181,0.06)',
		primaryBorder: 'rgba(0,145,181,0.28)',
		primaryGlow: 'rgba(0,145,181,0.14)',
		spotlight: 'rgba(0,145,181,0.12)',
		scrimH: 'linear-gradient(90deg, rgba(237,239,244,0.94) 0%, rgba(237,239,244,0.62) 38%, rgba(237,239,244,0) 62%)',
		scrimV: 'linear-gradient(180deg, rgba(237,239,244,0.6), rgba(237,239,244,0.15) 55%, rgba(237,239,244,0.82))',
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
	pillLime: {
		bg: 'var(--pill-lime-bg)',
		border: 'var(--pill-lime-border)',
	},
	primaryTint: 'var(--primary-tint)',
	primaryBorder: 'var(--primary-border)',
	primaryGlow: 'var(--primary-glow)',
	spotlight: 'var(--spotlight)',
	selection: 'var(--selection-bg)',
	scrimH: 'var(--scrim-h)',
	scrimV: 'var(--scrim-v)',
}

export const fonts = {
	// Warm editorial serif for display — carries the cinematic tone.
	display: '"Fraunces", "Times New Roman", Georgia, serif',
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
		'--pill-lime-bg': p.pillLimeBg,
		'--pill-lime-border': p.pillLimeBorder,
		'--primary-tint': p.primaryTint,
		'--primary-border': p.primaryBorder,
		'--primary-glow': p.primaryGlow,
		'--spotlight': p.spotlight,
		'--scrim-h': p.scrimH,
		'--scrim-v': p.scrimV,
	}
}

/** One `selector { --var: value; … }` block of CSS text. */
function varsBlock(selector: string, p: Palette): string {
	const body = Object.entries(paletteToVars(p))
		.map(([k, v]) => `\t${k}: ${v};`)
		.join('\n')
	return `${selector} {\n${body}\n}`
}

/**
 * Global CSS, as a STRING rather than a style object.
 *
 * MUI accepts either for `MuiCssBaseline.styleOverrides`, but the object form
 * is checked against `CSSObject`, a large recursive type. A template string
 * costs the type checker nothing, and none of this needs a theme callback —
 * every value is a literal or a CSS variable.
 *
 * Measured, so nobody re-litigates it: switching this block from object to
 * string did NOT clear the project's TS2590 (see sections/SceneShell.tsx).
 * That error comes from MUI v5's `Box` type — a bare `<Box>` with no props is
 * enough to trigger it — and only an MUI v6+ upgrade or dropping `Box` will
 * actually fix it. The string form is kept because it is cheaper and reads as
 * plain CSS, not because it solved that.
 *
 * NOTE: this is the ONLY global stylesheet that is actually loaded.
 * `src/index.css` exists but is imported nowhere; fonts come from a <link> in
 * index.html. Put new global CSS here.
 */
const GLOBAL_CSS = `
${varsBlock(':root', palettes.dark)}
${varsBlock('[data-theme="dark"]', palettes.dark)}
${varsBlock('[data-theme="light"]', palettes.light)}

/* Custom easing curves. The built-in CSS easings are too weak to read as
   intentional. Never ease-in for UI — it delays the first frames, exactly
   when the user is watching. */
html {
	--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
	--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

	/* ---- The one page grid ----------------------------------------------
	   Content column and 3D stage are derived from the SAME four numbers, so
	   the fixed-position canvas lands exactly where a grid track would put it.
	   This is the fix for the old layout: the canvas used to be "inset: 0"
	   full-bleed with a gradient scrim pretending to be a column.
	   --rail centres the pair once the viewport is wider than they need. */
	--content-w: clamp(420px, 44vw, 660px);
	--stage-w: clamp(320px, 32vw, 460px);
	--stage-gap: clamp(32px, 4vw, 64px);
	--rail: max(40px, calc((100vw - (var(--content-w) + var(--stage-gap) + var(--stage-w))) / 2));
	--stage-y: clamp(56px, 8vh, 96px);
}

/* Stacking context so VideoBackdrop's z-index:-1 paints above the body
   background rather than disappearing behind it. */
#root { isolation: isolate; }

/* note: no CSS scroll-behavior — Lenis owns smooth scrolling */
body {
	background-color: var(--body-bg);
	color: var(--text-primary);
	font-family: ${fonts.body};
	font-feature-settings: "cv11", "ss01", "ss03", "cv02";
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-rendering: optimizeLegibility;
	transition: background-color 240ms ease, color 240ms ease;
}

section[id] { scroll-margin-top: 24px; }
*::selection { background: var(--selection-bg); }

/* ---- Scene layout & HUD chrome (see sections/SceneShell.tsx) ----
   Plain classes rather than MUI <Box sx>: Box carries the entire
   system-props type on top of SxProps, and enough of them in one file tips
   tsc into TS2590. Static layout and decoration need no theme callback.
   Spacing mirrors MUI's 8px unit; breakpoints md=900, lg=1200. */
.scene-section {
	min-height: 100vh;
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 64px 24px;
}
@media (min-width: 900px) { .scene-section { padding: 80px; } }

/* Two-column layout. Below this width there is not enough room for a content
   column AND a stage, so the canvas stays a full-bleed ambient backdrop and
   the text takes the whole page — see .story-stage. */
@media (min-width: 1100px) {
	.scene-section {
		padding-block: var(--stage-y);
		padding-inline: var(--rail) calc(var(--rail) + var(--stage-w) + var(--stage-gap));
	}
}

/* Contrast scrim. Only earns its place while the canvas is full-bleed behind
   the text; once the stage has its own column there is nothing to scrim. */
.scene-scrim {
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	background: var(--scrim-v);
}
@media (min-width: 1100px) { .scene-scrim { background: none; } }

/* ---- Comic frame layer (see components/FrameScrub.tsx) --------------------
   The scroll-scrubbed art for a beat, living INSIDE the HUD panel so the panel
   frames it the way a comic gutter frames a panel.

   z-index: -1 is load-bearing and subtle. .scene-inner has backdrop-filter,
   which makes it a stacking context — so a negative z-index child is trapped
   inside it and paints in the one slot we want: above the panel's own
   background, below the copy. Without it the canvas is absolutely positioned
   and would paint OVER the static text; clamped to the content column outside
   the panel instead, it would be hidden by the panel's background entirely.
   Both were tried. This is the slot that works. */
.scene-frames {
	position: absolute;
	inset: 0;
	z-index: -1;
	border-radius: inherit;
	overflow: hidden;
	pointer-events: none;
}

/* ---- Degree cards (see sections/Scene2Foundation.tsx) --------------------
   Was <Stack><Box sx={…}>; moved here because that pair tips tsc over TS2590.
   Values are the MUI ones it replaced, resolved: p 2.5 = 20px, spacing 2 =
   16px, borderRadius 2.5 = 2.5 x shape.borderRadius(14) = 35px. sm = 600. */
.edu-grid {
	display: flex;
	flex-direction: column;
	gap: 16px;
}
@media (min-width: 600px) { .edu-grid { flex-direction: row; } }

/* ---- Beat 4 pull quote (see sections/Scene4Approach.tsx) -----------------
   The sentence the whole METHOD beat exists to earn, lifted out of the body
   paragraph. Display serif at body-adjacent size so it reads as the headline's
   second half rather than a third heading; the primary rail deliberately
   borrows the .ba language from beat 2, because it makes the same kind of
   claim. Class rather than sx — see the TS2590 note above .edu-grid.
   NB: this whole block is inside a JS template literal — never type a
   backtick in these comments, it ends the string and the page dies. */
.pull-line {
	margin: 16px 0;
	padding-left: 16px;
	max-width: 520px;
	font-family: ${fonts.display};
	font-size: 19px;
	line-height: 1.4;
	color: var(--text-primary);
	border-left: 2px solid var(--primary);
}
@media (min-width: 600px) { .pull-line { font-size: 22px; } }

/* ---- Beat 4 rule panels (see sections/Scene4Approach.tsx) ----------------
   Five practices, five panels. minmax(160px) lands 3 + 2 inside the 640px
   content panel, which is a deliberate comic rhythm and leaves each panel room
   for two words per line. 112px gave 4 + 1, which reads as a leftover; five
   across cramps every label to one word per line.
   auto-fit, not a fixed column count, so the row still collapses gracefully
   in the single-column layout below 1100px.
   NB: no backticks in this string, comments included — see .pull-line. */
.rule-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: 8px;
	margin: 20px 0 4px;
}

.rule-panel {
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding: 11px 12px 12px;
	border: 1px solid var(--line);
	border-radius: 4px;
	background: var(--primary-tint);
}
.rule-panel > b {
	font-family: ${fonts.mono};
	font-weight: 500;
	font-size: 12px;
	letter-spacing: 0.04em;
	color: var(--primary);
}
.rule-panel > span {
	font-size: 12px;
	line-height: 1.45;
	color: var(--text-muted);
}

.edu-card {
	flex: 1;
	padding: 20px;
	border: 1px solid var(--line);
	border-radius: 35px;
	background: var(--surface);
	backdrop-filter: blur(10px);
}

/* ---- The 3D stage ---------------------------------------------------------
   Below 1100px: an unframed, dimmed full-bleed backdrop.
   At 1100px and up: a real framed panel occupying the grid's second column,
   with the same border, radius, blur and shadow language as .scene-inner —
   so the two halves of the page read as one instrument, not a card floating
   next to a stray planet. */
.story-stage {
	position: fixed;
	inset: 0;
	z-index: 0;
	pointer-events: none;
	opacity: 0.4;
	transition: opacity 300ms ease;
}
@media (min-width: 1100px) {
	.story-stage {
		inset: var(--stage-y) var(--rail) var(--stage-y) auto;
		width: var(--stage-w);
		opacity: 1;
		border: 1px solid var(--primary-border);
		border-radius: 12px;
		overflow: hidden;
		background: var(--sidebar-bg);
		backdrop-filter: blur(10px);
		box-shadow: 0 24px 70px -34px rgba(0, 0, 0, 0.75), inset 0 0 0 1px var(--line-soft);
	}
}

/* Soft light pooled behind the field so the plates never float on flat black. */
.story-stage-glow {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background: radial-gradient(70% 55% at 50% 45%, var(--spotlight) 0%, transparent 70%);
}

/* HUD readout pinned to the stage's foot — the counterpart to .hud-header on
   the content panel. Hidden until the stage is a real framed column. */
.story-stage-readout {
	position: absolute;
	left: 14px;
	right: 14px;
	bottom: 12px;
	display: none;
	justify-content: space-between;
	gap: 12px;
	font-family: ${fonts.mono};
	font-size: 10px;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--text-muted);
	pointer-events: none;
}
@media (min-width: 1100px) { .story-stage-readout { display: flex; } }

/* Progress of the current formation, drawn as a hairline under the readout. */
.story-stage-bar {
	position: absolute;
	left: 14px;
	right: 14px;
	bottom: 30px;
	height: 1px;
	background: var(--line);
	pointer-events: none;
	display: none;
}
@media (min-width: 1100px) { .story-stage-bar { display: block; } }

.story-stage-bar > i {
	display: block;
	height: 100%;
	width: 0%;
	background: var(--primary);
	transform-origin: left center;
}

.scene-inner {
	position: relative;
	width: 100%;
	padding: 18px 20px 22px;
	border-radius: 10px;
	border: 1px solid var(--primary-border);
	background: var(--sidebar-bg);
	backdrop-filter: blur(10px);
	box-shadow: 0 24px 70px -34px rgba(0, 0, 0, 0.75), inset 0 0 0 1px var(--line-soft);
}
@media (min-width: 900px) { .scene-inner { padding: 22px 28px 26px; } }

/* ---- Before → After → Result (see sections/Scene2Foundation.tsx) ----
   The site's whole argument, in three rows. The rail down the left is what
   makes it read as one movement rather than three unrelated bullets: it runs
   muted → primary → accent, the same journey the 3D field makes. */
.ba {
	position: relative;
	margin: 4px 0 26px;
	padding-left: 22px;
}
.ba::before {
	content: '';
	position: absolute;
	left: 3px;
	top: 10px;
	bottom: 10px;
	width: 1px;
	opacity: 0.6;
	background: linear-gradient(180deg, var(--text-muted), var(--primary) 55%, var(--accent));
}
.ba-row { position: relative; padding: 9px 0; }
.ba-row::before {
	content: '';
	position: absolute;
	left: -22px;
	top: 15px;
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: var(--bg);
	border: 1px solid currentColor;
}
.ba-row--before { color: var(--text-muted); }
.ba-row--after { color: var(--primary); }
.ba-row--result { color: var(--accent); }

.ba-label {
	font-family: ${fonts.mono};
	font-size: 10px;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	margin-bottom: 5px;
}
.ba-text {
	color: var(--text-secondary);
	font-size: 16px;
	line-height: 1.65;
	max-width: 56ch;
}
@media (min-width: 900px) { .ba-text { font-size: 17px; } }
.ba-row--result .ba-text { color: var(--text-primary); }

/* Award pill (sections/Scene2Foundation.tsx). A class, not <Box sx>, because a
   bare MUI <Box> on its own is enough to trip TS2590 in this project. */
.award-pill {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 6px 14px;
	margin-bottom: 32px;
	border-radius: 999px;
	border: 1px solid var(--pill-lime-border);
	background: var(--pill-lime-bg);
	font-family: ${fonts.mono};
	font-size: 12px;
	letter-spacing: 0.08em;
	color: var(--text-primary);
}
.award-pill > span:first-child { font-size: 14px; letter-spacing: 0; }

/* ---- Beat 3: two card shapes (see sections/Scene3Now.tsx) ----------------
   NB: no backticks anywhere in this string, comments included — see .pull-line.
   The honesty rule in data/cv.ts forbids inventing a before-line, so
   ElevexAI and AIDFest have none. Rather than leave a hole where the other
   three cards have content, the two kinds of card get visibly different
   shapes — the asymmetry then reads as a decision rather than an omission.

   A card WITH a grounded before-line gets a comic caption box and an AFTER
   marker on the detail beneath it, so the card performs the same
   before/after move the whole site argues. A card WITHOUT one gets neither,
   and its detail line simply starts at the top. No new words either way:
   every string on screen is still straight out of cv.ts. */
.card-before {
	position: relative;
	display: flex;
	align-items: baseline;
	gap: 8px;
	margin-bottom: 10px;
	padding: 7px 10px 8px;
	border: 1px solid var(--line);
	border-left: 2px solid var(--text-muted);
	border-radius: 3px;
	background: var(--primary-tint);
	font-family: ${fonts.mono};
	font-size: 11px;
	line-height: 1.5;
	letter-spacing: 0.02em;
	color: var(--text-secondary);
}
.card-before > b {
	font-weight: 400;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	font-size: 9.5px;
	flex-shrink: 0;
	opacity: 0.9;
}

/* The AFTER label that makes the pair legible as a pair. */
.card-after {
	display: flex;
	align-items: baseline;
	gap: 8px;
}
.card-detail {
	color: var(--text-secondary);
	line-height: 1.55;
}
.card-after > b {
	font-family: ${fonts.mono};
	font-weight: 400;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	font-size: 9.5px;
	flex-shrink: 0;
	color: var(--primary);
	opacity: 0.9;
}

.hud-header {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 16px;
}
@media (min-width: 900px) { .hud-header { margin-bottom: 20px; } }

.hud-dot {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	flex-shrink: 0;
	background: var(--primary);
	box-shadow: 0 0 0 3px var(--primary-glow);
}

.hud-rule {
	flex: 1;
	height: 1px;
	background: linear-gradient(90deg, var(--primary-border), transparent);
}

.hud-scanline {
	position: absolute;
	inset: 0;
	border-radius: inherit;
	pointer-events: none;
	background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(255, 255, 255, 0.014) 3px 4px);
}
`

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
		h1: { fontFamily: fonts.display, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.0 },
		h2: { fontFamily: fonts.display, fontWeight: 500, letterSpacing: '-0.018em', lineHeight: 1.03 },
		h3: { fontFamily: fonts.display, fontWeight: 500, letterSpacing: '-0.015em' },
		h4: { fontFamily: fonts.display, fontWeight: 500, letterSpacing: '-0.012em' },
		h5: { fontFamily: fonts.display, fontWeight: 500, letterSpacing: '-0.01em' },
		h6: { fontFamily: fonts.display, fontWeight: 500, letterSpacing: '-0.008em' },
		body1: { letterSpacing: '-0.005em' },
		body2: { letterSpacing: '-0.003em' },
		subtitle2: { fontWeight: 600 },
		button: { fontWeight: 500, letterSpacing: '0' },
		overline: { fontFamily: fonts.mono, fontWeight: 500, letterSpacing: '0.14em' },
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: GLOBAL_CSS,
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
					// Press feedback. Without it a button gives no sign it heard the
					// click until the page reacts; the dip is what makes the UI feel
					// like it is listening. Subtle on purpose — 0.97, not 0.9.
					transition: 'transform 160ms var(--ease-out), background-color 200ms ease, border-color 200ms ease',
					'&:active': { transform: 'scale(0.97)' },
				},
				containedPrimary: {
					backgroundColor: 'var(--primary)',
					color: '#06121A',
					// Touch devices fire :hover on tap and leave it stuck until you
					// tap elsewhere. Gate hover to real pointers.
					'@media (hover: hover) and (pointer: fine)': {
						'&:hover': { backgroundColor: 'var(--button-contained-hover)' },
					},
				},
				outlinedPrimary: {
					borderColor: 'var(--line)',
					color: 'var(--text-primary)',
					'@media (hover: hover) and (pointer: fine)': {
						'&:hover': { borderColor: 'var(--primary)', backgroundColor: 'var(--button-outlined-hover-bg)' },
					},
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
