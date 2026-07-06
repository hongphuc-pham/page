import { Canvas, useFrame } from '@react-three/fiber'
import { Component, useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { palettes, type ThemeMode } from '../../theme'

/**
 * Lazy-loaded hero 3D scene: a drifting particle wave in the theme's
 * cyan→lime gradient plus a slowly tumbling wireframe icosahedron.
 * Cursor-reactive (parallax), theme-aware, static under reduced motion.
 */

type SceneProps = { mode: ThemeMode; animate: boolean }

const GRID_COLS = 90
const GRID_ROWS = 34
const GRID_W = 14
const GRID_H = 7

function themeColors(mode: ThemeMode) {
	const p = palettes[mode]
	return {
		a: new THREE.Color(p.primary),
		b: new THREE.Color(p.lime),
		opacity: mode === 'dark' ? 0.85 : 0.55,
		wire: p.primary,
		wireOpacity: mode === 'dark' ? 0.35 : 0.3,
	}
}

function WaveField({ mode, animate }: SceneProps) {
	const points = useRef<THREE.Points>(null)
	const colors = useMemo(() => themeColors(mode), [mode])

	const { positions, colorArray } = useMemo(() => {
		const count = GRID_COLS * GRID_ROWS
		const positions = new Float32Array(count * 3)
		const colorArray = new Float32Array(count * 3)
		const c = new THREE.Color()
		let i = 0
		for (let row = 0; row < GRID_ROWS; row++) {
			for (let col = 0; col < GRID_COLS; col++) {
				const x = (col / (GRID_COLS - 1) - 0.5) * GRID_W
				const z = (row / (GRID_ROWS - 1) - 0.5) * GRID_H
				positions[i * 3] = x
				positions[i * 3 + 1] = 0
				positions[i * 3 + 2] = z
				c.copy(colors.a).lerp(colors.b, col / (GRID_COLS - 1))
				colorArray[i * 3] = c.r
				colorArray[i * 3 + 1] = c.g
				colorArray[i * 3 + 2] = c.b
				i++
			}
		}
		return { positions, colorArray }
	}, [colors])

	useFrame((state) => {
		const pts = points.current
		if (!pts) return
		const t = animate ? state.clock.elapsedTime : 0
		const pos = pts.geometry.attributes.position as THREE.BufferAttribute
		let i = 0
		for (let row = 0; row < GRID_ROWS; row++) {
			for (let col = 0; col < GRID_COLS; col++) {
				const x = pos.getX(i)
				const z = pos.getZ(i)
				pos.setY(i, Math.sin(x * 0.9 + t * 0.7) * 0.35 + Math.cos(z * 1.3 + t * 0.5) * 0.28)
				i++
			}
		}
		pos.needsUpdate = true
		// gentle cursor parallax
		const target = animate ? state.pointer : { x: 0, y: 0 }
		pts.rotation.x += (target.y * 0.06 - pts.rotation.x) * 0.04
		pts.rotation.z += (-target.x * 0.05 - pts.rotation.z) * 0.04
	})

	return (
		<points ref={points} position={[0, -1.1, 0]} rotation={[0.28, 0, 0]}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
				<bufferAttribute attach="attributes-color" args={[colorArray, 3]} />
			</bufferGeometry>
			<pointsMaterial
				size={0.045}
				vertexColors
				transparent
				opacity={themeColors(mode).opacity}
				sizeAttenuation
				depthWrite={false}
			/>
		</points>
	)
}

function WireShape({ mode, animate }: SceneProps) {
	const mesh = useRef<THREE.Mesh>(null)
	const colors = useMemo(() => themeColors(mode), [mode])

	useFrame((state) => {
		const m = mesh.current
		if (!m) return
		const t = animate ? state.clock.elapsedTime : 0
		m.rotation.x = t * 0.12
		m.rotation.y = t * 0.16
		m.position.y = 0.9 + Math.sin(t * 0.6) * 0.18
		const target = animate ? state.pointer : { x: 0, y: 0 }
		m.position.x += (2.9 + target.x * 0.4 - m.position.x) * 0.04
	})

	return (
		<mesh ref={mesh} position={[2.9, 0.9, -1.2]}>
			<icosahedronGeometry args={[1.15, 1]} />
			<meshBasicMaterial color={colors.wire} wireframe transparent opacity={colors.wireOpacity} />
		</mesh>
	)
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
	state = { failed: false }
	static getDerivedStateFromError() {
		return { failed: true }
	}
	render() {
		return this.state.failed ? null : this.props.children
	}
}

export default function HeroScene({ mode, animate }: SceneProps) {
	return (
		<SceneErrorBoundary>
			<Canvas
				dpr={[1, 1.5]}
				frameloop={animate ? 'always' : 'demand'}
				camera={{ position: [0, 1.4, 6.2], fov: 48 }}
				gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
				style={{ background: 'transparent' }}
			>
				<WaveField mode={mode} animate={animate} />
				<WireShape mode={mode} animate={animate} />
			</Canvas>
		</SceneErrorBoundary>
	)
}
