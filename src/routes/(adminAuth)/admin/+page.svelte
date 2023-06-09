<script lang="ts">
	import TeamsTable from '$lib/components/teamsTable.svelte';
	import UsersTable from '$lib/components/usersTable.svelte';
	import type { PageServerData } from './$types';
	import { Button } from 'flowbite-svelte';

	export let data: PageServerData;
</script>

<div class="flex flex-col align-middle items-center">
	<div class="flex flex-row align-middle items-center">
		<h1 class="pb-5 pt-5 pr-0 mr-1 dark:text-white text-3xl">Teams</h1>
		<Button href="/teams/create" class="dark:text-white h-1 w-1" color="blue" outline>New</Button>
	</div>
	<TeamsTable teams={data.teams} />
</div>
<div class="flex flex-col align-middle items-center">
	<div class="flex flex-row align-middle items-center">
		<h1 class="pb-5 pt-5 mr-1 dark:text-white text-3xl">Users</h1>
		<Button href="/users/create" class="dark:text-white h-1 w-1" color="blue" outline>New</Button>
	</div>
	<UsersTable users={data.users} />
</div>
