<script lang="ts">
	import type { PageServerData } from './$types';
	import { currentMatch } from '$lib/stores/currentMatchStore';
	import ScoreUpdate from '$lib/components/scoreUpdate.svelte';
	import TeamUpdate from '$lib/components/teamUpdate.svelte';
	import { setContext } from 'svelte';
	import { trpc } from '$lib/trpc/client';

	export let data: PageServerData;

	$: if ($currentMatch) {
		$currentMatch = data.currentMatch;
	}
	setContext('currentMatch', currentMatch);

	const client = trpc();

	const handleUpdate = async () => {
		await client.updateCurrentMatch.mutate($currentMatch);
	};
</script>

<div>
	<ScoreUpdate on:scoreUpdate={handleUpdate} />
	<TeamUpdate teams={data.teams} on:teamUpdate={handleUpdate} />
</div>
