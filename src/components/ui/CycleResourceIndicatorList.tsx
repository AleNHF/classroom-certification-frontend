import React from 'react';
import { ActionButtonComponent } from '../../components/ui';
import { Indicator, Resource } from '../../types/indicator';
import { Cycle } from '../../types';

interface CycleResourceIndicatorListProps {
    cycleList: Cycle[];
    resourceList: Resource[];
    indicatorList: Indicator[];
    expandedCycles: { [key: string]: boolean };
    expandedResources: { [key: string]: boolean };
    toggleCycleExpansion: (cycleId: string) => void;
    toggleResourceExpansion: (resourceId: string) => void;
    handleEdit: (indicator: Indicator) => void;
    handleDelete: (indicatorId: string) => void;
}

const CycleResourceIndicatorList: React.FC<CycleResourceIndicatorListProps> = ({
    cycleList,
    resourceList,
    indicatorList,
    expandedCycles,
    expandedResources,
    toggleCycleExpansion,
    toggleResourceExpansion,
    handleEdit,
    handleDelete,
}) => {
    return (
        <>
            {cycleList.map(cycle => (
                <div key={cycle.id} className="w-full mt-4">
                    <button
                        onClick={() => toggleCycleExpansion(cycle.id.toString())}
                        className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-md mb-2 transition-all duration-300 ease-in-out"
                    >
                        {cycle.name}
                    </button>

                    {/* Mostrar recursos si el ciclo está expandido */}
                    {expandedCycles[cycle.id] && (
                        <div className="pl-4 mt-2">
                            {resourceList.map(resource => (
                                <div key={resource.id} className="mb-4">
                                    <button
                                        onClick={() => toggleResourceExpansion(resource.id.toString())}
                                        className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-md mb-2 transition-all duration-300 ease-in-out"
                                    >
                                        {resource.name}
                                    </button>

                                    {/* Mostrar la tabla de indicadores si el recurso está expandido */}
                                    {expandedResources[resource.id] && (
                                        <div className="mt-2 pl-4">
                                            <table className="min-w-full bg-white shadow-md rounded-lg">
                                                <thead className="bg-primary-red-color text-white">
                                                    <tr>
                                                        <th className="py-2 px-4">Contenido</th>
                                                        <th className="py-2 px-4">Indicador</th>
                                                        <th className="py-2 px-4">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {indicatorList
                                                        .filter(indicator => indicator.resource.id === resource.id)
                                                        .map(indicator => (
                                                            <tr key={indicator.id} className="border-b">
                                                                <td className="py-2 px-4">
                                                                    {indicator.content ? indicator.content.name : indicator.resource.name}
                                                                </td>
                                                                <td className="py-2 px-4">{indicator.name}</td>
                                                                <td className="py-2 px-4">
                                                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                                                        <ActionButtonComponent
                                                                            label="EDITAR"
                                                                            onClick={() => handleEdit(indicator)}
                                                                            bgColor="bg-secondary-button-color"
                                                                        />
                                                                        <ActionButtonComponent
                                                                            label="ELIMINAR"
                                                                            onClick={() => handleDelete(indicator.id.toString())}
                                                                            bgColor="bg-primary-red-color"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </>
    );
};

export default CycleResourceIndicatorList;
