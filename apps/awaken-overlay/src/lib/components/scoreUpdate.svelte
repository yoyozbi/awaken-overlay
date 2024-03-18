<script lang="ts">
  import { currentMatch } from '$lib/stores/currentMatchStore';
  import { Input, Button, Tabs, TabItem } from 'flowbite-svelte';
  import TeamSelect from '$lib/components/TeamSelect.svelte';
  import ScorePlus from './ScorePlus.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { BestOf, Team } from '@prisma/client';
  import BoSelect from './BoSelect.svelte';

  export let teams: Team[];
  export let bos: BestOf[];

  const dispatch = createEventDispatcher<{ scoreUpdate: typeof $currentMatch }>();
  $: {
    dispatch('scoreUpdate', $currentMatch);
  }

  let loading = false;

  let localTitle = $currentMatch.gameTitle;
  let localBo = $currentMatch.bestOfId;

  let error = '';
</script>

{#if !error}
  <div class="flex flex-col text-center w-fit pl-5">
    <Tabs>
      <TabItem open title="Scores">
        <div>
          <ScorePlus
            score={$currentMatch.team1Score}
            isLoading={loading}
            on:scoreUpdate={(e) => ($currentMatch.team1Score = e.detail)}
            ><p class="text-green-400">Team1 Score</p></ScorePlus
          >
          <TeamSelect
            {teams}
            selectedTeam={$currentMatch.team1Id}
            on:teamUpdate={(e) => ($currentMatch.team1Id = e.detail)}
            class="mt-5 max-w-12"
          />
        </div>
        <div class="mt-5">
          <ScorePlus
            score={$currentMatch.team2Score}
            isLoading={loading}
            on:scoreUpdate={(e) => ($currentMatch.team2Score = e.detail)}
            ><p class="text-blue-700">Team2 Score</p></ScorePlus
          >
          <TeamSelect
            {teams}
            selectedTeam={$currentMatch.team2Id}
            on:teamUpdate={(e) => ($currentMatch.team2Id = e.detail)}
            ss="mt-5"
          />
        </div>
      </TabItem>
      <TabItem title="Game format">
        <div class="mt-5">
          <p class="text-red-400">BO Format</p>
          <BoSelect
            {bos}
            bind:selectedBo={localBo}
            class="mt-5"
          />
        </div>
        <div class="mt-5">
          <p class="text-red-400">Game title</p>
          <Input type="text" bind:value={localTitle} class="mt-5" />
        </div>
        <div class="mt-5">
          <Button on:click={() => {$currentMatch.gameTitle = localTitle; $currentMatch.bestOfId = localBo;}}>Change</Button>
        </div>
      </TabItem>
    </Tabs>
  </div>
{:else}
  <p>{error}</p>
{/if}
