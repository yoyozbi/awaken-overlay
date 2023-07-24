<script lang="ts">
	import UserForm from '$lib/components/UserForm.svelte';
	import type { ActionData } from './$types';
	export let action: ActionData;
</script>

<UserForm data={undefined} errors={action} />
