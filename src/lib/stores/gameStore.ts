import { writable } from 'svelte/store';

export const gameStore = writable<{
	game: { team1Score: number; team2Score: number; timeLeft: number };
	icons: { team1: string; team2: string };
	serie: { team1Score: number; team2Score: number };
}>({
	game: { team1Score: 0, team2Score: 0, timeLeft: 300 },
	icons: { team1: '', team2: '' },
	serie: { team1Score: 0, team2Score: 0 }
});
