import { Grid, Skeleton, Stack, Typography } from '@mui/material'
import { SectionCard } from '../components/SectionCard'
import { FeatureCard } from '../components/FeatureCard'
import { useJson } from '../utils/useJson'

export function About() {
	const { data, loading } = useJson<{
		intro: string
		doing: { icon: any; title: string; text: string }[]
		testimonials: any[]
	}>('/src/data/about.json')

	return (
		<Stack spacing={2}>
			<SectionCard>
				<Typography variant="h6" gutterBottom>About Me</Typography>
				{loading ? (
					<Skeleton variant="text" height={80} />
				) : (
					<Typography color="text.secondary">{data?.intro}</Typography>
				)}
			</SectionCard>
			<SectionCard>
				<Typography variant="h6" gutterBottom>What I'm Doing</Typography>
				<Grid container spacing={2}>
					{(loading ? Array.from({ length: 4 }) : data?.doing || []).map((item: any, idx: number) => (
						<Grid item xs={12} sm={6} md={3} key={idx}>
							{loading ? (
								<Skeleton variant="rounded" height={120} />
							) : (
								<FeatureCard icon={item.icon} title={item.title} text={item.text} />
							)}
						</Grid>
					))}
				</Grid>
			</SectionCard>
		</Stack>
	)
}
