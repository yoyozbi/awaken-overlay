<script lang="ts">
	import { Select, Spinner } from 'flowbite-svelte';
	import type { CurrentMatch, Team } from '@prisma/client';
	import { currentMatch } from '$lib/stores/currentMatchStore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ teamUpdate: CurrentMatch }>();

	export let teams: Team[];
	let formatedTeams = teams.map((team) => {
		return {
			value: team.id,
			name: team.name
		};
	});

	const handleChange = () => {
		dispatch('teamUpdate', $currentMatch);
	};

	let loading = false;
</script>

<div class="flex mt-4">
	<div class="ml-5">
		<Select
			items={formatedTeams}
			bind:value={$currentMatch.team1Id}
			on:change={handleChange}
			underline
		/>
	</div>
	<div class="ml-9">
		<Select
			items={formatedTeams}
			bind:value={$currentMatch.team2Id}
			on:change={handleChange}
			underline
		/>
	</div>
	{#if loading}
		<Spinner />
	{/if}
</div>
