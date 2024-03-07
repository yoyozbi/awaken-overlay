import { writable } from 'svelte/store';

export const gameStore = writable<{
	game: { team1Score: number; team2Score: number; timeLeft: number, title: string };
	icons: { team1: string; team2: string };
	serie: { team1Score: number; team2Score: number, nbOfMatch: number };
}>({
	game: { team1Score: 0, team2Score: 0, timeLeft: 300, title: '' },
	icons: { team1: '', team2: '' },
	serie: { team1Score: 0, team2Score: 0, nbOfMatch: 3 }
});
