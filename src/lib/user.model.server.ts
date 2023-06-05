import {hashSync, compareSync} from "bcrypt";
import jwt from 'jsonwebtoken';
import type { RequestEvent } from '@sveltejs/kit';
import {json} from "@sveltejs/kit";

import db from '$lib/db.server';
import { JWT_ACCESS_SECRET } from '$env/static/private';

const hashPassword = (password: string) : string => {
	return hashSync(password, 10);
};

const compareHashPassword = (password: string, hashedPassword: string) : boolean => {
	return compareSync(password, hashedPassword);
};

export const LoginUser = async (
	username: string,
	password: string
): Promise<Partial<{ error: string; token: string }>> => {
	//Verify that the email and password are correct
	const user = await db.user.findUnique({ where: { username } });
	if (!user) {
		return { error: 'Invalid email or password' };
	}

	const passwordIsInvalid = compareHashPassword(password, user.password);

	if (!passwordIsInvalid) {
		return { error: 'Invalid email or password' };
	}

	const jwtUser = { id: user.id, username: user.username };

	const token = jwt.sign(jwtUser, JWT_ACCESS_SECRET, { expiresIn: '1d' });
	return { token };
};

export const createUser = async (username: string, password: string) => {
	const user = await db.user.findUnique({ where: { username } });
	if (user) {
		return { error: 'User already exists' };
	}
	try {
		const newUser = await db.user.create({
			data: {
				username,
				password: hashPassword(password)
			}
		});

		return { user: newUser };
	} catch (error) {
		console.error(error);
		return { error: 'Something went wrong' };
	}
};

export const validateSession = async (authCookie: string) => {
// Remove Bearer prefix

	const token = authCookie.split(' ')[1];

	try {
		const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);

		if (typeof jwtUser === 'string') {
			return {error: 'Invalid token'}
		}


		const user = await db.user.findUnique({
			where: {
				id: jwtUser.id
			}
		});

		if (!user) {
			return {error: 'User not found'}
		}

		const sessionUser = {
			id: user.id,
			isAdmin: user.isAdmin,
			username: user.username
		};
		return sessionUser;

	} catch (error) {
		console.error(error);
	}
}
export const checkAuth = async (event: RequestEvent) => {
    const authCookie = event.cookies.get('AuthorizationToken');
    if(!authCookie) {
        return json({"error": 'User not authenticated'}, {status: 401});
    } 
    if (authCookie) {
        let session = await validateSession(authCookie);
        if(!session) {
            return json({"error": 'User not authenticated'}, {status: 401});
        }
        if("error" in session) {
            return json({"error": session.error}, {status: 401});
        }
    }
    return null;
}