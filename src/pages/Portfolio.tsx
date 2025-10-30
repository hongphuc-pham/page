import { Skeleton, Stack, Typography } from '@mui/material'
import { SectionCard } from '../components/SectionCard'
import { ProjectGrid } from '../components/ProjectGrid'
import { useJson } from '../utils/useJson'

export function Portfolio() {
	const { data, loading } = useJson<any[]>('/src/data/projects.json')
	return (
		<Stack spacing={2}>
			<SectionCard>
				<Typography variant="h6" gutterBottom>Portfolio</Typography>
				{loading ? <Skeleton variant="rounded" height={240} /> : <ProjectGrid projects={data || []} />}
			</SectionCard>
		</Stack>
	)
}
