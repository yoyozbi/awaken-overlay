import { writable } from 'svelte/store';
import type { CurrentMatch } from '@prisma/client';
export const currentMatch = writable<CurrentMatch>({
	id: '',
	team1Id: '',
	team2Id: '',
	team1Score: 0,
	team2Score: 0,
	createdAt: new Date(),
	updatedAt: new Date()
});
