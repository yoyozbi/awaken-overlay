<script lang="ts">
	import type { User } from '@prisma/client';
	import {
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Modal,
		Button
	} from 'flowbite-svelte';

	import Time from 'svelte-time';
	let deleteModalOpen = false;
	let userId = '';

	export let users: User[];
</script>

<Table striped={true}>
	<TableHead>
		<TableHeadCell>Username</TableHeadCell>
		<TableHeadCell>isAdmin</TableHeadCell>
		<TableHeadCell>Created</TableHeadCell>
		<TableHeadCell>Updated</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each users as user}
			<TableBodyRow>
				<TableBodyCell>{user.username}</TableBodyCell>
				<TableBodyCell>{user.isAdmin}</TableBodyCell>
				<TableBodyCell><Time timestamp={user.createdAt} relative /></TableBodyCell>
				<TableBodyCell><Time timestamp={user.updatedAt} relative /></TableBodyCell>
				<TableBodyCell
					><a
						href="/users/{user.id}"
						class="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</a
					></TableBodyCell
				>
				<TableBodyCell
					><a
						href=""
						on:click={() => {
							userId = user.id;
							deleteModalOpen = true;
						}}
						class="font-medium text-blue-600 hover:underline dark:text-blue-500">Delete</a
					></TableBodyCell
				>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
<Modal bind:open={deleteModalOpen} size="xs">
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
			Are you sure you want to delete this user ?
		</h3>
		<form method="POST" action="?/deleteUser">
			<input type="hidden" name="userId" bind:value={userId} />
			<Button color="red" class="mr-2" type="submit">Yes, I'm sure</Button>
			<Button color="alternative" on:click={() => (deleteModalOpen = false)}>No, cancel</Button>
		</form>
	</div>
</Modal>
