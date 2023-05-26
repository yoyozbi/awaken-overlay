import type {RequestHandler} from "./$types";
import { getCurrentMatch } from "$lib/currentMatch.model.server";
export const GET = (async (event) => {
    
    return new Response(JSON.stringify(await getCurrentMatch()));
}) satisfies RequestHandler;