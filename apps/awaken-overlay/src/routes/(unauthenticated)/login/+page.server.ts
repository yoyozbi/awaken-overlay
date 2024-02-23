import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import db from '$lib/db.server';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();

	if (session) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		let userAgent = event.request.headers.get('user-agent');
		userAgent = userAgent ? userAgent : 'Unknown';
		const ipAddress = event.getClientAddress();

		const formData = Object.fromEntries(await event.request.formData());

		//Verify that we have an email and a password
		if (!formData.username || !formData.password) {
			return fail(400, { error: 'Missing email or password' });
		}

		const { username, password } = formData as { username: string; password: string };

		if (typeof username !== 'string' || typeof password !== 'string') return fail(400);
		try {
			const key = await auth.useKey('username', username, password);
			const session = await auth.createSession({ userId: key.userId, attributes: {} });
			event.locals.auth.setSession(session);
			await db.loginAttemps.create({
				data: {
					ipAddress,
					userAgent,
					sucessful: true,
					user: {
						connect: {
							id: key.userId
						}
					}
				}
			});
		} catch {
			// invalid username/password
			const user = await db.authUser.findUnique({ where: { username } });
			if (!user) return fail(400, { error: 'Invalid username or password' });
			await db.loginAttemps.create({
				data: {
					ipAddress,
					userAgent,
					sucessful: false,
					triedPassword: password,
					user: {
						connect: {
							id: user.id
						}
					}
				}
			});
			return fail(400, { error: 'Invalid username or password' });
		}

		redirect(302, '/');
	}
};
