<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Toast } from 'flowbite-svelte';
  export let error: string | undefined | null;
  export let success: string | undefined | null;
</script>

<div aria-live="polite" aria-atomic="true">
  <div class="absolute bottom-0 left-1/2 p-3">
    {#if error}
      <Toast transition={slide} role="alert" color="red">
        <svelte:fragment slot="icon">
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            /></svg
          >
          <span class="sr-only">Error icon</span>
        </svelte:fragment>
        {error}
      </Toast>
    {/if}
    {#if success}
      <Toast transition={slide} role="alert" color="green">
        <svelte:fragment slot="icon">
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            /></svg
          >
          <span class="sr-only">Check icon</span>
        </svelte:fragment>
        {success}
      </Toast>
    {/if}
  </div>
</div>
