'use client'

import { FC } from 'react'
import { Bell } from './ui/icons'
import { CollapsibleTrigger } from './ui/Collapsible'
import { Avatar, ConnectKitButton, useSIWE } from 'connectkit'

const ConnectWallet = () => <ConnectKitButton />

export const MobileProfileNav: FC<{}> = () => {
	const { signOut } = useSIWE()

	return (
		<ConnectKitButton.Custom>
			{({ ensName, truncatedAddress, address }) => (
				<div className="border-t border-neutral-700 pb-3 pt-4">
					<div className="flex items-center px-5">
						<div className="flex-shrink-0">
							<Avatar address={address} name={ensName} size={40} radius={40} />
						</div>
						<div className="ml-3">
							<div className="text-base font-medium leading-none text-white">
								{ensName ?? truncatedAddress}
							</div>
							<div className="mt-1 text-xs font-medium leading-none text-neutral-400">
								{ensName ? truncatedAddress : address}
							</div>
						</div>
						<button
							type="button"
							className="ml-auto flex-shrink-0 rounded-full bg-neutral-800 p-1 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800"
						>
							<span className="sr-only">View notifications</span>
							<Bell className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="mt-3 space-y-1 px-2">
						<CollapsibleTrigger asChild>
							<button
								onClick={signOut}
								className="block rounded-md px-3 py-2 text-base font-medium text-neutral-400 hover:bg-neutral-700 hover:text-white"
							>
								Sign out
							</button>
						</CollapsibleTrigger>
					</div>
				</div>
			)}
		</ConnectKitButton.Custom>
	)
}

export default ConnectWallet
