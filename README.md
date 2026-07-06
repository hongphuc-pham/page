# Phuc Pham — Cinematic CV (React + Vite + R3F + GSAP)

One-page, scroll-driven storytelling CV. A persistent three.js canvas sits
behind the DOM; scroll progress drives the camera, the hero shard, lighting,
and postprocessing across five pinned "beats". See `STORY.md` for the beat
map and where to tweak everything.

## Tech
- React 18 + Vite + TypeScript
- MUI v5 + Emotion (CSS-variable dual theme, dark default)
- three + @react-three/fiber + @react-three/postprocessing (lazy chunk)
- GSAP ScrollTrigger (scrubbed, pinned scenes) + Lenis smooth scroll
- framer-motion (micro-interactions: magnetic buttons, card tilt)
- react-router-dom (HashRouter, GitHub Pages friendly)

## Local dev
```bash
pnpm install
pnpm dev
```
> Windows + WSL note: install and run from the SAME OS — see
> `.claude/rules/dev-environment.md` if you hit `@rollup/rollup-*` errors.

## Build
```bash
pnpm build
pnpm preview
```

## Content editing
All CV copy lives in `src/data/cv.ts` (single source of truth, with
correction notes). The 3D look is tuned via commented constant arrays in
`src/scene/*` — one entry per beat.

## Swapping the hero object for a custom GLTF

The shard is procedural (`src/scene/HeroObject.tsx`). To replace it with a
GLTF model later:

1. `pnpm add @react-three/drei`, put your model at `public/models/hero.glb`
   (keep it small — the current shard is ~80 triangles).
2. In `HeroObject.tsx`:
   ```tsx
   import { useGLTF } from '@react-three/drei'
   useGLTF.preload('models/hero.glb')
   const { scene } = useGLTF('models/hero.glb')
   // render <primitive object={scene} /> inside the <group ref={group}>
   ```
3. Keep the `useFrame` block — rotation, color and fracture logic read from
   scroll progress and can drive your model's materials the same way. The
   displacement loop only applies to the procedural geometry; delete it or
   port it to your mesh's position attribute.
4. Vertex-color / material notes: the beat color comes from `COLOR_STOPS` —
   apply it to your model's material `color`/`emissive` in the same loop.

## GitHub Pages
- `package.json` includes `homepage`, `predeploy`, and `deploy` scripts.
- Hash Router so refresh works on GitHub Pages.

```bash
pnpm deploy
```
Builds to `dist/` then publishes to the `gh-pages` branch.
