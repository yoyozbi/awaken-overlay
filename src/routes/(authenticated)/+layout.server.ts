import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await event.locals.auth.validateUser();

	if (!user) {
		throw redirect(301, '/login');
	}
	return {
		user,
		displayNav: !event.request.url.includes('?navbar=false')
	};
};
