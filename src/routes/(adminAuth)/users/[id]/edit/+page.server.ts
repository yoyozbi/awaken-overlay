import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';
import { type ObjectSchema, object, string, ValidationError } from 'yup';

export const load = (async ({ params }) => {
	const { id } = params;
	if (!id) {
		throw error(404, 'missing id');
	}

	const user = await auth.getUser(id);
	if (!user) {
		throw error(404, 'Not found');
	}
	return {
		user
	};
}) satisfies PageServerLoad;

type userUpdate = {
	username: string;
	isAdmin?: string;
	password?: string;
};
const userUpdateSchema: ObjectSchema<userUpdate> = object({
	username: string().required(),
	isAdmin: string().optional(),
	password: string().optional()
});

export const actions: Actions = {
	default: async (event) => {
		const { id } = event.params;
		if (!id) {
			throw error(404, 'missing id');
		}

		const formData = Object.fromEntries(await event.request.formData());
		let data: userUpdate;

		try {
			data = await userUpdateSchema.validate(formData);
		} catch (e) {
			if (e instanceof ValidationError) {
				if (e.errors.length > 0) {
					return fail(400, { error: e.errors.join(', ') });
				}
				return fail(400, { error: 'Unknown data error' });
			}
			return fail(400, { error: 'Unknwon error' });
		}

		let isAdmin = false;
		if ('isAdmin' in data) isAdmin = true;

		try {
			const { user } = await event.locals.auth.validateUser();
			if (!user) return fail(400, { error: 'Not logged in' });
			await auth.updateUserAttributes(id, { username: data.username, isAdmin });
			if (data.password) auth.updateKeyPassword('username', data.username, data.password);
		} catch (e) {
			return fail(400, { error: e });
		}
		throw redirect(301, `/admin/`);
	}
} satisfies Actions;
