import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvaluation } from '../../../hooks';
import { EvaluatedIndicator, EvaluationData } from '../../../types/evaluatedIndicators';
import { HeaderComponent, PageHeaderComponent } from '../../../components';

const EvaluationView: React.FC = () => {
    const { evaluationId } = useParams<{ evaluationId: string }>();
    const { fetchEvaluationById, updateEvaluatedIndicator, updateEvaluation } = useEvaluation();
    const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
    const [evaluatedIndicators, setEvaluatedIndicators] = useState<EvaluatedIndicator[]>([]);
    const [editedIndicators, setEditedIndicators] = useState<Record<number, Partial<EvaluatedIndicator>>>({});
    const [filter, setFilter] = useState<'all' | 'fulfilled' | 'unfulfilled'>('all');
    const [resourceFilter, setResourceFilter] = useState<string>('all');
    const [contentFilter, setContentFilter] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!evaluationId) return;
            try {
                const response = await fetchEvaluationById(evaluationId);
                setEvaluationData(response.data.evaluation);
                setEvaluatedIndicators(response.data.evaluation.evaluatedIndicators);
            } catch (error) {
                console.error('Error fetching evaluation:', error);
            }
        };
        fetchData();
    }, [evaluationId, fetchEvaluationById]);

    const handleEdit = (id: number, field: keyof EvaluatedIndicator, value: any) => {
        setEditedIndicators((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleSave = async (id: number) => {
        const editedIndicator = editedIndicators[id];
        if (!editedIndicator) return;

        setLoading(true);
        try {
            // Actualiza el indicador
            await updateEvaluatedIndicator(id.toString(), {
                result: editedIndicator.result!,
                observation: editedIndicator.observation || '',
            });

            // Calcula el nuevo resultado de la evaluación
            const updatedIndicators = evaluatedIndicators.map((indicator) =>
                indicator.id === id ? { ...indicator, ...editedIndicator } : indicator
            );
            const fulfilledCount = updatedIndicators.filter(item => item.result === 1).length;

            // Actualiza la evaluación con el nuevo resultado
            await updateEvaluation(evaluationId!, {
                classroomId: evaluationData?.classroom.id!,
                cycleId: evaluationData?.cycleId!,
                areaId: evaluationData?.areaId!,
                result: fulfilledCount
            });

            setEvaluatedIndicators(updatedIndicators);
            setEvaluationData((prev) => prev && { ...prev, result: fulfilledCount })

            setEditedIndicators((prev) => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        } catch (error) {
            console.error('Error al actualizar el indicador:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredIndicators = evaluatedIndicators.filter((indicator) => {
        if (filter === 'fulfilled' && indicator.result !== 1) return false;
        if (filter === 'unfulfilled' && indicator.result !== 0) return false;
        if (resourceFilter !== 'all' && indicator.indicator.resource.name !== resourceFilter) return false;
        if (contentFilter !== 'all' && indicator.indicator.content?.name !== contentFilter) return false;
        return true;
    });

    const uniqueResources = Array.from(
        new Set(evaluatedIndicators.map((indicator) => indicator.indicator.resource.name))
    );

    const uniqueContents = Array.from(
        new Set(evaluatedIndicators.map((indicator) => indicator.indicator.content?.name))
    );

    if (!evaluationData) {
        return <div className="p-6 text-center">Cargando evaluación...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-start bg-gray-50 min-h-screen">
            <div className="w-full flex-shrink-0">
                <HeaderComponent />
            </div>
            <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <PageHeaderComponent title={`${evaluationData.classroom.name}`} onBack={() => navigate('/classrooms/evaluations', { state: { classroom: evaluationData.classroom } })} />

                <section className="bg-white p-6 rounded shadow-lg mb-6 w-full">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Información del Aula</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-500">Nombre del Aula</p>
                            <p className="text-lg text-gray-800">{evaluationData.classroom.name}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-500">Código</p>
                            <p className="text-lg text-gray-800">{evaluationData.classroom.code}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-500">Estado</p>
                            <p className="text-lg text-gray-800">{evaluationData.classroom.status}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-500">Evaluada el</p>
                            <p className="text-lg text-gray-800">{new Date(evaluationData.reviewDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-500">Resultado</p>
                            <p className="text-lg text-gray-800">{evaluationData.result}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-500">Total Indicadores evaluados</p>
                            <p className="text-lg text-gray-800">{evaluatedIndicators.length}</p>
                        </div>
                    </div>
                </section>

                <div className="w-full flex justify-end mb-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'fulfilled' | 'unfulfilled')}
                        className="border rounded px-3 py-2"
                    >
                        <option value="all">Todos</option>
                        <option value="fulfilled">Cumple</option>
                        <option value="unfulfilled">No cumple</option>
                    </select>
                    <select
                        value={resourceFilter}
                        onChange={(e) => setResourceFilter(e.target.value)}
                        className="border rounded px-3 py-2 ml-2"
                    >
                        <option value="all">Todos los recursos</option>
                        {uniqueResources.map((resource) => (
                            <option key={resource} value={resource}>
                                {resource}
                            </option>
                        ))}
                    </select>
                    {uniqueContents.length > 0 && (
                        <select
                            value={contentFilter}
                            onChange={(e) => setContentFilter(e.target.value)}
                            className="border rounded px-3 py-2 ml-2"
                        >
                            <option value="all">Todos los contenidos</option>
                            {uniqueContents.map((content) => (
                                <option key={content} value={content}>
                                    {content}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <section className="bg-white p-6 rounded shadow-lg w-full">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Indicadores Evaluados</h2>
                    {filteredIndicators.length === 0 ? (
                        <p className="text-gray-500">No hay indicadores que coincidan con el filtro seleccionado.</p>
                    ) : (
                        filteredIndicators.map((indicator) => (
                            <div
                                key={indicator.id}
                                className={`border py-4 px-6 mb-4 rounded-lg ${indicator.result === 1 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-lg text-gray-800">{indicator.indicator.name}</p>
                                    <span
                                        className={`px-2 py-1 rounded text-sm font-bold ${indicator.result === 1 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                                    >
                                        {indicator.result === 1 ? 'Cumple' : 'No cumple'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-2">
                                    <strong>Recurso:</strong> {indicator.indicator.resource.name} <br />
                                    {indicator.indicator.content && (
                                        <>
                                            <strong>Contenido:</strong> {indicator.indicator.content.name} <br />
                                        </>
                                    )}
                                    <strong>Área:</strong> {indicator.indicator.area.name} <br />
                                    <strong>Ciclo:</strong> {indicator.indicator.resource.cycle.name}
                                </p>
                                <div className="mt-4">
                                    <label className="block font-medium text-gray-700">Observación:</label>
                                    <textarea
                                        value={(editedIndicators[indicator.id]?.observation ?? indicator.observation) || ''}
                                        onChange={(e) =>
                                            handleEdit(indicator.id, 'observation', e.target.value)
                                        }
                                        className="border rounded px-2 py-1 w-full"
                                        rows={3}
                                    ></textarea>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <label className="block font-medium text-gray-700">Resultado:</label>
                                        <select
                                            value={
                                                editedIndicators[indicator.id]?.result ?? indicator.result
                                            }
                                            onChange={(e) =>
                                                handleEdit(indicator.id, 'result', parseInt(e.target.value))
                                            }
                                            className="border rounded px-2 py-1"
                                        >
                                            <option value={0}>No cumple</option>
                                            <option value={1}>Cumple</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => handleSave(indicator.id)}
                                        className={`bg-primary-red-color text-white px-4 py-2 rounded hover:bg-red-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Guardando...' : 'Actualizar'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
};

export default EvaluationView;