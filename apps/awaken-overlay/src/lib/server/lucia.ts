import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import db from '../db.server';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

export const auth = lucia({
	adapter: prisma(db, {
		user: 'authUser',
		key: 'authKey',
		session: 'authSession'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	// transformDatabaseUser: (userData) => {
	// 	return {
	// 		userId: userData.id,
	// 		username: userData.username,
	// 		isAdmin: userData.isAdmin,
	// 		createdAt: userData.createdAt,
	// 		updatedAt: userData.updatedAt
	// 	};
	// }
	getUserAttributes: (data) => {
		return {
			username: data.username,
			isAdmin: data.isAdmin,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt
		}
	},
	csrfProtection: true,
	sessionCookie: {
		name: "user_sesion",
		attributes: {
			sameSite: "strict"
		}
	}
});
async function seedAdminUser() {
	if (!env.ADMIN_PASSWORD) {
		console.error('NO ADMIN PASSWORD SET YOU WILL NOT BE ABLE TO LOGIN');
		return;
	}
	if (building) return;
	const user = await db.authUser.findUnique({ where: { username: 'admin' } });
	if (user) return;
	console.log('Admin user not found creating it');
	try {
		await auth.createUser({
			key: {
				providerId: 'username',
				providerUserId: 'admin',
				password: env.ADMIN_PASSWORD
			},
			attributes: {
				isAdmin: true,
				username: 'admin',
				createdAt: new Date(Date.now()),
				updatedAt: new Date(Date.now())
			}
		});
	} catch (e) {
		console.error('unable to create admin user', e);
	}
}
seedAdminUser();
export type Auth = typeof auth;
