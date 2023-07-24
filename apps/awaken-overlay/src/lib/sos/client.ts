import type { Players } from '$lib/sos/types/Player.type';
import { object, string, type InferType, mixed } from 'yup';
import type { Game } from './types/Game.type';
const messageSchema = object({
	event: string().required(),
	data: mixed().required()
});

type Message = InferType<typeof messageSchema>;

interface Events {
	'game:update_state': (d: {
		event: 'gameState';
		game: Game;
		players: Players;
		hasGame: true;
		match_guid: string;
	}) => void;
}
interface Subscriber<T extends keyof Events> {
	callback: Events[T];
	once: boolean;
	event: T;
}
export class SosWebSocket {
	private socket: WebSocket;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private subscribers: Subscriber<any>[] = [];
	private isConnected: boolean;

	constructor(port = 49122) {
		this.isConnected = false;
		this.init(port);
	}
	private init(port: number) {
		this.socket = new WebSocket(`ws://localhost:${port}`);
		this.socket.onopen = () => {
			console.log('WebSocket Client Connected');
			this.isConnected = true;
		};
		this.socket.onclose = () => {
			this.isConnected = false;
			console.log('WebSocket Client Disconnected');
			console.log('Retrying connection in 1 second');
			const timeout = setTimeout(() => {
				if (this.isConnected) {
					clearTimeout(timeout);
					return;
				}
				this.init(port);
			}, 1000);
		};
		this.socket.onmessage = (e) => {
			try {
				const data = JSON.parse(e.data);
				const parsedData = messageSchema.validateSync(data);
				this.handleMessage(parsedData);
			} catch (error) {
				console.error(error);
			}
		};
	}

	private handleMessage(e: Message) {
		this.subscribers.forEach((subscriber) => {
			if (subscriber.event === e.event) {
				subscriber.callback(e.data);
				if (subscriber.once) {
					this.subscribers = this.subscribers.filter((s) => s !== subscriber);
				}
			}
		});
	}

	public subscribe<T extends keyof Events>(event: T, callback: Events[T], once = false) {
		this.subscribers.push({ event, callback, once });
	}
}
