import type { PageServerLoad } from './$types';
import { getTeams } from '$lib/team.model.server';

import type { BestOf, Team } from '@prisma/client';
import { getBos } from '$lib/bestof.model.server';

export const load = (async () => {
	return {
		teams: await getTeams(),
		bos: await getBos()
	} satisfies { teams: Team[], bos: BestOf[] };
}) satisfies PageServerLoad;
