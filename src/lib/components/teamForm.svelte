<script lang="ts">
    import {Label, Input, Button, Fileupload, Alert} from "flowbite-svelte";
    export let data:  {name: string, icon: string};
    export let form: {error: string, success: boolean, newData: {name: string, icon: string}};
</script>
<form method="POST" enctype="multipart/form-data">
    <Label>Name
        <Input type="text" name="name" value={data.name}/>
    </Label>
    <div class="grid grid-cols-2 gap-2 mt-4">
    <Label>Current Icon
        {#if data.icon}
            <img src={data.icon} alt="icon"/>
        {:else}
        <p>No icon</p>
        {/if}
    </Label>
    <Label>Change Icon
        <Fileupload name="icon" accept="image/*" />
    </Label>
    </div>
    {#if form?.error}
        <Alert type="error">{form.error}</Alert>
    {:else if form?.success}
        <Alert type="success">Team updated</Alert>
    {/if}
    <Button type="submit">Update</Button>
</form>