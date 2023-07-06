<script lang="ts">
	import type { PageServerData } from './$types';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	export let data: PageServerData;
</script>

<h1>Login attemps</h1>

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
