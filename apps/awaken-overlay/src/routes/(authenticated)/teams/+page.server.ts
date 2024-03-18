import type { PageServerLoad } from './$types';
import { getTeams } from '$lib/team.model.server';

import type { Team } from '@prisma/client';

export const load = (async () => {
	return {
		teams: await getTeams(),
	} satisfies { teams: Team[] };
}) satisfies PageServerLoad;
