import db from '$lib/db.server';
import type { BestOf, Prisma } from '@prisma/client';
import type { CurrentMatch } from '@prisma/client';
type changeFields<T, R> = Omit<T, keyof R> & R;

export type CurrentMatchWithTeamsAndDate = Prisma.CurrentMatchGetPayload<{
  include: { team1: true; team2: true, bestOf: true };
}>;
type OmitDate<T> = Omit<T, 'createdAt' | 'updatedAt'>;

export type CurrentMatchWithTeams = changeFields<
  OmitDate<CurrentMatchWithTeamsAndDate>,
  {
    team1: OmitDate<CurrentMatchWithTeamsAndDate['team1']>;
    team2: OmitDate<CurrentMatchWithTeamsAndDate['team2']>;
    bestOf: OmitDate<BestOf>;
  }
>;

export const getCurrentMatch = async (): Promise<CurrentMatchWithTeams> => {
  const currentMatch = await db.currentMatch.findFirst({ include: { team1: true, team2: true, bestOf: true } });
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
  team2Id: string,
  bestOfId: string
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
      bestOf: {
        connect: {
          id: bestOfId
        }
      }
    },
    include: {
      team1: true,
      team2: true,
      bestOf: true
    }
  });
};
export const updateMatch = async (
  id: string,
  team1Id: string,
  team2Id: string,
  team1Score: number,
  team2Score: number,
  bestOfId: string,
  gameTitle: string
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
      team2Score,
      gameTitle,
      bestOf: {
        connect: {
          id: bestOfId
        }
      }
    },
    include: {
      team1: true,
      team2: true,
      bestOf: true
    }
  });
};
