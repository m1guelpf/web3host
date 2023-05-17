import Link from 'next/link'
import { cn } from '@/lib/utils'
import prisma from '@/db/prisma'
import Session from '@/lib/session'
import Navigation from './Navigation'
import { Team } from '@prisma/client'
import { cookies } from 'next/headers'
import { PropsWithChildren } from 'react'
import TeamSwitcher from '@/components/TeamSwitcher'
import { Bell, X, List, AirTrafficControl } from '@/components/ui/icons'
import ConnectWallet, { MobileProfileNav } from '@/components/ConnectWallet'
import Collapsible, { CollapsibleContent, CollapsibleTrigger } from '@/components/ui/Collapsible'

const navigation = [
	{ name: 'Overview', href: '/dashboard', current: true },
	{ name: 'Activity', href: '/team', current: false },
	{ name: 'Settings', href: '/settings', current: false },
]

const DashboardLayout = async ({ children }: PropsWithChildren<{}>) => {
	const session = await Session.fromCookies(cookies())
	const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { teams: true } })

	const switchTeam = async (team: Team) => {
		'use server'

		const session = await Session.fromCookies(cookies())
		session.teamId = team.id

		// @ts-expect-error -- Next.js returns the wrong type for cookies on server actions
		await session.persist(cookies())
	}

	const createTeam = async (name: string) => {
		'use server'

		const session = await Session.fromCookies(cookies())
		const team = await prisma.team.create({ data: { name, members: { connect: { id: session.userId } } } })
		session.teamId = team.id

		// @ts-expect-error -- Next.js returns the wrong type for cookies on server actions
		await session.persist(cookies())
	}

	return (
		<div className="min-h-screen bg-neutral-100">
			<div className="bg-neutral-800 pb-32">
				<Collapsible asChild>
					<nav className="bg-neutral-800 group">
						<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
							<div className="border-b border-neutral-700">
								<div className="flex h-16 items-center justify-between px-4 sm:px-0">
									<div className="flex items-center">
										<Link href="/dashboard" className="flex-shrink-0">
											<AirTrafficControl className="h-8 w-8" color="white" weight="duotone" />
										</Link>
										<TeamSwitcher
											className="ml-4"
											teams={user!.teams}
											onSwitch={switchTeam}
											onCreate={createTeam}
											currentTeamId={session.teamId!}
										/>
									</div>
									<div className="hidden md:block">
										<div className="ml-4 flex items-center md:ml-6">
											<button
												type="button"
												className="rounded-full bg-neutral-800 p-1 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800"
											>
												<span className="sr-only">View notifications</span>
												<Bell className="h-6 w-6" aria-hidden="true" />
											</button>
											<div className="relative ml-3">
												<ConnectWallet />
											</div>
										</div>
									</div>
									<div className="-mr-2 flex md:hidden">
										{/* Mobile menu button */}
										<CollapsibleTrigger asChild>
											<button className="inline-flex items-center justify-center rounded-md bg-neutral-800 p-2 text-neutral-400 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800">
												<span className="sr-only">Open main menu</span>
												<X
													className="hidden h-6 w-6 radix-state-open:block group-radix-state-open:block"
													aria-hidden="true"
												/>
												<List
													className="hidden h-6 w-6 group-radix-state-closed:block"
													aria-hidden="true"
												/>
											</button>
										</CollapsibleTrigger>
									</div>
								</div>
							</div>
							<div className="mt-2 hidden md:flex items-baseline space-x-4">
								{navigation.map(item => (
									<Navigation key={item.name} href={item.href}>
										{item.name}
									</Navigation>
								))}
							</div>
						</div>
						<CollapsibleContent className="border-b border-neutral-700 md:hidden">
							<div className="space-y-1 px-2 py-3 sm:px-3">
								{navigation.map(item => (
									<CollapsibleTrigger key={item.name} asChild>
										<Link
											href={item.href}
											aria-current={item.current ? 'page' : undefined}
											className={cn(
												item.current
													? 'bg-neutral-900 text-white'
													: 'text-neutral-300 hover:bg-neutral-700 hover:text-white',
												'block rounded-md px-3 py-2 text-base font-medium'
											)}
										>
											{item.name}
										</Link>
									</CollapsibleTrigger>
								))}
							</div>
							<MobileProfileNav />
						</CollapsibleContent>
					</nav>
				</Collapsible>

				<header className="py-10">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
					</div>
				</header>
			</div>

			<main className="-mt-32">
				<div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
					<div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">{children}</div>
				</div>
			</main>
		</div>
	)
}

export default DashboardLayout
