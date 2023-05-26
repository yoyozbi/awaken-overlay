import db from '$lib/db.server';

export const getCurrentMatch = async () => {
    return await db.currentMatch.findFirst({include: {team1: true, team2: true}});
}
export const updateMatchScore = async (id: string,team1Score: number, team2Score: number) => {
    return await db.currentMatch.update({
        where: {
            id
        },
        data: {
            team1Score,
            team2Score
        }
    });
}
export const updateMatchTeams = async (id: string, team1Id: string, team2Id: string) => {
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
}