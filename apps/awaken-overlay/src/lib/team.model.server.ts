import db from '$lib/db.server';

export const getTeams = async () => {
	return await db.team.findMany();
};

export const getTeamById = async (id: string) => {
	return await db.team.findUnique({ where: { id } });
};
export const createTeam = async (name: string, leftIcon: string, rightIcon: string) => {
	return await db.team.create({
		data: {
			name,
			leftIcon,
			rightIcon
		}
	});
};

export const updateTeam = async (
	id: string,
	name?: string,
	leftIcon?: string,
	rightIcon?: string
) => {
	const team = await getTeamById(id);
	if (!team) {
		return null;
	}
	return await db.team.update({
		where: { id },
		data: {
			name: name || team.name,
			leftIcon: leftIcon || team.leftIcon,
			rightIcon: rightIcon || team.rightIcon
		}
	});
};
export const deleteTeam = async (id: string) => {
	return await db.team.delete({ where: { id } });
};
