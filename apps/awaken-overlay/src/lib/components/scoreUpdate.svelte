<script lang="ts">
	import { currentMatch } from '$lib/stores/currentMatchStore';
	import TeamSelect from '$lib/components/TeamSelect.svelte';
	import ScorePlus from './ScorePlus.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { BestOf, Team } from '@prisma/client';
    import BoSelect from './BoSelect.svelte';

	export let teams: Team[];
	export let bos: BestOf[];

	const dispatch = createEventDispatcher<{ scoreUpdate: typeof $currentMatch }>();
	$: {
		console.log("Dispatching", $currentMatch)
		dispatch('scoreUpdate', $currentMatch)
	}

	/*const names1Update = (team1Id: string) => {
		$currentMatch.team1Score = 0;
		$currentMatch.team2Score = 0;

		$currentMatch.team1Id = team1Id;
		dispatch('scoreUpdate', $currentMatch);
	};
	const names2Update = (team2Id: string) => {
		$currentMatch.team1Score = 0;
		$currentMatch.team2Score = 0;

		$currentMatch.team2Id = team2Id;
		dispatch('scoreUpdate', $currentMatch);
	};
	const team1Update = (toAdd: number) => {
		if ($currentMatch.team1Score + toAdd < 0) {
			return;
		}
		$currentMatch.team1Score += toAdd;
		dispatch('scoreUpdate', $currentMatch);
	};
	const team2Update = (toAdd: number) => {
		if ($currentMatch.team2Score + toAdd < 0) {
			return;
		}
		$currentMatch.team2Score += toAdd;
		dispatch('scoreUpdate', $currentMatch);
	};*/

	let loading = false;

	let error = '';
</script>

{#if !error}
	<div class="flex flex-col text-center w-fit pl-5">
		<div>
			<ScorePlus score={$currentMatch.team1Score} isLoading={loading} on:scoreUpdate={e => $currentMatch.team1Score = e.detail}
				><p class="text-green-400">Team1 Score</p></ScorePlus
			>
			<TeamSelect
				{teams}
				selectedTeam={$currentMatch.team1Id}
				
				class="mt-5 max-w-12"
			/>
		</div>
		<div class="mt-5">
			<ScorePlus score={$currentMatch.team2Score} isLoading={loading} on:scoreUpdate={e => $currentMatch.team2Score = e.detail}
				><p class="text-blue-700">Team2 Score</p></ScorePlus
			>
			<TeamSelect
				{teams}
				selectedTeam={$currentMatch.team2Id}
				class="mt-5"
			/>
		</div>
		<div class="mt5">
			<p class="text-green-400">BO Format</p>
			<BoSelect
				{bos}
				selectedBo={$currentMatch.bestOfId}
				on:boUpdate={e => $currentMatch.bestOfId = e.detail}
				class="mt-5"
			/>
		</div>
	</div>
{:else}
	<p>{error}</p>
{/if}
