<script lang="ts">
	import type { ActionData } from './$types';
	import TeamForm from '$lib/components/TeamForm.svelte';
	export let form: ActionData;
	let data = { name: '', leftIcon: '', rightIcon: ''};
</script>

<TeamForm {data} {form} />
