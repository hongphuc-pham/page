import { Canvas } from '@react-three/fiber'
import { Component, type ReactNode } from 'react'
import { palettes, type ThemeMode } from '../theme'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { HeroObject } from './HeroObject'

/**
 * The one persistent full-viewport canvas. Fixed behind the DOM overlay,
 * never unmounts between scenes. Lazy-loaded from Story.tsx so three.js
 * lives in its own chunk.
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
	return (
		<SceneErrorBoundary>
			<Canvas
				dpr={isMobile ? [1, 1.5] : [1, 2]}
				frameloop={animate ? 'always' : 'demand'}
				camera={{ position: [0, 0.2, 6.5], fov: 42 }}
				gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
				style={{
					position: 'fixed',
					inset: 0,
					zIndex: 0,
					pointerEvents: 'none',
					background: 'var(--painter-bg)',
					transition: 'background 300ms ease',
				}}
			>
				<CameraRig animate={animate} warmColor={palette.accent} coolColor={palette.primary} />
				<HeroObject mode={mode} animate={animate} detail={isMobile ? 0 : 1} />
				{!isMobile && animate && <Effects />}
			</Canvas>
		</SceneErrorBoundary>
	)
}
