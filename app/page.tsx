import { ContactCode } from '@/components/Contact'
import { Projects } from '@/components/Projects'
import { Reveal } from '@/components/Reveal'
import { Education, Experience, Hero, Method, Origin, Section, Skills } from '@/components/Sections'
import { SectionHeading } from '@/components/ui'
import { SiteHeader } from '@/components/SiteHeader'
import { CV_HREF } from '@/lib/basePath'
import { contact } from '@/lib/cv'

export default function HomePage() {
	return (
		<>
			<div aria-hidden className="bg-grid hidden md:block" />
			<div aria-hidden className="ambient-glow" />

			<a
				className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-primary-container focus:px-4 focus:py-2 focus:text-black"
				href="#origin"
			>
				Skip to content
			</a>

			<SiteHeader />

			<main>
				<Hero />
				<Origin />
				<Experience />
				<Projects />
				<Method />
				<Skills />
				<Education />

				{/* Contact needs the same entry every other section gets. Without a
				    heading the code panel just appeared under the Education cards
				    with nothing marking a new section — the pitch copy used to do
				    that job, and removing it left the seam bare. A heading is the
				    marker; it does not bring the copy back. */}
				<Section className="pt-20 md:pt-24" id="contact">
					<Reveal>
						<SectionHeading icon="terminal">Contact</SectionHeading>
					</Reveal>
					<Reveal className="mt-8" delay={60}>
						<ContactCode />
					</Reveal>
				</Section>
			</main>

			<footer className="relative z-20 w-full border-t border-white/5 bg-surface-container-lowest py-stack-lg">
				<div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 px-margin-mobile text-center md:flex-row md:px-margin-desktop md:text-left">
					<div className="font-display text-[22px] font-bold text-primary">{contact.name}</div>
					<p className="font-label text-[12px] font-semibold text-on-surface-variant">
						© {new Date().getFullYear()} {contact.name}
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a
							className="font-label text-[12px] font-semibold text-on-surface-variant hover:text-secondary-fixed-dim"
							href={contact.github}
							rel="noreferrer"
							target="_blank"
						>
							GitHub
						</a>
						<a
							className="font-label text-[12px] font-semibold text-on-surface-variant hover:text-secondary-fixed-dim"
							href={contact.linkedin}
							rel="noreferrer"
							target="_blank"
						>
							LinkedIn
						</a>
						<a
							className="font-label text-[12px] font-semibold text-on-surface-variant hover:text-secondary-fixed-dim"
							download
							href={CV_HREF}
						>
							CV
						</a>
					</div>
				</div>
			</footer>
		</>
	)
}
