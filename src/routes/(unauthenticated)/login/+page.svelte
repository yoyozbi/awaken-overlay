<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Input, Button, Alert } from 'flowbite-svelte';

	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<div class="flex justify-center items-center w-screen h-screen bg-slate-800">
	<form method="POST" use:enhance>
		<Input type="text" id="username" name="username" placeholder="username" required />
		<Input
			class="mt-2"
			type="password"
			name="password"
			id="password"
			placeholder="password"
			required
		/>
		{#if form?.error}
			<Alert color="red">
				{form.error}
			</Alert>
		{/if}
		<div class="flex justify-center pt-2">
			<Button type="submit">Submit</Button>
		</div>
	</form>
</div>
