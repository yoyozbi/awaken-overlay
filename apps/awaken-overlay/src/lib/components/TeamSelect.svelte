<script lang="ts">
  import { Select } from 'flowbite-svelte';
  import type { Team } from '@prisma/client';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    teamUpdate: string;
  }>();

  export let teams: Team[];
  export let selectedTeam: string;

  let formatedTeams = teams.map((team) => {
    return {
      value: team.id,
      name: team.name
    };
  });
</script>

<Select
  class={`dark:text-white dark:focus:border-white dark:focus:bg-black ${$$props.class}`}
  items={formatedTeams}
  bind:value={selectedTeam}
  on:change={(e) => dispatch('teamUpdate', selectedTeam)}
  underline
/>
