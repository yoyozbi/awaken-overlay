<script lang="ts">
  import { Input, Button, Tabs, TabItem } from 'flowbite-svelte';
  import TeamSelect from '$lib/components/TeamSelect.svelte';
  import ScorePlus from './ScorePlus.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { BestOf, CurrentMatch, Team } from '@prisma/client';
  import BoSelect from './BoSelect.svelte';

  export let teams: Team[];
  export let bos: BestOf[];
  export let localMatch: Omit<CurrentMatch, 'createdAt' | 'updatedAt'> = {
    id: '',
    team1Id: '',
    team2Id: '',
    team1Score: 0,
    team2Score: 0,
    bestOfId: '',
    gameTitle: ''
  };

  type LocalMatch = typeof localMatch;

  const dispatch = createEventDispatcher<{ scoreUpdate: LocalMatch }>();

  function changeElement<T extends keyof LocalMatch>(element: T, value: LocalMatch[T]) {
    localMatch[element] = value;
    dispatch('scoreUpdate', localMatch);
  }

  let loading = false;

  let error = '';
</script>

{#if !error}
  <div class="flex flex-col text-center w-fit pl-5">
    <Tabs>
      <TabItem open title="Scores">
        <div>
          <ScorePlus
            score={localMatch.team1Score}
            isLoading={loading}
            on:scoreUpdate={(e) => changeElement('team1Score', e.detail)}
            ><p class="text-green-400">Team1 Score</p></ScorePlus
          >
          <TeamSelect
            {teams}
            selectedTeam={localMatch.team1Id}
            on:teamUpdate={(e) => changeElement('team1Id', e.detail)}
            class="mt-5 max-w-12"
          />
        </div>
        <div class="mt-5">
          <ScorePlus
            score={localMatch.team2Score}
            isLoading={loading}
            on:scoreUpdate={(e) => changeElement('team2Score', e.detail)}
            ><p class="text-blue-700">Team2 Score</p></ScorePlus
          >
          <TeamSelect
            {teams}
            selectedTeam={localMatch.team2Id}
            on:teamUpdate={(e) => changeElement('team2Id', e.detail)}
            ss="mt-5"
          />
        </div>
      </TabItem>
      <TabItem title="Game format">
        <div class="mt-5">
          <p class="text-red-400">BO Format</p>
          <BoSelect {bos} bind:selectedBo={localMatch.bestOfId} class="mt-5" />
        </div>
        <div class="mt-5">
          <p class="text-red-400">Game title</p>
          <Input type="text" bind:value={localMatch.gameTitle} class="mt-5" />
        </div>
        <div class="mt-5">
          <Button
            on:click={() => {
              dispatch('scoreUpdate', localMatch);
            }}>Change</Button
          >
        </div>
      </TabItem>
    </Tabs>
  </div>
{:else}
  <p>{error}</p>
{/if}
