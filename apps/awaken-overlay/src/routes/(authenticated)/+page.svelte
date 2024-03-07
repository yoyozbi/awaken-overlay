<script lang="ts">
	import type { PageServerData } from './$types';
	import { currentMatch } from '$lib/stores/currentMatchStore';
	import ScoreUpdate from '$lib/components/scoreUpdate.svelte';
	import { setContext } from 'svelte';
	import { trpc } from '$lib/trpc/client';

	export let data: PageServerData;

	$: if ($currentMatch) {
		$currentMatch = data.currentMatch;
	}
	setContext('currentMatch', currentMatch);

	const client = trpc();

	const handleUpdate = async () => {
		console.log('Updating current match');
		await client.updateCurrentMatch.mutate($currentMatch);
	};
</script>

<div>
	<ScoreUpdate on:scoreUpdate={handleUpdate} teams={data.teams} bos={data.bos} />
</div>
