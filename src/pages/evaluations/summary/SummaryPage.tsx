import React, { useCallback, useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { useLocation } from "react-router-dom";
import { HeaderComponent, ModalComponent, PageHeaderComponent, TableComponent } from "../../../components";
import { useForm, useSummary } from "../../../hooks";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Registrar componentes de Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

//const headers = ["Áreas", "Promedio", "Porcentaje", "Ponderación", "Promedio Ponderado"];
const headers = ["Áreas", "Promedio", "Promedio Ponderado"];

const SummaryPage: React.FC = () => {
    const [chartData, setChartData] = useState<any>(null);
    const location = useLocation();
    const formId = location.state?.formId;
    const classroom = location.state?.classroom;
    const [total, setTotal] = useState();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [observation, setObservation] = useState<string>("");
    const [savedObservation, setSavedObservation] = useState<string>("");

    const { data, loading, error, calculateSummary, addObservation } = useSummary();
    const { getFormById } = useForm(classroom.id);

    useEffect(() => {
        if (formId) {
            calculateSummary(formId);

            getFormById(formId).then((form) => {
                if (form?.observation) {
                    setSavedObservation(form.observation);
                }
            }).catch((error) => {
                console.error("Error al obtener el formulario:", error);
            });
        }
    }, [formId, calculateSummary, getFormById]);

    useEffect(() => {
        if (data && data.summary?.data) {
            const summaryData = data.summary.data;

            // Extraer etiquetas y valores
            const labels = summaryData.map((item: any) => item.area);
            const averages = summaryData.map((item: any) => parseFloat(item.average));

            // Configurar los datos para el radar
            setChartData({
                labels,
                datasets: [
                    {
                        label: "Promedio por área",
                        data: averages,
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 2,
                    },
                ],
            });
        }
    }, [data]);

    useEffect(() => {
        if (data?.summary?.totalWeightedAverage !== undefined) {
            setTotal(data.summary.totalWeightedAverage);
        }
    }, [data]);

    const handleAddObservation = useCallback(() => {
        setObservation("");
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setObservation("");
        setIsModalOpen(false);
    }, []);

    const renderTableRows = useCallback(() => {
        if (!data || !data.summary?.data) return [];

        const rows = data.summary.data.map((result: any) => ({
            'Áreas': result.area,
            'Promedio': result.average,
            //'Porcentaje': result.percentage,
            //'Ponderación': result.weight,
            'Promedio Ponderado': result.weightedAverage
        }));

        if (total !== undefined) {
            rows.push({
                Áreas: <strong>Promedio Ponderado General</strong>,
                Promedio: "",
                "Promedio Ponderado": (
                    <span className="font-bold">{`${total} (${getConditionByGrade(total)})`}</span>
                ),
            });
        }

        return rows;
    }, [data]);

    const handleSubmit = useCallback(async () => {
        try {
            if (observation.trim() != "") {
                const observationData = {
                    observation
                };

                await addObservation(formId, observationData);
                setSavedObservation(observation);
                calculateSummary(formId);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Error al añadir observación:', error);
        }
    }, [observation, addObservation, formId, calculateSummary]);

    const getConditionByGrade = (grade: number): string => {
        if (grade >= 0 && grade <= 51) {
            return "Condiciones inaceptables.";
        } else if (grade > 51 && grade <= 60) {
            return "Condiciones de mínimo aceptable.";
        } else if (grade > 60 && grade <= 70) {
            return "Condiciones regulares.";
        } else if (grade > 70 && grade <= 80) {
            return "Condiciones buenas.";
        } else if (grade > 80 && grade <= 90) {
            return "Condiciones óptimas.";
        } else if (grade > 90 && grade <= 100) {
            return "Condiciones excepcionales de calidad y excelencia.";
        }
        return "Puntaje fuera de rango.";
    };

    const exportToPdf = useCallback(async () => {
        const element = document.getElementById("summary-container");
        if (!element) {
            console.error("No se encontró el contenido del certificado para exportar");
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: false
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "letter"
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`roseta-promedios-${classroom.code}`);
        } catch (error) {
            console.error("Error al generar PDF:", error);
        }
    }, [])

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title="ROSETA DE PROMEDIOS POR ÁREA" />

                    <div className="flex w-full justify-end mb-4">
                        <button
                            className="bg-primary-red-color hover:bg-slate-700 text-white text-sm w-44 h-9 p-2 rounded-lg ml-2"
                            onClick={exportToPdf}
                        >
                            DESCARGAR PDF
                        </button>

                        <button
                            className="bg-black hover:bg-slate-700 text-white text-sm w-44 h-9 p-2 rounded-lg ml-2"
                            onClick={() => handleAddObservation()}
                        >
                            CALIF. CUALITATIVA
                        </button>
                    </div>

                    <div id="summary-container" className="w-full mx-auto p-10">
                        <h1 className="text-2xl text-center font-bold p-4">EVALUACIÓN PROCESO DE CONSTRUCCIÓN AVA</h1>
                        <h2 className="text-lg text-justify font-bold p-4">ASIGNATURA: <span>{classroom.name}</span></h2>

                        <div className="w-full max-w-lg mx-auto">
                            {loading ? (
                                <p>Cargando datos...</p>
                            ) : error ? (
                                <p>Error al cargar datos: {error}</p>
                            ) : chartData ? (
                                <div>
                                    <p className="text-lg text-center font-medium text-gray-500 p-4">ROSETA DE PROMEDIOS POR AREA</p>
                                    <Radar
                                        data={chartData}
                                        options={{
                                            responsive: true,
                                            scales: {
                                                r: {
                                                    beginAtZero: true,
                                                    max: 5, // Máximo en tu radar
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <p>No hay datos disponibles.</p>
                            )}
                        </div>
                        <div className="overflow-x-auto w-full mb-6">
                            <h2 className="text-center font-bold">CUADRO RESUMEN DE VALORACIÓN</h2>
                            <TableComponent headers={headers} rows={renderTableRows()} />

                            {(savedObservation) && (
                                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold">Calificación Cualitativa</h2>
                                    <p className="text-sm mt-2">
                                        {savedObservation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={'Calificación Cualitativa'}
                        primaryButtonText={'ACTUALIZAR'}
                        onSubmit={handleSubmit}
                        size="small"
                        loading={loading}
                    >
                        <div className="w-full p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md mb-4">
                            <p>
                                El aula tiene un puntaje de <span className="font-bold">{total}</span>. El aula está en <span className="font-bold">{getConditionByGrade(total!)}</span>
                            </p>
                        </div>
                        <label className="block text-sm font-medium text-gray-700">Observación de calificación cualitativa:</label>
                        <textarea
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            rows={4}
                        />
                    </ModalComponent>
                </div>
            </div>
        </>
    );
};

export default SummaryPage;