import db from "$lib/db.server";

export const getTeams = async () => {
    return await db.team.findMany();
}

export const getTeamById = async (id: string) => {
    return await db.team.findUnique({ where: { id } });
}
export const createTeam = async (name: string, icon: string) => {
    return await db.team.create({
        data: {
            name,
            icon
        }
    });
}

export const updateTeam = async (id: string, name?: string, icon?: string) => {
    let team = await getTeamById(id);
    if(!team) {
        return null;
    }
    return await db.team.update({
        where: { id },
        data: {
            name: name || team.name,
            icon: icon || team.icon
        }
    });
}
export const deleteTeam = async (id: string) => {
    return await db.team.delete({ where: { id } });
}
