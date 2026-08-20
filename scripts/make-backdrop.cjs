/* eslint-disable */
/**
 * Generates the two looping backdrop films (dark + light) used by
 * `src/components/VideoBackdrop.tsx`.
 *
 *   node scripts/make-backdrop.cjs
 *
 * Output → src/assets/backdrop/{loop-dark,loop-light}.{mp4,jpg}
 *
 * TUNING NOTE: judge these full-screen in the browser, not by the 1280x720
 * poster. VideoBackdrop draws them with `object-fit: cover` and `scale(1.08)`,
 * which crops toward the edges — so a vignette that looks right in the still
 * eats the whole frame in situ. Keep `vignetteStart` around 0.45+.
 *
 * Why generated instead of stock footage:
 *   - exact match to the palettes in src/theme.ts (no colour drift between the
 *     film and the UI sitting on top of it)
 *   - mathematically seamless loop: every animated parameter is periodic over
 *     the clip length, so frame N wraps onto frame 0 with no visible cut
 *   - no licence to track, no attribution to carry
 *   - tiny: slow abstract gradients compress extremely well
 *
 * Dependencies (@napi-rs/canvas + ffmpeg-static) are resolved from the repo
 * root if present, otherwise from the vendored copy under
 * plans/active/interview-deck/ which already has them installed.
 */
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const VENDOR = path.join(__dirname, '..', 'plans', 'active', 'interview-deck', 'node_modules')
function dep(name) {
	try {
		return require(name)
	} catch {
		return require(path.join(VENDOR, name))
	}
}
const { createCanvas } = dep('@napi-rs/canvas')
const ffmpegPath = dep('ffmpeg-static')

// ---------------------------------------------------------------- parameters

const W = 1280
const H = 720
const FPS = 24
const SECONDS = 12
const FRAMES = FPS * SECONDS

const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'backdrop')

/**
 * Palettes mirror src/theme.ts. `blobs` are drawn in order; each has a
 * Lissajous path whose frequencies are INTEGERS so the motion is periodic
 * over exactly one clip length.
 */
/**
 * Blob fields are deliberately kept SPATIALLY SEPARATED. Stacking four or five
 * additive fields on the same spot sums them toward grey and the palette turns
 * to mush — so each hue owns a region of the frame and only the soft tails
 * overlap.
 */
const LOOKS = {
	dark: {
		wash: ['#0B1020', '#04060C'],
		composite: 'lighter',
		vignette: 'rgba(0,0,0,0.60)',
		vignetteStart: 0.46,
		grain: 0.075,
		sweep: 'rgba(124,231,255,0.035)',
		blobs: [
			// cyan owns the upper left
			{ color: '124,231,255', alpha: 0.52, r: 0.62, fx: 1, fy: 2, px: 0.0, py: 0.7, cx: 0.18, cy: 0.28, ax: 0.12, ay: 0.11 },
			// violet owns the right
			{ color: '180,130,255', alpha: 0.38, r: 0.58, fx: 1, fy: 1, px: 3.4, py: 2.2, cx: 0.84, cy: 0.32, ax: 0.11, ay: 0.13 },
			// lime, low and quiet
			{ color: '198,255,61', alpha: 0.2, r: 0.5, fx: 2, fy: 1, px: 1.9, py: 0.3, cx: 0.64, cy: 0.84, ax: 0.13, ay: 0.1 },
			// amber, bottom left, quietest
			{ color: '255,176,46', alpha: 0.19, r: 0.48, fx: 2, fy: 3, px: 0.8, py: 4.1, cx: 0.2, cy: 0.88, ax: 0.12, ay: 0.09 },
		],
	},
	light: {
		wash: ['#FFFFFF', '#DFE5EE'],
		// multiply, not source-over: tints DARKEN the base into a real colour
		// instead of washing everything toward white
		composite: 'multiply',
		vignette: 'rgba(24,32,50,0.13)',
		vignetteStart: 0.5,
		grain: 0.05,
		sweep: 'rgba(255,255,255,0)',
		blobs: [
			{ color: '0,145,181', alpha: 0.34, r: 0.62, fx: 1, fy: 2, px: 0.0, py: 0.7, cx: 0.18, cy: 0.28, ax: 0.12, ay: 0.11 },
			{ color: '122,79,201', alpha: 0.26, r: 0.58, fx: 1, fy: 1, px: 3.4, py: 2.2, cx: 0.84, cy: 0.32, ax: 0.11, ay: 0.13 },
			{ color: '79,138,18', alpha: 0.19, r: 0.5, fx: 2, fy: 1, px: 1.9, py: 0.3, cx: 0.64, cy: 0.84, ax: 0.13, ay: 0.1 },
			{ color: '194,94,0', alpha: 0.17, r: 0.48, fx: 2, fy: 3, px: 0.8, py: 4.1, cx: 0.2, cy: 0.88, ax: 0.12, ay: 0.09 },
		],
	},
}

/**
 * Gaussian-ish falloff built from many stops. A 3-stop radial gradient steps
 * visibly once h264 quantises it — the concentric rings you see in cheap
 * "gradient mesh" backgrounds. Sampling the curve at 12 points removes them.
 */
function addFalloff(g, rgb, peak) {
	const STOPS = 12
	for (let k = 0; k <= STOPS; k++) {
		const o = k / STOPS
		const a = peak * Math.exp(-3.6 * o * o) * (1 - o)
		g.addColorStop(o, `rgba(${rgb},${a.toFixed(5)})`)
	}
}

const TAU = Math.PI * 2

// ------------------------------------------------------------------- grain
// Four pre-baked noise tiles, cycled and offset per frame. Cheaper than
// per-pixel noise every frame, and — more importantly — the grain dithers the
// smooth gradients so h264 doesn't band them into visible steps.

const TILE = 256
function makeNoiseTiles() {
	const tiles = []
	// deterministic PRNG so repeated runs produce identical files
	let seed = 0x2f6e2b1
	const rnd = () => {
		seed ^= seed << 13
		seed ^= seed >>> 17
		seed ^= seed << 5
		return ((seed >>> 0) % 100000) / 100000
	}
	for (let t = 0; t < 4; t++) {
		const c = createCanvas(TILE, TILE)
		const ctx = c.getContext('2d')
		const img = ctx.createImageData(TILE, TILE)
		for (let i = 0; i < TILE * TILE; i++) {
			const v = (rnd() * 255) | 0
			img.data[i * 4] = v
			img.data[i * 4 + 1] = v
			img.data[i * 4 + 2] = v
			img.data[i * 4 + 3] = 255
		}
		ctx.putImageData(img, 0, 0)
		tiles.push(c)
	}
	return tiles
}

// ------------------------------------------------------------------- render

function drawFrame(ctx, look, tiles, t /* 0→1, exclusive */) {
	const a = TAU * t

	// base wash
	ctx.globalCompositeOperation = 'source-over'
	ctx.globalAlpha = 1
	const wash = ctx.createRadialGradient(W * 0.5, H * 0.1, 0, W * 0.5, H * 0.1, H * 1.5)
	wash.addColorStop(0, look.wash[0])
	wash.addColorStop(1, look.wash[1])
	ctx.fillStyle = wash
	ctx.fillRect(0, 0, W, H)

	// drifting colour fields
	ctx.globalCompositeOperation = look.composite
	for (const b of look.blobs) {
		const x = (b.cx + Math.cos(a * b.fx + b.px) * b.ax) * W
		const y = (b.cy + Math.sin(a * b.fy + b.py) * b.ay) * H
		// radius breathes on its own periodic cycle
		const r = b.r * H * (1 + 0.16 * Math.sin(a * 1 + b.px * 1.7))
		// alpha breathes too, so fields fade in and out of prominence
		const alpha = b.alpha * (0.72 + 0.28 * Math.sin(a * 2 + b.py))
		const g = ctx.createRadialGradient(x, y, 0, x, y, r)
		addFalloff(g, b.color, alpha)
		ctx.fillStyle = g
		ctx.fillRect(0, 0, W, H)
	}

	// slow diagonal light sweep — one full pass per loop
	ctx.globalCompositeOperation = look.composite
	const sweepX = (t * 2 - 0.5) * W * 1.6
	const sweep = ctx.createLinearGradient(sweepX, 0, sweepX + W * 0.7, H)
	sweep.addColorStop(0, 'rgba(0,0,0,0)')
	sweep.addColorStop(0.5, look.sweep)
	sweep.addColorStop(1, 'rgba(0,0,0,0)')
	ctx.fillStyle = sweep
	ctx.fillRect(0, 0, W, H)

	// vignette — keeps the eye centre-screen and darkens the edges where the
	// DOM story's scrims sit
	ctx.globalCompositeOperation = 'source-over'
	const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.78)
	const [, vr, vg, vb, va] = /rgba\(([\d.]+),([\d.]+),([\d.]+),([\d.]+)\)/.exec(look.vignette.replace(/\s/g, ''))
	const start = look.vignetteStart
	// smoothstep ramp, sampled — a hard 2-stop vignette bands just like the blobs
	for (let k = 0; k <= 14; k++) {
		const o = start + (k / 14) * (1 - start)
		const u = k / 14
		const a = Number(va) * (u * u * (3 - 2 * u))
		vig.addColorStop(o, `rgba(${vr},${vg},${vb},${a.toFixed(5)})`)
	}
	vig.addColorStop(0, `rgba(${vr},${vg},${vb},0)`)
	ctx.fillStyle = vig
	ctx.fillRect(0, 0, W, H)

	// grain — tile index and offset both cycle whole numbers of times per loop
	ctx.globalCompositeOperation = 'overlay'
	ctx.globalAlpha = look.grain
	const tile = tiles[Math.floor(t * FRAMES) % tiles.length]
	const ox = -((t * 3 * TILE) % TILE)
	const oy = -((t * 2 * TILE) % TILE)
	for (let x = ox; x < W; x += TILE) {
		for (let y = oy; y < H; y += TILE) ctx.drawImage(tile, x, y)
	}
	ctx.globalAlpha = 1
	ctx.globalCompositeOperation = 'source-over'
}

// -------------------------------------------------------------------- encode

function encode(name, look, tiles) {
	return new Promise((resolve, reject) => {
		const canvas = createCanvas(W, H)
		const ctx = canvas.getContext('2d')
		const mp4 = path.join(OUT_DIR, `${name}.mp4`)

		const ff = spawn(ffmpegPath, [
			'-y',
			'-f', 'rawvideo',
			'-pix_fmt', 'rgba',
			'-s', `${W}x${H}`,
			'-r', String(FPS),
			'-i', 'pipe:0',
			'-an',
			'-c:v', 'libx264',
			'-preset', 'slow',
			'-crf', '30',
			'-pix_fmt', 'yuv420p',
			// every frame a keyframe-able GOP boundary at loop point keeps the
			// browser's loop seam clean
			'-g', String(FPS * 2),
			'-movflags', '+faststart',
			mp4,
		])
		ff.stderr.on('data', () => {})
		ff.on('error', reject)
		ff.on('close', (code) => (code === 0 ? resolve(mp4) : reject(new Error(`ffmpeg exited ${code}`))))

		let i = 0
		const pump = () => {
			while (i < FRAMES) {
				// t is exclusive of 1.0 — frame FRAMES would duplicate frame 0
				const t = i / FRAMES
				drawFrame(ctx, look, tiles, t)
				if (i === 0) {
					// poster still: what the user sees before the video decodes
					fs.writeFileSync(path.join(OUT_DIR, `${name}.jpg`), canvas.encodeSync('jpeg', 82))
				}
				const buf = Buffer.from(ctx.getImageData(0, 0, W, H).data.buffer)
				i++
				if (i % 24 === 0) process.stdout.write(`\r  ${name}: ${i}/${FRAMES}`)
				if (!ff.stdin.write(buf)) return ff.stdin.once('drain', pump)
			}
			process.stdout.write(`\r  ${name}: ${FRAMES}/${FRAMES}\n`)
			ff.stdin.end()
		}
		pump()
	})
}

async function main() {
	fs.mkdirSync(OUT_DIR, { recursive: true })
	const tiles = makeNoiseTiles()
	for (const [name, look] of Object.entries(LOOKS)) {
		const out = await encode(`loop-${name}`, look, tiles)
		const kb = (fs.statSync(out).size / 1024).toFixed(0)
		console.log(`  → ${path.relative(process.cwd(), out)}  ${kb} KB`)
	}
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
