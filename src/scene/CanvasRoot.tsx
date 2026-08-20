import { PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Component, useState, type ReactNode } from 'react'
import { palettes, type ThemeMode } from '../theme'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { LatticeField } from './LatticeField'

/**
 * The one persistent canvas. Never unmounts between scenes; lazy-loaded from
 * Story.tsx so three.js lives in its own chunk.
 *
 * It no longer positions itself. The canvas fills whatever box its parent
 * gives it — <StageFrame/> — which is what put it on the page grid instead of
 * floating full-bleed behind everything.
 */

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
	state = { failed: false }
	static getDerivedStateFromError() {
		return { failed: true }
	}
	render() {
		// No WebGL → no canvas; the DOM overlay still reads as a full CV.
		return this.state.failed ? null : this.props.children
	}
}

export default function CanvasRoot({
	mode,
	animate,
	isMobile,
}: {
	mode: ThemeMode
	animate: boolean
	isMobile: boolean
}) {
	const palette = palettes[mode]

	// Quality ladder. A fixed dpr of 2 looks best but silently costs 4× the
	// fragments of dpr 1, which is the difference between a smooth story and a
	// stuttering one on integrated graphics. PerformanceMonitor watches the real
	// frame rate and steps down — first resolution, then the postprocessing
	// stack — rather than letting the whole scene judder at full quality.
	const fullDpr = isMobile ? 1.5 : 2
	const [dpr, setDpr] = useState(fullDpr)
	const [degraded, setDegraded] = useState(false)

	return (
		<SceneErrorBoundary>
			<Canvas
				dpr={dpr}
				frameloop={animate ? 'always' : 'demand'}
				camera={{ position: [0, 0.2, 6.5], fov: 42 }}
				gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
				style={{
					position: 'absolute',
					inset: 0,
					pointerEvents: 'none',
					// The background is owned by <VideoBackdrop/> and the stage frame.
					background: 'transparent',
				}}
			>
				<PerformanceMonitor
					// Two strikes before touching quality — a single slow second
					// during page load shouldn't permanently downgrade the scene.
					flipflops={2}
					onDecline={() => setDpr(1)}
					onFallback={() => {
						setDpr(1)
						setDegraded(true)
					}}
				/>
				<CameraRig animate={animate} warmColor={palette.accent} coolColor={palette.primary} />
				<LatticeField mode={mode} animate={animate} isMobile={isMobile} />
				{!isMobile && animate && !degraded && <Effects />}
			</Canvas>
		</SceneErrorBoundary>
	)
}
