<script lang="ts">
  import type { PageServerData } from './$types';
  import ScoreUpdate from '$lib/components/scoreUpdate.svelte';
  import { onMount } from 'svelte';
  import { trpc } from '$lib/trpc/client';
  import Notifications from '$lib/components/Notifications.svelte';
  import type { CurrentMatch } from '@prisma/client';

  export let data: PageServerData;

  const client = trpc();

  let error = '';
  let success = '';
  let ignore = false;

  let match: Omit<CurrentMatch, 'createdAt' | 'updatedAt'>;

  onMount(() => {
    client.currentTeamUpdate.subscribe(undefined, {
      onData(newData) {
        if (ignore) {
          ignore = false;
          return;
        }
        console.log('newData', newData);
        match = newData;
        success = 'Received new data';
      }
    });

    client.getCurrentMatch.query().then((newData) => {
      match = newData;
    });
  });

  const handleUpdate = async (e: CustomEvent<Omit<CurrentMatch, 'createdAt' | 'updatedAt'>>) => {
    try {
      ignore = true;
      await client.updateCurrentMatch.mutate(e.detail);
      success = 'Updated';
      setTimeout(() => {
        success = '';
      }, 2000);
    } catch (e) {
      console.error(e);
      error = 'Failed to update match';
    }
  };
</script>

<div>
  <ScoreUpdate
    on:scoreUpdate={(e) => handleUpdate(e)}
    teams={data.teams}
    bos={data.bos}
    localMatch={match}
  />
  <Notifications {error} {success} />
</div>
