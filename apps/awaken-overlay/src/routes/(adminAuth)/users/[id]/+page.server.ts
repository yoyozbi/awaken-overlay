import { auth } from '$lib/server/lucia';
import db from '$lib/db.server';
import type { Actions, PageServerLoad } from './$types';

import { error, fail } from '@sveltejs/kit';
import { object, string, type ObjectSchema, ValidationError } from 'yup';

export const load = (async ({ params }) => {
	const { id } = params;
	if (!id) {
		error(404, 'missing id');
	}
	const user = await auth.getUser(id);
	if (!user) {
		error(404, 'Not found');
	}
	const loginAttempts = await db.loginAttemps.findMany({ where: { user: { id } } });
	return {
		user,
		loginAttempts
	};
}) satisfies PageServerLoad;

type userUpdate = {
	username: string;
	isAdmin?: string;
};
const userUpdateSchema: ObjectSchema<userUpdate> = object({
	username: string().required(),
	isAdmin: string().optional()
});

export const actions = {
	default: async ({ params, request, locals }) => {
		const { id } = params;
		if (!id) {
			error(404, 'missing id');
		}
		const local = await auth.getUser(id);
		if (!local) {
			error(404, 'Not found');
		}
		const formData = await request.formData();

		let data: userUpdate;

		try {
			data = await userUpdateSchema.validate(Object.fromEntries(formData));
		} catch (e) {
			if (e instanceof ValidationError) {
				if (e.errors.length > 0) {
					return fail(400, { error: e.errors.join(', ') });
				}
				return fail(400, { error: 'Unknown data error' });
			}
			return fail(400, { error: 'Unknown error' });
		}
		const isAdmin = data.isAdmin === 'true';

		const { user } = await locals.auth.validateUser();
		if (!user) return fail(400, { error: 'Not logged in' });
		const nData = await auth.updateUserAttributes(id, {
			username: data.username,
			isAdmin
		});

		return { data: nData };
	}
} satisfies Actions;
