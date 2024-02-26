import type { PageServerLoad, Actions } from './$types';
import { getTeams } from '$lib/team.model.server';
import { object, string, type InferType } from 'yup';
import { fail } from '@sveltejs/kit';
import db from '$lib/db.server';

export const load = (async () => {
	const teams = await getTeams();
	const users = await db.authUser.findMany();
	return {
		teams,
		users
	};
}) satisfies PageServerLoad;

const deleteUserSchema = object({
	userId: string().required()
});
type deleteUser = InferType<typeof deleteUserSchema>;
export const actions = {
	deleteUser: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		let data: deleteUser;
		try {
			data = await deleteUserSchema.validate(formData);
		} catch (e) {
			return fail(400, { error: 'Missing userId' });
		}

		await db.authUser.delete({
			where: {
				id: data.userId
			}
		});
	}
} satisfies Actions;
