import {type Handle, sequence } from '@sveltejs/kit';
import { validateSession } from '$lib/user.model.server';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from 'trpc-sveltekit/websocket';
import { building } from '$app/environment';
import {SvelteKitAuth} from "@auth/sveltekit";
import Credentials from "@auth/core/providers/credentials"

if (!building) createTRPCWebSocketServer({ router, createContext });

export const handle: Handle = async ({ event, resolve }) => {
	const authCookie = event.cookies.get('AuthorizationToken');

	if (authCookie) {
		const session = await validateSession(authCookie);
		if (!session) {
			throw new Error('User not authenticated');
		}
		if ('error' in session) {
			throw new Error(session.error);
		}

		event.locals.user = session;
	}
	return resolve(event);
};

export const handle = 
