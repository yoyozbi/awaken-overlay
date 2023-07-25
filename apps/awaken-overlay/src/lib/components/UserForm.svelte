<script lang="ts">
	import { Checkbox, Input, Button, Label, Popover } from 'flowbite-svelte';
	export let data: { username: string; isAdmin: boolean } | undefined;
	export let errors: { error: string } | null;
	import { InformationCircle } from 'svelte-heros-v2';
</script>

<form method="POST">
	<Label>
		Username
		<Input type="text" name="username" placeholder="Username" value={data?.username} />
	</Label>
	<Label>
		<div>
			Password
			<div class="inline-flex self-center" id="p1"><InformationCircle class="w-4 h-4 top-1" /></div>
		</div>
		<Input type="password" name="password" placeholder="Password" />
	</Label>
	<Label
		>Admin
		<Checkbox name="isAdmin" label="Admin" checked={data?.isAdmin || false} />
	</Label>
	{#if errors}
		<p class="text-red-500">{errors.error}</p>
	{/if}
	{#if data}
		<Button type="submit">Update</Button>
	{:else}
		<Button type="submit">Create</Button>
	{/if}
</form>
<Popover triggeredBy="#p1">Will override the current password if set</Popover>
