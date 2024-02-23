import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	return {
		user: session?.user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await lucia.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
	}
} satisfies Actions;
