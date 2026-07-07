import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { beatPos } from './useScrollProgress'

const ABERRATION_MAX = 0.0012

/** Postprocessing stack — desktop only (skipped under 768px and reduced motion). */
export function Effects() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const aberration = useRef<any>(null)

	useFrame(() => {
		// whoosh when crossing an INTERIOR beat boundary — beatPos near 1..4
		// (not at the very start/end, which are resting states).
		const bp = beatPos.value
		const nearest = Math.round(bp)
		const k = nearest >= 1 && nearest <= 4 ? 1 - Math.min(1, Math.abs(bp - nearest) / 0.12) : 0
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
