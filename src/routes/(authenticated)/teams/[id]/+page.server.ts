import { fail, error } from '@sveltejs/kit';
import type {Actions, PageServerLoad} from "./$types";
import {getTeamById, updateTeam} from "$lib/team.model.server";
import type { Team } from '@prisma/client';


export const load = (async ({ params }) => {
let { id } = params;
	if (!id) {
		throw error(400, 'missing id');
	}
	let team = await getTeamById(id);
	if (!team) {
		throw error(404, 'Not found');
	}
	return {
		team
	} satisfies { team: Team };
}) satisfies PageServerLoad;


export const actions = {
    default: async (event) => {
        let formData = await event.request.formData();
        if(!formData) {
            return fail(400, {error: 'Missing form data'});
        }
        let { name, icon } = Object.fromEntries(formData.entries());
        if(!name && !icon) {
            return fail(400, {error: 'You should at least change something!'});
        }
        if(typeof name !== 'string') {
            return fail(400, {error: 'Name is not a string'});
        }
        if(name.length > 50) {
            return fail(400, {error: 'Name is too long'});
        }
        if(icon && (icon instanceof File) && icon.size != 0) {
            let file = icon as File;
            let base64 = await file.arrayBuffer().then((buffer) => {
                return Buffer.from(buffer).toString('base64');
            });
            let all = `data:${file.type};base64,${base64}`;
            let team = await updateTeam(event.params.id, name, all); 
            if(!team) {
                return fail(404, {error: 'Not found'});
            }
            return {success: true, newData: team} 
        }else if(name) {
            let team = await updateTeam(event.params.id, name);
            if(!team) {
                return fail(404, {error: 'Not found'});
            }
            return {success: true, newData: team}
        }

    }
} satisfies Actions;