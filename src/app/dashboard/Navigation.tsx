'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { FC, PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'

const MotionLink = motion(Link)

const Navigation: FC<PropsWithChildren<{ href: string }>> = ({ href, children }) => {
	const pathname = usePathname()

	return (
		<MotionLink
			href={href}
			className={cn(
				href == pathname
					? 'bg-neutral-900 text-white'
					: 'text-neutral-300 hover:bg-neutral-700 hover:text-white',
				'rounded-md px-3 py-2 text-sm font-medium'
			)}
			aria-current={href == pathname ? 'page' : undefined}
		>
			{children}
		</MotionLink>
	)
}

export default Navigation
