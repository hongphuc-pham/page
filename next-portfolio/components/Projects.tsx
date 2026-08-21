import { projects, type Project } from '@/lib/cv'
import { DrStats, Section } from './Sections'
import { Reveal } from './Reveal'
import { AfterLine, BeforeBox, Eyebrow, ExternalLink, Icon, TagRow } from './ui'

/**
 * The bento grid.
 *
 * ── The honesty rule, as a layout rule ────────────────────────────────────
 * A project with a grounded `before` renders a caption box and an AFTER
 * label, so the card performs the site's whole argument in miniature. A
 * project without one — ElevexAI, AIDFest, both product surfaces rather than
 * automations — gets NEITHER, and its body copy simply starts. The asymmetry
 * is the point: it reads as a decision, not as a missing field. Do not
 * "fix" it by inventing a before-line.
 */

const SPAN: Record<Project['span'], string> = {
	4: 'md:col-span-4',
	6: 'md:col-span-6',
	8: 'md:col-span-8',
	12: 'md:col-span-12',
}

const ACCENT: Record<NonNullable<Project['accent']>, string> = {
	primary: 'text-primary',
	secondary: 'text-secondary-container',
	outline: 'text-outline',
}

function StatusPill({ children, floating = true }: { children: React.ReactNode; floating?: boolean }) {
	return (
		<span
			className={`absolute left-4 top-4 rounded-full border border-white/10 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.1em] ${
				floating ? 'bg-background/70 text-on-surface backdrop-blur' : 'text-on-surface-variant'
			}`}
		>
			{children}
		</span>
	)
}

/** Screenshot, initials block, or icon — in that order of preference. */
function Media({ project, className }: { project: Project; className: string }) {
	if (project.shot) {
		return (
			<div className={`relative ${className}`}>
				{/* Plain <img> rather than next/image: these are live third-party
				    screenshot-service URLs that redirect and change, which the
				    optimiser cannot fingerprint. */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					alt=""
					aria-hidden
					className="absolute inset-0 h-full w-full object-cover object-top opacity-50 transition-opacity duration-500 group-hover:opacity-90"
					loading="lazy"
					src={project.shot}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
				{project.status && <StatusPill>{project.status}</StatusPill>}
			</div>
		)
	}
	return (
		<div
			className={`relative flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary-container/10 ${className}`}
		>
			{project.initials ? (
				<span className="font-display text-[56px] font-extrabold tracking-tighter text-white/10">{project.initials}</span>
			) : (
				<Icon className="text-white/10" name={project.icon} />
			)}
			{project.status && <StatusPill floating={false}>{project.status}</StatusPill>}
		</div>
	)
}

function Body({ project }: { project: Project }) {
	return (
		<>
			<div className="mb-3 flex items-center gap-2">
				<Icon className={ACCENT[project.accent ?? 'primary']} name={project.icon} />
				<Eyebrow className={ACCENT[project.accent ?? 'primary']}>{project.kind}</Eyebrow>
			</div>
			<h3 className="mb-3 font-display text-[clamp(24px,3.4vw,32px)] font-extrabold tracking-tight text-on-background">
				{project.name}
			</h3>
			{project.before ? (
				<>
					<div className="mb-3">
						<BeforeBox>{project.before}</BeforeBox>
					</div>
					<div className="mb-5 flex-1">
						<AfterLine>{project.body}</AfterLine>
					</div>
				</>
			) : (
				<p className="mb-5 flex-1 text-base leading-relaxed text-on-surface-variant">{project.body}</p>
			)}
			{project.caveat && <p className="mb-5 text-[13px] italic text-outline">{project.caveat}</p>}
			<TagRow items={project.tech} />
			{project.links && (
				<div className="mt-4 flex flex-wrap gap-4">
					{project.links.map((l) => (
						<ExternalLink href={l.href} key={l.href}>
							{l.label}
						</ExternalLink>
					))}
				</div>
			)}
		</>
	)
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
	// The 12-col card is the DR platform: it earns a side-by-side layout with
	// the two numbers, because the numbers ARE the story there.
	if (project.span === 12) {
		return (
			<Reveal className={`glass-panel col-span-1 flex flex-col gap-8 rounded-xl p-6 md:p-8 lg:flex-row lg:items-center ${SPAN[12]}`}>
				<div className="flex-1">
					<Body project={project} />
				</div>
				<DrStats />
			</Reveal>
		)
	}

	// The 8-col card is the flagship: media beside copy, not above it.
	const wide = project.span === 8
	return (
		<Reveal
			className={`glass-panel group col-span-1 flex flex-col overflow-hidden rounded-xl ${SPAN[project.span]} ${
				wide ? 'md:flex-row' : ''
			}`}
			delay={index % 2 === 1 ? 80 : 0}
		>
			<Media className={wide ? 'h-56 w-full shrink-0 md:h-auto md:w-1/2' : 'h-44 shrink-0'} project={project} />
			<div className={`flex flex-1 flex-col p-6 md:p-8 ${wide ? 'justify-center md:w-1/2' : ''}`}>
				<Body project={project} />
			</div>
		</Reveal>
	)
}

export function Projects() {
	return (
		<Section className="pt-20 md:pt-24" id="projects">
			<div className="mb-stack-lg">
				<Reveal as="h2">
					<span className="block font-display text-[clamp(34px,7vw,64px)] leading-[1.05] tracking-[-0.04em] text-on-background">
						SELECTED WORKS<span className="text-primary">.</span>
					</span>
				</Reveal>
				<Reveal as="p" className="mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant" delay={60}>
					Not demos. Downloads. Where a project replaced a manual process, it says what that process was — where it
					didn&apos;t, it doesn&apos;t pretend otherwise.
				</Reveal>
			</div>

			<div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
				{projects.map((p, i) => (
					<ProjectCard index={i} key={p.name} project={p} />
				))}
			</div>
		</Section>
	)
}
