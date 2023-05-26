import type {Actions} from "./$types";
import {fail, error, redirect} from "@sveltejs/kit";
import {getTeamById, createTeam} from "$lib/team.model.server";
import type {Team} from "@prisma/client";

export const actions = {
    default: async (event) => {
        let formData = await event.request.formData();
        if(!formData) {
            return fail(400, {error: 'Missing form data'});
        }
        let { name, icon } = Object.fromEntries(formData.entries());
        if(!name) {
            return fail(400, {error: 'Missing name'});
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
            let team = await createTeam(name, all); 
            throw redirect(302,'/');
        }else {
            return fail(400, {error: 'Missing icon'})
        }
    }
} satisfies Actions;