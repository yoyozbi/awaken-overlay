import { writable } from 'svelte/store';
import type { CurrentMatch } from '@prisma/client';
export const currentMatch = writable<Omit<CurrentMatch, 'createdAt' | 'updatedAt'>>({
	id: '',
	team1Id: '',
	team2Id: '',
	team1Score: 0,
	team2Score: 0,
	gameTitle: '',
	bestOfId: ''
});
