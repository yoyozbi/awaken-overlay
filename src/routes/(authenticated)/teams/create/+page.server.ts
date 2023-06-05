import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createTeam } from '$lib/team.model.server';

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		if (!formData) {
			return fail(400, { error: 'Missing form data' });
		}
		const { name, leftIcon, rightIcon } = Object.fromEntries(formData.entries());
		if (!name) {
			return fail(400, { error: 'Missing name' });
		}
		if (typeof name !== 'string') {
			return fail(400, { error: 'Name is not a string' });
		}
		if (name.length > 50) {
			return fail(400, { error: 'Name is too long' });
		}
		if (
			leftIcon &&
			leftIcon instanceof File &&
			leftIcon.size != 0 &&
			rightIcon &&
			rightIcon instanceof File &&
			rightIcon.size != 0
		) {
			const leftFile = leftIcon as File;
			const leftBase64 = await leftFile.arrayBuffer().then((buffer) => {
				return Buffer.from(buffer).toString('base64');
			});
			const leftAll = `data:${leftFile.type};base64,${leftBase64}`;
			const rightFile = rightIcon as File;
			const rightBase64 = await rightFile.arrayBuffer().then((buffer) => {
				return Buffer.from(buffer).toString('base64');
			});
			const rightAll = `data:${rightFile.type};base64,${rightBase64}`;
			await createTeam(name, leftAll, rightAll);
			throw redirect(302, '/');
		} else {
			return fail(400, { error: 'Missing icon' });
		}
	}
} satisfies Actions;
