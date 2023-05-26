// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { ExtendedWebSocketServer } from "$lib/server/webSocketUtils";
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: string;
				username:string;
				isAdmin:boolean;
			},
			wss?: ExtendedWebSocketServer;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
