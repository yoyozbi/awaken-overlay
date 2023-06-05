import type { gameStore } from '$lib/stores/gameStore';

let webSocketEstablished = false;

let ws: WebSocket | null = null;

export const establishWebSocket = (game: typeof gameStore) => {
	if (webSocketEstablished) return;
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
	ws.addEventListener('open', (event) => {
		webSocketEstablished = true;
		console.log('[websocket] connection open', event);
	});
	ws.addEventListener('close', (event) => {
		console.log('[websocket] connection closed', event);
	});
	ws.addEventListener('message', (event) => {
		//console.log('[websocket] message received', event);
		try {
			const data = JSON.parse(event.data);
			console.log(`[websocket] received:`, data);
			if (data.type == 'currentMatch' || data.type == 'matchUpdate') {
				game.update((gameStore) => {
					gameStore.icons.team1 = data.data.team1.leftIcon;
					gameStore.serie.team1Score = data.data.team1Score;
					gameStore.icons.team2 = data.data.team2.rightIcon;
					gameStore.serie.team2Score = data.data.team2Score;
					return gameStore;
				});
			}
		} catch (e) {
			//console.log(e);
		}
	});
};
