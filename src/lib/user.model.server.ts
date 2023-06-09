import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '$lib/db.server';
import { JWT_ACCESS_SECRET } from '$env/static/private';
import type { IncomingMessage } from 'http';
import type { User } from '@prisma/client';

const hashPassword = (password: string): string => {
	return hashSync(password, 10);
};

const compareHashPassword = (password: string, hashedPassword: string): boolean => {
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

export const createUser = async (username: string, password: string, isAdmin = false) => {
	const user = await db.user.findUnique({ where: { username } });
	if (user) {
		return { error: 'User already exists' };
	}
	try {
		const newUser = await db.user.create({
			data: {
				username,
				password: hashPassword(password),
				isAdmin
			}
		});

		return { user: newUser };
	} catch (error) {
		console.error(error);
		return { error: 'Something went wrong' };
	}
};

export const getUserById = async (userId: string) => {
	const user = await db.user.findUnique({ where: { id: userId } });
	return user;
};

export const checkSession = async (
	req: IncomingMessage
): Promise<{ id: string; isAdmin: boolean; username: string } | undefined> => {
	if (!req.headers.cookie) return;

	const cookies = req.headers.cookie.split(';');
	const authCookie = cookies.find((cookie) => cookie.includes('AuthorizationToken'));

	if (!authCookie) return;

	const token = decodeURIComponent(authCookie).split(' ')[1];
	const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);

	if (typeof jwtUser === 'string') return;

	const user = await db.user.findUnique({ where: { id: jwtUser.id } });
	if (!user) return;
	const sessionUser = {
		id: user.id,
		isAdmin: user.isAdmin,
		username: user.username
	};
	return sessionUser;
};

export const validateSession = async (authCookie: string) => {
	// Remove Bearer prefix
	const token = authCookie.split(' ')[1];

	try {
		const jwtUser = jwt.verify(token, JWT_ACCESS_SECRET);

		if (typeof jwtUser === 'string') {
			return { error: 'Invalid token' };
		}

		const user = await db.user.findUnique({
			where: {
				id: jwtUser.id
			}
		});

		if (!user) {
			return { error: 'User not found' };
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
};
export const getUsers = async () => {
	const users = await db.user.findMany();
	return users;
};
export const updateUser = async (
	userId: string,
	username: string,
	isAdmin: boolean,
	password?: string
): Promise<{ error: string } | { success: true; newData: User }> => {
	const user = await db.user.findUnique({ where: { id: userId } });
	if (!user) {
		return { error: 'User not found' };
	}
	try {
		const updatedUser = await db.user.update({
			where: {
				id: userId
			},
			data: {
				username,
				isAdmin,
				password: password ? hashPassword(password) : undefined
			}
		});
		return { success: true, newData: updatedUser };
	} catch (error) {
		console.error(error);
		return { error: 'Something went wrong' };
	}
};

export const deleteUser = async (
	userId: string
): Promise<{ error: string } | { success: true }> => {
	const user = await db.user.findUnique({ where: { id: userId } });
	if (!user) {
		return { error: 'User not found' };
	}
	await db.user.delete({ where: { id: userId } });
	return { success: true };
};
