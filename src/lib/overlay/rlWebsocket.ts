import type { gameStore } from '$lib/stores/gameStore';
import { get } from 'svelte/store';
class WsSubscribers {
	static webSocket: WebSocket;
	static webSocketConnected: boolean = false;
	static registerQueue: any[] = [];

	static init(port: number, debug: boolean, debugFilters: string[]) {
		port = port || 49122;
		WsSubscribers.webSocket = new WebSocket('ws://localhost:8080');
		WsSubscribers.webSocket.onmessage = function (event: MessageEvent) {
			const jEvent = JSON.parse(event.data);
			const channel = jEvent.channel;
			const event_event = jEvent.event;
			if (debug) {
				if (!debugFilters) {
					console.log(channel, event_event, jEvent);
				} else if (debugFilters && debugFilters.indexOf(jEvent.event) < 0) {
					console.log(channel, event_event, jEvent);
				}
			}
			WsSubscribers.triggerSubscribers(channel, event_event, jEvent.data);
		};
		WsSubscribers.webSocket.onopen = function () {
			WsSubscribers.triggerSubscribers('ws', 'open');
			WsSubscribers.webSocketConnected = true;
			WsSubscribers.registerQueue.forEach((r: any) => {
				WsSubscribers.send('wsRelay', 'register', r);
			});
			WsSubscribers.registerQueue = [];
		};
		WsSubscribers.webSocket.onerror = function () {
			WsSubscribers.triggerSubscribers('ws', 'error');
			WsSubscribers.webSocketConnected = false;
		};
		WsSubscribers.webSocket.onclose = function () {
			WsSubscribers.triggerSubscribers('ws', 'close');
			WsSubscribers.webSocketConnected = false;
		};
	}

	static addSubscriber(channels: string[], events: string[], callback: Function) {
		WsSubscribers.registerQueue.push({ channels, events, callback });
	}
	static clearSubscribers(channels: string, events: string) {
		WsSubscribers.registerQueue = WsSubscribers.registerQueue.filter((r: any) => {
			return r.channels.indexOf(channels) < 0 || r.events.indexOf(events) < 0;
		});
	}
	static subscribe(channels: string, events: string, callback: Function) {
		WsSubscribers.registerQueue.push({ channels: [channels], events: [events], callback });
	}

	static triggerSubscribers(channel: string, event: string, data?: any) {
		WsSubscribers.registerQueue.forEach((r: any) => {
			if (r.channels.indexOf(channel) >= 0 && r.events.indexOf(event) >= 0) {
				r.callback(data);
			}
		});
	}

	static send(channel: string, event: string, data: any) {
		const message = JSON.stringify({ channel, event, data });
		if (WsSubscribers.webSocketConnected) {
			WsSubscribers.webSocket.send(message);
		} else {
			WsSubscribers.registerQueue.push({ channels: [channel], events: [event], data });
		}
	}
}

const getState = (callback: Function) => {
	WsSubscribers.subscribe('game', 'update_state', (d: any) => {
		WsSubscribers.clearSubscribers('game', 'update_state');
		callback(d);
	});
};
const updateTeams = (game: typeof gameStore, d: any) => {
	game.update((gameStore) => {
		gameStore.game.team1Score = d['game']['teams'][0]['score'];
		gameStore.game.team2Score = d['game']['teams'][1]['score'];
		return gameStore;
	});
};

const updateTimer = (game: typeof gameStore, d: any) => {
	game.update((gameStore) => {
		gameStore.game.timeLeft = d['game']['time_seconds'];
		return gameStore;
	});
};

export const handleWs = (game: typeof gameStore) => {
	WsSubscribers.init(49122, false, []);
	getState((d: any) => {
		updateTeams(game, d);
	});
	WsSubscribers.subscribe('game', 'goal_scored', () => {
		getState((d: any) => {
			updateTeams(game, d);
		});
	});

	WsSubscribers.subscribe('game', 'clock_updated_seconds', (d: any) => {
		updateTimer(game, d);
	});
	WsSubscribers.subscribe('game', 'match_created', (d: any) => {
		getState((d: any) => {
			updateTimer(game, d);
			updateTeams(game, d);
		});
	});
};
