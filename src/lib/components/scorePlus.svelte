<script lang="ts">
	import { Spinner } from "flowbite-svelte";
    import {Button, ButtonGroup} from "flowbite-svelte";

    export let score : number;
    export let isLoading : boolean;
    export let teamUpdate : (toAdd: number) => void;
</script>
<div class={`text-center ${$$props.class}`}>
    <div>
        <slot></slot>
    </div> 
    <div>
        <p class="text-6xl">{score}</p>
    </div>
    <div>
        {#if !isLoading}
            <ButtonGroup>
                <Button pill color="red" on:click={() => teamUpdate(-1)}>-</Button>
                <Button pill color="green" on:click={() => teamUpdate(1)}>+</Button>
            </ButtonGroup>
        {:else}
            <Spinner />
        {/if}

    </div>
</div>