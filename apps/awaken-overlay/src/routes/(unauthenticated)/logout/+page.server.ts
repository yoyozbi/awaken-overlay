import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.auth.validateUser();
	if (!session) return fail(401);
	await auth.invalidateSession(session.sessionId); // invalidate session
	locals.auth.setSession(null); // remove cookie
	return redirect(301, '/login');
};