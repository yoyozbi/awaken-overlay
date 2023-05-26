<script lang="ts">
	import type { PageServerData, ActionData } from "./$types";
    import {user} from "$lib/stores/userStore";
    import {Select, Label, Tabs, TabItem, Input, Button, Alert} from "flowbite-svelte";
    import {page} from "$app/stores";
	import TeamsTable from "$lib/components/teamsTable.svelte";
	import { slide } from "svelte/transition";

    export let data: PageServerData;
    export let form : ActionData;

    $: selectData = data.teams.map((team) => {
            return {
                name: team.name,
                value: team.id
            }
        })


    $: {
        if(form?.success && form?.newData) {
            if("currentMatch" in form.newData)
            {
                data.currentMatch = form.newData.currentMatch;
            }else if ("teams" in form.newData){
                data.teams = form.newData.teams;
            }
        }
        
    }
    $:team1Score = data.currentMatch?.team1Score;
    $:team2Score = data.currentMatch?.team2Score;
    let team1Id = data.currentMatch?.team1Id || "";
    let team2Id = data.currentMatch?.team2Id || "";
    
    $: currentTab = $page.url.searchParams.get("/updateTeams")  === ""? "updateTeams" : $page.url.searchParams.get("/updateScore")  === ""? "updateScore" : "teamsList";


</script>

<Tabs>
    <TabItem open={currentTab == "updateScore"} title="Update score">
        <form action="?/updateScore" method="post">
            <Label>Team1 Score
                <Input type="number" name="team1Score" value={team1Score}/>
            </Label>
            <Label>Team2 Score
                <Input type="number" name="team2Score" value={team2Score}/>
            </Label>
            {#if form && "error" in form && currentTab == "updateScore"}
                <Alert color="red">
                    {form.error}
                </Alert>
            {:else if form?.success && currentTab == "updateScore"}
                <Alert color="green">
                    Updated score successfully
                </Alert>
            {/if}
            <Button type="submit" >Update Score</Button>
        </form>
    </TabItem> 
    <TabItem open={currentTab == "updateTeams"} title="Update teams">
        <form action="?/updateTeams" method="post">
            <Label>Team1
                <Select label="Team1" name="team1" items={selectData} bind:value={team1Id}/>
            </Label>
            <Label>Team2
                <Select label="Team2" name="team2" items={selectData} bind:value={team2Id}/>
            </Label>
            {#if form && "error" in form && currentTab == "updateTeams"}
                <Alert color="red">
                    {form.error}
                </Alert>
            {:else if form?.success && currentTab == "updateTeams"}
                <Alert color="green">
                    Updated teams successfully
                </Alert>
            {/if}
            <Button type="submit" >Update Teams</Button>
        </form>
    </TabItem>
    <TabItem title="Teams list" open={currentTab == "teamsList"}>
        <TeamsTable teams={data.teams}/>
        {#if form?.success && currentTab == "teamsList"}
            <Alert color="green">
               Successfully deleted the team 
            </Alert>
        {/if}
        <Button href="/teams/create">Create team</Button>
    </TabItem>
</Tabs>