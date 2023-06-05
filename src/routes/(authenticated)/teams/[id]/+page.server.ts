import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getTeamById, updateTeam } from '$lib/team.model.server';
import type { Team } from '@prisma/client';

export const load = (async ({ params }) => {
	const { id } = params;
	if (!id) {
		throw error(400, 'missing id');
	}
	const team = await getTeamById(id);
	if (!team) {
		throw error(404, 'Not found');
	}
	return {
		team
	} satisfies { team: Team };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		if (!formData) {
			return fail(400, { error: 'Missing form data' });
		}
		const { name, leftIcon, rightIcon } = Object.fromEntries(formData.entries());
		if (!name && !leftIcon && !rightIcon) {
			return fail(400, { error: 'You should at least change something!' });
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
			const team = await updateTeam(event.params.id, name, leftAll, rightAll);
			if (!team) {
				return fail(404, { error: 'Not found' });
			}
			return { success: true, newData: team };
		} else if (leftIcon && leftIcon instanceof File && leftIcon.size != 0) {
			const file = leftIcon as File;
			const base64 = await file.arrayBuffer().then((buffer) => {
				return Buffer.from(buffer).toString('base64');
			});
			const all = `data:${file.type};base64,${base64}`;
			const team = await updateTeam(event.params.id, name, all);
			if (!team) {
				return fail(404, { error: 'Not found' });
			}
			return { success: true, newData: team };
		} else if (rightIcon && rightIcon instanceof File && rightIcon.size != 0) {
			const file = rightIcon as File;
			const base64 = await file.arrayBuffer().then((buffer) => {
				return Buffer.from(buffer).toString('base64');
			});
			const all = `data:${file.type};base64,${base64}`;
			const team = await updateTeam(event.params.id, name, undefined, all);
			if (!team) {
				return fail(404, { error: 'Not found' });
			}
			return { success: true, newData: team };
		} else if (name) {
			const team = await updateTeam(event.params.id, name);
			if (!team) {
				return fail(404, { error: 'Not found' });
			}
			return { success: true, newData: team };
		}
	}
} satisfies Actions;
