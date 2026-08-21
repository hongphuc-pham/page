'use client'

import { useCallback, useEffect, useState } from 'react'
import { contact } from '@/lib/cv'
import { Icon } from './ui'

/**
 * Contact, as a source file.
 *
 * No "send an email" button and no contact-card list — the details live in
 * the code block and nowhere else. That is the whole brief: one artefact, not
 * a form and a duplicate of the same five facts beside it.
 *
 * The copy button is the affordance a real code block has, so it earns its
 * place where a mailto CTA would not.
 */

const FILE = `// contact.ts

export const engineer = {
  name:     ${JSON.stringify(contact.name)},
  role:     ${JSON.stringify(contact.role)},
  location: ${JSON.stringify(contact.location)},

  email:    ${JSON.stringify(contact.email)},
  phone:    ${JSON.stringify(contact.phone)},
  linkedin: ${JSON.stringify(contact.linkedinLabel)},
  github:   ${JSON.stringify(contact.githubLabel)},

  status:   "Available — open to remote",
} as const;`

/** Minimal tokeniser — enough to colour this one file, no dependency. */
function highlight(line: string) {
	if (line.trimStart().startsWith('//')) {
		return <span className="text-outline">{line}</span>
	}

	// Split on string literals first, so keywords inside strings stay strings.
	const parts = line.split(/("(?:[^"\\]|\\.)*")/g)
	return parts.map((part, i) => {
		if (i % 2 === 1) return <span className="text-primary-fixed" key={i}>{part}</span>
		return (
			<span key={i}>
				{part.split(/\b(export|const|as|console|log)\b/g).map((word, j) =>
					j % 2 === 1 ? (
						<span className="text-secondary-container" key={j}>
							{word}
						</span>
					) : (
						<span className="text-on-surface-variant" key={j}>
							{word}
						</span>
					),
				)}
			</span>
		)
	})
}

export function ContactCode() {
	const [copied, setCopied] = useState(false)

	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(FILE)
			setCopied(true)
		} catch {
			// Clipboard can be blocked (insecure origin, permissions). The code
			// is on screen and selectable either way, so fail quietly.
		}
	}, [])

	// Reset the label rather than leaving a permanent "Copied".
	useEffect(() => {
		if (!copied) return
		const t = setTimeout(() => setCopied(false), 1800)
		return () => clearTimeout(t)
	}, [copied])

	return (
		<div className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-terminal">
			<div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />

			<div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 md:px-6">
				<span className="h-3 w-3 rounded-full bg-error" />
				<span className="h-3 w-3 rounded-full bg-tertiary-container" />
				<span className="h-3 w-3 rounded-full bg-primary-container" />
				<span className="ml-3 font-label text-[12px] font-bold text-outline">contact.ts</span>

				<button
					className="press ml-auto inline-flex items-center gap-1.5 rounded border border-white/10 px-2.5 py-1 font-label text-[11px] font-semibold text-on-surface-variant hover:border-primary/50 hover:text-primary"
					onClick={copy}
					type="button"
				>
					<Icon className="text-[14px]" name={copied ? 'check' : 'content_copy'} />
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>

			<pre className="flex-grow overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.7] md:px-6 md:text-[13.5px]">
				<code>
					{FILE.split('\n').map((line, i) => (
						<span className="block" key={i}>
							{line ? highlight(line) : ' '}
						</span>
					))}
				</code>
			</pre>
		</div>
	)
}
