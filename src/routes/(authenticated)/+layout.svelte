<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;
</script>

<div class=" dark:bg-slate-900 min-w-screen min-h-screen">
	{#if data.displayNav}
		<Navbar />
		<div class="mt-4">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</div>
