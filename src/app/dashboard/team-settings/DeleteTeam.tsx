'use client'

import { deleteTeam } from './actions'
import { toast } from 'react-hot-toast'
import { actionToast } from '@/lib/errors'
import Button from '@/components/ui/Button'
import { FC, FormEvent, useState } from 'react'
import { Team, TeamRole } from '@prisma/client'
import Card, { CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Dialog, {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog'

const DeleteTeam: FC<{ team: Team; role: TeamRole }> = ({ team, role }) => {
	const [isOpen, setOpen] = useState<boolean>(false)

	const handleDelete = async (event: FormEvent) => {
		event.preventDefault()

		await actionToast(deleteTeam(), {
			error: e => e.message,
			success: 'Team deleted',
			loading: 'Deleting team...',
		})

		window.location.pathname = '/dashboard'
	}
	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<Card>
				<CardHeader className="flex-row items-center justify-between">
					<div className="space-y-1.5">
						<CardTitle>Delete Team</CardTitle>
						<CardDescription>Permanently delete this team and all the sites in it.</CardDescription>
					</div>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							disabled={role != TeamRole.OWNER}
							className="hover:bg-red-500 hover:text-red-50 hover:border-red-500"
						>
							Delete Team
						</Button>
					</DialogTrigger>
				</CardHeader>
			</Card>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm Deletion</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete <strong>{team.name}</strong>? All sites in this team will be
						deleted and this action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="ghost" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<form onSubmit={handleDelete}>
						<Button type="submit" className="hover:bg-red-500 hover:text-red-50 hover:border-red-500">
							Confirm
						</Button>
					</form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DeleteTeam
