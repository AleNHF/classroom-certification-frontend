import React from "react";
import { CertificationFormData } from "../../../types";

interface Props {
    formData: CertificationFormData;
    setFormData: React.Dispatch<React.SetStateAction<CertificationFormData>>;
    evaluators: any[];
}

const EvaluationDataSection: React.FC<Props> = ({ formData, setFormData, evaluators }) => {
    return (
        <div className="w-full">
            <h3 className="font-semibold text-gray-600 mb-2">Datos generales de la evaluación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Evaluador:</label>
                        <select
                            value={formData.evaluatorUsername}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, evaluatorUsername: e.target.value }))}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option>Selecciona un evaluador</option>
                            {evaluators.map((evaluator) => (
                                <option key={evaluator.id} value={evaluator.name}>
                                    {evaluator.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Más campos similares... */}
            </div>
        </div>
    );
};

export default EvaluationDataSection;