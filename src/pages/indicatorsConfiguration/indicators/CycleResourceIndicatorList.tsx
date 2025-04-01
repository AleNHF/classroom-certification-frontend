import React from 'react';
import { Content, Indicator, Resource } from '../../../types/indicator';
import { Cycle } from '../../../types';
import IndicatorTable from './IndicatorTable';

interface CycleResourceIndicatorListProps {
    cycleList: Cycle[];
    resourceList: Resource[];
    contentList: Content[];
    indicatorList: Indicator[];
    expandedCycles: { [key: string]: boolean };
    expandedResources: { [key: string]: boolean };
    expandedContents: { [key: string]: boolean };
    toggleCycleExpansion: (cycleId: string) => void;
    toggleResourceExpansion: (resourceId: string) => void;
    toggleContentExpansion: (resourceId: string) => void;
    handleEdit: (indicator: Indicator) => void;
    handleDelete: (indicatorId: string, indicatorName: string) => void;
}

const CycleResourceIndicatorList: React.FC<CycleResourceIndicatorListProps> = ({
    cycleList,
    resourceList,
    contentList,
    indicatorList,
    expandedCycles,
    expandedResources,
    expandedContents,
    toggleCycleExpansion,
    toggleResourceExpansion,
    toggleContentExpansion,
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
                                            {contentList.length == 0 ? (
                                                <IndicatorTable
                                                    indicators={indicatorList}
                                                    handleEdit={handleEdit}
                                                    handleDelete={handleDelete}
                                                    resourceId={resource.id}
                                                />
                                            ) : (
                                                contentList.map(content => (
                                                    <div key={content.id} className="mb-4">
                                                        <button
                                                            onClick={() => toggleContentExpansion(content.id.toString())}
                                                            className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-md mb-2 transition-all duration-300 ease-in-out"
                                                        >
                                                            {content.name}
                                                        </button>
                                                        {expandedContents[content.id] && (
                                                            <IndicatorTable
                                                                indicators={indicatorList}
                                                                handleEdit={handleEdit}
                                                                handleDelete={handleDelete}
                                                                contentId={content.id}
                                                            />
                                                        )}
                                                    </div>
                                                )))}
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
