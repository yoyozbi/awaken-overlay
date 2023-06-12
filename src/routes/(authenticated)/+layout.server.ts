import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = (event) => {
	const user = event.locals.user;
	if (!user) {
		throw redirect(301, '/login');
	}
	return {
		user,
		displayNav: !event.request.url.includes('?navbar=false')
	};
};
