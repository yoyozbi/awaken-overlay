import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { updateMatchTeams, getCurrentMatch } from "$lib/currentMatch.model.server";
import { getTeamById } from "$lib/team.model.server";
import { checkAuth } from "$lib/user.model.server";

let regexUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export const POST = (async (event) => {
    const authError = await checkAuth(event);
    if (authError) {
        return authError;
    }

    const data = await event.request.json();

    let teams = ["team1Id", "team2Id"];
    for(let team of teams) {
        if(team in data && typeof(data[team]) !== "string" || team in data && data[team].match(regexUuid) === null) {
            return json({"error": `Invalid ${team}`});
        }
    }
    
    const team1 = await getTeamById(data["team1Id"]);
    const team2 = await getTeamById(data["team2Id"]);
    if(!team1) {
        return json({"error": "Team 1 not found"});
    }
    if(!team2) {
        return json({"error": "Team 2 not found"});
    }

    const currentMatch = await getCurrentMatch();

    const newData = await updateMatchTeams(currentMatch.id, team1.id, team2.id);

    return json({ "success": true, data: newData });
}) satisfies RequestHandler;