import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getTeams, deleteTeam } from '$lib/team.model.server';
import {
	getCurrentMatch,
	updateMatchScore,
	updateMatchTeams
} from '$lib/currentMatch.model.server';
import type { CurrentMatch, Team } from '@prisma/client';

export const load = (async (event) => {
	return {
		currentMatch: await getCurrentMatch(),
		teams: await getTeams()
	} satisfies { currentMatch: CurrentMatch | null; teams: Team[] };
}) satisfies PageServerLoad;

export const actions = {
	updateTeams: async (event) => {
		const match = await getCurrentMatch();
		if (!match) {
			return fail(400, { error: 'No current match' });
		}
		const formData = Object.fromEntries(await event.request.formData());
		if (!formData.team1 || !formData.team2) {
			return fail(400, { error: 'Missing team1 or team2' });
		}
		const { team1, team2 } = formData as { team1: string; team2: string };
		try {
			const newData = await updateMatchTeams(match.id, team1, team2);
			event.locals.wss?.clients.forEach((client) => {
				client.send(JSON.stringify({ type: 'updateTeams', data: newData }));
			});
			return { success: true, newData: { currentMatch: newData } };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Failed to update teams' });
		}
	},
	updateScore: async (event) => {
		const match = await getCurrentMatch();
		if (!match) {
			return fail(400, { error: 'No current match' });
		}
		const formData = Object.fromEntries(await event.request.formData());
		const { team1Score, team2Score } = formData as {
			team1Score: string;
			team2Score: string;
		};

		if (!team1Score || !team2Score) {
			return fail(400, { error: 'Missing team1Score or team2Score' });
		}

		try {
			const newData = await updateMatchScore(match.id, parseInt(team1Score), parseInt(team2Score));
			event.locals.wss?.clients.forEach((client) => {
				client.send(JSON.stringify({ type: 'updateScore', data: newData }));
			});
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Failed to update score' });
		}
		return { success: true };
	},
	deleteTeam: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		const { teamId } = formData as { teamId: string };
		if (!teamId) {
			return fail(400, { error: 'Missing teamId' });
		}
		try {
			await deleteTeam(teamId);
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Failed to delete team' });
		}
		const newData = await getTeams();
		return { success: true, newData: { teams: newData } };
	}
} satisfies Actions;
