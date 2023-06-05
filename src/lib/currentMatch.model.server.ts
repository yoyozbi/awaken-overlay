import db from '$lib/db.server';
import type {Prisma} from "@prisma/client";
import type {CurrentMatch} from "@prisma/client";

export const getCurrentMatch = async () : Promise<Prisma.CurrentMatchGetPayload<{include: {team1: true, team2: true}}>> => {

    const currentMatch=  await db.currentMatch.findFirst({include: {team1: true, team2: true}});
    if(!currentMatch)
        throw new Error("No current match please create at least one");
    return currentMatch;
}
export const updateMatchScore = async (id: string,team1Score: number, team2Score: number) : Promise<CurrentMatch> => {
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
export const updateMatchTeams = async (id: string, team1Id: string, team2Id: string) : Promise<Prisma.CurrentMatchGetPayload<{include: {team1: true, team2: true}}>> => {
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