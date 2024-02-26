import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { lucia } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.user || !locals.session) {
		return fail(401);
	}
	await lucia.invalidateSession(locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: ".",
		...sessionCookie.attributes
	});
	redirect(302, "/login");

};
