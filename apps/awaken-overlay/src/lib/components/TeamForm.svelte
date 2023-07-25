<script lang="ts">
	import { Label, Input, Button, Fileupload, Alert } from 'flowbite-svelte';
	export let data: { name: string; leftIcon: string; rightIcon: string };
	export let form: {
		error: string;
		success: undefined;
		newData: { name: string; icon: string };
	} | null;
</script>

<form method="POST" enctype="multipart/form-data">
	<Label
		>Name
		<Input type="text" name="name" value={data.name} />
	</Label>
	<div class="grid grid-cols-2 gap-2 mt-4">
		<Label
			>Current Left Icon
			{#if data.leftIcon}
				<img src={data.leftIcon} alt="icon" />
			{:else}
				<p>No icon</p>
			{/if}
		</Label>
		<Label
			>Change Left Icon
			<Fileupload name="leftIcon" accept="image/*" />
		</Label>
	</div>
	<div class="grid grid-cols-2 gap-2 mt-4">
		<Label
			>Current Right Icon
			{#if data.rightIcon}
				<img src={data.rightIcon} alt="icon" />
			{:else}
				<p>No icon</p>
			{/if}
		</Label>
		<Label
			>Change Right Icon
			<Fileupload name="rightIcon" accept="image/*" />
		</Label>
	</div>
	{#if form?.error}
		<Alert type="error">{form.error}</Alert>
	{:else if form?.success}
		<Alert type="success">Team updated</Alert>
	{/if}
	<Button type="submit">Update</Button>
</form>
