import type { Handle } from '@sveltejs/kit';
import { lucia } from "$lib/server/lucia"
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from 'trpc-sveltekit/websocket';
import { building } from '$app/environment';

if (!building) createTRPCWebSocketServer({ router, createContext });

export const handle: Handle = async ({ event, resolve }) => {

	event.locals.auth = lucia.handleRequest(event);
	return await resolve(event);
};
