<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Modal,
		Button
	} from 'flowbite-svelte';
	import type { Team } from '@prisma/client';
	import Time from 'svelte-time';
	export let teams: Team[];
	let deleteModal = false;
	let teamId = '';
</script>

<Table striped={true}>
	<TableHead>
		<TableHeadCell>Team</TableHeadCell>
		<TableHeadCell>Left icon</TableHeadCell>
		<TableHeadCell>Right icon</TableHeadCell>
		<TableHeadCell>Created</TableHeadCell>
		<TableHeadCell>Updated</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each teams as team}
			<TableBodyRow>
				<TableBodyCell>{team.name}</TableBodyCell>
				{#if team.leftIcon}
					<TableBodyCell><img src={team.leftIcon} alt={`left ${team.name}'s logo`} /></TableBodyCell
					>
				{:else}
					<TableBodyCell><span class="italic">No icon</span></TableBodyCell>
				{/if}
				{#if team.rightIcon}
					<TableBodyCell
						><img src={team.rightIcon} alt={`right ${team.name}'s  logo`} /></TableBodyCell
					>
				{:else}
					<TableBodyCell><span class="italic">No icon</span></TableBodyCell>
				{/if}
				<TableBodyCell><Time timestamp={team.createdAt} relative /></TableBodyCell>
				<TableBodyCell><Time timestamp={team.updatedAt} relative /></TableBodyCell>
				<TableBodyCell
					><a
						href="/teams/{team.id}"
						class="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</a
					></TableBodyCell
				>
				<TableBodyCell
					><button
						on:click={() => {
							deleteModal = true;
							teamId = team.id;
						}}
						class="font-medium text-blue-600 hover:underline dark:text-blue-500">Delete</button
					></TableBodyCell
				>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal bind:open={deleteModal} size="xs">
	<div class="text-center">
		<svg
			aria-hidden="true"
			class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this team?
		</h3>
		<form method="POST" action="?/deleteTeam">
			<input type="hidden" name="teamId" bind:value={teamId} />
			<Button color="red" class="mr-2" type="submit">Yes, I'm sure</Button>
			<Button color="alternative" on:click={() => (deleteModal = false)}>No, cancel</Button>
		</form>
	</div>
</Modal>
