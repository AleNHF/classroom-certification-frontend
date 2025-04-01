import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useEvaluation } from "../../../hooks";
import { HeaderComponent, PageHeaderComponent } from "../../../components";

const EvaluationResults: React.FC = () => {
    const location = useLocation();
    const classroom = location.state?.classroom;
    const { weightedAverageList, fetchWeightedAverage } = useEvaluation();

    useEffect(() => {
        const loadEvaluations = async () => {
            if (classroom) {
                try {
                    await fetchWeightedAverage(classroom.id);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };
        loadEvaluations();
    }, [classroom, fetchWeightedAverage]);

    // Agrupar los datos por área y ciclo
    const groupedByArea = weightedAverageList.reduce((acc: any, item: any) => {
        const cycleMapping: { [key: string]: string } = {
            "CICLO I": "CICLO I",
            "CICLO 2": "CICLO II",
            "CICLO 3": "CICLO III",
        };
    
        const normalizedCycleName = cycleMapping[item.cycleName?.trim().toUpperCase()] || null;
    
        if (!acc[item.areaId]) {
            acc[item.areaId] = {
                areaName: item.areaName,
                cycles: {
                    "CICLO I": 0,
                    "CICLO II": 0,
                    "CICLO III": 0,
                },
                totalWeightedAverage: 0,
            };
        }
    
        if (normalizedCycleName && normalizedCycleName in acc[item.areaId].cycles) {
            acc[item.areaId].cycles[normalizedCycleName] = item.weightedAverage || 0;
            acc[item.areaId].totalWeightedAverage += item.weightedAverage || 0;
        } else {
            console.warn(`Cycle not found or unrecognized: ${normalizedCycleName}`);
        }
    
        return acc;
    }, {});
    
    const areas = Object.values(groupedByArea);

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title={`Resultados de evaluación de: ${classroom.name}`} />
                    <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    <th className="border-b border-gray-300 pb-4 pt-10">Área</th>
                                    <th className="border-b border-gray-300 pb-4 pt-10">Ciclo I</th>
                                    <th className="border-b border-gray-300 pb-4 pt-10">Ciclo II</th>
                                    <th className="border-b border-gray-300 pb-4 pt-10">Ciclo III</th>
                                    <th className="border-b border-gray-300 pb-4 pt-10">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {areas.map((area: any, index: number) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="py-4 border-b border-gray-300">{area.areaName}</td>
                                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                                            {area.cycles["CICLO I"].toFixed(2) || "0"}
                                        </td>
                                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                                            {area.cycles["CICLO II"].toFixed(2) || "0"}
                                        </td>
                                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                                            {area.cycles["CICLO III"].toFixed(2) || "0"}
                                        </td>
                                        <td className="border-b border-gray-300 px-4 py-2 text-center font-bold">
                                            {area.totalWeightedAverage.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EvaluationResults;
