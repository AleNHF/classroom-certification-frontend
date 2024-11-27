import { useLocation, useNavigate } from "react-router-dom";
import { Card, HeaderComponent, ModalComponent, PageHeaderComponent, SelectInput } from "../../components";
import { ClassroomStatus } from "../../utils/enums/classroomStatus";
import { useArea, useCycle, useEvaluation } from "../../hooks";
import { useCallback, useState } from "react";

const mapStatusToText = (status: ClassroomStatus): string => {
    switch (status) {
        case ClassroomStatus.PENDING:
            return 'Pendiente';
        case ClassroomStatus.PROCESSING:
            return 'En Proceso';
        case ClassroomStatus.EVALUATED:
            return 'Evaluada';
        case ClassroomStatus.CERTIFIED:
            return 'Certificada'
        default:
            return status;
    }
}

const EvaluationDashboard = () => {
    const location = useLocation();
    const navigation = useNavigate();
    const classroom = location.state?.classroom;

    if (!classroom || !classroom.id) {
        return <div>Error: No se encontró información del aula</div>;
    }

    const routes = {
        evaluation: `/classrooms/evaluation-personal/${classroom.id}`,
        form: `/classrooms/evaluation-formulario/${classroom.id}`,
        certificates: `/classrooms/certificates/${classroom.id}`
    }

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estados de Datos
    const [selectedCycle, setSelectedCycle] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [newEvaluation, setNewEvaluation] = useState({ id: '', cycleId: '', areaId: '', classroomId: '' });

    // Estados de validación y errores
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

    const { cycleList, getCycle } = useCycle();
    const { areaList, getArea } = useArea();
    const { addEvaluation, analizeCompliance } = useEvaluation();

    const moodleToken = localStorage.getItem('moodle_token') || '';
    const filteredAreaList = areaList.filter(area =>
        !area.name.toLowerCase().includes('calidad académica')
    );

    // Manejadores de modal
    const resetEvaluationForm = () => {
        setNewEvaluation({ id: '', cycleId: '', areaId: '', classroomId: '' });
        setSelectedCycle('');
        setSelectedArea('');
        setErrorMessages({});
    }

    const handleOpenModal = () => {
        resetEvaluationForm();
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        resetEvaluationForm();
        setIsModalOpen(false);
    }

    // Manejadores de cambio para los select
    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCycle(e.target.value);
        setNewEvaluation(prev => ({
            ...prev,
            cycleId: e.target.value
        }));

        if (errorMessages.cycleId) {
            setErrorMessages(prev => ({
                ...prev,
                cycleId: ''
            }));
        }
    };

    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(e.target.value);
        setNewEvaluation(prev => ({
            ...prev,
            areaId: e.target.value
        }));

        if (errorMessages.areaId) {
            setErrorMessages(prev => ({
                ...prev,
                areaId: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!selectedCycle) {
            newErrors.cycleId = 'Debe seleccionar un ciclo';
        }
        if (!selectedArea) {
            newErrors.areaId = 'Debe seleccionar un área';
        }

        setErrorMessages(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejador de submit del formulario
    const handleSubmitEvaluation = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const evaluationData = {
                classroomId: classroom?.id || '',
                cycleId: parseInt(newEvaluation.cycleId),
                areaId: parseInt(newEvaluation.areaId),
                result: 0
            };

            const evaluationResponse = await addEvaluation(evaluationData);
            const cycle = await getCycle(evaluationData.cycleId.toString());
            const area = await getArea(evaluationData.areaId.toString());

            handleCloseModal();
            if (area.area.name !== 'Diseño gráfico') {
                navigation('/classrooms/evaluation-progress', {
                    state: {
                        evaluationData: {
                            ...evaluationData,
                            evaluationId: evaluationResponse.data.evaluation.id,
                            token: moodleToken
                        },
                        cycleName: cycle.cycle.name,
                        areaName: area.area.name,
                        classroom: classroom
                    }
                });
            } else {
                const result = await analizeCompliance(
                    classroom.moodleCourseId,
                    moodleToken,
                    evaluationData.cycleId,
                    evaluationData.areaId,
                    evaluationResponse.data.evaluation.id
                );
                console.info(result)
                navigation('/classrooms/evaluations', { state: { classroom } })
            }
        } catch (error) {
            console.error('Error adding evaluation:', error);
        }
    }, [newEvaluation, classroom, validateForm])

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title={`${classroom.code}: ${classroom.name}`} onBack={() => navigation('/classrooms')} />

                    <div className="flex justify-between items-center w-full my-4">
                        <p className="text-gray-700">
                            ESTADO: <span className="font-medium">{mapStatusToText(classroom.status)}</span>
                        </p>
                        {/* {classroom.status !== ClassroomStatus.EVALUATED && (
                            <button
                                className="bg-primary-red-color hover:bg-red-400 text-white px-6 py-2 rounded-md transition-colors duration-200"
                                onClick={handleOpenModal}
                            >
                                INICIAR EVALUACIÓN
                            </button>
                        )} */}
                        <button
                            className="bg-primary-red-color hover:bg-red-400 text-white px-6 py-2 rounded-md transition-colors duration-200"
                            onClick={handleOpenModal}
                        >
                            INICIAR EVALUACIÓN
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 w-full">
                        {/* {(classroom.status === ClassroomStatus.PROCESSING || classroom.status === ClassroomStatus.EVALUATED || classroom.status === ClassroomStatus.CERTIFIED) && (
                            <Card title='INFORMES DE EVALUACIÓN' route='personal' />
                        )} */}
                        <Card
                            title="EVALUACIONES"
                            route="/classrooms/evaluations"
                            onClick={() => navigation('/classrooms/evaluations', { state: { classroom } })}
                        />
                        {(classroom.status === ClassroomStatus.EVALUATED || classroom.status === ClassroomStatus.CERTIFIED) && (
                            <Card title='VALORACIÓN DE AULA VIRTUAL' route={routes.form}/>
                        )}
                        {(classroom.status === ClassroomStatus.EVALUATED || classroom.status === ClassroomStatus.CERTIFIED) && (
                            <Card title='CERTIFICADOS' route={routes.certificates} />
                        )}
                    </div>
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={classroom.name}
                primaryButtonText="INICIAR"
                onSubmit={handleSubmitEvaluation}
                size='medium'
            >
                <form className="space-y-4">
                    <div className="text-justify">
                        <p className="mt-2 text-sm text-gray-700">
                            Por favor, selecciona el ciclo y el área con el que deseas iniciar la evaluación
                        </p>
                    </div>
                    <div className="mb-4">
                        <SelectInput
                            label="Ciclo"
                            value={selectedCycle}
                            options={cycleList}
                            onChange={handleCycleChange}
                            error={errorMessages.cycleId}
                        />
                        <div className="mb-4">
                            <SelectInput
                                label="Área"
                                value={selectedArea}
                                options={filteredAreaList}
                                onChange={handleAreaChange}
                                error={errorMessages.areaId}
                            />
                        </div>
                    </div>
                </form>
            </ModalComponent>
        </>
    );
};

export default EvaluationDashboard;
