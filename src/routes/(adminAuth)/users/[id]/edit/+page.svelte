<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import UserForm from '$lib/components/userForm.svelte';

	export let data: PageServerData;
	export let action: ActionData;
</script>

<UserForm data={data.user} errors={action} />
