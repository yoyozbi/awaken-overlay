import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {

	if (!event.locals.user) {
		redirect(301, '/login');
	}
	return {
		user: event.locals.user,
		displayNav: !event.request.url.includes('?navbar=false')
	};
};
