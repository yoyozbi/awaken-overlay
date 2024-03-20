<script lang="ts">
  import { Spinner } from 'flowbite-svelte';
  import { Button, ButtonGroup } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';

  export let score: number;
  export let isLoading: boolean;
  const dispatch = createEventDispatcher<{
    scoreUpdate: number;
  }>();
  function changeScore(operation: number) {
    if (score == 0 && operation < 1) return;

    score += operation;
    dispatch('scoreUpdate', score);
  }
</script>

<div class={`text-center ${$$props.class}`}>
  <div>
    <slot />
  </div>
  <div>
    <p class="text-6xl dark:text-white">{score}</p>
  </div>
  <div>
    {#if !isLoading}
      <ButtonGroup>
        <Button
          pill
          color="red"
          on:click={() => {
            changeScore(-1);
          }}>-</Button
        >
        <Button pill color="green" on:click={() => changeScore(1)}>+</Button>
      </ButtonGroup>
    {:else}
      <Spinner />
    {/if}
  </div>
</div>
