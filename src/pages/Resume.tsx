import { Grid, Skeleton, Stack, Typography, Chip } from '@mui/material'
import { SectionCard } from '../components/SectionCard'
import { Timeline, TimelineItem } from '../components/Timeline'
import { SkillBars } from '../components/SkillBars'
import { useJson } from '../utils/useJson'

export function Resume() {
	const edu = useJson<TimelineItem[]>('/src/data/education.json')
	const exp = useJson<TimelineItem[]>('/src/data/experience.json')
	const skills = useJson<any>('/src/data/skills.json')

	return (
		<Stack spacing={2}>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<SectionCard>
						<Typography variant="h6" gutterBottom>Education</Typography>
						{edu.loading ? <Skeleton variant="rounded" height={200} /> : <Timeline items={edu.data || []} />}
					</SectionCard>
				</Grid>
				<Grid item xs={12} md={6}>
					<SectionCard>
						<Typography variant="h6" gutterBottom>Experience</Typography>
						{exp.loading ? <Skeleton variant="rounded" height={200} /> : <Timeline items={exp.data || []} />}
					</SectionCard>
				</Grid>
			</Grid>
			<SectionCard>
				<Typography variant="h6" gutterBottom>My Skills</Typography>
				{skills.loading ? (
					<Skeleton variant="rounded" height={120} />
				) : (
					<Stack spacing={2}>
						<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
							{[...skills.data.languages, ...skills.data.frontend_fullstack, ...skills.data.databases].slice(0, 12).map((s: string) => (
								<Chip key={s} label={s} />
							))}
						</Stack>
						<SkillBars bars={skills.data.bars} />
					</Stack>
				)}
			</SectionCard>
		</Stack>
	)
}
