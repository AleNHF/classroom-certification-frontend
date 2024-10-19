import React, { useState, useCallback } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import { validateTeamData } from '../../utils/validateTeamData';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal } from '../../components/ui';
import usePersonal from '../../hooks/workTeams/usePersonal';
import useTeam from '../../hooks/workTeams/useTeam';
import { LoadingPage, ErrorPage } from '../utils';

const teamHeaders = ["Nombre", "Gestión", "Facultad", "Acciones"];
const memberHeaders = ["Nombre", "Cargo", "Acciones"];

interface TeamMember {
    id: string;
    name: string;
    position: string;
}

const TeamPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({ id: '', name: '', management: '', faculty: '' });
    const [selectedPersonalId, setSelectedPersonalId] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [memberData, setMemberData] = useState<number[]>([]);
    const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

    const { teamList, loading, error, addTeam, updateTeam, deleteTeam } = useTeam();
    const { personalList } = usePersonal();

    const resetTeamData = () => {
        setNewTeam({ id: '', name: '', management: '', faculty: '' });
        setTeamMembers([]);
        setMemberData([]);
        setSelectedPersonalId(null);
        setErrorMessages({});
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
        resetTeamData();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetTeamData();
    };

    const handleAddMember = useCallback(() => {
        if (selectedPersonalId) {
            const selectedMember = personalList.find(person => Number(person.id) === Number(selectedPersonalId));
            if (selectedMember && !teamMembers.some(member => member.id === selectedMember.id)) {
                setTeamMembers(prevMembers => [
                    ...prevMembers,
                    { id: selectedMember.id, name: selectedMember.name, position: selectedMember.position }
                ]);
                setMemberData(prevData => [...prevData, Number(selectedMember.id)]);
            }
            setSelectedPersonalId(null);
        }
    }, [selectedPersonalId, personalList, teamMembers]);

    const handleRemoveMember = useCallback((id: string) => {
        setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== id));
        setMemberData(prevData => prevData.filter(memberId => memberId !== Number(id)));
    }, []);

    const handleSubmitTeam = useCallback(async () => {
        const newErrorMessages = validateTeamData(newTeam, teamMembers);
        setErrorMessages(newErrorMessages);

        if (Object.keys(newErrorMessages).length > 0) return;

        const teamData = {
            name: newTeam.name,
            faculty: newTeam.faculty,
            management: newTeam.management,
            personal: memberData
        };

        try {
            newTeam.id ? await updateTeam(newTeam.id, teamData) : await addTeam(teamData);
            handleCloseModal();
        } catch (error) {
            console.error('Error adding/updating team:', error);
        }
    }, [newTeam, memberData, addTeam, updateTeam, handleCloseModal, teamMembers]);

    const handleDelete = useCallback((id: string) => {
        setTeamToDelete(id);
        setIsConfirmDeleteOpen(true);
    }, []);

    const confirmDeleteTeam = useCallback(async () => {
        if (teamToDelete) {
            try {
                await deleteTeam(teamToDelete);
            } catch (error) {
                console.error('Error deleting team:', error);
            } finally {
                setTeamToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [teamToDelete, deleteTeam]);

    const handleEdit = (team: any) => {
        setNewTeam({
            id: team.id,
            name: team.name,
            management: team.management,
            faculty: team.faculty
        });

        const members = Array.isArray(team.personals) ? team.personals : [];
        setTeamMembers(members);
        setMemberData(members.map((member: any) => member.id));
        setIsModalOpen(true);
    };

    const teamRows = teamList.map((team: any) => ({
        Nombre: team.name,
        Gestión: team.management,
        Facultad: team.faculty,
        Acciones: (
            <div className="flex space-x-2">
                <ActionButtonComponent 
                    label="EDITAR"
                    onClick={() => handleEdit(team)}
                    bgColor="bg-secondary-button-color"
                />
                <ActionButtonComponent 
                    label="ELIMINAR"
                    onClick={() => handleDelete(team.id)}
                    bgColor="bg-primary-red-color"
                />
            </div>
        )
    }));

    const memberRows = teamMembers.map((member) => ({
        Nombre: member.name,
        Cargo: member.position,
        Acciones: (
            <button
                onClick={() => handleRemoveMember(member.id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
            >
                ELIMINAR
            </button>
        )
    }));

    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='GESTIONAR EQUIPOS' />
                    <AddButtonComponent onClick={handleAddClick} />
                    <TableComponent headers={teamHeaders} rows={teamRows} />
                </div>
            </div>

            {/* Modal para agregar o editar equipo */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newTeam.id ? "Editar Equipo" : "Nuevo Equipo"}
                primaryButtonText={newTeam.id ? "ACTUALIZAR" : "GUARDAR"}
                onSubmit={handleSubmitTeam}
                size='large'
            >
                <form className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={newTeam.name || ''}
                                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                            {errorMessages.name && <p className="text-red-600 text-sm">{errorMessages.name}</p>}
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Gestión</label>
                            <input
                                type="text"
                                value={newTeam.management || ''}
                                onChange={(e) => setNewTeam({ ...newTeam, management: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                            {errorMessages.management && <p className="text-red-600 text-sm">{errorMessages.management}</p>}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Facultad</label>
                        <input
                            type="text"
                            value={newTeam.faculty || ''}
                            onChange={(e) => setNewTeam({ ...newTeam, faculty: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {errorMessages.faculty && <p className="text-red-600 text-sm">{errorMessages.faculty}</p>}
                    </div>

                    {/* Miembros del equipo */}
                    <div>
                        <h3 className="text-lg font-semibold">Personal técnico</h3>
                        <div className="flex items-center mt-2">
                            <select
                                value={selectedPersonalId || ''}
                                onChange={(e) => setSelectedPersonalId(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
                            >
                                <option value="">Seleccionar personal</option>
                                {personalList.map((personal) => (
                                    <option key={personal.id} value={personal.id}>
                                        {personal.name} ({personal.position})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleAddMember}
                                className="ml-2 bg-primary-red-color text-white px-4 py-2 rounded-md"
                            >
                                AGREGAR
                            </button>
                        </div>
                        <div className="mt-4">
                            <TableComponent headers={memberHeaders} rows={memberRows} />
                        </div>
                    </div>
                </form>
            </ModalComponent>

            {/* Modal de confirmación de eliminación */}
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={confirmDeleteTeam}
            />
        </>
    );
};

export default TeamPage;
