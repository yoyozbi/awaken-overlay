import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth.validate();

	if (!session) {
		throw redirect(301, '/login');
	}
	return {
		user: session.user,
		displayNav: !event.request.url.includes('?navbar=false')
	};
};
