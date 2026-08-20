/**
 * Single source of truth for all CV copy shown in the cinematic scenes.
 *
 * ── The story this site tells ─────────────────────────────────────────────
 * "I delete the manual step." Every role here is the same shape of work: a
 * process people were doing by hand became software they actually use. That
 * through-line is not a marketing angle bolted on afterwards — it is what the
 * facts below already say, in every job, since 2019.
 *
 *   Excel DR workflow, 15–20h        → Spring Boot platform            (ANZ)
 *   hand-labelled 2D floor plans     → PyTorch CV model                (Eclipse CS)
 *   NDIS documentation read by hand  → Luna, a RAG chatbot             (CREST)
 *   researchers provisioning infra   → DEP & VIP, a managed PaaS       (CREST)
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
 *
 * ── Rule for the `before:` lines ──────────────────────────────────────────
 * A `before` must be derivable from copy already in this file. Projects with no
 * grounded manual-step story (ElevexAI, AIDFest — both are product surfaces, not
 * automations) carry NO `before` line rather than an invented one. Symmetry is
 * not worth a claim you cannot back in an interview.
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

/** Beat 1 — INTRO */
export const hook = {
	kicker: '// phuc · william · pham',
	headline: 'I delete the manual step.',
	positioning:
		'Full-stack engineer. I take the work people are still doing by hand — in spreadsheets, ' +
		'in documents, in their heads — and turn it into software they actually use.',
	meta: `${contact.role} · ${contact.location}`,
}

/**
 * Beat 2 — PROOF. The origin story, told as the before/after it actually was.
 * Scene2Foundation renders `before` → `after` → `result` as three stacked rows.
 */
export const foundation = {
	kicker: '// 02 · proof',
	headline: 'It started with a spreadsheet.',
	before: {
		label: 'Before',
		text:
			'ANZ New Zealand ran its disaster-recovery exercise out of Excel — a manual workflow, ' +
			'coordinated by hand, inside a regulated bank. The previous year it took 15–20 hours.',
	},
	after: {
		label: 'After',
		text:
			'A Java + Spring Boot web application on MS SQL Server, deployed to Red Hat OpenShift. ' +
			'I designed the schema and migrated the data off a legacy MS Access database.',
	},
	result: {
		label: 'Result',
		text: 'The year the team coordinated through the app, the exercise finished hours earlier.',
	},
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
	/** the manual process this replaced — omitted where there isn't a grounded one */
	before?: string
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

/** Beat 3 — PATTERN. Same shape of problem, four more times — and these ones shipped. */
export const recentWork = {
	kicker: '// 03 · pattern',
	headline: 'Then it kept happening.',
	body:
		'Software Engineer at CREST, University of Adelaide (Dec 2023 – Jun 2026). Different ' +
		'domains, same shape of problem. Features across the stack within 4–5 web and mobile ' +
		'platforms — React / Next.js / React Native front ends, Node.js and FastAPI services, ' +
		'PostgreSQL, MongoDB, Milvus and Neo4j underneath.',
	aiNote:
		'LLM integration and agentic features, RAG pipelines, small-model training ' +
		'and quantisation — local LLM infrastructure for research work.',
	showcaseHeading: 'Not demos. Downloads.',
	projects: [
		{
			name: 'SoftSec Intel',
			tagline: 'RAG security companion',
			before: 'Software-security guidance spread across advisories, papers and docs.',
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
			name: 'DEP & VIP',
			tagline: 'Data-science PaaS',
			before: 'Researchers provisioning their own infrastructure before they could start.',
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
			// No manual-step story here — it's a product surface. No `before` line.
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
			// Luna + CareHub are one product; kept last per request.
			name: 'CareHub · Luna',
			tagline: 'Healthcare app · RAG',
			before: 'NDIS documentation, read by hand.',
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

/** Beat 4 — METHOD. The part that makes the pattern repeatable instead of lucky. */
export const approach = {
	kicker: '// 04 · method',
	headline: 'How I keep it honest.',
	/**
	 * The reason this beat exists at all. Same sentence that used to open
	 * `body` — moved out so it lands as a line rather than as a clause the eye
	 * slides past on its way to the list.
	 */
	pull: 'Removing someone’s manual step means they now trust your software instead.',
	/**
	 * The five practices that used to be a comma-list inside `body`, split so
	 * each can hold a panel of its own.
	 *
	 * The split is stored rather than computed: taking the first word at render
	 * time produced "Swagger-documented / APIs" and a heading that read just
	 * "peer". Every fragment here is still a verbatim slice of the original
	 * sentence — `scope` is empty where the phrase has no tail worth splitting.
	 * Presentational only, not editorial. Do not add a sixth without a source.
	 */
	practices: [
		{ tool: 'pytest', scope: 'on backend logic' },
		{ tool: 'Playwright', scope: 'over main user flows' },
		{ tool: 'Swagger', scope: 'documented APIs' },
		{ tool: 'Peer code review', scope: '' },
		{ tool: 'Docker', scope: 'first deployment' },
	],
	body: 'No fabricated metrics. Grounded documentation. Shipped software.',
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
		before: 'A manual, Excel-based disaster-recovery workflow.',
		detail:
			'Digitised the workflow end to end. Spring Boot + MS SQL Server, deployed on Red Hat OpenShift.',
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
		before: 'Floor plans labelled by hand, one at a time.',
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

/**
 * Beat 5 — RECORD. The dated employment history, in full. The story beats above
 * are the argument; this is the evidence a recruiter scrolls to check it against.
 * Main roles expand to full detail; the ⋮ menu reveals the `more` roles.
 */
export const experience = {
	kicker: '// 05 · record',
	headline: 'The full record.',
	roles: [
		{
			title: 'Software Engineer',
			org: 'CREST · University of Adelaide',
			range: 'Dec 2023 – Jun 2026',
			location: 'Adelaide, AU',
			blurb: 'Turned research workflows into products — 4–5 web & mobile platforms, plus LLM/RAG infrastructure.',
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
			blurb: 'Replaced an Excel-run disaster-recovery workflow with a Java/Spring Boot platform, in a regulated bank.',
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
			blurb: 'Replaced hand-labelling of 2D floor plans with a PyTorch computer-vision model.',
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

/** Beat 6 — NEXT */
export const cta = {
	kicker: '// 06 · next',
	headline: 'Available for new roles.',
	body:
		'Adelaide-based, open to remote. If something on your team still runs on a spreadsheet and ' +
		'goodwill — that’s the work I want.',
	links: [
		{ label: contact.email, href: `mailto:${contact.email}`, kind: 'email' as const },
		{ label: 'LinkedIn', href: contact.linkedin, kind: 'linkedin' as const },
		{ label: 'GitHub', href: contact.github, kind: 'github' as const },
	],
}

/**
 * Section ids are load-bearing — ChapterDots, scrollToSection and the SceneShell
 * HUD readout all key off them. Change labels freely; change ids never.
 */
export const chapters = [
	{ id: 'hook', label: 'Intro' },
	{ id: 'foundation', label: 'Proof' },
	{ id: 'now', label: 'Pattern' },
	{ id: 'approach', label: 'Method' },
	{ id: 'experience', label: 'Record' },
	{ id: 'contact', label: 'Next' },
] as const

export type ChapterId = (typeof chapters)[number]['id']
