import db from '$lib/db.server';
import type { Prisma } from '@prisma/client';
import type { CurrentMatch } from '@prisma/client';
type changeFields<T, R> = Omit<T, keyof R> & R;

export type CurrentMatchWithTeamsAndDate = Prisma.CurrentMatchGetPayload<{
	include: { team1: true; team2: true };
}>;

export type CurrentMatchWithTeams = changeFields<
	Omit<CurrentMatchWithTeamsAndDate, 'createdAt' | 'updatedAt'>,
	{
		team1: Omit<CurrentMatchWithTeamsAndDate['team1'], 'createdAt' | 'updatedAt'>;
		team2: Omit<CurrentMatchWithTeamsAndDate['team2'], 'createdAt' | 'updatedAt'>;
	}
>;

export const getCurrentMatch = async (): Promise<CurrentMatchWithTeams> => {
	const currentMatch = await db.currentMatch.findFirst({ include: { team1: true, team2: true } });
	if (!currentMatch) throw new Error('No current match please create at least one');
	return currentMatch;
};
export const updateMatchScore = async (
	id: string,
	team1Score: number,
	team2Score: number
): Promise<CurrentMatch> => {
	return await db.currentMatch.update({
		where: {
			id
		},
		data: {
			team1Score,
			team2Score
		}
	});
};
export const updateMatchTeams = async (
	id: string,
	team1Id: string,
	team2Id: string
): Promise<CurrentMatchWithTeams> => {
	return await db.currentMatch.update({
		where: {
			id
		},
		data: {
			team1: {
				connect: {
					id: team1Id
				}
			},
			team2: {
				connect: {
					id: team2Id
				}
			}
		},
		include: {
			team1: true,
			team2: true
		}
	});
};
export const updateMatch = async (
	id: string,
	team1Id: string,
	team2Id: string,
	team1Score: number,
	team2Score: number
): Promise<CurrentMatchWithTeams> => {
	return await db.currentMatch.update({
		where: {
			id
		},
		data: {
			team1: {
				connect: {
					id: team1Id
				}
			},
			team2: {
				connect: {
					id: team2Id
				}
			},
			team1Score,
			team2Score
		},
		include: {
			team1: true,
			team2: true
		}
	});
};
