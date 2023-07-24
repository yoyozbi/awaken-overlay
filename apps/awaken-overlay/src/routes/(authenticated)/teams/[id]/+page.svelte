<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { Input, Button, Label, Fileupload, Alert } from 'flowbite-svelte';
	import TeamForm from '$lib/components/TeamForm.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	$: {
		if (form && 'success' in form && form.success) {
			data.team = form?.newData;
		}
	}
</script>

<TeamForm data={data.team} {form} />
