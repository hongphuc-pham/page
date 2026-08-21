/**
 * Single source of truth for every word on the site.
 *
 * ── The honesty rule ──────────────────────────────────────────────────────
 * Nothing here may be invented. Every claim traces to
 * `docs/Pham_HongPhuc_Career_Facts.md`. In particular:
 *
 *   - ANZ was a Java WEB APP, never "microservices". Microservices = CREST.
 *   - No CI/CD pipeline ownership. A teammate owned GitHub Actions; I used it
 *     on the CMS project only.
 *   - No comprehensive e2e coverage claim — core flows only.
 *   - No "~10%" DR metric. The real story is 15–20h → finished hours earlier.
 *   - Medical model work is proof-of-concept and collaborative. Never shipped.
 *   - Feature/module work inside platforms, not "N apps delivered end to end".
 *
 * A project without a grounded `before` gets NO before-line rather than an
 * invented one — and the UI gives it a different shape so the gap reads as a
 * decision instead of an omission. See components/ProjectCard.
 */

export const contact = {
	name: 'Phuc (William) Pham',
	role: 'Software Engineer & AI Developer',
	location: 'Adelaide, SA, Australia',
	email: 'william.phucpham@gmail.com',
	phone: '0435 837 182',
	linkedin: 'https://linkedin.com/in/phucph',
	linkedinLabel: 'linkedin.com/in/phucph',
	github: 'https://github.com/hongphuc-pham',
	githubLabel: 'github.com/hongphuc-pham',
	availability: 'Open to new work · Adelaide or remote',
} as const

export const hero = {
	eyebrow: `${contact.role} · Adelaide, SA`,
	/**
	 * Split so the tail can be held unbreakable in the markup. The headline
	 * must never wrap as "I DELETE THE MANUAL / STEP." — that orphans the word
	 * the whole sentence turns on.
	 */
	headlineLead: 'I DELETE THE',
	headlineTail: 'MANUAL STEP',
	lede:
		'Full-stack engineer. I take the work people are still doing by hand — in spreadsheets, ' +
		'in documents, in their heads — and turn it into software they actually use.',
	sub: 'Every role below is the same shape of work. It started with a bank running its disaster recovery out of Excel.',
} as const

export const origin = {
	heading: 'It started with a spreadsheet',
	before:
		'ANZ New Zealand ran its disaster-recovery exercise out of Excel — a manual workflow, ' +
		'coordinated by hand, inside a regulated bank. The previous year it took 15–20 hours.',
	after:
		'A Java and Spring Boot web application on Microsoft SQL Server, deployed to Red Hat ' +
		'OpenShift. I designed the schema and migrated the data off a legacy MS Access database.',
	result: 'The year the team coordinated through the app, the exercise finished hours earlier.',
	award: 'Kau Mau Te Wehi Award — ANZ New Zealand, for contribution to DR exercise efficiency',
} as const

export type Role = {
	title: string
	org: string
	range: string
	body: string[]
	tech: string[]
}

export const roles: Role[] = [
	{
		title: 'Software Engineer',
		org: 'CREST · The University of Adelaide',
		range: 'Dec 2023 – Jun 2026',
		body: [
			'Built features across the stack within four to five web and mobile platforms — React, Next.js and React Native front ends over Node.js and FastAPI services. Integrated LLMs and agentic features, including a retrieval-augmented chatbot over NDIS documentation, and trained and quantised small models with Unsloth for research use.',
			'Containerised services with Docker and deployed to OpenStack VMs; front ends auto-deploy on Vercel. Documented REST endpoints in Swagger for other developers, built authenticated services with role- and identity-based access, and scoped data access to the requesting user on services handling restricted data. Took part in peer code review, and checked existing behaviour when extending services to new versions to catch regressions.',
			'Onboarded an incoming engineer over about a month and gave semester-long technical guidance to student project contributors.',
		],
		tech: ['React', 'Next.js', 'React Native', 'Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Milvus', 'Neo4j', 'Docker', 'OpenStack', 'Vercel'],
	},
	{
		title: 'Application Developer',
		org: 'ANZ New Zealand · Wellington',
		range: 'Mar 2019 – Sep 2020',
		body: [
			"Built a Java and Spring Boot web application on Microsoft SQL Server that digitised a manual, Excel-based disaster-recovery workflow. Designed the schema, migrated data from a legacy MS Access database, and sat in on the DBA team's weekly sessions on batch processing, backups and recovery.",
			"Built REST APIs and wrote unit and integration tests. Deployed to Red Hat OpenShift through the team's pipeline. Applied bank-wide secure-coding standards — input validation, authenticated APIs, dependency hygiene, peer code review — in a regulated environment. Translated requirements with non-technical operational stakeholders and wrote both technical and end-user documentation.",
		],
		tech: ['Java', 'Spring Boot', 'MS SQL Server', 'OpenShift', 'REST APIs', 'Secure coding'],
	},
	{
		title: 'Research Fellow',
		org: 'Rayo · part-time, remote from Adelaide',
		range: 'Jul 2023 – Sep 2023',
		body: [
			'Contributed to an AI-powered browser extension improving web accessibility for users with visual impairments. User research, prototyping and early-stage product evaluation.',
		],
		tech: ['AI', 'Accessibility', 'Prototyping', 'User research'],
	},
	{
		title: 'Research Software Engineer Intern',
		org: 'Eclipse CS Pty Ltd · remote from Adelaide',
		range: 'Sep 2021 – Dec 2021',
		body: [
			'Built a computer-vision solution in PyTorch automating 2D floor-plan analysis, replacing plans that were labelled by hand one at a time. Worked with domain experts to design, test and refine the models, and presented results for integration.',
		],
		tech: ['PyTorch', 'Computer Vision', 'Python'],
	},
]

export type Project = {
	name: string
	kind: string
	icon: string
	/** The manual process this replaced. OMITTED where there isn't a grounded one. */
	before?: string
	body: string
	/** Extra honesty note, e.g. "nothing here was deployed to users". */
	caveat?: string
	tech: string[]
	status?: string
	shot?: string
	initials?: string
	links?: { label: string; href: string }[]
	/** Bento span, in 12-col units. */
	span: 4 | 6 | 8 | 12
	accent?: 'primary' | 'secondary' | 'outline'
}

const shot = (url: string) =>
	`https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=720`

export const projects: Project[] = [
	{
		name: 'SoftSec Intel',
		kind: 'RAG Security Companion',
		icon: 'security',
		before: 'Software-security guidance spread across advisories, papers and docs.',
		body: 'A retrieval-augmented software-security companion over vector, graph and relational stores — shipped to the App Store and Google Play.',
		tech: ['LLM RAG', 'Prefect', 'Vector + Graph DB', 'iOS', 'Android'],
		status: 'Live · iOS + Android',
		shot: shot('https://apps.apple.com/au/app/softsec-intel/id6762328734'),
		links: [
			{ label: 'App Store', href: 'https://apps.apple.com/au/app/softsec-intel/id6762328734' },
			{ label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.mssi.app&hl=en_AU' },
		],
		span: 8,
		accent: 'primary',
	},
	{
		name: 'CareHub · Luna',
		kind: 'Healthcare · RAG',
		icon: 'forum',
		before: 'NDIS documentation, read by hand.',
		body: 'A React Native healthcare app with Luna, a retrieval-augmented chatbot answering from the documentation itself.',
		tech: ['React Native', 'LLM RAG', 'Python'],
		status: 'Internal · CREST',
		initials: 'CL',
		span: 4,
		accent: 'secondary',
	},
	{
		name: 'DEP & VIP',
		kind: 'Platform Engineering',
		icon: 'dns',
		before: 'Researchers provisioning their own infrastructure before they could start.',
		body: 'An internal data-science platform at CREST — managed research environments, no infrastructure to provision.',
		tech: ['Platform-as-a-Service', 'Data Science', 'Docker'],
		shot: shot('https://www.elevexai.systems/products'),
		links: [{ label: 'Featured on elevexai.systems', href: 'https://www.elevexai.systems/products' }],
		span: 6,
		accent: 'primary',
	},
	{
		name: 'Medical Inference',
		kind: 'Research · Collaboration',
		icon: 'medical_services',
		body: 'Exploratory inference with medical models such as MedGemma over medical images and records, plus a collaborative project scraping and reporting on medical technologies for the School of Medicine.',
		caveat: 'Proof-of-concept and collaborative work. Nothing here was deployed to users.',
		tech: ['MedGemma', 'Python', 'Research'],
		status: 'Proof of concept',
		span: 6,
		accent: 'secondary',
	},
	{
		name: 'DR Management Platform',
		kind: 'Enterprise · Regulated Banking',
		icon: 'account_balance',
		before: 'A manual, Excel-based disaster-recovery workflow, coordinated by hand.',
		body: "The workflow digitised end to end — Spring Boot and MS SQL Server on Red Hat OpenShift, with the schema designed and the data migrated off a legacy MS Access database. The previous year's exercise took 15–20 hours; the year the team coordinated through the app, it finished hours earlier.",
		tech: ['Java', 'Spring Boot', 'MS SQL Server', 'OpenShift'],
		span: 12,
		accent: 'outline',
	},
	{
		// Product surface, not an automation — no before-line, by design.
		name: 'ElevexAI',
		kind: 'Product Surface',
		icon: 'language',
		body: 'Marketing and product surface for ElevexAI, built on Next.js with Sanity CMS and deployed on Vercel.',
		tech: ['Next.js', 'Sanity CMS', 'Vercel', 'TypeScript'],
		status: 'Live · Web',
		shot: shot('https://www.elevexai.systems/'),
		links: [{ label: 'elevexai.systems', href: 'https://www.elevexai.systems/' }],
		span: 6,
		accent: 'outline',
	},
	{
		// Product surface, not an automation — no before-line, by design.
		name: 'AIDFest',
		kind: 'Product Surface',
		icon: 'groups',
		body: "Festival platform for Adelaide's AI and data community — programming, speakers and registration.",
		tech: ['Next.js', 'Vercel', 'TypeScript'],
		status: 'Live · Web',
		shot: shot('https://www.aidfest.tech/'),
		links: [{ label: 'aidfest.tech', href: 'https://www.aidfest.tech/' }],
		span: 6,
		accent: 'outline',
	},
]

/** The DR outcome, as the two numbers it actually is. No invented percentage. */
export const drStat = {
	before: { label: 'Previous year', value: '15–20', unit: 'hrs' },
	after: { label: 'With the app', value: 'Hours', unit: 'earlier' },
} as const

export const method = {
	heading: 'How I keep it honest',
	pull: 'Removing someone’s manual step means they now trust your software instead.',
	practices: [
		{ tool: 'pytest', scope: 'on backend logic' },
		{ tool: 'Playwright', scope: 'over main user flows' },
		{ tool: 'Swagger', scope: 'documented APIs' },
		{ tool: 'Peer code review', scope: 'and regression checks' },
		{ tool: 'Docker', scope: 'first deployment' },
	],
	body:
		'No fabricated metrics. Grounded documentation. Shipped software. Core flows are covered ' +
		"by automated tests rather than claimed as comprehensive end-to-end coverage — because they aren't.",
} as const

export type SkillGroup = { label: string; items: string[]; note?: string; wide?: boolean }

export const skillGroups: SkillGroup[] = [
	{ label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Java', 'Bash'] },
	{ label: 'Frontend', items: ['React', 'Next.js', 'React Native', 'Tailwind CSS', 'ShadCN', 'Sanity CMS'] },
	{ label: 'Backend', items: ['Node.js', 'FastAPI', 'Spring Boot', 'REST APIs', 'Microservices', 'Integration services'] },
	{ label: 'Databases', items: ['PostgreSQL', 'Supabase', 'MongoDB', 'MS SQL Server', 'Neo4j', 'Milvus', 'Oracle', 'Schema design', 'Migrations'] },
	{
		label: 'Infrastructure & CI/CD',
		items: ['Docker', 'Kubernetes', 'OpenShift', 'OpenStack', 'Vercel', 'Git', 'GitHub Actions'],
		// The caveat is the point: it is what makes the rest of the list credible.
		note: 'Hands-on: containerised services with Docker, deployed to OpenStack VMs provisioned by admins, front ends auto‑deploying on Vercel. Kubernetes on a robotics project, for master‑worker communication between robots. OpenShift at ANZ as the hosting platform. GitHub Actions on the CMS project — a teammate owned the main pipelines.',
	},
	{
		label: 'AI & Data',
		items: ['LLM integration', 'Agentic features', 'RAG', 'Unsloth', 'Data pipelines', 'Prefect'],
		note: 'Small-model training and quantisation with Unsloth; LLMs integrated into applications and agentic features. Inference work was for research and testing — not large‑model fine‑tuning.',
	},
	{ label: 'Testing & Security', items: ['pytest', 'Playwright', 'Authenticated APIs', 'Role-based access', 'Secure coding'] },
	{
		label: 'Professional',
		items: ['Code review', 'SDLC', 'Requirements analysis', 'Technical documentation', 'Swagger', 'Mentoring', 'Cross-team collaboration', 'Research'],
		wide: true,
	},
]

export const education = [
	{
		title: 'Master of Machine Learning',
		org: 'The University of Adelaide',
		detail: 'Capstone — a computer-vision pipeline estimating tree height and classifying species from street-view imagery, evaluated against held-out test sets.',
	},
	{
		title: 'Bachelor of Information Technology',
		org: 'Wellington Institute of Technology, New Zealand',
		detail: 'Patrick Pop Memorial Shield — awarded to the top third-year industrial IT project.',
	},
] as const

export const extras = [
	{ label: 'Certification', body: 'Mental Health First Aider — accreditation, Australia.' },
	{
		label: 'Community',
		body: 'Daffodil Day fundraising volunteer at ANZ New Zealand — co-ran a branch fundraiser that raised around NZ$11,000 for cancer research, about 30% above internal targets.',
	},
] as const

/**
 * The contact section carries NO heading, pitch paragraph, fields-of-interest
 * list or target-titles list. It is the file and nothing else — see
 * components/Contact. Removed deliberately; do not reintroduce them here
 * without being asked.
 */

/** Section ids, in scroll order. The header spy and the nav both read this. */
export const sections = [
	{ id: 'origin', label: 'Origin' },
	{ id: 'experience', label: 'Experience' },
	{ id: 'projects', label: 'Work' },
	{ id: 'skills', label: 'Skills' },
	{ id: 'education', label: 'Education' },
	{ id: 'contact', label: 'Contact' },
] as const
