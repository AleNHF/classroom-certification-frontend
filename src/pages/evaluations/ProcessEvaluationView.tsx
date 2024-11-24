import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { HeaderComponent, PageHeaderComponent } from "../../components";
import { useEvaluation } from "../../hooks";
import { EvaluationResult } from '../../types';

interface ProgressBarProps {
    progress: number;
}

interface EvaluationData {
    classroomId: number;
    cycleId: number;
    areaId: number;
    evaluationId: number;
    token: string;
}

interface LocationState {
    evaluationData: EvaluationData;
    cycleName: string;
    areaName: string;
    classroom: any
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-4">
            <div
                className="bg-primary-red-color h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

const EvaluationProgress = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { evaluationData, cycleName, areaName, classroom } = (location.state as LocationState) || {};
    const { analizeCompliance } = useEvaluation();

    const [progress, setProgress] = useState<number>(0);
    const [analysisResult, setAnalysisResult] = useState<EvaluationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startAnalysis = async () => {
            try {
                // Iniciamos la barra de progreso
                const progressInterval = setInterval(() => {
                    setProgress(prev => prev < 90 ? prev + 5 : prev);
                }, 300);
                console.log('evaluationData', evaluationData)

                // Realizamos el análisis
                const result = await analizeCompliance(
                    evaluationData.classroomId,
                    evaluationData.token,
                    evaluationData.cycleId,
                    evaluationData.areaId,
                    evaluationData.evaluationId
                );
                console.log('result view', result)

                // Limpiamos el intervalo y completamos la barra
                clearInterval(progressInterval);
                setProgress(100);
                setAnalysisResult(result.data);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error al analizar el cumplimiento';
                setError(errorMessage);
                setProgress(0);
            }
        };

        if (evaluationData) {
            startAnalysis();
        } else {
            navigate('/classrooms');
        }
    }, [evaluationData, analizeCompliance, navigate]);

    if (!evaluationData) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-start bg-white min-h-screen">
            <div className="w-full flex-shrink-0">
                <HeaderComponent />
            </div>

            <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <PageHeaderComponent title={`${classroom.code} - ${classroom.name}`} />

                <div className="w-full bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-2">
                        {`${cycleName} - ${areaName}`}  </h2>
                    <div className="space-y-6">
                        {/* Estado del análisis */}
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-semibold mb-2">
                                {progress < 100
                                    ? 'Analizando cumplimiento de indicadores...'
                                    : 'Análisis completado'}
                            </h2>
                            <p className="text-gray-600">
                                {progress < 100
                                    ? 'Por favor, espere mientras procesamos la información'
                                    : 'Se ha completado el análisis de cumplimiento'}
                            </p>
                        </div>

                        {/* Barra de progreso */}
                        <div className="w-full">
                            <ProgressBar progress={progress} />
                            <p className="text-center mt-2 text-sm text-gray-600">
                                {progress}% completado
                            </p>
                        </div>

                        {/* Mensaje de error si existe */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Resultados del análisis */}
                        {analysisResult && progress === 100 && (
                            <div className="mt-8 space-y-4">
                                <h3 className="text-lg font-semibold">Recursos analizados</h3>
                                <div className="space-y-3">
                                    {analysisResult.resourceDetails?.map((result, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-green-50 rounded-lg text-sm text-gray-700"
                                        >
                                            {result.resourceName}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => navigate('/classrooms/evaluation-dashboard', { state: { classroom: classroom } })
                                        }
                                        className="bg-primary-red-color hover:bg-red-400 text-white px-6 py-2 rounded-md transition-colors duration-200"
                                    >
                                        FINALIZAR
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluationProgress;