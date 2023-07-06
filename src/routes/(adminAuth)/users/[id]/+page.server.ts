import { auth } from '$lib/server/lucia';
import db from '$lib/db.server';
import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { id } = params;
	if (!id) {
		throw error(404, 'missing id');
	}
	const user = await auth.getUser(id);
	if (!user) {
		throw error(404, 'Not found');
	}
	const loginAttempts = await db.loginAttemps.findMany({ where: { user: { id } } });
	return {
		user,
		loginAttempts
	};
}) satisfies PageServerLoad;
