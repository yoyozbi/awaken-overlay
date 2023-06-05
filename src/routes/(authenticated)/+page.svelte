<script lang="ts">
	import type { PageServerData, ActionData } from "./$types";
    import ScoreUpdate from "$lib/components/scoreUpdate.svelte"
    import {user} from "$lib/stores/userStore";
    import {Select, Label, Tabs, TabItem, Input, Button, Alert} from "flowbite-svelte";
    import {page} from "$app/stores";
	import TeamsTable from "$lib/components/teamsTable.svelte";
	import { slide } from "svelte/transition";

    export let data: PageServerData;
    export let form : ActionData;

    
    let team1Id = data.currentMatch?.team1Id || "";
    let team2Id = data.currentMatch?.team2Id || "";
    


</script>
<div>        
    <ScoreUpdate />

</div>