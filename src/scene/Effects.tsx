import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { scrollProgress } from './useScrollProgress'

// Beat boundaries where the aberration "whooshes" during transitions.
const BOUNDARIES = [0.2, 0.4, 0.6, 0.8]
const ABERRATION_MAX = 0.0012

/** Postprocessing stack — desktop only (skipped under 768px and reduced motion). */
export function Effects() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const aberration = useRef<any>(null)

	useFrame(() => {
		const p = scrollProgress.value
		// proximity to the nearest beat boundary → 0..1
		let k = 0
		for (const b of BOUNDARIES) {
			k = Math.max(k, 1 - Math.min(1, Math.abs(p - b) / 0.03))
		}
		const offset = aberration.current?.offset
		if (offset) {
			offset.x = k * ABERRATION_MAX
			offset.y = k * ABERRATION_MAX * 0.6
		}
	})

	return (
		<EffectComposer>
			<Bloom intensity={0.45} luminanceThreshold={0.5} luminanceSmoothing={0.7} mipmapBlur />
			<ChromaticAberration ref={aberration} radialModulation={false} modulationOffset={0} />
			<Vignette eskil={false} offset={0.15} darkness={0.6} />
		</EffectComposer>
	)
}
