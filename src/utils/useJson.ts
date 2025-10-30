import { useEffect, useState } from 'react'

export function useJson<T = any>(path: string) {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<unknown>(null)

	useEffect(() => {
		let mounted = true
		async function load() {
			setLoading(true)
			try {
				await new Promise((r) => setTimeout(r, 350))
				const mod = await import(/* @vite-ignore */ path)
				if (mounted) setData(mod.default ?? mod)
			} catch (e) {
				if (mounted) setError(e)
			} finally {
				if (mounted) setLoading(false)
			}
		}
		load()
		return () => {
			mounted = false
		}
	}, [path])

	return { data: data as T, loading, error }
}
