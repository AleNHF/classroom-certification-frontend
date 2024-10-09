interface NewTeam {
    name: string;
    management: string;
    faculty: string;
}

export const validateTeamData = (team: NewTeam, teamMembers: any[]) => {
    const errorMessages: { [key: string]: string } = {};

    if (!team.name) errorMessages.name = 'El nombre es obligatorio.';
    if (!team.management) errorMessages.management = 'La gestión es obligatoria.';
    if (!team.faculty) errorMessages.faculty = 'La facultad es obligatoria.';
    if (teamMembers.length === 0) errorMessages.members = 'Debes agregar al menos un miembro del equipo.';

    return errorMessages;
};
