import type { PageServerLoad } from './$types';
import { getTeams } from '$lib/team.model.server';
import {
	getCurrentMatch,
	type CurrentMatchWithTeams
} from '$lib/currentMatch.model.server';
import type { BestOf, Team } from '@prisma/client';
import { getBos } from '$lib/bestof.model.server';

export const load = (async () => {
	return {
		currentMatch: await getCurrentMatch(),
		teams: await getTeams(),
		bos: await getBos() 
	} satisfies { currentMatch: CurrentMatchWithTeams; teams: Team[], bos: BestOf[] };
}) satisfies PageServerLoad;