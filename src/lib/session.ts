import { COOKIE_NAME } from './consts'
import { NextRequest, NextResponse } from 'next/server'
import { sealData, unsealData } from 'iron-session/edge'

export const SESSION_OPTIONS = {
	ttl: 60 * 60 * 24 * 30, // 30 days
	password: process.env.SESSION_SECRET!,
}

export type ISession = {
	nonce?: string
	userId?: string
}

class Session {
	nonce?: string
	userId?: string

	constructor(session?: ISession) {
		this.nonce = session?.nonce
		this.userId = session?.userId
	}

	static async fromRequest(req: NextRequest): Promise<Session> {
		const sessionCookie = req.cookies.get(COOKIE_NAME)?.value

		if (!sessionCookie) return new Session()
		return new Session(await unsealData<ISession>(sessionCookie, SESSION_OPTIONS))
	}

	clear(res: NextResponse): Promise<void> {
		this.nonce = undefined
		this.userId = undefined

		return this.persist(res)
	}

	toJSON(): ISession {
		return { nonce: this.nonce, userId: this.userId }
	}

	async persist(res: NextResponse): Promise<void> {
		res.cookies.set(COOKIE_NAME, await sealData(this.toJSON(), SESSION_OPTIONS), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		})
	}
}

export default Session
