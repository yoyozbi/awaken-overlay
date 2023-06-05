<script lang="ts">
	import { currentMatch } from '$lib/stores/currentMatchStore';
	import type { Prisma } from '@prisma/client';
	import { Spinner } from 'flowbite-svelte';
	import ScoreUpdate from '$lib/components/scoreUpdate.svelte';
	import ScorePlus from './scorePlus.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ scoreUpdate: typeof $currentMatch }>();

	type localResponse =
		| {
				success: true;
				data: Prisma.CurrentMatchGetPayload<{ include: { team1: true; team2: true } }>;
		  }
		| { error: string };

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
	};

	let loading = false;

	let error = '';
</script>

{#if !error}
	<div class="flex flex-row text-center">
		<ScorePlus
			score={$currentMatch.team1Score}
			isLoading={loading}
			teamUpdate={team1Update}
			class="pl-11 pr-5"><p class="text-green-400">Team1 Score</p></ScorePlus
		>
		<ScorePlus
			score={$currentMatch.team2Score}
			isLoading={loading}
			teamUpdate={team2Update}
			class="pl-5 pr-11"><p class="text-blue-700">Team2 Score</p></ScorePlus
		>
	</div>
{:else}
	<p>{error}</p>
{/if}
