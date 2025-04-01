import { SelectInput } from "../../../components";
import { AssessmentData } from "../../../types";

interface AssessmentFormProps {
    newAssessment: AssessmentData;
    selectedArea: string;
    formErrors: Record<string, string>;
    areaList: any[];
    onAssessmentChange: (assessment: AssessmentData) => void;
    onAreaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
    newAssessment,
    selectedArea,
    formErrors,
    areaList,
    onAssessmentChange,
    onAreaChange,
}) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <SelectInput
                        label="Área"
                        value={selectedArea || newAssessment.areaId?.toString() || ''}
                        options={areaList}
                        onChange={onAreaChange}
                        error={formErrors.areaId}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Valoración</label>
                    <input
                        type="number"
                        value={newAssessment.assessment}
                        onChange={(e) => onAssessmentChange({ ...newAssessment, assessment: parseInt(e.target.value) })}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                    value={newAssessment.description}
                    onChange={(e) => onAssessmentChange({ ...newAssessment, description: e.target.value })}
                    rows={3}
                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500 resize-y"
                />
                {formErrors.description && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Conclusiones/Recomendaciones</label>
                <textarea
                    value={newAssessment.conclusions}
                    onChange={(e) => onAssessmentChange({ ...newAssessment, conclusions: e.target.value })}
                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    rows={3}
                />
            </div>
        </div>
    );
};