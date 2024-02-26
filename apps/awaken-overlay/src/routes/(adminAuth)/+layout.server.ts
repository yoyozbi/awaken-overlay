import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.user.isAdmin) {
		redirect(302, '/login');
	}
	return {
		user: event.locals.user
	};
};
