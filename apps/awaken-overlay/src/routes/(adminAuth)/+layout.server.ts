import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await event.locals.auth.validateUser();
	if (!user || !user.isAdmin) {
		throw redirect(302, '/login');
	}
	return {
		user
	};
};
