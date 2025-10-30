import { Grid, Stack, Typography, Chip } from '@mui/material'
import { SectionCard } from '../components/SectionCard'
import { FeatureCard } from '../components/FeatureCard'
import { Timeline, TimelineItem } from '../components/Timeline'
// Use static imports so content always renders (avoids dynamic import issues in build/hash routes)
import about from '../data/about.json'
import edu from '../data/education.json'
import exp from '../data/experience.json'
import skills from '../data/skills.json'

export function Home() {
	return (
		<Stack spacing={2}>
			<SectionCard>
				<Typography variant="h6" gutterBottom>About Me</Typography>
				{(about as any).description && (
					<Typography color="text.secondary" sx={{ textAlign: 'left' }}>
						{(about as any).description}
					</Typography>
				)}
			</SectionCard>

			<SectionCard>
				<Typography variant="h6" gutterBottom>What I'm Doing</Typography>
				<Grid container spacing={2}>
					{(((about as any).doing || []) as any[]).map((item: any, idx: number) => (
						<Grid item xs={12} sm={6} md={4} key={idx}>
							<FeatureCard icon={item.icon} title={item.title} text={item.text} />
						</Grid>
					))}
				</Grid>
			</SectionCard>

			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Stack spacing={2}>
						<SectionCard>
							<Typography variant="h6" gutterBottom>Education</Typography>
							<Timeline items={(edu as unknown as TimelineItem[]) || []} />
						</SectionCard>
						<SectionCard>
							<Typography variant="h6" gutterBottom>Skills</Typography>
							<Stack spacing={2}>
								<Stack spacing={1}>
									<Typography variant="subtitle2">Languages</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										{((skills as any).languages || []).map((s: string) => <Chip key={s} label={s} sx={{ border: '1px solid', borderColor: 'primary.main' }} />)}
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<Typography variant="subtitle2">Front-End & Full-Stack</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										{((skills as any).frontend_fullstack || []).map((s: string) => <Chip key={s} label={s} sx={{ border: '1px solid', borderColor: 'primary.main' }} />)}
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<Typography variant="subtitle2">Databases & Storage</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										{((skills as any).databases || []).map((s: string) => <Chip key={s} label={s} sx={{ border: '1px solid', borderColor: 'primary.main' }} />)}
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<Typography variant="subtitle2">Tools & Tech</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										{((skills as any).tools || []).map((s: string) => <Chip key={s} label={s} sx={{ border: '1px solid', borderColor: 'primary.main' }} />)}
									</Stack>
								</Stack>
								<Stack spacing={1}>
									<Typography variant="subtitle2">Soft skills</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										{((skills as any).soft || []).map((s: string) => <Chip key={s} label={s} sx={{ border: '1px solid', borderColor: 'primary.main' }} />)}
									</Stack>
								</Stack>
							</Stack>
						</SectionCard>
					</Stack>
				</Grid>
				<Grid item xs={12} md={6}>
					<SectionCard>
						<Typography variant="h6" gutterBottom>Experience</Typography>
						<Timeline items={(exp as unknown as TimelineItem[]) || []} />
					</SectionCard>
				</Grid>
			</Grid>
		</Stack>
	)
}
