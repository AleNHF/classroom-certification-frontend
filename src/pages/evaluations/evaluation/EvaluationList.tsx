import React, { useCallback, useEffect, useState } from "react";
import { useEvaluation } from "../../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionButtonComponent, AlertComponent, ConfirmDeleteModal, HeaderComponent, PageHeaderComponent, TableComponent } from "../../../components";

const headers = ["Ciclo", "Área", "Resultado", "Fecha de revisión", "Acciones"];

const EvaluationList: React.FC = () => {
    const location = useLocation();
    const classroom = location.state?.classroom;
    const navigate = useNavigate();

    const {
        evaluationList,
        loading,
        error,
        successMessage,
        deleteEvaluation,
        fetchData
    } = useEvaluation();

    const [evaluationToDelete, setEvaluationToDelete] = useState<{ id: string | null }>({ id: null });
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false); // Estado de carga al eliminar
    const [cycleFilter, setCycleFilter] = useState<string>('all');

    //const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    useEffect(() => {
        const loadEvaluations = async () => {
            if (classroom) {
                try {
                    await fetchData(classroom.id);
                } catch (error) {
                    console.error("Error fetching data:", error)
                }
            }
        };
        loadEvaluations();
    }, [classroom, fetchData]);

    const handleDelete = useCallback((id: string) => {
        setEvaluationToDelete({ id });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (evaluationToDelete.id) {
            setIsDeleting(true); // Activa el indicador de carga
            try {
                await deleteEvaluation(evaluationToDelete.id);
                await fetchData(classroom.id); // Refresca la lista tras la eliminación
            } catch (error) {
                console.error('Error al eliminar evaluación:', error);
            } finally {
                setIsDeleting(false); // Desactiva el indicador de carga
                setEvaluationToDelete({ id: null });
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [evaluationToDelete.id, deleteEvaluation, classroom.id, fetchData]);

    const navigateToEvaluationViewData = (evaluationId: string) => {
        navigate(`/classrooms/evaluations/${evaluationId}`)
    };

    const navigateToEvaluationResults = () => {
        navigate(`/classrooms/evaluation-results`, { state: { classroom } })
    };

    const navigateToEvaluationAttachments = () => {
        navigate(`/classrooms/evaluation-attachments`, { state: { classroom } })
    };

    // Filtrado por ciclos
    const filteredEvaluations = evaluationList.filter((evaluation) => {
        if (cycleFilter !== 'all' && evaluation.cycle?.name !== cycleFilter) return false;
        return true;
    });

    const uniqueCycles = Array.from(
        new Set(evaluationList.map((evaluation) => evaluation.cycle?.name))
    );

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        const formatDateTime = (dateTime: string) => {
            return new Intl.DateTimeFormat('es-ES', {
                dateStyle: 'short',
                timeStyle: 'medium',
            }).format(new Date(dateTime));
        };

        return filteredEvaluations.map((evaluation: any) => ({
            Ciclo: evaluation.cycle.name,
            'Área': evaluation.area.name,
            Resultado: evaluation.result,
            'Fecha de revisión': formatDateTime(evaluation.reviewDate),
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="VER"
                        onClick={() => navigateToEvaluationViewData(evaluation.id)}
                        bgColor="bg-optional-button-color hover:bg-slate-400 hover:bg-slate-400"
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(evaluation.id)}
                        bgColor="bg-primary-red-color hover:bg-red-400 hover:bg-blue-800"
                    />
                </div>
            )
        }));
    }, [filteredEvaluations, handleDelete]);

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>
                {/* Main Content */}
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title={`${classroom.name}`} onBack={() => navigate('/classrooms/evaluation-dashboard', { state: { classroom: classroom } })} />
                    {
                        evaluationList.length > 0 &&
                        <div className="flex justify-end items-center w-full">
                            <button
                                className="bg-primary-red-color hover:bg-red-400 text-white px-6 py-2 mr-3 rounded-md transition-colors duration-200"
                                onClick={() => navigateToEvaluationResults()}
                            >
                                RESULTADOS
                            </button>
                            <button
                                    className="bg-black hover:bg-slate-800 text-white px-6 py-2 rounded-md transition-colors duration-200"
                                    onClick={() => navigateToEvaluationAttachments()}
                                >
                                    ANEXOS
                                </button>
                        </div>
                    }
                    {(loading || isDeleting) && <AlertComponent type="info" message={"Cargando..."} className="mb-4 w-full" />}
                    {error && <AlertComponent type="error" message={`Error: ${error}`} className="mb-4 w-full" />}
                    {successMessage && <AlertComponent type="success" message={successMessage} className="mb-4 w-full" />}

                    <div className="w-full flex justify-end p-8">
                        <select 
                            value={cycleFilter}
                            onChange={(e) => setCycleFilter(e.target.value)}
                            className="border rounded px-3 py-2 ml-2"
                        >
                            <option value="all">Todos los ciclos</option>    
                            {uniqueCycles.map((cycle) => (
                                <option key={cycle} value={cycle}>{cycle}</option>
                            ))}                        
                        </select>
                    </div>

                    <div className="overflow-x-auto w-full mb-8">
                        <TableComponent headers={headers} rows={renderTableRows()} />
                    </div>
                    {/* <PaginationComponent
                        items={evaluationList}
                        onPageItemsChange={setPaginatedItems}
                    /> */}
                </div>
            </div>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar la evaluación?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default EvaluationList;