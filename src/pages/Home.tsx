import { Box, Button, Chip, Grid, Link, Stack, Typography } from '@mui/material'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import EmailIcon from '@mui/icons-material/EmailOutlined'
import DownloadIcon from '@mui/icons-material/DownloadOutlined'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import * as Icons from '@mui/icons-material'
import { SectionLabel } from '../components/SectionLabel'
import { Timeline, TimelineItem } from '../components/Timeline'
import { fonts, tokens } from '../theme'
import site from '../config/site'
import about from '../data/about.json'
import skills from '../data/skills.json'
import exp from '../data/experience.json'
import edu from '../data/education.json'
import projects from '../data/projects.json'
import resumeDocx from '../assets/Phuc_Pham-CV-0401766596.docx'

type Doing = { icon: string; title: string; text: string }
type About = { description: string; doing: Doing[] }
type Skills = {
	languages: string[]
	frontend_fullstack: string[]
	databases: string[]
	infrastructure: string[]
	ai_ml: string[]
}
type Project = { title: string; category: string; summary: string; tech: string[]; link: string; repo: string }
type Education = { title: string; org: string; range?: string; projects?: string[]; awards?: string[] }

const skillData = skills as Skills
const aboutData = about as About

const stackGroups: { label: string; items: string[] }[] = [
	{ label: 'Languages', items: skillData.languages },
	{ label: 'Backend & Frontend', items: skillData.frontend_fullstack },
	{ label: 'Databases', items: skillData.databases },
	{ label: 'Infrastructure', items: skillData.infrastructure },
	{ label: 'AI & ML', items: skillData.ai_ml },
]

const highlights: { k: string; v: string; note: string }[] = [
	{ k: '4–5', v: 'production apps shipped', note: 'end-to-end at UofA CREST' },
	{ k: '~10%', v: 'DR efficiency uplift', note: 'Kau Mau Te Wehi Award · ANZ NZ' },
	{ k: 'MLL + BIT', v: 'degrees', note: 'UofA · WelTec (Patrick Pop Shield)' },
	{ k: '7+ yrs', v: 'full SDLC', note: 'enterprise + research' },
]

export function Home() {
	return (
		<Stack spacing={{ xs: 6, md: 10 }} sx={{ pb: 10 }}>
			<Hero />
			<HighlightsStrip />
			<AboutSection />
			<StackSection />
			<WorkSection />
			<ExperienceSection />
			<EducationSection />
			<ContactCTA />
		</Stack>
	)
}

function Hero() {
	return (
		<Box
			sx={{
				position: 'relative',
				pt: { xs: 4, md: 8 },
				pb: { xs: 4, md: 6 },
			}}
		>
			<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
				<Chip
					icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: `${tokens.lime} !important` }} />}
					label={site.availability}
					sx={{
						bgcolor: 'rgba(198,255,61,0.06)',
						borderColor: 'rgba(198,255,61,0.28)',
						color: tokens.text.primary,
						fontFamily: fonts.mono,
						fontSize: 11,
						letterSpacing: '0.08em',
					}}
				/>
			</Stack>

			<Typography
				sx={{
					fontFamily: fonts.mono,
					fontSize: 13,
					letterSpacing: '0.2em',
					color: tokens.text.secondary,
					textTransform: 'uppercase',
					mb: 2,
				}}
			>
				Phuc (William) Pham · {site.location}
			</Typography>

			<Typography
				variant="h1"
				sx={{
					fontSize: { xs: 44, sm: 64, md: 88, lg: 104 },
					lineHeight: 0.98,
					letterSpacing: '-0.035em',
					mb: 3,
				}}
			>
				Software that
				<Box
					component="span"
					sx={{
						display: 'inline-block',
						ml: 1.5,
						px: 1,
						background: tokens.gradient,
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}
				>
					serves
				</Box>
				<br />
				people, not just
				<Box
					component="span"
					sx={{
						position: 'relative',
						ml: 1.5,
						fontStyle: 'italic',
						fontFamily: fonts.display,
					}}
				>
					functions
					<Box
						sx={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: { xs: 4, md: 8 },
							height: { xs: 6, md: 10 },
							background: 'rgba(124,231,255,0.25)',
							borderRadius: 2,
							zIndex: -1,
						}}
					/>
				</Box>
				.
			</Typography>

			<Typography
				variant="h6"
				sx={{
					color: tokens.text.secondary,
					fontWeight: 400,
					maxWidth: 640,
					fontFamily: fonts.body,
					fontSize: { xs: 16, md: 18 },
					mb: 4,
				}}
			>
				{site.role} across web, mobile, and ML — shipping production systems at
				<Box component="span" sx={{ color: tokens.text.primary }}> UofA CREST</Box> and
				<Box component="span" sx={{ color: tokens.text.primary }}> ANZ New Zealand</Box>.
				Reliable in high-stakes operations, comfortable across technical and non-technical teams.
			</Typography>

			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 5 }}>
				<Button
					variant="contained"
					color="primary"
					startIcon={<EmailIcon />}
					component={Link}
					href={`mailto:${site.email}`}
				>
					{site.email}
				</Button>
				<Button
					variant="outlined"
					color="primary"
					startIcon={<DownloadIcon />}
					component={Link}
					href={resumeDocx}
					download
				>
					Download CV
				</Button>
				<Button
					variant="outlined"
					color="primary"
					startIcon={<GitHubIcon />}
					component={Link}
					href={site.socials.github}
					target="_blank"
					rel="noreferrer"
					endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
				>
					GitHub
				</Button>
			</Stack>

			<Stack
				direction="row"
				spacing={3}
				sx={{
					pt: 3,
					borderTop: `1px solid ${tokens.line}`,
					fontFamily: fonts.mono,
					fontSize: 12,
					color: tokens.text.muted,
					flexWrap: 'wrap',
					rowGap: 1,
				}}
			>
				<MetaTag label="focus" value="web · mobile · ai" />
				<MetaTag label="tz" value={site.timezone} />
				<MetaTag label="stack" value="react · node · python · fastapi" />
			</Stack>
		</Box>
	)
}

function MetaTag({ label, value }: { label: string; value: string }) {
	return (
		<Box component="span" sx={{ display: 'inline-flex', gap: 0.75 }}>
			<Box component="span" sx={{ color: tokens.primary }}>{label}:</Box>
			<Box component="span">{value}</Box>
		</Box>
	)
}

function HighlightsStrip() {
	return (
		<Box component="section" id="signal">
			<SectionLabel index="01" title="signal" />
			<Grid container spacing={2}>
				{highlights.map((h) => (
					<Grid key={h.k} item xs={6} md={3}>
						<Box
							sx={{
								p: 2.5,
								height: '100%',
								border: `1px solid ${tokens.line}`,
								borderRadius: 2,
								bgcolor: tokens.surface,
								transition: 'border-color 160ms ease, transform 160ms ease',
								'&:hover': { borderColor: tokens.primary, transform: 'translateY(-2px)' },
							}}
						>
							<Typography
								variant="h3"
								sx={{
									fontSize: { xs: 30, md: 38 },
									background: tokens.gradient,
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									mb: 0.5,
								}}
							>
								{h.k}
							</Typography>
							<Typography sx={{ color: tokens.text.primary, fontWeight: 600, fontSize: 14 }}>{h.v}</Typography>
							<Typography
								sx={{ color: tokens.text.muted, fontFamily: fonts.mono, fontSize: 11, mt: 0.5, letterSpacing: '0.04em' }}
							>
								{h.note}
							</Typography>
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

function AboutSection() {
	const doing = aboutData.doing
	return (
		<Box component="section" id="about">
			<SectionLabel index="02" title="about" />
			<Grid container spacing={{ xs: 3, md: 5 }}>
				<Grid item xs={12} md={6}>
					<Typography variant="h4" sx={{ mb: 2, fontSize: { xs: 28, md: 34 } }}>
						Built for reliable delivery, curious about everything else.
					</Typography>
					<Typography sx={{ color: tokens.text.secondary, lineHeight: 1.7 }}>
						{aboutData.description}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					<Grid container spacing={2}>
						{doing.map((d) => {
							const Icon = (Icons as unknown as Record<string, typeof Icons.Api>)[d.icon] ?? Icons.Api
							return (
								<Grid key={d.title} item xs={12} sm={6}>
									<Box
										sx={{
											p: 2.5,
											height: '100%',
											bgcolor: tokens.surface,
											border: `1px solid ${tokens.line}`,
											borderRadius: 2,
											transition: 'border-color 160ms ease',
											'&:hover': { borderColor: tokens.primary },
										}}
									>
										<Box
											sx={{
												width: 34,
												height: 34,
												borderRadius: 1.5,
												display: 'grid',
												placeItems: 'center',
												bgcolor: 'rgba(124,231,255,0.08)',
												color: tokens.primary,
												mb: 1.5,
											}}
										>
											<Icon sx={{ fontSize: 20 }} />
										</Box>
										<Typography sx={{ fontWeight: 600, mb: 0.5 }}>{d.title}</Typography>
										<Typography variant="body2" sx={{ color: tokens.text.secondary }}>
											{d.text}
										</Typography>
									</Box>
								</Grid>
							)
						})}
					</Grid>
				</Grid>
			</Grid>
		</Box>
	)
}

function StackSection() {
	return (
		<Box component="section" id="stack">
			<SectionLabel index="03" title="stack" />
			<Typography variant="h4" sx={{ mb: 3, fontSize: { xs: 28, md: 34 } }}>
				Tools I reach for.
			</Typography>
			<Stack spacing={2}>
				{stackGroups.map((g) => (
					<Box key={g.label} sx={{ display: { md: 'grid' }, gridTemplateColumns: '220px 1fr', gap: 3, alignItems: 'start' }}>
						<Typography
							sx={{
								fontFamily: fonts.mono,
								fontSize: 12,
								letterSpacing: '0.14em',
								color: tokens.text.muted,
								textTransform: 'uppercase',
								pt: 1,
							}}
						>
							{g.label}
						</Typography>
						<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
							{g.items.map((it) => (
								<Chip key={it} label={it} />
							))}
						</Stack>
					</Box>
				))}
			</Stack>
		</Box>
	)
}

const projectGradients = [
	'linear-gradient(135deg, rgba(124,231,255,0.25), rgba(198,255,61,0.15))',
	'linear-gradient(135deg, rgba(255,176,46,0.22), rgba(124,231,255,0.12))',
	'linear-gradient(135deg, rgba(198,255,61,0.22), rgba(255,176,46,0.12))',
	'linear-gradient(135deg, rgba(124,231,255,0.2), rgba(255,107,107,0.14))',
]

function WorkSection() {
	const list = projects as Project[]
	return (
		<Box component="section" id="work">
			<SectionLabel index="04" title="selected work" />
			<Typography variant="h4" sx={{ mb: 3, fontSize: { xs: 28, md: 34 } }}>
				Signature projects.
			</Typography>
			<Grid container spacing={2}>
				{list.map((p, i) => (
					<Grid key={p.title} item xs={12} md={6}>
						<Box
							aria-disabled
							sx={{
								display: 'block',
								height: '100%',
								position: 'relative',
								border: `1px solid ${tokens.line}`,
								borderRadius: 2.5,
								overflow: 'hidden',
								bgcolor: tokens.surface,
								transition: 'border-color 160ms ease, transform 160ms ease',
								'&:hover': { borderColor: 'rgba(124,231,255,0.5)', transform: 'translateY(-2px)' },
							}}
						>
							<Box
								sx={{
									height: '100%',
								}}
							>
								<Box
									sx={{
										aspectRatio: '16 / 8',
										background: projectGradients[i % projectGradients.length],
										position: 'relative',
										overflow: 'hidden',
										borderBottom: `1px solid ${tokens.line}`,
									}}
								>
									<Box
										sx={{
											position: 'absolute',
											inset: 0,
											backgroundImage:
												'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0, transparent 40%), ' +
												'linear-gradient(135deg, transparent 48%, rgba(255,255,255,0.04) 50%, transparent 52%)',
										}}
									/>
									<Typography
										sx={{
											position: 'absolute',
											top: 16,
											left: 16,
											fontFamily: fonts.mono,
											fontSize: 11,
											letterSpacing: '0.18em',
											color: tokens.text.primary,
											textTransform: 'uppercase',
										}}
									>
										{String(i + 1).padStart(2, '0')} / {p.category}
									</Typography>
									<Typography
										sx={{
											position: 'absolute',
											bottom: 16,
											right: 20,
											fontFamily: fonts.display,
											fontSize: { xs: 40, md: 56 },
											fontWeight: 700,
											color: 'rgba(255,255,255,0.08)',
											letterSpacing: '-0.03em',
										}}
									>
										{p.title.split(' ').map((w) => w[0]).join('').slice(0, 3)}
									</Typography>
								</Box>
								<Box sx={{ p: 2.5 }}>
									<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
										<Typography sx={{ fontWeight: 700, fontSize: 18 }}>{p.title}</Typography>
										<Box
											sx={{
												ml: 'auto',
												px: 1,
												py: 0.25,
												borderRadius: 999,
												fontFamily: fonts.mono,
												fontSize: 10,
												letterSpacing: '0.14em',
												color: tokens.text.muted,
												border: `1px solid ${tokens.line}`,
												textTransform: 'uppercase',
											}}
										>
											case study soon
										</Box>
									</Stack>
									<Typography variant="body2" sx={{ color: tokens.text.secondary, mb: 1.5 }}>
										{p.summary}
									</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										{p.tech.map((t) => (
											<Chip key={t} label={t} size="small" />
										))}
									</Stack>
								</Box>
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

function ExperienceSection() {
	return (
		<Box component="section" id="experience">
			<SectionLabel index="05" title="experience" />
			<Typography variant="h4" sx={{ mb: 3, fontSize: { xs: 28, md: 34 } }}>
				Where I've shipped.
			</Typography>
			<Timeline items={exp as unknown as TimelineItem[]} />
		</Box>
	)
}

function EducationSection() {
	return (
		<Box component="section" id="education">
			<SectionLabel index="06" title="education" />
			<Grid container spacing={2}>
				{(edu as Education[]).map((e) => (
					<Grid key={e.title} item xs={12} md={6}>
						<Box
							sx={{
								p: 3,
								height: '100%',
								border: `1px solid ${tokens.line}`,
								borderRadius: 2,
								bgcolor: tokens.surface,
							}}
						>
							<Typography sx={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.14em', color: tokens.primary, textTransform: 'uppercase', mb: 1 }}>
								{e.range || 'Degree'}
							</Typography>
							<Typography variant="h6" sx={{ mb: 0.5 }}>{e.title}</Typography>
							<Typography variant="body2" sx={{ color: tokens.text.secondary, mb: 1.5 }}>{e.org}</Typography>
							{e.projects && (
								<Stack spacing={0.5}>
									{e.projects.map((p: string) => (
										<Typography key={p} variant="body2" sx={{ color: tokens.text.secondary }}>· {p}</Typography>
									))}
								</Stack>
							)}
							{e.awards && (
								<Stack spacing={0.5}>
									{e.awards.map((a: string) => (
										<Typography key={a} variant="body2" sx={{ color: tokens.text.secondary }}>★ {a}</Typography>
									))}
								</Stack>
							)}
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

function ContactCTA() {
	return (
		<Box
			component="section"
			id="contact"
			sx={{
				p: { xs: 4, md: 6 },
				border: `1px solid ${tokens.line}`,
				borderRadius: 3,
				bgcolor: tokens.bgElevated,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(600px 300px at 90% 0%, rgba(124,231,255,0.12), transparent 60%),' +
						'radial-gradient(500px 300px at 0% 100%, rgba(198,255,61,0.08), transparent 60%)',
					pointerEvents: 'none',
				}}
			/>
			<Box sx={{ position: 'relative' }}>
				<Typography sx={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.2em', color: tokens.primary, textTransform: 'uppercase', mb: 2 }}>
					// let's build
				</Typography>
				<Typography variant="h2" sx={{ fontSize: { xs: 36, md: 56 }, mb: 2, maxWidth: 820 }}>
					Got a hard problem worth shipping? Let's talk.
				</Typography>
				<Typography sx={{ color: tokens.text.secondary, mb: 3, maxWidth: 620 }}>
					{site.availability}. Happy to chat about roles, collaborations, or a weird side project.
				</Typography>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
					<Button
						variant="contained"
						color="primary"
						startIcon={<EmailIcon />}
						component={Link}
						href={`mailto:${site.email}`}
					>
						{site.email}
					</Button>
					<Button
						variant="outlined"
						color="primary"
						startIcon={<LinkedInIcon />}
						component={Link}
						href={site.socials.linkedin}
						target="_blank"
						rel="noreferrer"
					>
						LinkedIn
					</Button>
					<Button
						variant="outlined"
						color="primary"
						startIcon={<GitHubIcon />}
						component={Link}
						href={site.socials.github}
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</Button>
				</Stack>
			</Box>
		</Box>
	)
}
