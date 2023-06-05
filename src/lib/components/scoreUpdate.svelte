<script lang="ts">
	import { currentMatch } from '$lib/stores/currentMatchStore';
	import type { Prisma } from '@prisma/client';
	import { Spinner } from 'flowbite-svelte';
	import ScoreUpdate from '$lib/components/scoreUpdate.svelte';
	import ScorePlus from './scorePlus.svelte';

	const url = '/api/score';

	type localResponse =
		| {
				success: true;
				data: Prisma.CurrentMatchGetPayload<{ include: { team1: true; team2: true } }>;
		  }
		| { error: string };

	let scores = { team1Score: 0, team2Score: 0 };
	$: if ($currentMatch) {
		scores = { team1Score: $currentMatch.team1Score, team2Score: $currentMatch.team2Score };
	}

	const sendRequest = async () => {
		loading = true;
		const data = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(scores)
		});
		if (!data.ok) {
			error = 'Error fetching data';
			return;
		}
		const json: localResponse = await data.json();
		if ('error' in json) {
			error = json.error;
			return;
		}
		scores = { team1Score: json.data.team1Score, team2Score: json.data.team2Score };
		loading = false;
	};

	const team1Update = (toAdd: number) => {
		if (scores.team1Score + toAdd < 0) {
			return;
		}
		scores.team1Score += toAdd;
		sendRequest();
	};
	const team2Update = (toAdd: number) => {
		if (scores.team2Score + toAdd < 0) {
			return;
		}
		scores.team2Score += toAdd;
		sendRequest();
	};

	let loading = false;

	let error = '';
</script>

{#if !error}
	<div class="flex flex-row text-center">
		<ScorePlus
			score={scores.team1Score}
			isLoading={loading}
			teamUpdate={team1Update}
			class="pl-11 pr-5"><p class="text-green-400">Team1 Score</p></ScorePlus
		>
		<ScorePlus
			score={scores.team2Score}
			isLoading={loading}
			teamUpdate={team2Update}
			class="pl-5 pr-11"><p class="text-blue-700">Team2 Score</p></ScorePlus
		>
	</div>
{:else}
	<p>{error}</p>
{/if}
