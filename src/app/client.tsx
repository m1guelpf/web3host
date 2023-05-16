'use client'

import { SiweMessage } from 'siwe'
import { APP_NAME } from '@/lib/consts'
import { useRouter } from 'next/navigation'
import { WagmiConfig, createClient } from 'wagmi'
import { IconContext } from '@phosphor-icons/react'
import { FC, PropsWithChildren, useEffect } from 'react'
import { ConnectKitProvider, SIWEConfig, SIWEProvider, getDefaultClient, useSIWE } from 'connectkit'

const client = createClient(
	getDefaultClient({
		appName: APP_NAME,
		infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
	})
)

const siweConfig: SIWEConfig = {
	getNonce: async () => {
		const res = await fetch(`/login/siwe`, { method: 'PUT' })
		if (!res.ok) throw new Error('Failed to fetch SIWE nonce')

		return res.text()
	},
	createMessage: ({ nonce, address, chainId }) => {
		return new SiweMessage({
			nonce,
			chainId,
			address,
			version: '1',
			uri: window.location.origin,
			domain: window.location.host,
			statement: 'Sign In With Ethereum to prove you control this wallet.',
		}).prepareMessage()
	},
	verifyMessage: ({ message, signature }) => {
		return fetch(`/login/siwe`, {
			method: 'POST',
			body: JSON.stringify({ message, signature }),
			headers: { 'Content-Type': 'application/json' },
		}).then(res => res.ok)
	},
	getSession: async () => {
		const res = await fetch(`/login/siwe`)
		if (!res.ok) throw new Error('Failed to fetch SIWE session')

		const { userId } = await res.json()
		return userId ? { address: userId, chainId: 1 } : null
	},
	signOut: () => fetch(`/login/siwe`, { method: 'DELETE' }).then(res => res.ok),
}

const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<IconContext.Provider value={{ color: 'currentColor', size: '' }}>
			<WagmiConfig client={client}>
				<SIWEProvider {...siweConfig}>
					<SIWERedirector />
					<ConnectKitProvider options={{ hideBalance: true, enforceSupportedChains: false }}>
						{children}
					</ConnectKitProvider>
				</SIWEProvider>
			</WagmiConfig>
		</IconContext.Provider>
	)
}

const SIWERedirector: FC = () => {
	const router = useRouter()
	const { isSignedIn, isReady } = useSIWE()

	useEffect(() => {
		if (!isReady) return

		if (isSignedIn) router.push('/dashboard')
		else router.push('/login')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSignedIn])

	return null
}

export default ClientLayout
