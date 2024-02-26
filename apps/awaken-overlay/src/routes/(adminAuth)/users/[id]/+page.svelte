<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import type { ActionData, PageServerData } from './$types';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tabs,
		TabItem,
		Input,
		Label,
		Toggle,
		Button,
		Toast
	} from 'flowbite-svelte';

	export let data: PageServerData;
	export let form: ActionData;

	let isSuccess = false;
</script>

<Tabs>
	<TabItem title="Infos" open>
		<form
			method="POST"
			use:enhance={({ formData, action, cancel }) => {
				let isAdmin = false;
				if (formData.has('isAdmin')) {
					isAdmin = true;
					formData.delete('isAdmin');
				}

				formData.append('isAdmin', isAdmin.toString());
				console.log(data);
				isSuccess = false;
				return async ({ result }) => {
					if (result.type === 'success') isSuccess = true;
				};
			}}
		>
			<div class="flex items-center">
				<div class="flex text-center items-center pr-10">
					<div class="pr-2">
						<Label for="username">Username</Label>
					</div>
					<div class="self-end">
						<Input type="text" value={data.user.username} name="username" id="username" required />
					</div>
				</div>

				<div class="pr-4">
					<Toggle id="isAdmin" checked={data.user.isAdmin} name="isAdmin">Admin</Toggle>
				</div>
			</div>

			<Button type="submit">Save</Button>
		</form>
	</TabItem>
	<TabItem title="Login attempts">
		<Table>
			<TableHead>
				<TableHeadCell>When</TableHeadCell>
				<TableHeadCell>IP</TableHeadCell>
				<TableHeadCell>User-Agent</TableHeadCell>
				<TableHeadCell>Success</TableHeadCell>
				<TableHead>Tried Password</TableHead>
			</TableHead>
			<TableBody>
				{#each data.loginAttempts as attempt}
					<TableBodyRow>
						<TableBodyCell>{attempt.when}</TableBodyCell>
						<TableBodyCell>{attempt.ipAddress}</TableBodyCell>
						<TableBodyCell>{attempt.userAgent}</TableBodyCell>
						<TableBodyCell>{attempt.sucessful}</TableBodyCell>
						<TableBodyCell>{attempt.triedPassword}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</TabItem>
</Tabs>
<div aria-live="polite" aria-atomic="true">
	<div class="absolute bottom-0 left-1/2 p-3">
		{#if form}
			<Toast transition={slide} role="alert" color="red">
				<svelte:fragment slot="icon">
					<svg
						aria-hidden="true"
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/></svg
					>
					<span class="sr-only">Error icon</span>
				</svelte:fragment>
				{form.error}
			</Toast>
		{/if}
		{#if isSuccess}
			<Toast transition={slide} role="alert" color="green">
				<svelte:fragment slot="icon">
					<svg
						aria-hidden="true"
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/></svg
					>
					<span class="sr-only">Check icon</span>
				</svelte:fragment>
				Successfully updated
			</Toast>
		{/if}
	</div>
</div>
