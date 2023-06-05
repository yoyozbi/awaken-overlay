import type {RequestHandler} from "./$types";
import {json} from "@sveltejs/kit";
import {updateMatchScore,getCurrentMatch } from "$lib/currentMatch.model.server";
import {checkAuth} from "$lib/user.model.server";


export const POST = (async(event) => {

    const authError = await checkAuth(event);
    if(authError) {
        return authError;
    }

    const data = await event.request.json();
    const currentMatch = await getCurrentMatch();
    let team1Score = currentMatch.team1Score;
    let team2Score = currentMatch.team2Score;
    if(!data) {
        return json({"error": "No data provided"});
    }
    if("team1Score" in data && typeof(data["team1Score"]) === "number") {
        team1Score = data["team1Score"];
    }
    if("team2Score" in data && typeof(data["team2Score"]) === "number") {
        team2Score = data["team2Score"];
    }
    const newData = await updateMatchScore(currentMatch.id, team1Score, team2Score);
    return json({"success": true, data: newData});
}) satisfies RequestHandler;