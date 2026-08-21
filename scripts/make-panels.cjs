/* eslint-disable */
/**
 * Generates the scroll-scrubbed comic frames used by
 * `src/components/FrameScrub.tsx`.
 *
 *   node scripts/make-panels.cjs
 *
 * Output → src/assets/panels/story-frames.webp   beats 1 + 6
 *          src/assets/panels/schema-frames.webp  beat 2
 *
 * ── Why sprite sheets instead of N files ─────────────────────────────────
 * A 60-file frame sequence is 60 requests and 60 decodes, and on a cold cache
 * the scrubber stutters while the tail is still arriving. One sheet is one
 * request, one decode, and `drawImage` with a source rect is exactly as cheap
 * per frame as drawing a standalone image.
 *
 * ── Why more than one sheet ──────────────────────────────────────────────
 * One sheet PER BEAT, except where beats share art. Beats 1 and 6 share a
 * sheet because they share the grid — that IS the story loop, and it makes
 * beat 6 cost nothing. Beat 2 gets its own file so it is fetched only when the
 * reader reaches beat 2, and so no single sheet grows into the tens of
 * megapixels a browser must hold decoded.
 *
 * ── Why alpha-only, tinted at runtime ────────────────────────────────────
 * The art is white-on-transparent line work; `FrameScrub` tints it with a
 * gradient built from the live theme tokens. That means:
 *   - ONE sheet serves dark and light (VideoBackdrop needs two films because
 *     its footage carries baked-in colour; this doesn't)
 *   - the art can never drift out of sync with the palette in theme.ts
 *   - alpha-only line art compresses far better than the same art flattened
 *     onto a background
 *
 * ── The sequences ────────────────────────────────────────────────────────
 * story-frames.webp
 *   frames 0–47   CELLS — beat 1. A cursor fills spreadsheet cells, decelerating,
 *                 freezes mid-cell, then the grid detaches and drifts apart.
 *   frames 48–59  EMPTY — beat 6. The same grid, cleared, one cursor blinking.
 *                 Periodic over its 12 frames so it loops without a cut.
 * schema-frames.webp
 *   frames 0–39   SCHEMA — beat 2. The same grid again, at the same fill count
 *                 beat 1 froze on; its cells then fly into table rows and the
 *                 foreign keys draw themselves.
 *
 * All three share one grid geometry ON PURPOSE — that shared object is the
 * whole point of the story. Change one, change all three.
 *
 * Keep these numbers in sync with src/scene/storyFrames.ts.
 */
const path = require('path')
const fs = require('fs')

const VENDOR = path.join(__dirname, '..', 'plans', 'active', 'interview-deck', 'node_modules')
function dep(name) {
	try {
		return require(name)
	} catch {
		return require(path.join(VENDOR, name))
	}
}
const { createCanvas } = dep('@napi-rs/canvas')

// ---------------------------------------------------------------- geometry

// Frame aspect deliberately tracks the HUD panel it plays inside (roughly
// square at desktop widths), because FrameScrub draws it with `cover`. A wide
// 16:9 source got cropped hard enough to lose the cursor — which is the
// subject — off the left edge.
const FRAME_W = 448
const FRAME_H = 384
const SHEET_COLS = 8

const CELLS_FRAMES = 48 // beat 1
const EMPTY_FRAMES = 12 // beat 6
const TOTAL = CELLS_FRAMES + EMPTY_FRAMES // 60

const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'panels')


// The spreadsheet itself. One header row of ticks, then the data cells.
// Generous side padding is not decoration: `cover` crops the sides, and the
// cursor starts in column 0. Too little padding and the subject of frame 0 is
// half off-screen. Keep PAD_X comfortably above the widest expected crop.
const PAD_X = 58
const PAD_Y = 26
const COLS = 10
const ROWS = 9 // row 0 is the header
const DATA_CELLS = COLS * (ROWS - 1) // 80

/**
 * The fill stops here, not at DATA_CELLS. The cursor is meant to freeze on an
 * unfinished cell — that unpaid work is what beat 6 comes back to.
 */
const FILL_TARGET = 66

// Phase boundaries within the 48-frame CELLS sequence.
const FILL_END = 31 // 0–31   filling, decelerating
const FREEZE_END = 35 // 32–35  frozen, cursor blinking
//                       36–47  dissolve → hands off to the SCATTER formation

// Ink levels. Alpha is the only channel that carries meaning.
const INK = {
	grid: 0.16,
	header: 0.34,
	tick: 0.5,
	value: 0.62,
	cursor: 1.0,
}

// ---------------------------------------------------------------- helpers

/** Deterministic PRNG — the dissolve must be identical on every re-run. */
function mulberry32(seed) {
	return function () {
		seed |= 0
		seed = (seed + 0x6d2b79f5) | 0
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

const cellW = (FRAME_W - PAD_X * 2) / COLS
const cellH = (FRAME_H - PAD_Y * 2) / ROWS

/** Data cell index (0-based, row-major, skipping the header row) → box. */
function cellBox(i) {
	const c = i % COLS
	const r = Math.floor(i / COLS) + 1 // +1 skips the header
	return { x: PAD_X + c * cellW, y: PAD_Y + r * cellH, w: cellW, h: cellH }
}

function white(ctx, alpha) {
	ctx.strokeStyle = `rgba(255,255,255,${alpha})`
	ctx.fillStyle = `rgba(255,255,255,${alpha})`
}

/** Crisp hairlines: land strokes on the half-pixel. */
function line(ctx, x1, y1, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5)
	ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5)
	ctx.stroke()
}

// ---------------------------------------------------------------- drawing

/**
 * The grid chrome — verticals, horizontals, and the header ticks.
 * `drift` displaces each line along its own seeded vector (the dissolve);
 * `fade` scales every alpha.
 */
function drawGrid(ctx, drift, fade) {
	const rand = mulberry32(1337)
	ctx.lineWidth = 1

	// verticals
	for (let c = 0; c <= COLS; c++) {
		const dx = (rand() - 0.5) * 2 * drift
		const dy = (rand() - 0.5) * 2 * drift * 0.6
		const x = PAD_X + c * cellW + dx
		white(ctx, INK.grid * fade)
		line(ctx, x, PAD_Y + dy, x, FRAME_H - PAD_Y + dy)
	}

	// horizontals — the header rule is brighter than the rest
	for (let r = 0; r <= ROWS; r++) {
		const dx = (rand() - 0.5) * 2 * drift * 0.6
		const dy = (rand() - 0.5) * 2 * drift
		const y = PAD_Y + r * cellH + dy
		white(ctx, (r === 1 ? INK.header : INK.grid) * fade)
		line(ctx, PAD_X + dx, y, FRAME_W - PAD_X + dx, y)
	}

	// header ticks — the column labels, abstracted to short marks
	for (let c = 0; c < COLS; c++) {
		const dx = (rand() - 0.5) * 2 * drift
		const dy = (rand() - 0.5) * 2 * drift
		const x = PAD_X + c * cellW + cellW * 0.22 + dx
		const y = PAD_Y + cellH * 0.55 + dy
		white(ctx, INK.tick * fade)
		ctx.fillRect(x, y, cellW * 0.34, 2)
	}
}

/** A filled cell — the "value" someone typed by hand. `amount` 0→1. */
function drawValue(ctx, i, amount, drift, fade, rand) {
	if (amount <= 0) return
	const b = cellBox(i)
	const dx = (rand() - 0.5) * 2 * drift
	const dy = (rand() - 0.5) * 2 * drift
	const w = b.w * 0.56 * amount
	white(ctx, INK.value * fade)
	ctx.fillRect(b.x + b.w * 0.18 + dx, b.y + b.h * 0.46 + dy, w, 2.5)
}

/** The cursor box, with a caret on its leading edge. */
function drawCursor(ctx, i, alpha) {
	if (alpha <= 0) return
	const b = cellBox(i)
	ctx.lineWidth = 1.5
	white(ctx, INK.cursor * alpha)
	ctx.strokeRect(Math.round(b.x) + 1, Math.round(b.y) + 1, Math.round(b.w) - 2, Math.round(b.h) - 2)
	// the little drag handle in the corner, the way a spreadsheet draws it
	ctx.fillRect(Math.round(b.x + b.w) - 3, Math.round(b.y + b.h) - 3, 3, 3)
}

/** CELLS, frame i of 0…47. */
function drawCellsFrame(ctx, i) {
	const rand = mulberry32(9001)

	let filled, partial, cursorAt, cursorAlpha, drift, fade

	if (i <= FILL_END) {
		// Decelerating fill. A pure ease-out finishes visually by ~60% of the
		// phase and then shows a static grid for the rest — so this is mostly
		// linear with an ease-out blended in. The tick-tick-tick stays legible
		// the whole way down and only *then* grinds to a halt.
		const p = i / FILL_END
		const eased = 0.6 * p + 0.4 * (1 - Math.pow(1 - p, 3))
		const exact = FILL_TARGET * eased
		filled = Math.floor(exact)
		partial = exact - filled
		cursorAt = Math.min(filled, DATA_CELLS - 1)
		cursorAlpha = 1
		drift = 0
		fade = 1
	} else if (i <= FREEZE_END) {
		// Frozen mid-cell. Only the cursor moves, and only by blinking.
		filled = FILL_TARGET
		partial = 0.45
		cursorAt = FILL_TARGET
		cursorAlpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos((i - FILL_END) * 1.9))
		drift = 0
		fade = 1
	} else {
		// Dissolve. Quadratic so it hangs, then goes.
		const d = (i - FREEZE_END) / (CELLS_FRAMES - 1 - FREEZE_END)
		const eased = d * d
		filled = FILL_TARGET
		partial = 0.45
		cursorAt = FILL_TARGET
		cursorAlpha = Math.max(0, 1 - eased * 2.2)
		drift = eased * 96
		fade = 1 - eased
	}

	drawGrid(ctx, drift, fade)
	for (let k = 0; k < filled; k++) drawValue(ctx, k, 1, drift, fade, rand)
	if (partial > 0 && filled < DATA_CELLS) drawValue(ctx, filled, partial, drift, fade, rand)
	drawCursor(ctx, cursorAt, cursorAlpha * fade)
}

/**
 * EMPTY, frame j of 0…11. The same grid, cleared, one cursor waiting.
 * The blink is periodic over the sequence so the loop has no cut.
 */
function drawEmptyFrame(ctx, j) {
	drawGrid(ctx, 0, 1)
	const blink = 0.3 + 0.7 * (0.5 + 0.5 * Math.cos((j / EMPTY_FRAMES) * Math.PI * 2))
	drawCursor(ctx, 0, blink)
}

// ------------------------------------------------------- SCHEMA (beat 2)

/**
 * Beat 2's shot: the spreadsheet becomes a schema.
 *
 * The move that makes it worth animating is that the CELLS THEMSELVES become
 * the fields — each value bar flies to a row inside a table box rather than
 * cross-fading to an unrelated diagram. That is the actual claim of the beat
 * (the manual workflow was not thrown away, it was given a structure), so the
 * art should perform it rather than illustrate it.
 *
 * It opens on the *same* grid, at the same fill count beat 1 froze on, so
 * beats 1 and 2 read as one continuous object.
 */
const SCHEMA_FRAMES = 40
const SCHEMA_GRID_END = 15 // 0–15   the inherited spreadsheet, holding
const SCHEMA_MORPH_END = 33 // 16–33  cells fly into tables, FK lines draw
//                            34–39  settled, crisp, still
// The settle phase is only six frames because nothing moves in it — "order is
// the thing that stops moving" (STORY.md). It was 14; the extra eight were
// byte-identical, so they were sheet weight buying nothing. FrameScrub holds
// the last frame for as long as the pin needs.

/** Three tables. Widths are equal so the settled state has a real grid to it. */
const TABLES = [
	{ x: 42, y: 44, w: 150, h: 148, rows: 8 },
	{ x: 256, y: 44, w: 150, h: 148, rows: 8 },
	{ x: 149, y: 238, w: 150, h: 116, rows: 6 },
]
const T_HEAD = 18
const T_ROW = 15

/**
 * Foreign keys, drawn as elbows: [parentTable, childTable].
 *
 * Both parents relate DOWN into the shared child, and nothing relates
 * sideways. A 0→1 edge was tried and cut: `drawFk` routes bottom-to-top, so
 * between two tables on the same row it drew down, across and back up — which
 * reads as a stray rectangle floating between them, not as a relationship.
 * Two edges into one child is also the more truthful shape for the thing being
 * illustrated.
 */
const FKS = [
	[0, 2],
	[1, 2],
]

/** Flat list of field slots across all tables, in table order. */
const SLOTS = TABLES.flatMap((t) =>
	Array.from({ length: t.rows }, (_, r) => ({
		x: t.x + 13,
		y: t.y + T_HEAD + 9 + r * T_ROW,
	})),
)

function smoothstep(t) {
	const c = Math.min(1, Math.max(0, t))
	return c * c * (3 - 2 * c)
}

/** Table outline + header bar. */
function drawTable(ctx, t, alpha) {
	if (alpha <= 0) return
	ctx.lineWidth = 1
	white(ctx, INK.header * alpha)
	ctx.strokeRect(Math.round(t.x) + 0.5, Math.round(t.y) + 0.5, t.w, t.h)
	// header bar — the table name, abstracted
	white(ctx, INK.tick * alpha)
	ctx.fillRect(t.x + 13, t.y + 8, t.w * 0.42, 3)
	white(ctx, INK.grid * alpha)
	line(ctx, t.x, t.y + T_HEAD, t.x + t.w, t.y + T_HEAD)
}

/**
 * FK elbow between two tables, revealed by length so the relationships appear
 * to be drawn rather than faded on.
 */
function drawFk(ctx, a, b, reveal, alpha) {
	if (reveal <= 0 || alpha <= 0) return
	const from = { x: a.x + a.w / 2, y: a.y + a.h }
	const to = { x: b.x + b.w / 2, y: b.y }
	const midY = from.y + (to.y - from.y) / 2
	// three segments: down, across, down
	const segs = [
		[from.x, from.y, from.x, midY],
		[from.x, midY, to.x, midY],
		[to.x, midY, to.x, to.y],
	]
	const total = segs.reduce((s, [x1, y1, x2, y2]) => s + Math.hypot(x2 - x1, y2 - y1), 0)
	let budget = total * reveal
	ctx.lineWidth = 1
	white(ctx, INK.grid * 1.6 * alpha)
	for (const [x1, y1, x2, y2] of segs) {
		if (budget <= 0) break
		const len = Math.hypot(x2 - x1, y2 - y1)
		const f = Math.min(1, budget / len)
		line(ctx, x1, y1, x1 + (x2 - x1) * f, y1 + (y2 - y1) * f)
		budget -= len
	}
	// endpoint dot, only once the line has actually arrived
	if (reveal >= 0.999) {
		white(ctx, INK.cursor * 0.7 * alpha)
		ctx.fillRect(to.x - 2, to.y - 2, 4, 4)
	}
}

/** SCHEMA, frame i of 0…47. */
function drawSchemaFrame(ctx, i) {
	const rand = mulberry32(4242)

	if (i <= SCHEMA_GRID_END) {
		// Hold on the inherited spreadsheet. Beat 1 ended here; beat 2 starts here.
		drawGrid(ctx, 0, 1)
		for (let k = 0; k < FILL_TARGET; k++) drawValue(ctx, k, 1, 0, 1, rand)
		return
	}

	const settled = i > SCHEMA_MORPH_END
	const m = settled ? 1 : (i - SCHEMA_GRID_END) / (SCHEMA_MORPH_END - SCHEMA_GRID_END)

	// The grid chrome leaves first — structure cannot arrive while the old
	// structure is still on screen.
	drawGrid(ctx, 0, Math.max(0, 1 - m * 1.8))

	// Tables fade in over the middle of the morph.
	const tableAlpha = smoothstep((m - 0.25) / 0.45)
	for (const t of TABLES) drawTable(ctx, t, tableAlpha)

	// Cells fly to their slots, staggered so it ripples rather than snapping
	// as one sheet — same reasoning as LatticeField's per-plate delay.
	for (let k = 0; k < FILL_TARGET; k++) {
		const b = cellBox(k)
		const bx = b.x + b.w * 0.18
		const by = b.y + b.h * 0.46
		const delay = (k / FILL_TARGET) * 0.35
		const t = smoothstep((m - delay) / (1 - 0.35))

		if (k < SLOTS.length) {
			const s = SLOTS[k]
			white(ctx, INK.value)
			ctx.fillRect(bx + (s.x - bx) * t, by + (s.y - by) * t, b.w * 0.56 + (60 - b.w * 0.56) * t, 2.5)
		} else {
			// No room in the schema. These are the columns the workflow carried
			// that the model does not need — they fade rather than fly.
			const a = Math.max(0, 1 - t * 1.5)
			if (a > 0) {
				white(ctx, INK.value * a)
				ctx.fillRect(bx, by, b.w * 0.56, 2.5)
			}
		}
	}

	// Relationships last: they only exist once there are tables to relate.
	const fkReveal = smoothstep((m - 0.62) / 0.38)
	for (const [a, b] of FKS) drawFk(ctx, TABLES[a], TABLES[b], fkReveal, tableAlpha)
}

// ------------------------------------------- SHOTS 3-5 (beats 3, 4, 5)

/**
 * The back half of the film. One subject throughout — the schema from beat 2 —
 * so the six shots read as one continuous take rather than six clips.
 *
 *   3 REPLICATE  the one schema shrinks into a slot and four more arrive
 *   4 VERIFY     a scan sweeps the five; each is ticked as it passes
 *   5 RECORD     the five collapse into dated rows on a ledger
 *
 * Five instances because there are five projects. The count is the content,
 * not a composition choice.
 */
const SHOT_FRAMES = 32

const GLYPH_W = 110
const GLYPH_H = 84
const SLOTS_5 = [
	{ x: 45, y: 98 },
	{ x: 169, y: 98 },
	{ x: 293, y: 98 },
	{ x: 107, y: 202 },
	{ x: 231, y: 202 },
].map((s) => ({ ...s, w: GLYPH_W, h: GLYPH_H }))

/** Where beat 2 leaves the schema: one instance, near full frame. */
const GLYPH_FULL = { x: 60, y: 70, w: 328, h: 244 }

function lerpRect(a, b, t) {
	return {
		x: a.x + (b.x - a.x) * t,
		y: a.y + (b.y - a.y) * t,
		w: a.w + (b.w - a.w) * t,
		h: a.h + (b.h - a.h) * t,
	}
}

/** A schema, abstracted: outline, header bar, a few field rows. */
function drawGlyph(ctx, r, alpha, rows = 4) {
	if (alpha <= 0) return
	ctx.lineWidth = 1
	white(ctx, INK.header * alpha)
	ctx.strokeRect(Math.round(r.x) + 0.5, Math.round(r.y) + 0.5, Math.round(r.w), Math.round(r.h))

	const headH = Math.max(8, r.h * 0.16)
	white(ctx, INK.tick * alpha)
	ctx.fillRect(r.x + r.w * 0.09, r.y + headH * 0.42, r.w * 0.44, Math.max(2, r.h * 0.026))
	white(ctx, INK.grid * alpha)
	line(ctx, r.x, r.y + headH, r.x + r.w, r.y + headH)

	const gap = (r.h - headH) / (rows + 1)
	for (let i = 0; i < rows; i++) {
		white(ctx, INK.value * alpha)
		ctx.fillRect(r.x + r.w * 0.09, r.y + headH + gap * (i + 0.7), r.w * 0.62, Math.max(2, r.h * 0.022))
	}
}

/** Checkmark inside a glyph's top-right corner. */
function drawTick(ctx, r, alpha) {
	if (alpha <= 0) return
	const cx = r.x + r.w - 17
	const cy = r.y + 11
	ctx.lineWidth = 1.8
	white(ctx, INK.cursor * alpha)
	ctx.beginPath()
	ctx.moveTo(cx - 4, cy)
	ctx.lineTo(cx - 1, cy + 3.5)
	ctx.lineTo(cx + 5, cy - 4)
	ctx.stroke()
}

/** SHOT 3 — REPLICATE. One becomes five. */
function drawReplicateFrame(ctx, i) {
	const p = i / (SHOT_FRAMES - 1)

	// The original travels to slot 0 over the first two thirds.
	const travel = smoothstep(p / 0.66)
	drawGlyph(ctx, lerpRect(GLYPH_FULL, SLOTS_5[0], travel), 1, travel > 0.5 ? 4 : 6)

	// The other four arrive one at a time, and only once the first has landed —
	// a copy cannot precede the thing it is a copy of.
	for (let k = 1; k < SLOTS_5.length; k++) {
		const delay = 0.55 + (k - 1) * 0.1
		const t = smoothstep((p - delay) / 0.3)
		if (t <= 0) continue
		const s = SLOTS_5[k]
		// Scale up from 0.92, never from nothing.
		const g = 0.92 + 0.08 * t
		drawGlyph(
			ctx,
			{ x: s.x + (s.w * (1 - g)) / 2, y: s.y + (s.h * (1 - g)) / 2, w: s.w * g, h: s.h * g },
			t,
		)
	}
}

/** SHOT 4 — VERIFY. A scan sweeps the set; each instance is ticked as it passes. */
function drawVerifyFrame(ctx, i) {
	const p = i / (SHOT_FRAMES - 1)
	// The scan runs edge to edge over the first 80%, then leaves.
	const scanX = PAD_X + (FRAME_W - PAD_X * 2) * smoothstep(p / 0.8)
	const scanAlpha = 1 - smoothstep((p - 0.8) / 0.2)

	for (const s of SLOTS_5) {
		const passed = scanX > s.x + s.w * 0.5
		drawGlyph(ctx, s, passed ? 1 : 0.55)
		drawTick(ctx, s, passed ? smoothstep((scanX - (s.x + s.w * 0.5)) / 40) : 0)
	}

	if (scanAlpha > 0) {
		ctx.lineWidth = 1
		white(ctx, INK.cursor * 0.55 * scanAlpha)
		line(ctx, scanX, PAD_Y, scanX, FRAME_H - PAD_Y)
	}
}

/** SHOT 5 — RECORD. The set collapses into dated rows. */
function drawRecordFrame(ctx, i) {
	const p = i / (SHOT_FRAMES - 1)
	const ROW_X = 96
	const ROW_W = 268
	const ROW_TOP = 108
	const ROW_GAP = 42

	for (let k = 0; k < SLOTS_5.length; k++) {
		const delay = k * 0.07
		const t = smoothstep((p - delay) / (1 - 0.35))
		const row = { x: ROW_X, y: ROW_TOP + k * ROW_GAP, w: ROW_W, h: 4 }
		const r = lerpRect(SLOTS_5[k], row, t)

		if (t < 0.85) {
			drawGlyph(ctx, r, 1 - smoothstep((t - 0.5) / 0.35), 4)
		}
		if (t > 0.45) {
			const a = smoothstep((t - 0.45) / 0.4)
			// the row itself
			white(ctx, INK.value * a)
			ctx.fillRect(r.x, r.y, r.w, 3)
			// the date tick to its left — this is a dated ledger, not a list
			white(ctx, INK.tick * a)
			ctx.fillRect(ROW_X - 40, r.y, 28, 2)
		}
	}

	// The ledger's spine, drawn last and only once rows exist to hang on it.
	const spine = smoothstep((p - 0.55) / 0.45)
	if (spine > 0) {
		ctx.lineWidth = 1
		white(ctx, INK.grid * spine)
		line(ctx, ROW_X - 10, ROW_TOP - 14, ROW_X - 10, ROW_TOP + (SLOTS_5.length - 1) * ROW_GAP + 16)
	}
}

// ---------------------------------------------------------------- build

/**
 * One sheet PER BEAT, not one sheet for everything.
 *
 * Beats 1 and 6 share a sheet because they share art — that is the story loop,
 * and it makes beat 6 free. Beat 2 gets its own file so it can be fetched only
 * when the reader actually reaches beat 2, and so neither sheet grows into the
 * tens of megapixels that a browser has to hold decoded.
 */
const SHEETS = [
	{
		file: 'story-frames.webp',
		count: TOTAL,
		draw: (ctx, n) => (n < CELLS_FRAMES ? drawCellsFrame(ctx, n) : drawEmptyFrame(ctx, n - CELLS_FRAMES)),
		ranges: `CELLS 0–${CELLS_FRAMES - 1}   EMPTY ${CELLS_FRAMES}–${TOTAL - 1}`,
	},
	{
		file: 'schema-frames.webp',
		count: SCHEMA_FRAMES,
		draw: (ctx, n) => drawSchemaFrame(ctx, n),
		ranges: `SCHEMA 0–${SCHEMA_FRAMES - 1}`,
	},
	{
		file: 'replicate-frames.webp',
		count: SHOT_FRAMES,
		draw: (ctx, n) => drawReplicateFrame(ctx, n),
		ranges: `REPLICATE 0–${SHOT_FRAMES - 1}`,
	},
	{
		file: 'verify-frames.webp',
		count: SHOT_FRAMES,
		draw: (ctx, n) => drawVerifyFrame(ctx, n),
		ranges: `VERIFY 0–${SHOT_FRAMES - 1}`,
	},
	{
		file: 'record-frames.webp',
		count: SHOT_FRAMES,
		draw: (ctx, n) => drawRecordFrame(ctx, n),
		ranges: `RECORD 0–${SHOT_FRAMES - 1}`,
	},
]

async function buildSheet(spec) {
	const rows = Math.ceil(spec.count / SHEET_COLS)
	const sheetW = SHEET_COLS * FRAME_W
	const sheetH = rows * FRAME_H

	const sheet = createCanvas(sheetW, sheetH)
	const sctx = sheet.getContext('2d')

	// One scratch canvas reused per frame, so each frame starts genuinely clear
	// rather than inheriting whatever the previous one left in the sheet.
	const frame = createCanvas(FRAME_W, FRAME_H)
	const fctx = frame.getContext('2d')

	for (let n = 0; n < spec.count; n++) {
		fctx.clearRect(0, 0, FRAME_W, FRAME_H)
		spec.draw(fctx, n)
		sctx.drawImage(frame, (n % SHEET_COLS) * FRAME_W, Math.floor(n / SHEET_COLS) * FRAME_H)
	}

	const out = path.join(OUT_DIR, spec.file)
	const buf = await sheet.encode('webp', 82)
	fs.writeFileSync(out, buf)

	console.log(`✓ ${path.relative(process.cwd(), out)}`)
	console.log(`  ${spec.count} frames · ${FRAME_W}×${FRAME_H} · sheet ${sheetW}×${sheetH} · ${(buf.length / 1024).toFixed(1)} KB`)
	console.log(`  ${spec.ranges}`)
	return buf.length
}

async function main() {
	fs.mkdirSync(OUT_DIR, { recursive: true })
	let total = 0
	for (const spec of SHEETS) total += await buildSheet(spec)
	console.log(`— total ${(total / 1024).toFixed(1)} KB across ${SHEETS.length} sheets`)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
