import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth.validate();
	if (!session || !session.user.isAdmin) {
		throw redirect(302, '/login');
	}
	return {
		user: session.user
	};
};
