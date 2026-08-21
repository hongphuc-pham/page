import { contact, drStat, education, extras, hero, method, origin, roles, skillGroups } from '@/lib/cv'
import { HeroVideo } from './HeroVideo'
import { Reveal } from './Reveal'
import { Eyebrow, Icon, SectionHeading, TagRow } from './ui'

const HERO_STREAM = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8'

/** Shared section shell — padding, width and the id the header spies on. */
function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
	return (
		<section
			className={`relative z-10 mx-auto w-full max-w-container-max px-margin-mobile pb-stack-lg md:px-margin-desktop ${className}`}
			id={id}
		>
			{children}
		</section>
	)
}

/* ── Hero ──────────────────────────────────────────────────────────────── */

export function Hero() {
	return (
		<section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden pb-16 pt-28" id="top">
			<div className="absolute inset-0 z-0">
				<HeroVideo src={HERO_STREAM} />
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/70 to-transparent" />
				<div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent" />
				<div className="pointer-events-none absolute inset-0 z-10 hidden justify-evenly md:flex">
					<div className="h-full w-px bg-white/10" />
					<div className="h-full w-px bg-white/10" />
					<div className="h-full w-px bg-white/10" />
				</div>
				<div className="glow-ellipse absolute left-1/2 top-0 z-0 h-[400px] w-[min(800px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-[100%]" />
			</div>

			<div className="relative z-20 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
				<div className="max-w-4xl">
					<Reveal as="p" className="mb-4 block">
						<Eyebrow className="text-primary-container">{hero.eyebrow}</Eyebrow>
					</Reveal>
					{/* "MANUAL STEP." is unbreakable, so the line can only split
					    BEFORE it. Left to itself the headline wrapped as
					    "I DELETE THE MANUAL / STEP.", which orphans the word the
					    whole sentence turns on. */}
					<Reveal as="h1" delay={60}>
						<span className="block text-balance font-display text-[clamp(38px,9vw,76px)] leading-[1.02] tracking-[-0.04em] text-on-background">
							{hero.headlineLead}{' '}
							<span className="whitespace-nowrap">
								{hero.headlineTail}
								<span className="text-primary-container">.</span>
							</span>
						</span>
					</Reveal>
					<Reveal as="p" className="mb-4 mt-6 max-w-[620px] text-[clamp(15px,2.2vw,18px)] leading-relaxed text-on-surface-variant" delay={120}>
						{hero.lede}
					</Reveal>
					<Reveal as="p" className="mb-10 max-w-[620px] text-[14px] leading-relaxed text-outline" delay={180}>
						{hero.sub}
					</Reveal>
					<Reveal className="flex flex-col gap-4 sm:flex-row sm:items-center" delay={240}>
						<a
							className="press inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-7 py-4 font-label text-[12px] font-semibold uppercase tracking-[0.1em] text-background hover:shadow-[0_0_15px_rgba(94,210,156,0.5)]"
							href="#projects"
						>
							View Work
							<Icon filled name="arrow_right_alt" />
						</a>
						<Eyebrow className="text-outline">{contact.availability}</Eyebrow>
					</Reveal>
				</div>
			</div>
		</section>
	)
}

/* ── Origin ────────────────────────────────────────────────────────────── */

export function Origin() {
	const rows = [
		{ key: 'before', label: 'Before', text: origin.before, tone: 'text-outline' },
		{ key: 'after', label: 'After', text: origin.after, tone: 'text-primary-container' },
		{ key: 'result', label: 'Result', text: origin.result, tone: 'text-secondary-container' },
	] as const

	return (
		<Section className="pt-20 md:pt-24" id="origin">
			<Reveal>
				<SectionHeading icon="bolt">{origin.heading}</SectionHeading>
			</Reveal>
			<Reveal className="glass-panel mt-8 rounded-xl p-6 md:p-10" delay={80}>
				<div className="ba-rail max-w-3xl">
					{rows.map((r) => (
						<div className={`ba-row ${r.tone}`} key={r.key}>
							<div className="mb-1 font-label text-[10px] font-bold uppercase tracking-[0.22em]">{r.label}</div>
							<p className={`text-[15px] leading-[1.65] ${r.key === 'result' ? 'text-on-surface' : 'text-on-surface-variant'}`}>
								{r.text}
							</p>
						</div>
					))}
				</div>
				<div className="award mt-8 flex items-center gap-3 font-label text-[12px] font-semibold text-on-surface-variant md:ml-[22px]">
					<i>★</i>
					<span>{origin.award}</span>
				</div>
			</Reveal>
		</Section>
	)
}

/* ── Experience ────────────────────────────────────────────────────────── */

export function Experience() {
	return (
		<Section className="pt-12" id="experience">
			<Reveal>
				<SectionHeading icon="work">Experience</SectionHeading>
			</Reveal>
			<Reveal as="p" className="mb-8 mt-6 max-w-2xl text-base leading-relaxed text-on-surface-variant" delay={60}>
				Different domains, the same shape of problem — a process someone was doing by hand became software.
			</Reveal>

			<div className="relative mt-8 w-full md:pl-4">
				{roles.map((role, i) => {
					const last = i === roles.length - 1
					return (
						<Reveal className={`relative ${last ? '' : 'mb-10 md:mb-12'}`} key={role.title + role.org}>
							{/* The connector stops at the last node; a line running past
							    the final role implies a role that isn't there. */}
							{!last && (
								<div
									className="absolute bottom-[-24px] left-[11px] top-6 hidden w-0.5 md:block"
									style={{ background: 'linear-gradient(to bottom, rgba(94,210,156,0.5), rgba(94,210,156,0.1))' }}
								/>
							)}
							<div className="absolute -left-4 top-1 hidden md:block">
								<span className="grid h-6 w-6 place-items-center rounded-full border-2 border-primary-container bg-background shadow-[0_0_10px_rgba(94,210,156,0.4)]">
									<span className="h-2 w-2 rounded-full bg-primary-container" />
								</span>
							</div>

							<div className="glass-panel w-full rounded-xl p-6 md:ml-6 md:p-8">
								<div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
									<div>
										<h3 className="text-lg leading-[1.6] text-on-surface">{role.title}</h3>
										<p className="mt-1 text-base leading-[1.6] text-primary">{role.org}</p>
									</div>
									<div className="self-start whitespace-nowrap rounded bg-surface-container-high px-3 py-1 font-label text-[12px] font-bold text-on-surface-variant">
										{role.range}
									</div>
								</div>
								{role.body.map((p) => (
									<p className="mb-4 text-base leading-relaxed text-on-surface-variant" key={p.slice(0, 40)}>
										{p}
									</p>
								))}
								<div className="mt-4">
									<TagRow items={role.tech} />
								</div>
							</div>
						</Reveal>
					)
				})}
			</div>
		</Section>
	)
}

/* ── Method ────────────────────────────────────────────────────────────── */

export function Method() {
	return (
		<Section className="pt-20 md:pt-24" id="method">
			<Reveal>
				<SectionHeading icon="verified">{method.heading}</SectionHeading>
			</Reveal>
			<Reveal
				as="p"
				className="mb-8 mt-6 max-w-2xl border-l-2 border-primary pl-6 font-accent text-[clamp(20px,3.2vw,26px)] italic leading-snug text-on-surface"
				delay={60}
			>
				{method.pull}
			</Reveal>
			<div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
				{method.practices.map((p, i) => (
					<Reveal className="glass-panel rounded-xl p-5" delay={i * 50} key={p.tool}>
						<div className="mb-1 font-label text-[12px] font-bold text-primary">{p.tool}</div>
						<div className="text-[13px] text-outline">{p.scope}</div>
					</Reveal>
				))}
			</div>
			<Reveal as="p" className="max-w-2xl text-base leading-relaxed text-on-surface-variant">
				{method.body}
			</Reveal>
		</Section>
	)
}

/* ── Skills ────────────────────────────────────────────────────────────── */

/**
 * One matrix, not eight cards.
 *
 * As a card grid this read as scattered: the two groups carrying caveats ran
 * tall, the short ones left gaps, and every label sat at a different x so the
 * eye had to hunt. A fixed label column gives every group the same left edge
 * and hairlines instead of gaps make it one table rather than eight objects.
 */
export function Skills() {
	return (
		<Section className="pt-12" id="skills">
			<Reveal>
				<SectionHeading icon="code_blocks">Technical Arsenal</SectionHeading>
			</Reveal>
			<Reveal className="glass-panel mt-8 overflow-hidden rounded-xl" delay={60}>
				{skillGroups.map((g) => (
					<div className="skill-row" key={g.label}>
						<div className="skill-key font-label">{g.label}</div>
						<div className="skill-vals">
							{g.items.map((t) => (
								<span className="skill-tag font-label" key={t}>
									{t}
								</span>
							))}
							{/* The caveat is what makes the tag list credible, so it sits
							    WITH the tags. Full-basis so it never wraps beside one. */}
							{g.note && <p className="skill-note">{g.note}</p>}
						</div>
					</div>
				))}
			</Reveal>
		</Section>
	)
}

/* ── Education ─────────────────────────────────────────────────────────── */

export function Education() {
	return (
		<Section className="pt-12" id="education">
			<Reveal>
				<SectionHeading icon="school">Education</SectionHeading>
			</Reveal>
			<div className="mt-8 grid grid-cols-1 gap-gutter md:grid-cols-2">
				{education.map((e, i) => (
					<Reveal className="glass-panel group relative overflow-hidden rounded-xl p-6 md:p-8" delay={i * 60} key={e.title}>
						<div
							className={`absolute h-32 w-32 rounded-full blur-2xl transition-colors duration-500 ${
								i === 0
									? '-mr-16 -mt-16 right-0 top-0 bg-primary/5 group-hover:bg-primary/10'
									: '-mb-16 -ml-16 bottom-0 left-0 bg-secondary-container/5 group-hover:bg-secondary-container/10'
							}`}
						/>
						<h3 className="relative z-10 text-lg font-bold text-on-surface">{e.title}</h3>
						<p className="relative z-10 mt-1 text-base text-primary">{e.org}</p>
						<p className="relative z-10 mt-4 text-base leading-relaxed text-on-surface-variant">{e.detail}</p>
					</Reveal>
				))}
			</div>
			<div className="mt-gutter grid grid-cols-1 gap-gutter md:grid-cols-2">
				{extras.map((x, i) => (
					<Reveal className="glass-panel rounded-xl p-6 md:p-8" delay={i * 60} key={x.label}>
						<h4 className="mb-4 font-label text-[12px] font-bold uppercase tracking-[0.1em] text-outline">{x.label}</h4>
						<p className="text-base leading-relaxed text-on-surface">{x.body}</p>
					</Reveal>
				))}
			</div>
		</Section>
	)
}

/* ── Closing + the DR numbers ──────────────────────────────────────────── */

export function DrStats() {
	return (
		<div className="grid w-full shrink-0 grid-cols-2 gap-4 lg:w-1/3 lg:grid-cols-1">
			<div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
				<div className="mb-2 font-label text-[10px] font-bold uppercase tracking-[0.1em] text-outline">
					{drStat.before.label}
				</div>
				<div className="font-display text-[clamp(28px,5vw,40px)] font-extrabold leading-none text-on-surface-variant">
					{drStat.before.value}
					<span className="ml-1 text-[16px] font-normal">{drStat.before.unit}</span>
				</div>
			</div>
			<div className="rounded-lg border border-primary/30 bg-primary/[0.05] p-5">
				<div className="mb-2 font-label text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
					{drStat.after.label}
				</div>
				<div className="font-display text-[clamp(28px,5vw,40px)] font-extrabold leading-none text-primary">
					{drStat.after.value}
					<span className="ml-1 text-[16px] font-normal">{drStat.after.unit}</span>
				</div>
			</div>
		</div>
	)
}


export { Section }
