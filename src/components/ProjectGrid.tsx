import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface Project {
	title: string
	category: string
	summary: string
	tech: string[]
	link: string
	repo: string
	image?: string
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
	const location = useLocation()
	const navigate = useNavigate()
	const params = new URLSearchParams(location.search)
	const [cat, setCat] = useState<string | 'All'>(params.get('cat') || 'All')

	useEffect(() => {
		const qs = new URLSearchParams(location.search)
		if (cat === 'All') qs.delete('cat')
		else qs.set('cat', cat)
		navigate({ pathname: '/portfolio', search: qs.toString() }, { replace: true })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cat])

	const categories = useMemo(
		() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
		[projects],
	)

	const filtered = useMemo(
		() => (cat === 'All' ? projects : projects.filter((p) => p.category === cat)),
		[projects, cat],
	)

	return (
		<Stack spacing={2}>
			<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
				{categories.map((c) => (
					<Chip
						key={c}
						label={c}
						color={c === cat ? 'primary' : 'default'}
						onClick={() => setCat(c)}
					/>
				))}
			</Stack>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
					gap: 2,
				}}
			>
				{filtered.map((p) => (
					<Card key={p.title}>
						<CardActionArea href={p.link !== '#' ? p.link : p.repo} target="_blank" rel="noreferrer">
							<Box sx={{ aspectRatio: '16 / 9', bgcolor: 'background.default', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
							<CardContent>
								<Typography fontWeight={600}>{p.title}</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
									{p.summary}
								</Typography>
								<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
									{p.tech.map((t) => (
										<Chip key={t} label={t} size="small" />
									))}
								</Stack>
							</CardContent>
						</CardActionArea>
					</Card>
				))}
			</Box>
		</Stack>
	)
}
