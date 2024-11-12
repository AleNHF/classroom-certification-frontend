import React from 'react';
import { SelectInput } from '../ui/SelectInput';
import { Cycle } from '../../types';
import { Content, Resource } from '../../types/indicator';

interface IndicatorFormProps {
    selectedCycle: string;
    selectedResource: string;
    selectedContent: string;
    indicatorName: string;
    cycleList: Array<Cycle>;
    resourceList: Array<Resource>;
    contentList: Array<Content>;
    errorMessages: {
        cycleId?: string;
        resourceId?: string;
        name?: string;
    };
    handleCycleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleResourceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleContentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    setIndicatorName: (value: string) => void;
}

const IndicatorForm: React.FC<IndicatorFormProps> = ({
    selectedCycle,
    selectedResource,
    selectedContent,
    indicatorName,
    cycleList,
    resourceList,
    contentList,
    errorMessages,
    handleCycleChange,
    handleResourceChange,
    handleContentChange,
    setIndicatorName,
}) => {
    return (
        <form className="space-y-4">
            <div className="mb-4">
                <SelectInput
                    label="Ciclo"
                    value={selectedCycle}
                    options={cycleList}
                    onChange={handleCycleChange}
                    error={errorMessages.cycleId}
                />
            </div>

            {selectedCycle && (
                <div className="mb-4">
                    <SelectInput
                        label="Recurso"
                        value={selectedResource}
                        options={resourceList}
                        onChange={handleResourceChange}
                        error={errorMessages.resourceId}
                    />
                </div>
            )}

            {selectedResource && contentList.length > 0 && (
                <div className="mb-4">
                    <SelectInput
                        label="Contenido"
                        value={selectedContent}
                        options={contentList}
                        onChange={handleContentChange}
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre del Indicador</label>
                <textarea
                    rows={4}
                    value={indicatorName}
                    onChange={(e) => setIndicatorName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
                {errorMessages.name && <p className="text-red-600 text-sm">{errorMessages.name}</p>}
            </div>
        </form>
    );
};

export default IndicatorForm;