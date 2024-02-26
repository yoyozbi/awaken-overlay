import type { Handle } from '@sveltejs/kit';
import { lucia } from "$lib/server/lucia"
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from 'trpc-sveltekit/websocket';
import { building } from '$app/environment';

if (!building) createTRPCWebSocketServer({ router, createContext });

export const handle: Handle = async ({ event, resolve }) => {

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;


	return resolve(event);
};
