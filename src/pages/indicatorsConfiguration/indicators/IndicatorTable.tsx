// IndicatorTable.tsx
import React from 'react';
import { ActionButtonComponent, IconButtonComponent } from '../../../components';
import { Indicator } from '../../../types/indicator';

interface IndicatorTableProps {
    indicators: Indicator[];
    handleEdit: (indicator: Indicator) => void;
    handleDelete: (indicatorId: string, indicatorName: string) => void;
    resourceId?: number,
    contentId?: number
}

const IndicatorTable: React.FC<IndicatorTableProps> = ({ indicators, handleEdit, handleDelete, resourceId, contentId }) => {
    return (
        <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-primary-red-color text-white">
                <tr>
                    <th className="py-2 px-4">Indicador</th>
                    <th className="py-2 px-4">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {resourceId != null ? (
                    indicators
                        .filter(indicator => indicator.resource.id === resourceId)
                        .map(indicator => (
                            <tr key={indicator.id} className="border-b">
                                <td className="py-2 px-4">{indicator.name}</td>
                                <td className="py-2 px-4">
                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                        <ActionButtonComponent
                                            label="EDITAR"
                                            onClick={() => handleEdit(indicator)}
                                            bgColor="bg-secondary-button-color hover:bg-blue-800"
                                        />
                                        <ActionButtonComponent
                                            label="ELIMINAR"
                                            onClick={() => handleDelete(indicator.id.toString(), indicator.name)}
                                            bgColor="bg-primary-red-color hover:bg-red-400"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                ) : (
                    indicators
                        .filter(indicator => indicator.content?.id === contentId)
                        .map(indicator => (
                            <tr key={indicator.id} className="border-b">
                                <td className="py-2 px-4">{indicator.name}</td>
                                <td className="py-2 px-4">
                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                        <IconButtonComponent
                                            variant="edit"
                                            onClick={() => handleEdit(indicator)}
                                        />
                                        <IconButtonComponent
                                            variant="delete"
                                            onClick={() => handleDelete(indicator.id.toString(), indicator.name)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                )
                }
            </tbody>
        </table>
    );
};

export default IndicatorTable;