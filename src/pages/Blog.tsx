import { SectionCard } from '../components/SectionCard'
import { BlogList } from '../components/BlogList'
import { Skeleton, Stack, Typography } from '@mui/material'
import { useJson } from '../utils/useJson'

export function Blog() {
	const { data, loading } = useJson<any[]>('/src/data/posts.json')
	return (
		<Stack spacing={2}>
			<SectionCard>
				<Typography variant="h6" gutterBottom>Blog</Typography>
				{loading ? <Skeleton variant="rounded" height={160} /> : <BlogList posts={data || []} />}
			</SectionCard>
		</Stack>
	)
}
