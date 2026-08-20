import schemaSheetUrl from '../assets/panels/schema-frames.webp'
import storySheetUrl from '../assets/panels/story-frames.webp'

/**
 * Geometry of the comic frame sheets drawn by `components/FrameScrub.tsx`.
 *
 * MUST match the constants at the top of `scripts/make-panels.cjs`. Re-run
 * that script after changing anything here (or, more usefully, change it
 * there and mirror the numbers back).
 *
 * The sheets are white-on-transparent line art; FrameScrub tints them from the
 * live theme tokens, which is why one sheet serves both dark and light.
 *
 * One sheet per beat, except where beats share art: beats 1 and 6 share the
 * grid, which is the story loop and makes beat 6 free. Beat 2 is a separate
 * file so it is only fetched once the reader gets there.
 */

export const FRAME_W = 448
export const FRAME_H = 384
export const SHEET_COLS = 8

export type Sheet = { url: string; cols: number }

const STORY_SHEET: Sheet = { url: storySheetUrl, cols: SHEET_COLS }
const SCHEMA_SHEET: Sheet = { url: schemaSheetUrl, cols: SHEET_COLS }

export type FrameRange = { sheet: Sheet; from: number; to: number }

/**
 * Beat 1 — a cursor fills spreadsheet cells, decelerating, freezes mid-cell,
 * then the grid detaches and drifts apart into the SCATTER formation.
 */
export const CELLS: FrameRange = { sheet: STORY_SHEET, from: 0, to: 47 }

/**
 * The freeze — grid full, cursor stopped on an unfinished cell. This is the
 * frame that carries beat 1's meaning, so it is the one the still-image
 * fallback must use. CELLS *ends* fully dissolved, so the range's last frame
 * is blank and would render an empty panel on phones and under reduced motion.
 */
export const CELLS_STILL = 35

/**
 * Beat 2 — the same grid, at the same fill count beat 1 froze on. Its cells
 * fly into table rows; the foreign keys draw themselves last. The cells
 * BECOMING the fields is the point: the manual workflow was not thrown away,
 * it was given a structure.
 */
export const SCHEMA: FrameRange = { sheet: SCHEMA_SHEET, from: 0, to: 39 }

/**
 * Beat 6 — the same grid, cleared, one cursor blinking. Periodic over its 12
 * frames, so it plays as an ambient loop rather than a scrub: at the end of
 * the story the reader has stopped scrolling, and a frozen cursor would read
 * as broken rather than as waiting.
 */
export const EMPTY: FrameRange = { sheet: STORY_SHEET, from: 48, to: 59 }

/** Source rect of frame `n` within its sheet. */
export function frameRect(sheet: Sheet, n: number) {
	return {
		sx: (n % sheet.cols) * FRAME_W,
		sy: Math.floor(n / sheet.cols) * FRAME_H,
		sw: FRAME_W,
		sh: FRAME_H,
	}
}
