<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import type { LayoutServerData } from './$types';
	import '../app.postcss';
	import { setContext } from 'svelte';
	export let data: LayoutServerData;

	$: user.set({ ...data.user });
	setContext('user', user);
</script>

<slot />
