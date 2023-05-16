'use client'

import { cn } from '@/lib/utils'
import { FC, useState } from 'react'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import Button from '@/components/ui/Button'
import { CaretUpDown, Check, PlusCircle } from '@phosphor-icons/react'
import Avatar, { AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import Popover, { PopoverContent, PopoverTrigger, PopoverTriggerProps } from '@/components/ui/Popover'
import Command, {
	CommandItem,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandSeparator,
} from '@/components/ui/Command'
import Dialog, {
	DialogTitle,
	DialogFooter,
	DialogHeader,
	DialogContent,
	DialogTrigger,
	DialogDescription,
} from '@/components/ui/Dialog'

const groups = [
	{
		label: 'Personal Account',
		teams: [
			{
				label: 'Miguel Piedrafita',
				value: 'personal',
			},
		],
	},
	{
		label: 'Teams',
		teams: [
			{
				label: 'Acme Inc.',
				value: 'acme-inc',
			},
			{
				label: 'Monsters Inc.',
				value: 'monsters',
			},
		],
	},
]

type Team = (typeof groups)[number]['teams'][number]

const TeamSwitcher: FC<PopoverTriggerProps> = ({ className }) => {
	const [open, setOpen] = useState(false)
	const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)
	const [selectedTeam, setSelectedTeam] = useState<Team>(groups[0].teams[0])

	return (
		<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						size="sm"
						variant="ghost"
						role="combobox"
						aria-expanded={open}
						aria-label="Select a team"
						className={cn('w-[200px] justify-between', className)}
					>
						<Avatar className="mr-2 h-5 w-5">
							<AvatarImage
								src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
								alt={selectedTeam.label}
							/>
							<AvatarFallback>
								{selectedTeam.label
									.split(' ')
									.map(word => word[0])
									.join('')}
							</AvatarFallback>
						</Avatar>
						{selectedTeam.label}
						<CaretUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Search team..." />
							<CommandEmpty>No team found.</CommandEmpty>
							{groups.map(group => (
								<CommandGroup key={group.label} heading={group.label}>
									{group.teams.map(team => (
										<CommandItem
											key={team.value}
											onSelect={() => {
												setSelectedTeam(team)
												setOpen(false)
											}}
											className="text-sm"
										>
											<Avatar className="mr-2 h-5 w-5">
												<AvatarImage
													src={`https://avatar.vercel.sh/${team.value}.png`}
													alt={team.label}
												/>
												<AvatarFallback>
													{team.label
														.split(' ')
														.map(word => word[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
											{team.label}
											<Check
												className={cn(
													'ml-auto h-4 w-4',
													selectedTeam.value === team.value ? 'opacity-100' : 'opacity-0'
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							))}
						</CommandList>
						<CommandSeparator />
						<CommandList>
							<CommandGroup>
								<DialogTrigger asChild>
									<CommandItem
										onSelect={() => {
											setOpen(false)
											setShowNewTeamDialog(true)
										}}
									>
										<PlusCircle className="mr-2 h-5 w-5" />
										Create Team
									</CommandItem>
								</DialogTrigger>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create team</DialogTitle>
					<DialogDescription>Add a new team to manage products and customers.</DialogDescription>
				</DialogHeader>
				<div>
					<div className="space-y-4 py-2 pb-4">
						<div className="space-y-2">
							<Label htmlFor="name">Team name</Label>
							<Input id="name" placeholder="Acme Inc." />
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
						Cancel
					</Button>
					<Button type="submit">Continue</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default TeamSwitcher
