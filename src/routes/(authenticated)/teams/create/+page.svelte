<script lang="ts">
    import type {ActionData} from "./$types";
    import TeamForm from "$lib/components/teamForm.svelte";
    export let form : ActionData;
    let data = {name: "", icon: ""};
</script>

<TeamForm data={data} form={form} />

