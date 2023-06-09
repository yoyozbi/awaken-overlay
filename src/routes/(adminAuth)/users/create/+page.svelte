<script lang="ts">
	import UserForm from '$lib/components/userForm.svelte';
	import type { ActionData } from './$types';
	export let action: ActionData;
</script>

<UserForm data={undefined} errors={action} />
