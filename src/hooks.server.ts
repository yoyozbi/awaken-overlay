import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/user.model.server';
import { JWT_ACCESS_SECRET } from '$env/static/private';
import { getCurrentMatch } from '$lib/currentMatch.model.server';
import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/webSocketUtils';
import type { ExtendedGlobal } from '$lib/server/webSocketUtils';

// This can be extracted into a separate file
let wssInitialized = false;
const startupWebsocketServer = () => {
	if (wssInitialized) return;
	console.log('[wss:kit] setup');
	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
	if (wss !== undefined) {
		wss.on('connection', async (ws, request) => {
			// This is where you can authenticate the client from the request
			// const session = await getSessionFromCookie(request.headers.cookie || '');
			/*const session = validateSession(request.headers.cookie || '');
			if("error" in session && typeof session.error === 'string') {
				ws.close(1008, session.error);
				return;
			}*/
			// if (!session) ws.close(1008, 'User not authenticated');
			// ws.userId = session.userId;
			console.log(`[wss:kit] client connected (${ws.socketId})`);
			ws.send(JSON.stringify({type: "welcome", data: `Hello from SvelteKit ${new Date().toLocaleString()} (${ws.socketId})]`}));
			ws.send(JSON.stringify({ type: 'currentMatch', data: await getCurrentMatch() }));

			ws.on('close', () => {
				console.log(`[wss:kit] client disconnected (${ws.socketId})`);
			});
		});
		wssInitialized = true;
	}
};


export const handle: Handle = async ({ event, resolve }) => {
	const authCookie = event.cookies.get('AuthorizationToken');

	if (authCookie) {
		let session = await validateSession(authCookie);
		if(!session) {
			throw new Error('User not authenticated');
		}
		if("error" in session) {
			throw new Error(session.error);
		}
		
		event.locals.user = session;
	}
	startupWebsocketServer();
	// Skip WebSocket server when pre-rendering pages
	if (!building) {
		const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
		if (wss !== undefined) {
			event.locals.wss = wss;
		}
	}
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type'
	});
	return response;
};
