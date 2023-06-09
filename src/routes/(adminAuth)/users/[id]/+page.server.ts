import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getUserById, updateUser } from '$lib/user.model.server';
import { type ObjectSchema, object, string, ValidationError } from 'yup';

export const load = (async ({ params }) => {
	const { id } = params;
	if (!id) {
		throw error(404, 'missing id');
	}

	const user = await getUserById(id);
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

		const res = await updateUser(id, data.username, isAdmin, data.password);
		if ('error' in res) {
			return fail(400, { error: res.error });
		}
		throw redirect(301, `/admin/`);
	}
} satisfies Actions;
