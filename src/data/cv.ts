/**
 * Single source of truth for all CV copy shown in the cinematic scenes.
 *
 * Sources: src/data/*.json (previous site copy) + docs/Pham_HongPhuc_Career_Facts.md
 * (the declared master reference). Where the two disagreed, the career-facts
 * guardrails win. Corrections made while migrating (each was a do-not-claim item):
 *   - ANZ "microservices"            → Java + Spring Boot web application
 *   - "verified ~10% DR uplift"      → real story: 15–20h exercise finished ~2–3h earlier
 *   - "delivered 4–5 production apps"→ features/modules across 4–5 platforms
 *   - "Set up CI/CD"                 → used GitHub Actions on CMS project only; not pipeline owner
 *   - "API design reviews"           → peer code review + regression checks
 *   - CREST "Dec 2023 – Present"     → Dec 2023 – Jun 2026 (role has ended)
 *   - email                          → william.phucpham@gmail.com (user-confirmed)
 */

export const contact = {
	name: 'Phuc (William) Pham',
	shortName: 'Phuc Pham',
	role: 'Software Engineer & AI Developer',
	location: 'Adelaide, SA, Australia',
	availability: 'Available for new roles · Adelaide · open to remote',
	email: 'william.phucpham@gmail.com',
	phone: '0435 837 182',
	linkedin: 'https://linkedin.com/in/phucph/',
	github: 'https://github.com/hongphuc-pham',
}

/** Beat 1 — HOOK (scroll 0–20%) */
export const hook = {
	kicker: '// phuc · william · pham',
	headline: 'Software that thinks with you.',
	positioning:
		'Full-stack engineer building AI-enabled products across web, mobile and backend systems.',
	meta: `${contact.role} · ${contact.location}`,
}

/** Beat 2 — FOUNDATION (scroll 20–40%) */
export const foundation = {
	kicker: '// 02 · foundation',
	headline: 'The craft came before the hype.',
	body:
		'Application Developer at ANZ New Zealand (2019–2020): a Java + Spring Boot platform ' +
		'that digitised a manual, Excel-based disaster-recovery workflow in a regulated ' +
		'banking environment.',
	proof:
		'The previous year, the DR exercise took 15–20 hours. The year the app was used, ' +
		'the team coordinated through it and finished hours earlier.',
	award: 'Kau Mau Te Wehi Award — contribution to DR exercise efficiency',
	education: [
		{
			title: 'Master of Machine Learning',
			org: 'The University of Adelaide',
			detail:
				'Capstone: computer-vision pipeline estimating tree height and species from street-view imagery.',
		},
		{
			title: 'Bachelor of Information Technology',
			org: 'Wellington Institute of Technology',
			detail: 'Patrick Pop Memorial Shield — top third-year industrial IT project.',
		},
	],
}

/** Beat 3 — RECENT WORK (scroll 40–60%) */
export const recentWork = {
	kicker: '// 03 · recent work',
	headline: 'Research that ships.',
	body:
		'Software Engineer at CREST, University of Adelaide (Dec 2023 – Jun 2026). ' +
		'Built features across the stack within 4–5 web and mobile platforms — ' +
		'React / Next.js / React Native front ends, Node.js and FastAPI services, ' +
		'PostgreSQL, MongoDB, Milvus and Neo4j underneath.',
	aiNote:
		'LLM integration and agentic features, RAG pipelines, small-model training ' +
		'and quantisation — local LLM infrastructure for research work.',
	// Shown as the stacked one-by-one card gallery. Humbler heading per user note.
	showcaseHeading: 'Live & in use today.',
	projects: [
		{
			name: 'Luna',
			detail: 'Retrieval-augmented chatbot over NDIS documentation.',
			link: null,
		},
		{
			name: 'CareHub',
			detail: 'React Native healthcare app, shipped to the App Store.',
			link: null,
		},
		{
			name: 'SoftSec Intel',
			detail:
				'RAG-powered software-security companion — vector + graph + relational stores, on iOS and Android.',
			link: 'https://apps.apple.com/au/app/softsec-intel/id6762328734',
		},
		{
			name: 'ElevexAI',
			detail: 'Product surface for ElevexAI — Next.js, Sanity, Vercel.',
			link: 'https://www.elevexai.systems/',
		},
		{
			name: 'AIDFest',
			detail: 'Festival platform for Adelaide’s AI & data community.',
			link: 'https://www.aidfest.tech/',
		},
		{
			name: 'DEP & VIP',
			detail: 'Internal data-science PaaS at CREST — managed research environments.',
			link: 'https://www.elevexai.systems/products',
		},
	],
}

/** Beat 4 — HOW I WORK (scroll 60–80%) */
export const approach = {
	kicker: '// 04 · how i work',
	headline: 'AI-assisted. Structured. Honest.',
	body:
		'pytest on backend logic, Playwright over main user flows, Swagger-documented APIs, ' +
		'peer code review, Docker-first deployment. No fabricated metrics. Grounded ' +
		'documentation. Shipped software.',
	stack: [
		'Python',
		'TypeScript',
		'React',
		'React Native',
		'Next.js',
		'Node.js',
		'FastAPI',
		'PostgreSQL',
		'Docker',
		'Ollama · local LLMs',
		'RAG',
		'OpenStack',
		'Vercel',
	],
}

/** Beat 5 — CTA (scroll 80–100%) */
export const cta = {
	kicker: '// 05 · next',
	headline: 'Available for new roles.',
	body: 'Adelaide-based, open to remote. Product and fintech teams welcome.',
	links: [
		{ label: contact.email, href: `mailto:${contact.email}`, kind: 'email' as const },
		{ label: 'LinkedIn', href: contact.linkedin, kind: 'linkedin' as const },
		{ label: 'GitHub', href: contact.github, kind: 'github' as const },
	],
}

export const chapters = [
	{ id: 'hook', label: 'Intro' },
	{ id: 'foundation', label: 'Foundation' },
	{ id: 'now', label: 'Now' },
	{ id: 'approach', label: 'Approach' },
	{ id: 'contact', label: 'Contact' },
] as const

export type ChapterId = (typeof chapters)[number]['id']
