import { JWT_ACCESS_SECRET, NODE_ENV } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';
import { LoginUser } from '$lib/user.model.server';
import {fail, redirect} from "@sveltejs/kit";


export const load: PageServerLoad = (event) => {
	const user = event.locals.user;

	if(user) {
		throw redirect(302, '/')
	}
}

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		//Verify that we have an email and a password
		if (!formData.username || !formData.password) {
			return fail(400, {error: 'Missing email or password'});
		}

		const {username, password} = formData as {username: string, password: string};

		const {token, error} = await LoginUser(username, password);
		if(error) {
			return fail(400, {error});
		}

				
		event.cookies.set("AuthorizationToken", `Bearer ${token}`, {
			httpOnly: true,
			path: "/",
			secure: NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 24, // 1 day
		});

		throw redirect(302, '/')

	}
};
