<script lang="ts">
	import { Select } from 'flowbite-svelte';
	import type { BestOf } from '@prisma/client';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		boUpdate: string;
	}>();

	export let bos: BestOf[];
	export let selectedBo: string;

	let formatedBos = bos.map((bo) => {
		return {
			value: bo.id,
			name: bo.name
		};
	});

	$: {
		dispatch('boUpdate', selectedBo);
	}
</script>

<Select
	class={`dark:text-white dark:focus:border-white dark:focus:bg-black ${$$props.class}`}
	items={formatedBos}
	bind:value={selectedBo}
	underline
/>