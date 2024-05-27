import { Lucia, TimeSpan, generateId } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import db from '../db.server';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import { Argon2id } from "oslo/password";

const adapter = new PrismaAdapter(db.authSession, db.authUser);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes: DatabaseUserAttributes) => {
		return {
			username: attributes.username,
			isAdmin: attributes.isAdmin,
			createdAt: attributes.createdAt,
			updatedAt: attributes.updatedAt
		}
	},
	sessionExpiresIn: new TimeSpan(20, "w"),
	sessionCookie: {
		expires: false,
		name: "user_sesion",
		attributes: {
			sameSite: "strict",
			secure: env.NODE_ENV === "production"
		}
	}
});

export async function createUser(username: string, password: string, isAdmin = false) {
	const userId = generateId(15);
	const hashedPassword = await new Argon2id().hash(password);

	const user = await db.authUser.create({
		data: {
			id: userId,
			username,
			hashedPassword,
			isAdmin
		}
	});

	return user;
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;

}

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
		await createUser("admin", env.ADMIN_PASSWORD, true);
	} catch (e) {
		console.error('unable to create admin user', e);
	}
}
seedAdminUser();
export type Auth = typeof lucia;
