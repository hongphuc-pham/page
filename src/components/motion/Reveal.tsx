import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

/**
 * Fade-slide a block in when it scrolls into view. Honors prefers-reduced-motion.
 */
export function Reveal({
	children,
	delay = 0,
	y = 26,
	once = true,
}: {
	children: ReactNode
	delay?: number
	y?: number
	once?: boolean
}) {
	const reduced = useReducedMotion()
	if (reduced) return <>{children}</>
	return (
		<motion.div
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once, margin: '-60px 0px' }}
			transition={{ duration: 0.7, delay, ease: EASE }}
		>
			{children}
		</motion.div>
	)
}

const groupVariants: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 22 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/**
 * Container that staggers its <StaggerItem> children as they enter the viewport.
 */
export function Stagger({ children, once = true }: { children: ReactNode; once?: boolean }) {
	const reduced = useReducedMotion()
	if (reduced) return <>{children}</>
	return (
		<motion.div
			variants={groupVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once, margin: '-60px 0px' }}
		>
			{children}
		</motion.div>
	)
}

export function StaggerItem({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
	const reduced = useReducedMotion()
	if (reduced) return <>{children}</>
	return (
		<motion.div variants={itemVariants} style={{ height: '100%', ...style }}>
			{children}
		</motion.div>
	)
}
