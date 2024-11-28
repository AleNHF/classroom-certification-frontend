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
import { HeaderComponent, PageHeaderComponent, TableComponent } from "../../../components";
import { useSummary } from "../../../hooks";

// Registrar componentes de Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const headers = ["Áreas", "Promedio", "Porcentaje", "Ponderación", "Promedio Ponderado"];

const SummaryPage: React.FC = () => {
    const [chartData, setChartData] = useState<any>(null);
    const location = useLocation();
    const formId = location.state?.formId;

    const { data, loading, error, getSummaries } = useSummary(); 

    useEffect(() => {
        if (formId) {
            getSummaries(formId); 
        }
    }, [formId, getSummaries]);

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

    const renderTableRows = useCallback(() => {
        if (!data || !data.summary?.data) return [];

        return data.summary.data.map((result: any) => ({
            'Áreas': result.area,
            'Promedio': result.average,
            'Porcentaje': result.percentage,
            'Ponderación': result.weight,
            'Promedio Ponderado': result.weightedAverage
        }))
    }, [data])

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title="ROSETA DE PROMEDIOS POR ÁREA" />
                    <div className="w-full max-w-lg mx-auto">
                        {loading ? (
                            <p>Cargando datos...</p>
                        ) : error ? (
                            <p>Error al cargar datos: {error}</p>
                        ) : chartData ? (
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
                        ) : (
                            <p>No hay datos disponibles.</p>
                        )}
                    </div>
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={renderTableRows()} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SummaryPage;