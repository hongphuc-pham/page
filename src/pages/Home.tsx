import * as Icons from '@mui/icons-material'
import DownloadIcon from '@mui/icons-material/DownloadOutlined'
import EmailIcon from '@mui/icons-material/EmailOutlined'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline'
import SlideshowIcon from '@mui/icons-material/SlideshowOutlined'
import { Box, Button, Chip, Grid, Link, Stack, Typography } from '@mui/material'
import resumeDocx from '../assets/Phuc_Pham-CV-0401766596.docx'
import reelMp4 from '../assets/Phuc_Pham-Interview_Reel.mp4'
import deckPptx from '../assets/Phuc_Pham-Interview_Showcase.pptx'
import { SectionLabel } from '../components/SectionLabel'
import { Timeline, TimelineItem } from '../components/Timeline'
import site from '../config/site'
import about from '../data/about.json'
import edu from '../data/education.json'
import exp from '../data/experience.json'
import projects from '../data/projects.json'
import showcase from '../data/showcase.json'
import skills from '../data/skills.json'
import { fonts, tokens } from '../theme'

type Doing = { icon: string; title: string; text: string }
type About = { description: string; doing: Doing[] }
type Skills = {
	languages: string[]
	frontend_fullstack: string[]
	databases: string[]
	infrastructure: string[]
	ai_ml: string[]
}
type Project = { title: string; category: string; org?: string; summary: string; tech: string[]; link: string; repo: string }
type Education = { title: string; org: string; range?: string; projects?: string[]; awards?: string[] }
type ShowcaseLink = { label: string; url: string; icon: string }
type ShowcaseItem = {
	id: string
	name: string
	tagline: string
	summary: string
	tech: string[]
	status: string
	kind: 'web' | 'mobile' | 'internal'
	primary?: ShowcaseLink
	links?: ShowcaseLink[]
	displayUrl: string
	image?: string
	gradient: string
	accent: string
	initials: string
}

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
			<ShowcaseSection />
			<ExperienceSection />
			<WorkSection />
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
					startIcon={<SlideshowIcon />}
					component={Link}
					href={deckPptx}
					download
				>
					PTTX
				</Button>
				<Button
					variant="outlined"
					color="primary"
					startIcon={<PlayCircleIcon />}
					component={Link}
					href={reelMp4}
					target="_blank"
					rel="noreferrer"
					endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
				>
					30s Reel
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

function WorkSection() {
	const list = projects as Project[]
	return (
		<Box component="section" id="work">
			<SectionLabel index="06" title="selected work" />
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				justifyContent="space-between"
				alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
				spacing={1.5}
				sx={{ mb: 3 }}
			>
				<Typography variant="h4" sx={{ fontSize: { xs: 28, md: 34 }, maxWidth: 720 }}>
					Signature projects.
				</Typography>
				<Typography
					sx={{
						fontFamily: fonts.mono,
						fontSize: 11,
						letterSpacing: '0.18em',
						color: tokens.text.muted,
						textTransform: 'uppercase',
						pb: { sm: 1 },
					}}
				>
					case studies coming soon
				</Typography>
			</Stack>
			<Box
				sx={{
					border: `1px solid ${tokens.line}`,
					borderRadius: 2.5,
					bgcolor: tokens.surface,
					overflow: 'hidden',
				}}
			>
				{list.map((p, i) => (
					<WorkRow key={p.title} project={p} index={i + 1} divider={i < list.length - 1} />
				))}
			</Box>
		</Box>
	)
}

function WorkRow({ project, index, divider }: { project: Project; index: number; divider: boolean }) {
	return (
		<Box
			sx={{
				p: { xs: 2.25, md: 3 },
				display: 'grid',
				gridTemplateColumns: { xs: '36px 1fr', md: '56px 1fr 200px' },
				columnGap: { xs: 1.75, md: 3 },
				rowGap: 1.25,
				alignItems: 'baseline',
				borderBottom: divider ? `1px solid ${tokens.line}` : 'none',
				transition: 'background 200ms ease',
				'&:hover': { background: 'rgba(124,231,255,0.03)' },
			}}
		>
			<Typography
				sx={{
					fontFamily: fonts.mono,
					fontSize: { xs: 12, md: 13 },
					letterSpacing: '0.14em',
					color: tokens.primary,
					fontWeight: 600,
				}}
			>
				{String(index).padStart(2, '0')}
			</Typography>

			<Box sx={{ minWidth: 0 }}>
				<Stack direction="row" alignItems="baseline" spacing={1.25} flexWrap="wrap" sx={{ mb: 0.75 }}>
					<Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 20 }, letterSpacing: '-0.01em' }}>
						{project.title}
					</Typography>
					<Typography
						sx={{
							fontFamily: fonts.mono,
							fontSize: 10,
							letterSpacing: '0.16em',
							color: tokens.text.muted,
							textTransform: 'uppercase',
							display: { xs: 'inline', md: 'none' },
						}}
					>
						{project.category}
						{project.org && ` · ${project.org}`}
					</Typography>
				</Stack>
				<Typography
					variant="body2"
					sx={{ color: tokens.text.secondary, mb: 1.25, lineHeight: 1.65, maxWidth: 720 }}
				>
					{project.summary}
				</Typography>
				<Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
					{project.tech.map((t) => (
						<Chip key={t} label={t} size="small" />
					))}
				</Stack>
			</Box>

			<Stack
				spacing={0.75}
				alignItems="flex-end"
				sx={{ display: { xs: 'none', md: 'flex' } }}
			>
				<Typography
					sx={{
						fontFamily: fonts.mono,
						fontSize: 10,
						letterSpacing: '0.16em',
						color: tokens.text.muted,
						textTransform: 'uppercase',
					}}
				>
					{project.category}
				</Typography>
				{project.org && (
					<Typography
						sx={{
							fontFamily: fonts.mono,
							fontSize: 10,
							letterSpacing: '0.12em',
							color: tokens.primary,
							textTransform: 'uppercase',
							textAlign: 'right',
						}}
					>
						{project.org}
					</Typography>
				)}
				<Box
					sx={{
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
		</Box>
	)
}

function ShowcaseSection() {
	const items = showcase as ShowcaseItem[]
	return (
		<Box component="section" id="live">
			<SectionLabel index="04" title="live & shipping" />
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				justifyContent="space-between"
				alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
				spacing={1.5}
				sx={{ mb: 3 }}
			>
				<Typography variant="h4" sx={{ fontSize: { xs: 28, md: 34 }, maxWidth: 720 }}>
					Products you can visit, install, or read about today.
				</Typography>
				<Typography
					sx={{
						fontFamily: fonts.mono,
						fontSize: 11,
						letterSpacing: '0.18em',
						color: tokens.text.muted,
						textTransform: 'uppercase',
						pb: { sm: 1 },
					}}
				>
					{items.length} live surfaces
				</Typography>
			</Stack>
			<Grid container spacing={2.5}>
				{items.map((it) => (
					<Grid key={it.id} item xs={12} md={6}>
						<ShowcaseCard item={it} />
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
	const isMobile = item.kind === 'mobile'
	const isInternal = item.kind === 'internal'
	const StatusDot = isInternal ? Icons.Lock : Icons.FiberManualRecord
	return (
		<Box
			sx={{
				position: 'relative',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				border: `1px solid ${tokens.line}`,
				borderRadius: 3,
				overflow: 'hidden',
				bgcolor: tokens.surface,
				transition: 'border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease',
				'&:hover': {
					borderColor: `${item.accent}66`,
					transform: 'translateY(-3px)',
					boxShadow: `0 18px 44px -28px ${item.accent}55`,
				},
				'&:hover .showcase-hero img': {
					transform: 'scale(1.04)',
				},
			}}
		>
			<ChromeBar item={item} isMobile={isMobile} />

			<Box
				className="showcase-hero"
				sx={{
					position: 'relative',
					aspectRatio: '16 / 9',
					background: item.gradient,
					overflow: 'hidden',
					borderBottom: `1px solid ${tokens.line}`,
				}}
			>
				{item.image && (
					<Box
						component="img"
						src={item.image}
						alt={`${item.name} preview`}
						loading="lazy"
						sx={{
							position: 'absolute',
							inset: 0,
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							objectPosition: 'top center',
							display: 'block',
							transition: 'transform 700ms cubic-bezier(.2,.7,.2,1)',
							filter: 'saturate(1.05) contrast(1.02)',
						}}
					/>
				)}
				<Box
					aria-hidden
					sx={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(180deg, rgba(7,10,18,0.55) 0%, rgba(7,10,18,0) 22%, rgba(7,10,18,0) 55%, rgba(7,10,18,0.85) 100%)',
					}}
				/>
				<Box
					aria-hidden
					sx={{
						position: 'absolute',
						inset: 0,
						backgroundImage:
							'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),' +
							'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
						backgroundSize: '36px 36px',
						maskImage: 'radial-gradient(ellipse at 70% 90%, black 25%, transparent 75%)',
						WebkitMaskImage: 'radial-gradient(ellipse at 70% 90%, black 25%, transparent 75%)',
						opacity: 0.35,
						mixBlendMode: 'overlay',
					}}
				/>

				<Stack
					direction="row"
					spacing={0.75}
					sx={{
						position: 'absolute',
						top: 14,
						left: 16,
						alignItems: 'center',
						px: 1.1,
						py: 0.45,
						borderRadius: 999,
						bgcolor: 'rgba(7,10,18,0.55)',
						backdropFilter: 'blur(8px)',
						border: `1px solid rgba(255,255,255,0.10)`,
					}}
				>
					<StatusDot
						sx={{
							fontSize: isInternal ? 11 : 9,
							color: isInternal ? tokens.accent : tokens.lime,
						}}
					/>
					<Typography
						sx={{
							fontFamily: fonts.mono,
							fontSize: 10,
							letterSpacing: '0.14em',
							color: tokens.text.primary,
							textTransform: 'uppercase',
						}}
					>
						{item.status}
					</Typography>
				</Stack>

				<Box
					sx={{
						position: 'absolute',
						top: 14,
						right: 16,
						px: 1.1,
						py: 0.45,
						borderRadius: 999,
						bgcolor: 'rgba(7,10,18,0.55)',
						backdropFilter: 'blur(8px)',
						border: `1px solid rgba(255,255,255,0.10)`,
					}}
				>
					<Typography
						sx={{
							fontFamily: fonts.mono,
							fontSize: 10,
							letterSpacing: '0.18em',
							color: tokens.text.primary,
							textTransform: 'uppercase',
						}}
					>
						{item.kind === 'web' ? 'Web · Live' : item.kind === 'mobile' ? 'iOS · Android' : 'Internal · Private'}
					</Typography>
				</Box>

				{!item.image && (
					<Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
						<Typography
							sx={{
								fontFamily: fonts.display,
								fontSize: { xs: 88, md: 112 },
								fontWeight: 800,
								letterSpacing: '-0.04em',
								color: 'rgba(255,255,255,0.10)',
								lineHeight: 1,
								userSelect: 'none',
							}}
						>
							{item.initials}
						</Typography>
					</Box>
				)}

				<Typography
					sx={{
						position: 'absolute',
						bottom: 14,
						left: 16,
						right: 16,
						fontFamily: fonts.mono,
						fontSize: 11,
						letterSpacing: '0.06em',
						color: 'rgba(255,255,255,0.82)',
					}}
				>
					{item.displayUrl}
				</Typography>
			</Box>

			<Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
				<Stack direction="row" alignItems="baseline" spacing={1.25} flexWrap="wrap">
					<Typography sx={{ fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em' }}>{item.name}</Typography>
					<Typography
						sx={{
							fontFamily: fonts.mono,
							fontSize: 11,
							letterSpacing: '0.12em',
							color: item.accent,
							textTransform: 'uppercase',
						}}
					>
						{item.tagline}
					</Typography>
				</Stack>

				<Typography variant="body2" sx={{ color: tokens.text.secondary, lineHeight: 1.65 }}>
					{item.summary}
				</Typography>

				<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
					{item.tech.map((t) => (
						<Chip key={t} label={t} size="small" />
					))}
				</Stack>

				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mt: 'auto', pt: 1.5 }}>
					{item.primary && <ShowcaseCta link={item.primary} accent={item.accent} primary />}
					{item.links?.map((l, idx) => (
						<ShowcaseCta key={l.url} link={l} accent={item.accent} primary={idx === 0 && !item.primary} />
					))}
				</Stack>
			</Box>
		</Box>
	)
}

function ChromeBar({ item, isMobile }: { item: ShowcaseItem; isMobile: boolean }) {
	if (isMobile) {
		return (
			<Stack
				direction="row"
				alignItems="center"
				spacing={1}
				sx={{
					px: 2,
					py: 1.1,
					borderBottom: `1px solid ${tokens.line}`,
					bgcolor: 'var(--chrome-bar-bg)',
				}}
			>
				<Icons.Apple sx={{ fontSize: 14, color: tokens.text.muted }} />
				<Icons.Android sx={{ fontSize: 14, color: tokens.text.muted }} />
				<Box sx={{ flex: 1 }} />
				<Typography
					sx={{
						fontFamily: fonts.mono,
						fontSize: 10,
						letterSpacing: '0.14em',
						color: tokens.text.muted,
						textTransform: 'uppercase',
					}}
				>
					mobile · cross-platform
				</Typography>
			</Stack>
		)
	}
	return (
		<Stack
			direction="row"
			alignItems="center"
			spacing={1.25}
			sx={{
				px: 2,
				py: 1.1,
				borderBottom: `1px solid ${tokens.line}`,
				bgcolor: 'var(--chrome-bar-bg)',
			}}
		>
			<Stack direction="row" spacing={0.6}>
				{['#FF6B6B', '#FFB02E', '#C6FF3D'].map((c) => (
					<Box key={c} sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: `${c}99` }} />
				))}
			</Stack>
			<Box
				sx={{
					flex: 1,
					px: 1.25,
					py: 0.5,
					borderRadius: 999,
					border: `1px solid ${tokens.line}`,
					bgcolor: 'rgba(255,255,255,0.02)',
					display: 'flex',
					alignItems: 'center',
					gap: 0.75,
					minWidth: 0,
				}}
			>
				<Icons.LockOutlined sx={{ fontSize: 11, color: tokens.text.muted }} />
				<Typography
					noWrap
					sx={{
						fontFamily: fonts.mono,
						fontSize: 11,
						color: tokens.text.secondary,
						letterSpacing: '0.02em',
					}}
				>
					https://{item.displayUrl}
				</Typography>
			</Box>
		</Stack>
	)
}

function ShowcaseCta({
	link,
	accent,
	primary,
}: {
	link: ShowcaseLink
	accent: string
	primary: boolean
}) {
	const Icon = (Icons as unknown as Record<string, typeof Icons.Api>)[link.icon] ?? Icons.OpenInNew
	if (primary) {
		return (
			<Button
				variant="contained"
				component={Link}
				href={link.url}
				target="_blank"
				rel="noreferrer"
				startIcon={<Icon sx={{ fontSize: 18 }} />}
				endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
				sx={{
					bgcolor: accent,
					color: '#06121A',
					'&:hover': { bgcolor: accent, filter: 'brightness(0.92)' },
				}}
			>
				{link.label}
			</Button>
		)
	}
	return (
		<Button
			variant="outlined"
			color="primary"
			component={Link}
			href={link.url}
			target="_blank"
			rel="noreferrer"
			startIcon={<Icon sx={{ fontSize: 18 }} />}
			endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
			sx={{
				borderColor: tokens.line,
				color: tokens.text.primary,
				'&:hover': { borderColor: accent, backgroundColor: `${accent}10` },
			}}
		>
			{link.label}
		</Button>
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
			<SectionLabel index="07" title="education" />
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
