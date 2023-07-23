// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { ExtendedWebSocketServer } from '$lib/server/webSocketUtils';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia-auth').AuthRequest;
			wss?: ExtendedWebSocketServer;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type UserAttributes = {
			username: string;
			isAdmin: boolean;
			createdAt: Date;
			updatedAt: Date;
		};
	}
}

export {};
