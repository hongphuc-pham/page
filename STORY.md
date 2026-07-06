# STORY — the cinematic CV

One scroll, five beats. Scroll progress (0 → 1) is the single source of truth:
it drives the camera spline, the hero shard, lighting temperature, and
postprocessing. Beats map to equal fifths of total scroll.

## The five beats

| # | Beat | Scroll | Section id | On screen |
|---|------|--------|------------|-----------|
| 1 | HOOK | 0.00–0.20 | `#hook` | "Software that thinks with you." Name, role, positioning. Warm light, calm shard, faint wireframe. |
| 2 | FOUNDATION | 0.20–0.40 | `#foundation` | ANZ NZ Java/Spring Boot DR platform, the 15–20h → hours-earlier story, Kau Mau Te Wehi Award, degrees. Cool light, wireframe reveals. |
| 3 | NOW | 0.40–0.60 | `#now` | CREST (Dec 2023 – Jun 2026), features across 4–5 platforms; project cards deal one-by-one onto a deck (Luna, CareHub, SoftSec Intel, ElevexAI, AIDFest, DEP & VIP). Shard fractures into fragments. |
| 4 | APPROACH | 0.60–0.80 | `#approach` | "AI-assisted. Structured. Honest." Stack chips fly in from around the viewport, settle into a row, then the scene exits. Fragments reassemble. |
| 5 | CONTACT | 0.80–1.00 | `#contact` | "Available for new roles." Email / LinkedIn / GitHub / CV download. Warm light returns, shard settles. |

## Where to edit what

| Thing | File |
|---|---|
| All copy / CV content | `src/data/cv.ts` (single source of truth — correction notes at top) |
| Camera path + look-at keyframes, lighting per beat | `src/scene/CameraRig.tsx` (`CAM_KEYFRAMES`, `LOOK_KEYFRAMES`, `WARM_INTENSITY`, `COOL_INTENSITY` — index = beat) |
| Shard behavior (displacement, wireframe, colors, fracture window) | `src/scene/HeroObject.tsx` (`AMP_STOPS`, `WIRE_STOPS`, `COLOR_STOPS`, fracture `range(p, 0.42, 0.52)`) |
| Postprocessing (bloom, vignette, transition aberration) | `src/scene/Effects.tsx` (`BOUNDARIES`, `ABERRATION_MAX`) |
| Pin lengths / per-scene choreography | each `src/sections/Scene*.tsx` (the `length` option = pin duration in vh%; mobile automatically gets 60%) |
| Colors / theme | `src/theme.ts` (CSS variables; dark + light palettes) |
| Smooth scroll | `src/lib/lenis.ts` |

## Accessibility / fallbacks

- `prefers-reduced-motion`: no Lenis, no pins, no scrubs — the page renders
  as a plain top-to-bottom document with everything visible; the canvas shows
  a static shard (`frameloop="demand"`).
- No WebGL: the canvas error-boundary renders nothing; the DOM CV still reads.
- Mobile (<768px): no postprocessing, `dpr [1,1.5]`, lower shard detail,
  60%-length pins, full-width tap targets in beat 5.
