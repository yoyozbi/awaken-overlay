import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { Team } from '@prisma/client';
import { getCurrentMatch, updateMatch } from '$lib/currentMatch.model.server';
import { getTeamById } from '$lib/team.model.server';
import { checkAuth } from '$lib/user.model.server';

let regexUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export const POST = (async (event) => {
	const authError = await checkAuth(event);
	if (authError) {
		return authError;
	}
	const data = await event.request.json();
	console.log(data);
	if (!data) {
		return json({ error: 'No data provided' }, { status: 400 });
	}
	if (
		!('team1Score' in data) ||
		('team1Score' in data && typeof data['team1Score'] != 'number') ||
		data['team1Score'] < 0
	) {
		return json({ error: 'Invalid team1Score' }, { status: 400 });
	}
	if (
		!('team2Score' in data) ||
		('team2Score' in data && typeof data['team2Score'] != 'number') ||
		data['team2Score'] < 0
	) {
		return json({ error: 'Invalid team2Score' }, { status: 400 });
	}

	let teams = ['team1Id', 'team2Id'];
	for (let team of teams) {
		if (
			(team in data && typeof data[team] !== 'string') ||
			(team in data && data[team].match(regexUuid) === null)
		) {
			return json({ error: `Invalid ${team}` }, { status: 400 });
		}
	}
	const team1 = await getTeamById(data['team1Id']);
	const team2 = await getTeamById(data['team2Id']);
	if (!team1) {
		return json({ error: 'Team 1 not found' }, { status: 400 });
	}
	if (!team2) {
		return json({ error: 'Team 2 not found' }, { status: 400 });
	}
	const currentMatch = await getCurrentMatch();

	const newData = await updateMatch(
		currentMatch.id,
		team1.id,
		team2.id,
		data['team1Score'],
		data['team2Score']
	);
	event.locals.wss?.clients.forEach((client) => {
		client.send(JSON.stringify({ type: 'matchUpdate', data: newData }));
	});
	return json({ success: true, data: newData });
}) satisfies RequestHandler;
