import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/lucia';
import db from '$lib/db.server';
import { Argon2id } from 'oslo/password';

export const load: PageServerLoad = async (event) => {
  const session = event.locals.user;

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
      const existingUser = await db.authUser.findUniqueOrThrow({
        where: {
          username
        }
      });

      const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password);
	  if(!validPassword) {
		throw new Error("Invalid username or password");
	  }

      const session = await lucia.createSession(existingUser.id, {});
	  const sessionCookie = lucia.createSessionCookie(session.id);
	  event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	  });

      await db.loginAttemps.create({
        data: {
          ipAddress,
          userAgent,
          sucessful: true,
          user: {
            connect: {
              id: existingUser.id
            }
          }
        }
      });

    } catch {
      // invalid username/password
      const user = await db.authUser.findUnique({ where: { username } });
      if (user) {
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
      }
      return fail(400, { error: 'Invalid username or password' });
    }

    redirect(302, '/');
  }
};
