import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prisma from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import db from '../db.server';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

export const auth = lucia({
  adapter: prisma(db),
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),
  transformDatabaseUser: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
      isAdmin: userData.isAdmin,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    };
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
      primaryKey: {
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
