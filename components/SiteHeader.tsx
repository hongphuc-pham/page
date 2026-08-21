'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CV_HREF } from '@/lib/basePath'
import { contact, sections } from '@/lib/cv'
import { Icon } from './ui'

/**
 * Fixed header: reading progress, scroll-spy, condense-on-scroll, mobile drawer.
 *
 * Everything that moves is driven from ONE rAF-throttled scroll handler.
 * Separate listeners per feature would each schedule their own frame and
 * fight for the same layout read.
 */
export function SiteHeader() {
	const [scrolled, setScrolled] = useState(false)
	const [active, setActive] = useState<string | null>(null)
	const [menuOpen, setMenuOpen] = useState(false)

	const barRef = useRef<HTMLElement>(null)
	const navRef = useRef<HTMLElement>(null)
	const indicatorRef = useRef<HTMLSpanElement>(null)
	const ticking = useRef(false)

	/**
	 * Which section is "current".
	 *
	 * Deliberately NOT "whichever is most visible": these sections differ
	 * wildly in height, so the tallest would win almost permanently. Instead:
	 * the last section whose top has passed just under the header.
	 */
	const measure = useCallback(() => {
		const y = window.scrollY
		setScrolled(y > 24)

		const max = document.documentElement.scrollHeight - window.innerHeight
		if (barRef.current) {
			barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
		}

		const line =
			(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68) + 40
		let current: string | null = null
		for (const s of sections) {
			const el = document.getElementById(s.id)
			if (el && el.getBoundingClientRect().top <= line) current = s.id
		}
		setActive(current)
	}, [])

	useEffect(() => {
		const onScroll = () => {
			if (ticking.current) return
			ticking.current = true
			requestAnimationFrame(() => {
				measure()
				ticking.current = false
			})
		}
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => {
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
		}
	}, [measure])

	// Slide the indicator to the active link. Measured from the DOM rather
	// than tracked in state, because link widths depend on the rendered font.
	useEffect(() => {
		const indicator = indicatorRef.current
		const nav = navRef.current
		if (!indicator || !nav) return
		const link = active ? nav.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`) : null
		if (!link) {
			indicator.style.opacity = '0'
			return
		}
		indicator.style.opacity = '1'
		indicator.style.width = `${link.offsetWidth}px`
		indicator.style.transform = `translateX(${link.offsetLeft}px)`
	}, [active])

	// Lock the page behind the drawer, and never leave it locked.
	useEffect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : ''
		return () => {
			document.body.style.overflow = ''
		}
	}, [menuOpen])

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
		// Resizing past the breakpoint must not strand the lock on.
		const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false)
		document.addEventListener('keydown', onKey)
		window.addEventListener('resize', onResize)
		return () => {
			document.removeEventListener('keydown', onKey)
			window.removeEventListener('resize', onResize)
		}
	}, [])

	return (
		<>
			<header className="site-header" data-scrolled={scrolled ? 'true' : 'false'}>
				<div className="header-inner mx-auto flex max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
					<a
						className="shrink-0 font-display text-[20px] font-extrabold tracking-tighter text-primary md:text-[24px]"
						href="#top"
					>
						{contact.name}
					</a>

					<nav aria-label="Sections" className="relative hidden h-full items-center lg:flex" ref={navRef}>
						{sections.map((s) => (
							<a
								className={`px-4 py-2 font-label text-[12px] leading-[1.6] uppercase tracking-[0.1em] transition-colors ${
									active === s.id ? 'text-primary-container' : 'text-on-surface-variant hover:text-on-surface'
								}`}
								href={`#${s.id}`}
								key={s.id}
							>
								{s.label}
							</a>
						))}
						<span aria-hidden className="nav-indicator" ref={indicatorRef} style={{ opacity: 0, width: 0 }} />
					</nav>

					<div className="flex shrink-0 items-center gap-3">
						<a
							className="hidden items-center gap-2 text-primary hover:text-primary-fixed-dim xl:inline-flex"
							download
							href={CV_HREF}
						>
							<span className="font-label text-[11px] font-bold uppercase tracking-[0.1em]">CV</span>
							<Icon className="text-[18px]" name="download" />
						</a>
						<a
							className="press hidden rounded bg-primary-container px-5 py-2 font-label text-[12px] font-bold uppercase tracking-[0.1em] text-black hover:shadow-[0_0_15px_rgba(123,239,182,0.5)] sm:block"
							href="#contact"
						>
							Connect
						</a>
						<button
							aria-controls="mobile-menu"
							aria-expanded={menuOpen}
							aria-label={menuOpen ? 'Close menu' : 'Open menu'}
							className="grid h-10 w-10 place-items-center rounded-full text-on-background hover:bg-white/5 lg:hidden"
							onClick={() => setMenuOpen((o) => !o)}
							type="button"
						>
							<Icon name={menuOpen ? 'close' : 'menu'} />
						</button>
					</div>
				</div>
				<div aria-hidden className="scroll-progress">
					<i ref={barRef} style={{ transform: 'scaleX(0)' }} />
				</div>
			</header>

			<div className="mobile-menu lg:hidden" data-open={menuOpen ? 'true' : 'false'} id="mobile-menu">
				{sections.map((s, i) => (
					<a
						className="font-display"
						href={`#${s.id}`}
						key={s.id}
						onClick={() => setMenuOpen(false)}
						style={{ '--d': `${40 + i * 40}ms` } as React.CSSProperties}
					>
						{s.label}
					</a>
				))}
			</div>
		</>
	)
}
