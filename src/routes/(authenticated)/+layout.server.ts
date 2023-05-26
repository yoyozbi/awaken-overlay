import type {LayoutServerLoad} from './$types';
import {fail, redirect} from "@sveltejs/kit";

export const load : LayoutServerLoad = (event) => {
    const user = event.locals.user;
    if(!user) {
       throw redirect(302, '/login');
    }
    return {
        user
    }
}