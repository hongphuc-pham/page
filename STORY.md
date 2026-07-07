# STORY — the cinematic CV

One scroll, six beats. The 3D scene tracks a continuous BEAT position
(`beatPos`, 0 → 5), written by each scene's own ScrollTrigger as
`beatIndex + localProgress`. This keeps the shard colour, camera, lighting and
chapter dots in sync with the scene actually on screen even though scenes have
different pin lengths. (The thin top progress bar uses the raw linear scroll
fraction — that's the only thing that does.)

## The six beats

| # | Beat | beatPos | Section id | On screen |
|---|------|---------|------------|-----------|
| 1 | HOOK | 0 | `#hook` | "Software that thinks with you." Name, role, positioning. Warm light, calm shard. |
| 2 | FOUNDATION | 1 | `#foundation` | ANZ NZ Java/Spring Boot DR platform, the 15–20h → hours-earlier story, Kau Mau Te Wehi Award, degrees. Cool light, wireframe reveals. |
| 3 | NOW | 2 | `#now` | CREST intro; project cards are a scroll-driven STACK that swaps card-by-card, each with a live screenshot thumbnail + links (Luna, CareHub, SoftSec Intel, ElevexAI, AIDFest, DEP & VIP). Shard fractures mid-beat. |
| 4 | APPROACH | 3 | `#approach` | "AI-assisted. Structured. Honest." CV-style skill matrix — category rows (Languages / Frontend / Backend / Databases / Infra & CI/CD / AI & Data) fly in and settle. |
| 5 | EXPERIENCE | 4 | `#experience` | "Where I've shipped." CV-style listing of the two main roles (CREST + ANZ) with dated bullet points + award. |
| 6 | CONTACT | 5 | `#contact` | "Available for new roles." Email / LinkedIn / GitHub / CV download. Warm light returns, shard settles. |

Per-scene pin lengths are set in each `Scene*.tsx` (the `length` option). Chapter
dots and `scrollToSection` land ~0.55×viewport into a pin so you arrive on
revealed content, not the pre-animation state.

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
