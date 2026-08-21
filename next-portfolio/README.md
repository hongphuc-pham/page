# Portfolio — Next.js

Port of `portfolio-standalone.html` to the Next.js App Router with React
components and a real Tailwind build (no CDN script).

```bash
cd next-portfolio
pnpm install     # or npm install
pnpm dev         # http://localhost:3000
```

## Where things live

| To change… | Go to |
|---|---|
| **Any word on the site** | `lib/cv.ts` |
| Colours, spacing, fonts | `tailwind.config.ts` |
| Global CSS, motion tokens, component classes | `app/globals.css` |
| Page order | `app/page.tsx` |
| Header, scroll-spy, mobile drawer | `components/SiteHeader.tsx` |
| Project bento grid | `components/Projects.tsx` |
| Everything else on the page | `components/Sections.tsx` |

## The one rule

`lib/cv.ts` is the single source of truth, and every claim in it traces to
`docs/Pham_HongPhuc_Career_Facts.md`. Components render content; they never
hold copy.

The **honesty rule is a layout rule**. A project with a grounded `before`
gets a caption box and an AFTER label. A project without one — ElevexAI and
AIDFest, which are product surfaces rather than automations — gets neither,
and its body copy simply starts. That asymmetry is deliberate. Do not "fix"
it by inventing a before-line; see the do-not-claim list at the top of
`lib/cv.ts`.

## Server vs client

Almost everything is a server component. Only four are `'use client'`, and
each for one reason:

| Component | Why it needs the client |
|---|---|
| `SiteHeader` | scroll position, spy state, drawer |
| `Reveal` | IntersectionObserver |
| `HeroVideo` | HLS playback, dynamic `hls.js` import |
| `ContactCode` | clipboard |

`Ticker` looks interactive but is not — the two copies its keyframe needs are
just rendered twice, so it stays on the server.

## Motion

- `transform` and `opacity` only, so nothing triggers layout or paint.
- Custom easing (`--ease-out`); never `ease-in` on UI.
- Hover is gated behind `@media (hover: hover) and (pointer: fine)` so touch
  devices don't get stuck hover states.
- `prefers-reduced-motion` removes movement and stops the ticker, but keeps
  content in its final state — fewer and gentler, not nothing.
- Reveals fire **once**. A card that re-animates on every pass reads as a
  glitch rather than an entrance.

## Still to do

- `public/Pham_HongPhuc_CV.pdf` does not exist yet. The header and footer
  both link to it. There is a `.docx` in the Vite app's `src/assets/`.
- The hero video is still the stock stream from the original template. Swap
  the `HERO_STREAM` constant in `components/Sections.tsx` for real footage,
  or delete `<HeroVideo />` and let the gradient carry the hero.
