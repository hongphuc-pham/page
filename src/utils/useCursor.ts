import { useEffect, useRef, useState } from 'react'

type Cursor = {
	x: number
	y: number
	nx: number
	ny: number
	active: boolean
}

const initial: Cursor = { x: 0, y: 0, nx: 0, ny: 0, active: false }

export function useCursor(): Cursor {
	const [cursor, setCursor] = useState<Cursor>(initial)
	const rafRef = useRef<number | null>(null)
	const latestRef = useRef<Cursor>(initial)

	useEffect(() => {
		const handleMove = (e: MouseEvent) => {
			const nx = (e.clientX / window.innerWidth) * 2 - 1
			const ny = (e.clientY / window.innerHeight) * 2 - 1
			latestRef.current = { x: e.clientX, y: e.clientY, nx, ny, active: true }
			if (rafRef.current === null) {
				rafRef.current = requestAnimationFrame(() => {
					rafRef.current = null
					setCursor(latestRef.current)
				})
			}
		}
		const handleLeave = () => {
			latestRef.current = { ...latestRef.current, active: false }
			setCursor((c) => ({ ...c, active: false }))
		}
		window.addEventListener('mousemove', handleMove, { passive: true })
		window.addEventListener('mouseleave', handleLeave)
		return () => {
			window.removeEventListener('mousemove', handleMove)
			window.removeEventListener('mouseleave', handleLeave)
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
		}
	}, [])

	return cursor
}

export function useElementCursor(ref: React.RefObject<HTMLElement>) {
	const [pos, setPos] = useState<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false })
	useEffect(() => {
		const el = ref.current
		if (!el) return
		let raf: number | null = null
		let last = { x: 0, y: 0, inside: false }
		const onMove = (e: MouseEvent) => {
			const rect = el.getBoundingClientRect()
			last = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true }
			if (raf === null) {
				raf = requestAnimationFrame(() => {
					raf = null
					setPos(last)
				})
			}
		}
		const onLeave = () => setPos({ x: 0, y: 0, inside: false })
		el.addEventListener('mousemove', onMove)
		el.addEventListener('mouseleave', onLeave)
		return () => {
			el.removeEventListener('mousemove', onMove)
			el.removeEventListener('mouseleave', onLeave)
			if (raf !== null) cancelAnimationFrame(raf)
		}
	}, [ref])
	return pos
}
