import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	return {
		user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ locals }) => {
		const { session } = await locals.auth.validateUser();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
	}
} satisfies Actions;
