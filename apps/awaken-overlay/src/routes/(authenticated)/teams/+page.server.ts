import type { PageServerLoad, Actions } from './$types';
import { getTeams } from '$lib/team.model.server';

import type { Team } from '@prisma/client';
import { object, string, type InferType } from 'yup';
import { fail } from '@sveltejs/kit';
import db from '$lib/db.server';

export const load = (async () => {
	return {
		teams: await getTeams(),
	} satisfies { teams: Team[] };
}) satisfies PageServerLoad;


const deleteTeamSchema = object({
	teamId: string().required()
});

type deleteTeam = InferType<typeof deleteTeamSchema>;

export const actions = {
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
