import React, { useCallback, useMemo, useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import { ActionButtonComponent, ModalComponent, PageHeaderComponent, SearchInputComponent, TableComponent, WarningModal } from '../../components';
import { ErrorPage } from '../utils';
import { useClassroom, useTeam } from '../../hooks';
import { ClassroomMoodle } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ClassroomStatus } from '../../utils/enums/classroomStatus';

const headers = ["Código", "Nombre", "Acciones"];

const SearchClassroomPage: React.FC = () => {
    const navigate = useNavigate();
    const selectedServer = localStorage.getItem('platform_id') || '';
    
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [fieldTerm, setFieldTerm] = useState<string>("id");
    const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState<ClassroomMoodle | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [isTokenWarningModalOpen, setIsTokenWarningModalOpen] = useState(false);

    const { teamList } = useTeam();
    const {
        searchClassroomsList,
        error,
        loading,
        searchClassrooms,
        addClassroom, 
    } = useClassroom();

    /* useEffect(() => {
        if (!moodleToken) {
            setIsTokenWarningModalOpen(true);
        }
    }, [moodleToken]); */

    const handleCloseTokenWarningModal = () => {
        setIsTokenWarningModalOpen(false);
    }

    // Manejador para la búsqueda
    const handleSearch = useCallback(() => {
        const moodleToken = localStorage.getItem('moodle_token') || '';

        if (!moodleToken) {
            setIsTokenWarningModalOpen(true);
            return;
        }

        setCustomErrorMessage(null);
        searchClassrooms({ field: fieldTerm, value: searchTerm }, moodleToken)
            .catch(err => {
                // Manejo específico para error 404
                if (err.message && err.message.includes('404')) {
                    setCustomErrorMessage(`No se encontró el aula en Moodle: [${searchTerm}]`);
                } else {
                    setCustomErrorMessage('Ocurrió un error al buscar el aula. Intenta de nuevo más tarde.');
                }
            });
    }, [fieldTerm, searchTerm, searchClassrooms]);

    const handleClassroomSelect = (classroom: ClassroomMoodle) => {
        setSelectedClassroom(classroom);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClassroom(null);
        setSelectedTeam('');
    };

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTeam(e.target.value);
    };

    const handleConfirm = async () => {
        if (!selectedClassroom) return;

        if (!selectedTeam) return;

        const classroomData = {
            name: selectedClassroom.fullname,
            code: selectedClassroom.shortname,
            status: ClassroomStatus.PENDING,
            moodleCourseId: selectedClassroom.id,
            teamId: parseInt(selectedTeam),
            platformId: parseInt(selectedServer)
        };

        try {
            const classroom = await addClassroom(classroomData);

            navigate('/classrooms/evaluation-dashboard', { state: { classroom: classroom.data.classroom } });
        } catch (error) {
            console.error('Error al añadir el aula virtual:', error);
            setCustomErrorMessage('Ocurrió un error al guardar el aula. Por favor, intenta de nuevo.');
        }
    }

    const rows = useMemo(() => {
        return searchClassroomsList.map((classroom: ClassroomMoodle) => ({
            Código: classroom.shortname,
            Nombre: classroom.fullname,
            Acciones: (
                <ActionButtonComponent
                    label="SELECCIONAR"
                    onClick={() => handleClassroomSelect(classroom)}
                    bgColor="bg-primary-red-color hover:bg-red-400"
                />
            )
        }));
    }, [searchClassroomsList]);

    if (error && customErrorMessage === null) {
        return <ErrorPage message={error} />;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title="BUSCAR AULAS A EVALUAR" />
                    {customErrorMessage && (
                        <div className="bg-red-100 text-red-600 border border-red-400 rounded-md p-3 mb-4 w-full">
                            {customErrorMessage}
                        </div>
                    )}

                    {/* Buscador */}
                    <div className="flex flex-col sm:flex-row w-full items-center mb-4">
                        <SearchInputComponent
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            fieldTerm={fieldTerm}
                            setFieldTerm={setFieldTerm}
                            onSearch={handleSearch}
                            loading={loading}
                        />
                    </div>

                    <div className="flex w-full justify-start mt-4">
                        <p className="text-sm"> {searchClassroomsList.length} Resultados</p>
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={rows} />
                    </div>
                </div>
            </div>

            {/* Contenido del Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Confirmar selección de aula"
                primaryButtonText="ACEPTAR"
                onSubmit={handleConfirm}
            >
                <div className="flex flex-col gap-6">
                    <div className="text-justify">
                        <p className="text-lg font-medium text-gray-700">¿Deseas iniciar la evaluación de esta aula?</p>
                        <p className="mt-2 text-sm text-gray-600">
                            Al confirmar, se registrará esta aula en el software y se podrá comenzar el proceso de evaluación
                        </p>
                    </div>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-items-center">
                            <span className="text-gray-600 w-32">Aula seleccionada:</span>
                            <span className="font-medium text-sm text-gray-800">{selectedClassroom?.fullname}</span>
                        </div>
                        <div className="flex justify-items-center">
                            <span className="text-gray-600 w-32">Categoría:</span>
                            <span className="font-medium text-sm text-gray-800">{selectedClassroom?.categoryname}</span>
                        </div>
                    </div>

                    {/* Selector de equipo */}
                    <div className="space-y-3">
                        <label htmlFor="team-select" className="block text-sm font-medium text-gray-700">
                            Equipo responsable del aula:
                        </label>
                        <select
                            id="team-select"
                            value={selectedTeam}
                            onChange={handleTeamChange}
                            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring focus:ring-blue-200"
                        >
                            <option value="" disabled>
                                Selecciona un equipo
                            </option>
                            {teamList.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </ModalComponent>

            <WarningModal
                isOpen={isTokenWarningModalOpen}
                onClose={handleCloseTokenWarningModal}
                size="medium"
            />
        </>
    );
};

export default SearchClassroomPage;