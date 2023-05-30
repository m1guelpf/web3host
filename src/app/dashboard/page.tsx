import prisma from '@/db/prisma'
import Session from '@/lib/session'
import { cookies } from 'next/headers'
import BlockPlaceholder from '@/components/BlockPlaceholder'

const DashboardPage = async () => {
	const session = await Session.fromCookies(cookies())
	const sites = await prisma.site.findMany({ where: { teamId: session.teamId } })

	return <BlockPlaceholder />
}

export default DashboardPage
