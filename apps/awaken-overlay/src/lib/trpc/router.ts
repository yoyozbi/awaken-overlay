// lib/trpc/router.ts
import type { Context } from '$lib/trpc/context';
import { observable } from '@trpc/server/observable';
import { initTRPC } from '@trpc/server';
import { type ObjectSchema, object, string, number } from 'yup';
import { EventEmitter } from 'events';
import {
	getCurrentMatch,
	type CurrentMatchWithTeams,
	updateMatch
} from '$lib/currentMatch.model.server';
import type { CurrentMatch } from '@prisma/client';

type currentMatchUpdate = Omit<CurrentMatch, 'createdAt' | 'updatedAt'>;
const currentMatchUpdateSchema: ObjectSchema<currentMatchUpdate> = object({
	id: string().required(),
	team1Id: string().required(),
	team2Id: string().required(),
	team1Score: number().required(),
	team2Score: number().required()
});

export const t = initTRPC.context<Context>().create();

const currentTeamUpdate = new EventEmitter();

export const router = t.router({
	greeting: t.procedure.query(async () => {
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	currentTeamUpdate: t.procedure.subscription(() => {
		return observable<CurrentMatchWithTeams>((emit) => {
			const onUpdate = (match: CurrentMatchWithTeams) => {
				emit.next(match);
			};

			currentTeamUpdate.on('update', onUpdate);

			return () => {
				currentTeamUpdate.off('update', onUpdate);
			};
		});
	}),
	updateCurrentMatch: t.procedure
		.input((input: unknown) => {
			if (typeof input !== 'object') throw new Error('Invalid input');
			try {
				const i = currentMatchUpdateSchema.validateSync(input);
				return i;
			} catch (e) {
				throw new Error('Invalid input');
			}
		})
		.mutation(async ({ input }) => {
			const i = input as unknown as currentMatchUpdate;
			const currentMatch = await getCurrentMatch();
			if (!currentMatch) return { error: 'No current match please create at least one' };
			const updatedMatch = await updateMatch(
				currentMatch.id,
				i.team1Id,
				i.team2Id,
				i.team1Score,
				i.team2Score
			);
			currentTeamUpdate.emit('update', updatedMatch);
			return updatedMatch;
		}),
	getCurrentMatch: t.procedure.query(async () => {
		return await getCurrentMatch();
	})
});

export type Router = typeof router;
