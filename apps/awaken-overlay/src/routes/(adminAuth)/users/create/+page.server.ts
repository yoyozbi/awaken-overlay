import type { Actions } from './$types';
import { createUser } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { object, type ObjectSchema, string, ValidationError } from 'yup';

type createUserType = {
	username: string;
	password: string;
	isAdmin?: string;
};
const createUserSchema: ObjectSchema<createUserType> = object({
	username: string().required(),
	password: string().required(),
	isAdmin: string().optional()
});

export const actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		let data: createUserType;
		try {
			data = await createUserSchema.validate(formData);
		} catch (e) {
			if (e instanceof ValidationError) {
				if (e.errors.length > 0) {
					return fail(400, { error: e.errors.join(', ') });
				}
				return fail(400, { error: 'Unknown data error' });
			}
			return fail(400, { error: 'Unknown error' });
		}
		let isAdmin = false;
		if ('isAdmin' in data) isAdmin = true;
		try {
			await createUser(data.username, data.password, isAdmin);
		} catch (e) {
			return fail(400, { error: 'Unknown error when creating user' });
		}

		redirect(301, `/admin/`);
	}
} satisfies Actions;
