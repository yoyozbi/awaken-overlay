// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { ExtendedWebSocketServer } from '$lib/server/webSocketUtils';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: import('lucia').User | null;
			session?: import('lucia').Session | null;
			wss?: ExtendedWebSocketServer;
		}
		// interface PageData {}
		// interface Platform {}
	}
}
