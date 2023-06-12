<script lang="ts">
	import { Select, Spinner } from 'flowbite-svelte';
	import type { CurrentMatch, Team } from '@prisma/client';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		teamUpdate: string;
	}>();

	export let teams: Team[];
	export let selectedTeam: string;

	let formatedTeams = teams.map((team) => {
		return {
			value: team.id,
			name: team.name
		};
	});

	const handleChange = (e: Event) => {
		let val = (e.target as HTMLSelectElement).value;
		dispatch('teamUpdate', val);
	};
</script>

<Select
	class={`${$$props.class}`}
	items={formatedTeams}
	bind:value={selectedTeam}
	on:change={handleChange}
	underline
/>
