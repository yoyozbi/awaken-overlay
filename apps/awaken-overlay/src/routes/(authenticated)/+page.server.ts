import type { PageServerLoad } from './$types';
import { getTeams } from '$lib/team.model.server';
import {
	getCurrentMatch,
	type CurrentMatchWithTeams
} from '$lib/currentMatch.model.server';
import type { Team } from '@prisma/client';

export const load = (async () => {
	return {
		currentMatch: await getCurrentMatch(),
		teams: await getTeams()
	} satisfies { currentMatch: CurrentMatchWithTeams; teams: Team[] };
}) satisfies PageServerLoad;