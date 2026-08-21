# STORY — the cinematic CV

## The argument

**"I delete the manual step."**

Every role in this CV is the same shape of work: a process people were doing by
hand became software they actually use. That is not a positioning exercise
bolted on afterwards — it is what the facts in `src/data/cv.ts` already say, in
every job, since 2019.

| Before | After | Where |
|---|---|---|
| Excel disaster-recovery workflow, 15–20h | Java + Spring Boot platform | ANZ NZ |
| 2D floor plans labelled by hand | PyTorch computer-vision model | Eclipse CS |
| NDIS documentation read by hand | Luna, a RAG chatbot | CREST |
| Researchers provisioning their own infra | DEP & VIP, a managed PaaS | CREST |

The six beats are that argument, in order: state it → prove it once → show it is
a habit → show why it can be trusted → hand over the dated evidence → ask for
the next one.

**Honesty rule.** `cv.ts` opens with a do-not-claim list. Any `before:` line must
be derivable from copy already in that file. Projects with no grounded
manual-step story (ElevexAI, AIDFest — product surfaces, not automations) carry
**no** `before` line. Symmetry is not worth a claim you cannot back in an
interview.

## The six beats

The 3D stage tracks a continuous BEAT position (`beatPos`, 0 → 5), written by
each scene's own ScrollTrigger as `beatIndex + localProgress`. This keeps the
field, camera, lighting, chapter dots and stage readout in sync with the scene
actually on screen even though scenes have different pin lengths. (The thin top
progress bar uses the raw linear scroll fraction — that's the only thing that
does.)

| # | Beat | Section id | On screen | Field formation |
|---|------|------------|-----------|-----------------|
| 1 | INTRO | `#hook` | "I delete the manual step." Name, role, positioning. | `SCATTER` — MANUAL |
| 2 | PROOF | `#foundation` | ANZ NZ as Before → After → Result on a rail, the Kau Mau Te Wehi Award, the two degrees. | `GRID` — STRUCTURED |
| 3 | PATTERN | `#now` | "Then it kept happening." Project carousel; each card leads with the manual process it replaced, where there is one. | `LAYERS` — REPLICATED |
| 4 | METHOD | `#approach` | "How I keep it honest." Testing, docs, review, Docker — then the CV-style skill matrix. | `LANES` — VERIFIED |
| 5 | RECORD | `#experience` | "The full record." Dated roles as expandable cards; ⋮ reveals internships, research and community. | `HELIX` — SHIPPED |
| 6 | NEXT | `#contact` | "Available for new roles." Email / LinkedIn / GitHub / CV download. | `SLAB` — SETTLED |

Section **ids are load-bearing** — `ChapterDots`, `scrollToSection` and the
SceneShell HUD readout all key off them. Change labels freely; change ids never.

## Layout — one grid, two columns

The page derives **both** columns from the same four variables in `theme.ts`:

```
--content-w : clamp(420px, 44vw, 660px)
--stage-w   : clamp(320px, 32vw, 460px)
--stage-gap : clamp(32px, 4vw, 64px)
--rail      : max(40px, (100vw - (content + gap + stage)) / 2)
```

`.scene-section` pads itself by `--rail` on the left and
`--rail + --stage-w + --stage-gap` on the right; `.story-stage` is fixed at
`right: var(--rail); width: var(--stage-w)`. Because both read the same numbers,
the fixed canvas lands exactly where a grid track would put it, and the pair
stays centred on wide screens.

Below **1100px** there is not enough width for two columns: the stage drops its
frame and becomes a dimmed full-bleed backdrop, the content takes the whole
page, and `.scene-scrim` switches back on for contrast.

### What this replaced, and why

The old layout pushed the 3D object rightward by aiming the camera's `lookAt` at
`x = -1.7`. That never moved the object — it rotated the whole scene, so the
shard sat at a perspective-skewed off-axis angle that could not align with any
DOM edge. Meanwhile the canvas was `position: fixed; inset: 0` full-bleed while
the content was a hard-bordered card, and the only thing joining them was a 90°
gradient scrim. Two elements, no shared edge, baseline or column — which is
exactly why the right-hand side read as "off". Placement is CSS's job now, and
the camera simply looks at the field, dead centre.

## The stage object

`src/scene/LatticeField.tsx` — one `InstancedMesh` of 224 plates (112 on
mobile), six precomputed FORMATIONS, one per beat. Every frame it reads
`beatFraction()`, picks the two formations either side, and lerps. No React
re-render on scroll.

Two details make it read as *snapping into place* rather than sliding: the blend
is smoothstepped, and each plate carries a `delay` from its vertical position so
a change ripples bottom-to-top instead of moving as one sheet.

`DISORDER` per formation drives both an idle drift and the noise amplitude in
`./displace` — the scatter breathes, the lattice is dead crisp. Order is the
thing that stops moving.

This replaced `HeroObject.tsx` (a fracturing icosahedron) and `Orbits.tsx` (an
orrery of section rings). Both were removed: they were generic sci-fi that
illustrated nothing in the CV, and the orrery's rings ran out to radius 3.55, so
the "right-side object" swept back across the text anyway.

## Where to edit what

| Thing | File |
|---|---|
| All copy / CV content | `src/data/cv.ts` (single source of truth — correction notes + the `before` rule at top) |
| Formations, plate count, disorder, colours | `src/scene/LatticeField.tsx` |
| Stage frame + HUD readout labels | `src/components/StageFrame.tsx` |
| Two-column grid, stage frame styling, `.ba` rail | `src/theme.ts` (`GLOBAL_CSS`; `--content-w` / `--stage-w` / `--stage-gap` / `--rail`) |
| Camera path + look-at keyframes, lighting per beat | `src/scene/CameraRig.tsx` (`CAM_KEYFRAMES`, `LOOK_KEYFRAMES`, `WARM_INTENSITY`, `COOL_INTENSITY` — index = beat) |
| Postprocessing (bloom, vignette, transition aberration) | `src/scene/Effects.tsx` (`ABERRATION_MAX`) |
| Pin lengths / per-scene choreography | each `src/sections/Scene*.tsx` (the `length` option = pin duration in vh%; mobile automatically gets 60%) |
| Colors / theme | `src/theme.ts` (CSS variables; dark + light palettes) |
| Smooth scroll | `src/lib/lenis.ts` |

Note: `src/index.css` is dead — imported nowhere. Global CSS goes in
`theme.ts` `GLOBAL_CSS`.

## Accessibility / fallbacks

- `prefers-reduced-motion`: no Lenis, no pins, no scrubs — the page renders as a
  plain top-to-bottom document with everything visible; the canvas shows a
  static field (`frameloop="demand"`) at formation 0.
- No WebGL: the canvas error-boundary renders nothing. The stage frame still
  draws, so the layout does not collapse, and the DOM CV still reads.
- Mobile (<768px): no postprocessing, `dpr [1,1.5]`, half the plate count,
  60%-length pins, full-width tap targets.
- <1100px: single column, stage becomes an ambient backdrop.
