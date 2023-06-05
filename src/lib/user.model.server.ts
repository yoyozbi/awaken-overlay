import db from '$lib/db.server';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '$env/static/private';

const hashPassword = (password: string) : string => {
	return createHash('sha256').update(password).digest('hex');
};

const compareHashPassword = (password: string, hashedPassword: string) : boolean => {
	return hashPassword(password) === hashedPassword
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
