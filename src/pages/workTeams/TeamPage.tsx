import React, { useState, useCallback } from 'react';
import { validateTeamData } from '../../utils/validations/validateTeamData';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent } from '../../components';
import { ErrorPage } from '../utils';
import { useTeam, usePersonal } from '../../hooks';

const teamHeaders = ["Nombre", "Gestión", "Facultad", "Acciones"];
const memberHeaders = ["Nombre", "Cargo", "Acciones"];

interface TeamMember {
    id: string;
    name: string;
    position: string;
}

interface TeamForm {
    id: string;
    name: string;
    management: string;
    faculty: string;
}

const INITIAL_TEAM_FORM: TeamForm = {
    id: '',
    name: '',
    management: '',
    faculty: ''
};

const TeamPage: React.FC = () => {
    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [newTeam, setNewTeam] = useState<TeamForm>(INITIAL_TEAM_FORM);
    const [selectedPersonalId, setSelectedPersonalId] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [memberData, setMemberData] = useState<number[]>([]);
    const [teamToDelete, setTeamToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    // Estados de validación y errores
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const {
        teamList,
        error,
        successMessage,
        addTeam,
        updateTeam,
        deleteTeam
    } = useTeam();
    const { personalList } = usePersonal();

    // Manejadores de modal
    const resetTeamData = useCallback(() => {
        setNewTeam(INITIAL_TEAM_FORM);
        setTeamMembers([]);
        setMemberData([]);
        setSelectedPersonalId(null);
        setFormErrors({});
    }, []);

    const handleAddClick = useCallback(() => {
        setIsModalOpen(true);
        resetTeamData();
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        resetTeamData();
    }, [resetTeamData]);

    // Manejadores para agregar personal técnico al equipo
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
        setTeamMembers(prevMembers => {
            const updatedMembers = prevMembers.filter(member => member.id !== id);
            return updatedMembers;
        });
        setMemberData(prevData => {
            const updatedData = prevData.filter(memberId => memberId !== Number(id));
            return updatedData;
        });
    }, []);

    // Manejador de submit del formulario
    const handleSubmitTeam = useCallback(async () => {
        const newErrorMessages = validateTeamData(newTeam, teamMembers);
        setFormErrors(newErrorMessages);

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

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setTeamToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (teamToDelete.id) {
            try {
                await deleteTeam(teamToDelete.id);
            } catch (error) {
                console.error('Error deleting team:', error);
            } finally {
                setTeamToDelete({ id: null, name: null });
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [teamToDelete, deleteTeam]);

    const handleEdit = useCallback((team: any) => {
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
    }, []);

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((team: any) => ({
            Nombre: team.name,
            Gestión: team.management,
            Facultad: team.faculty,
            Acciones: (
                <div className="flex space-x-2">
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => handleEdit(team)}
                        bgColor="bg-secondary-button-color hover:bg-blue-800"
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(team.id, team.name)}
                        bgColor="bg-primary-red-color hover:bg-red-400"
                    />
                </div>
            )
        }));
    }, [paginatedItems, handleDelete]);

    const memberRows = teamMembers.map((member) => ({
        Nombre: member.name,
        Cargo: member.position,
        Acciones: (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveMember(member.id);
                }}
                className="bg-red-600 text-white px-4 py-1 rounded"
            >
                ELIMINAR
            </button>
        )
    }));

    //if (loading) return <LoadingPage minDisplayTime={1000} />
    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='GESTIONAR EQUIPOS' />
                    {successMessage && (
                        <AlertComponent
                            type="success"
                            message={successMessage}
                            className="mb-4 w-full"
                        />
                    )}

                    {formErrors.submit && (
                        <AlertComponent
                            type="error"
                            message={formErrors.submit}
                            className="mb-4 w-full"
                        />
                    )}
                    <AddButtonComponent onClick={handleAddClick} />
                    <TableComponent headers={teamHeaders} rows={renderTableRows()} />
                    <PaginationComponent
                        items={teamList}
                        onPageItemsChange={setPaginatedItems}
                    />
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
                            {formErrors.name && <p className="text-red-600 text-sm">{formErrors.name}</p>}
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Gestión</label>
                            <input
                                type="text"
                                value={newTeam.management || ''}
                                onChange={(e) => setNewTeam({ ...newTeam, management: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                            {formErrors.management && <p className="text-red-600 text-sm">{formErrors.management}</p>}
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
                        {formErrors.faculty && <p className="text-red-600 text-sm">{formErrors.faculty}</p>}
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
                                className="ml-2 bg-primary-red-color hover:bg-red-400 text-white px-4 py-2 rounded-md"
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
                message={`¿Estás seguro de que deseas eliminar al equipo "${teamToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default TeamPage;
