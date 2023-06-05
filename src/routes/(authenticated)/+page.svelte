<script lang="ts">
	import type { PageServerData } from './$types';
	import { currentMatch } from '$lib/stores/currentMatchStore';
	import ScoreUpdate from '$lib/components/scoreUpdate.svelte';
	import TeamUpdate from '$lib/components/teamUpdate.svelte';
	import type { Prisma } from '@prisma/client';

	type response =
		| {
				success: true;
				data: Prisma.CurrentMatchGetPayload<{ include: { team1: true; team2: true } }>;
		  }
		| { error: string };

	export let data: PageServerData;

	$: if ($currentMatch) {
		$currentMatch = data.currentMatch;
	}

	const handleUpdate = async (currentMatch: CustomEvent<typeof $currentMatch>) => {
		$currentMatch = currentMatch.detail;
		const data = {
			team1Score: $currentMatch.team1Score,
			team2Score: $currentMatch.team2Score,
			team1Id: $currentMatch.team1Id,
			team2Id: $currentMatch.team2Id
		};
		const res = await fetch('/api/currentMatch', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		const json = await res.json();
		if (!res.ok) {
			console.log('error', res);
		}
	};
</script>

<div>
	<ScoreUpdate on:scoreUpdate={(c) => handleUpdate(c)} />
	<TeamUpdate teams={data.teams} on:teamUpdate={(c) => handleUpdate(c)} />
</div>
