<script lang="ts">
  import type { PageServerData } from './$types';
  import { currentMatch } from '$lib/stores/currentMatchStore';
  import ScoreUpdate from '$lib/components/scoreUpdate.svelte';
  import { setContext } from 'svelte';
  import { trpc } from '$lib/trpc/client';
  import Notifications from '$lib/components/Notifications.svelte';

  export let data: PageServerData;

  $: if ($currentMatch) {
    $currentMatch = data.currentMatch;
  }
  setContext('currentMatch', currentMatch);

  const client = trpc();

  let error = '';
  let isSuccess = false;

  const handleUpdate = async () => {
    try {
      await client.updateCurrentMatch.mutate($currentMatch);
      isSuccess = true;
      setTimeout(() => {
        isSuccess = false;
      }, 2000);
    } catch (e) {
      console.error(e);
      error = 'Failed to update match';
    }
  };
</script>

<div>
  <ScoreUpdate on:scoreUpdate={handleUpdate} teams={data.teams} bos={data.bos} />
  <Notifications {error} success={isSuccess ? 'Updated !' : undefined} />
</div>
