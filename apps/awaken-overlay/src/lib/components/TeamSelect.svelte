<script lang="ts">
	import { Select, Spinner } from 'flowbite-svelte';
	import type { CurrentMatch, Team } from '@prisma/client';
	import { createEventDispatcher } from 'svelte';
    import { string } from 'yup';

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
	class={`dark:text-white dark:focus:border-white dark:focus:bg-black ${$$props.class}`}
	items={formatedTeams}
	bind:value={selectedTeam}
	on:change={handleChange}
	underline
/>
