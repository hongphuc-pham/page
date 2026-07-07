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

/** Beat 1 — HOOK (scroll 0–16.7%) */
export const hook = {
	kicker: '// phuc · william · pham',
	headline: 'Software that thinks with you.',
	positioning:
		'Full-stack engineer building AI-enabled products across web, mobile and backend systems.',
	meta: `${contact.role} · ${contact.location}`,
}

/** Beat 2 — FOUNDATION (scroll 16.7–33.3%) */
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

export type ProjectLink = { label: string; url: string }
export type Project = {
	name: string
	tagline: string
	detail: string
	tech: string[]
	/** live screenshot thumbnail; null → gradient + initials placeholder */
	image: string | null
	links: ProjectLink[]
	accent: string
	gradient: string
	initials: string
	status: string
}

/** Beat 3 — RECENT WORK (scroll 33.3–50%) */
export const recentWork = {
	kicker: '// 03 · recent work',
	headline: 'Built to ship.',
	body:
		'Software Engineer at CREST, University of Adelaide (Dec 2023 – Jun 2026). ' +
		'Built features across the stack within 4–5 web and mobile platforms — ' +
		'React / Next.js / React Native front ends, Node.js and FastAPI services, ' +
		'PostgreSQL, MongoDB, Milvus and Neo4j underneath.',
	aiNote:
		'LLM integration and agentic features, RAG pipelines, small-model training ' +
		'and quantisation — local LLM infrastructure for research work.',
	showcaseHeading: 'Live & in use today.',
	projects: [
		{
			name: 'SoftSec Intel',
			tagline: 'RAG security companion',
			detail:
				'RAG-powered software-security companion — vector + graph + relational stores, on iOS and Android.',
			tech: ['LLM RAG', 'Prefect', 'Vector + Graph DB', 'iOS', 'Android'],
			image:
				'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fapps.apple.com%2Fau%2Fapp%2Fsoftsec-intel%2Fid6762328734?w=1280&h=720',
			links: [
				{ label: 'App Store', url: 'https://apps.apple.com/au/app/softsec-intel/id6762328734' },
				{ label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.mssi.app&hl=en_AU' },
			],
			accent: '#C6FF3D',
			gradient: 'linear-gradient(135deg, rgba(198,255,61,0.45) 0%, rgba(111,168,45,0.28) 100%)',
			initials: 'SSI',
			status: 'Live · iOS + Android',
		},
		{
			name: 'ElevexAI',
			tagline: 'Product surface',
			detail: 'Marketing & product surface for ElevexAI — Next.js, Sanity, Vercel.',
			tech: ['Next.js', 'Sanity CMS', 'Vercel', 'TypeScript'],
			image:
				'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fwww.elevexai.systems%2F?w=1280&h=720',
			links: [{ label: 'elevexai.systems', url: 'https://www.elevexai.systems/' }],
			accent: '#7CE7FF',
			gradient: 'linear-gradient(135deg, rgba(124,231,255,0.55) 0%, rgba(74,144,255,0.35) 100%)',
			initials: 'EX',
			status: 'Live · Web',
		},
		{
			name: 'AIDFest',
			tagline: 'Festival platform',
			detail: 'Festival platform for Adelaide’s AI & data community — programming, speakers, registration.',
			tech: ['Next.js', 'Vercel', 'TypeScript'],
			image: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fwww.aidfest.tech%2F?w=1280&h=720',
			links: [{ label: 'aidfest.tech', url: 'https://www.aidfest.tech/' }],
			accent: '#FFB02E',
			gradient: 'linear-gradient(135deg, rgba(255,176,46,0.50) 0%, rgba(255,107,107,0.30) 100%)',
			initials: 'AID',
			status: 'Live · Web',
		},
		{
			name: 'DEP & VIP',
			tagline: 'Data-science PaaS',
			detail: 'Internal data-science PaaS at CREST — managed research environments, no infra to provision.',
			tech: ['Platform-as-a-Service', 'Data Science', 'CREST · UofA'],
			image:
				'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fwww.elevexai.systems%2Fproducts?w=1280&h=720',
			links: [{ label: 'Featured on elevexai.systems', url: 'https://www.elevexai.systems/products' }],
			accent: '#B482FF',
			gradient: 'linear-gradient(135deg, rgba(180,130,255,0.45) 0%, rgba(124,231,255,0.22) 100%)',
			initials: 'DV',
			status: 'Internal · CREST',
		},
		{
			// Luna + CareHub are one product; kept last per request.
			name: 'CareHub · Luna',
			tagline: 'Healthcare app · RAG',
			detail:
				'React Native healthcare app with Luna — a retrieval-augmented chatbot over NDIS documentation.',
			tech: ['React Native', 'LLM RAG', 'Python', 'iOS'],
			image: null,
			links: [],
			accent: '#C6FF3D',
			gradient: 'linear-gradient(135deg, rgba(198,255,61,0.45) 0%, rgba(74,144,255,0.28) 100%)',
			initials: 'CL',
			status: 'Internal · CREST',
		},
	] as Project[],
}

/** Beat 4 — HOW I WORK (scroll 50–66.7%) */
export const approach = {
	kicker: '// 04 · how i work',
	headline: 'AI-assisted. Structured. Honest.',
	body:
		'pytest on backend logic, Playwright over main user flows, Swagger-documented APIs, ' +
		'peer code review, Docker-first deployment. No fabricated metrics. Grounded ' +
		'documentation. Shipped software.',
	// CV-style skill matrix — grouped by category.
	stackGroups: [
		{ label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Java', 'Bash'] },
		{ label: 'Frontend', items: ['React', 'Next.js', 'React Native', 'Tailwind', 'ShadCN', 'Sanity CMS'] },
		{ label: 'Backend', items: ['Node.js', 'FastAPI', 'Spring Boot', 'REST APIs', 'Microservices'] },
		{ label: 'Databases', items: ['PostgreSQL', 'Supabase', 'MongoDB', 'MS SQL Server', 'Neo4j', 'Milvus', 'Oracle'] },
		{ label: 'Infra & CI/CD', items: ['Docker', 'Kubernetes', 'OpenShift', 'OpenStack', 'Vercel', 'GitHub Actions', 'Git'] },
		{ label: 'AI & Data', items: ['LLM integration', 'RAG', 'Agentic features', 'Unsloth', 'Data pipelines'] },
	],
}

export type Role = {
	title: string
	org: string
	range: string
	location: string
	blurb: string // one-liner shown while collapsed
	points: string[]
	award?: string
	/** projects done at this workplace, with quick-shot thumbnails (expanded view) */
	projects?: Project[]
}

const anzProjects: Project[] = [
	{
		name: 'DR Management Platform',
		tagline: 'Java · Spring Boot',
		detail:
			'Digitised a manual, Excel-based disaster-recovery workflow. Spring Boot + MS SQL Server, deployed on Red Hat OpenShift.',
		tech: ['Java', 'Spring Boot', 'MS SQL Server', 'OpenShift'],
		image: null,
		links: [],
		accent: '#FFB02E',
		gradient: 'linear-gradient(135deg, rgba(255,176,46,0.50) 0%, rgba(255,107,107,0.28) 100%)',
		initials: 'DR',
		status: 'Enterprise · ANZ',
	},
]

const eclipseProjects: Project[] = [
	{
		name: '2D Floor-plan Analysis',
		tagline: 'CV · PyTorch',
		detail:
			'Computer-vision solution automating 2D floor-plan analysis; designed, tested and refined models with domain experts.',
		tech: ['PyTorch', 'Computer Vision', 'Python'],
		image: null,
		links: [],
		accent: '#7CE7FF',
		gradient: 'linear-gradient(135deg, rgba(124,231,255,0.55) 0%, rgba(74,144,255,0.28) 100%)',
		initials: 'FP',
		status: 'Research · Eclipse CS',
	},
]

const rayoProjects: Project[] = [
	{
		name: 'Accessibility Extension',
		tagline: 'AI · Browser',
		detail:
			'AI-powered browser extension improving web accessibility for users with visual impairments; user research + prototyping.',
		tech: ['AI', 'Accessibility', 'Prototyping'],
		image: null,
		links: [],
		accent: '#C6FF3D',
		gradient: 'linear-gradient(135deg, rgba(198,255,61,0.45) 0%, rgba(111,168,45,0.28) 100%)',
		initials: 'AX',
		status: 'Research · Rayo',
	},
]

/** Beat 5 — EXPERIENCE (scroll 66.7–83.3%). Main roles expand to full detail;
 *  the ⋮ menu reveals the `more` roles. */
export const experience = {
	kicker: '// 05 · experience',
	headline: 'Where I’ve shipped.',
	roles: [
		{
			title: 'Software Engineer',
			org: 'CREST · University of Adelaide',
			range: 'Dec 2023 – Jun 2026',
			location: 'Adelaide, AU',
			blurb: 'Full-stack features across 4–5 research web & mobile platforms, plus LLM/RAG infrastructure.',
			points: [
				'Built full-stack features across 4–5 web & mobile platforms — React, Next.js, React Native, Node.js, FastAPI.',
				'LLM integration & agentic features; RAG (e.g. Luna over NDIS docs); small-model training & quantisation (Unsloth).',
				'Databases across the stack — PostgreSQL, MongoDB, Milvus (vector) and Neo4j (graph).',
				'Containerised services with Docker; deployed to OpenStack VMs and Vercel; documented REST APIs in Swagger.',
				'Peer code review; mentored an incoming engineer and semester-long student contributors.',
			],
			projects: recentWork.projects,
		},
		{
			title: 'Application Developer',
			org: 'ANZ New Zealand',
			range: 'Mar 2019 – Sep 2020',
			location: 'Wellington, NZ',
			blurb: 'Java/Spring Boot disaster-recovery platform in a regulated banking environment.',
			points: [
				'Built a Java + Spring Boot web app (MS SQL Server) digitising a manual, Excel-based disaster-recovery workflow.',
				'Designed the SQL Server schema; migrated data from a legacy MS Access database.',
				'Deployed to Red Hat OpenShift via the team’s CI/CD; applied bank-wide secure-coding standards.',
				'Investigated and resolved issues during live DR exercises; wrote technical and end-user documentation.',
			],
			award: 'Kau Mau Te Wehi Award — DR exercise efficiency',
			projects: anzProjects,
		},
	] as Role[],
	/** Revealed by the ⋮ "show more" menu. */
	more: [
		{
			title: 'Research Fellow',
			org: 'Rayo',
			range: 'Jul 2023 – Sep 2023',
			location: 'Remote · Adelaide',
			blurb: 'AI browser extension for web accessibility.',
			points: [
				'Contributed to an AI-powered browser extension improving web accessibility for users with visual impairments.',
				'User research, prototyping and early-stage product evaluation.',
			],
			projects: rayoProjects,
		},
		{
			title: 'Research Software Engineer Intern',
			org: 'Eclipse CS',
			range: 'Sep 2021 – Dec 2021',
			location: 'Remote · Adelaide',
			blurb: 'Computer-vision automation of 2D floor-plan analysis (PyTorch).',
			points: [
				'Built a computer-vision solution automating 2D floor-plan analysis, cutting manual labelling effort.',
				'Collaborated with domain experts to design, test and refine models; presented results for integration.',
			],
			projects: eclipseProjects,
		},
		{
			title: 'Certifications & Community',
			org: 'Selected',
			range: '—',
			location: 'AU · NZ',
			blurb: 'Mental Health First Aider; community fundraising.',
			points: [
				'Mental Health First Aider — accreditation, Australia.',
				'Daffodil Day fundraising volunteer (ANZ NZ) — co-ran a branch fundraiser raising ~NZ$11,000 (~30% above target).',
			],
		},
	] as Role[],
}

/** Beat 6 — CTA (scroll 83.3–100%) */
export const cta = {
	kicker: '// 06 · next',
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
	{ id: 'experience', label: 'Experience' },
	{ id: 'contact', label: 'Contact' },
] as const

export type ChapterId = (typeof chapters)[number]['id']
