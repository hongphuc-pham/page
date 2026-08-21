import type { ReactNode } from 'react'

/**
 * Small shared primitives. Server components — none of them need state, and
 * keeping them off the client bundle is free.
 */

/** Material Symbols glyph. The font is loaded once in app/layout. */
export function Icon({ name, className = '', filled = false }: { name: string; className?: string; filled?: boolean }) {
	return (
		<span
			aria-hidden
			className={`material-symbols-outlined ${className}`}
			style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
		>
			{name}
		</span>
	)
}

/**
 * Section heading. Sizes are a STEP at md, not a clamp — the original design
 * uses 32px below 768px and 40px above, and a clamp rendered 28px on a phone,
 * which quietly shrank every heading on the page.
 */
export function SectionHeading({ icon, children }: { icon: string; children: ReactNode }) {
	return (
		<div className="flex items-center gap-3">
			<Icon className="text-2xl text-primary" name={icon} />
			<h2 className="font-display text-[32px] font-extrabold leading-[1.2] text-on-surface md:text-[40px] md:tracking-[-0.03em]">
				{children}
			</h2>
		</div>
	)
}

/** Uppercase label above a heading or inside a card. */
export function Eyebrow({ children, className = 'text-primary' }: { children: ReactNode; className?: string }) {
	return (
		<span className={`font-label text-[12px] font-bold uppercase tracking-[0.1em] ${className}`}>{children}</span>
	)
}

export function SkillTag({ children }: { children: ReactNode }) {
	return <span className="skill-tag font-label">{children}</span>
}

export function TagRow({ items }: { items: readonly string[] }) {
	return (
		<div className="flex flex-wrap gap-2">
			{items.map((t) => (
				<SkillTag key={t}>{t}</SkillTag>
			))}
		</div>
	)
}

/** The caption box a project gets ONLY when it has a grounded before-line. */
export function BeforeBox({ children }: { children: ReactNode }) {
	return (
		<p className="before-box font-label">
			<b className="mr-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] opacity-90">Before</b>
			{children}
		</p>
	)
}

export function AfterLine({ children }: { children: ReactNode }) {
	return (
		<p className="text-base leading-relaxed text-on-surface-variant">
			<span className="mr-1.5 font-label text-[9.5px] font-bold uppercase tracking-[0.18em] text-primary-container">
				After
			</span>
			{children}
		</p>
	)
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a
			className="inline-flex items-center gap-1 font-label text-[12px] font-semibold text-primary-container hover:underline"
			href={href}
			rel="noreferrer"
			target="_blank"
		>
			{children}
			<Icon className="text-[14px]" name="north_east" />
		</a>
	)
}
