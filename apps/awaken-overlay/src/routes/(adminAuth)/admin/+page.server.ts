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

const deleteTeamSchema = object({
	teamId: string().required()
});

type deleteUser = InferType<typeof deleteUserSchema>;
type deleteTeam = InferType<typeof deleteTeamSchema>;

export const actions = {
	deleteUser: async (event) => {
		if (!event.locals.user || !event.locals.user.isAdmin) {
			return fail(403, { error: 'Unauthorized' });
		}

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
	},
	deleteTeam: async (event) => {
		if (!event.locals.user || !event.locals.user.isAdmin) {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = Object.fromEntries(await event.request.formData());
		let data: deleteTeam;
		try {
			data = await deleteTeamSchema.validate(formData);
		} catch (e) {
			return fail(400, { error: 'Missing teamId' });
		}

		await db.team.delete({
			where: {
				id: data.teamId
			}
		});
	}
} satisfies Actions;
