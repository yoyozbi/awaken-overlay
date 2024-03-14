<script lang="ts">
  import TeamsTable from '$lib/components/TeamsTable.svelte';
  import type { PageServerData } from './$types';
  import { Button } from 'flowbite-svelte';

  export let data: PageServerData;
</script>

<div class="flex flex-col align-middle items-center">
  <div class="flex flex-row align-middle items-center">
    <h1 class="pb-5 pt-5 pr-o mr-1 dark:text-white text-3xl">Teams</h1>
    <Button href="/teams/create" class="dark:text-white h-1 w-1" color="blue" outline>New</Button>
  </div>
  <TeamsTable teams={data.teams} />
</div>
