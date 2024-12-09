import React from "react";
import { CertificationFormData } from "../../../types";

interface Props {
    formData: CertificationFormData;
    setFormData: React.Dispatch<React.SetStateAction<CertificationFormData>>;
    formErrors: Record<string, string>;
}

const GeneralDataSection: React.FC<Props> = ({ formData, setFormData, formErrors }) => {
    return (
        <div className="w-full">
            <h3 className="font-semibold text-gray-600 mb-2">Datos generales del Aula</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Docente de la materia:</label>
                    <input
                        type="text"
                        value={formData.teacher}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, teacher: e.target.value }))}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                    {formErrors.teacher && <p className="text-red-600 text-sm mt-1">{formErrors.teacher}</p>}
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                    >
                        Código de docente:
                    </label>
                    <input
                        type="text"
                        value={formData.teacherCode}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, teacherCode: e.target.value }))}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                    {formErrors.teacherCode && <p className="text-red-600 text-sm mt-1">{formErrors.teacherCode}</p>}
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                    >
                        Facultad:
                    </label>
                    <input
                        type="text"
                        value={formData.faculty}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, faculty: e.target.value }))}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                    {formErrors.faculty && <p className="text-red-600 text-sm mt-1">{formErrors.faculty}</p>}
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                    >
                        Plan:
                    </label>
                    <select
                        value={formData.plan}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, plan: e.target.value }))}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    >
                        <option value="">Selecciona un plan</option>
                        <option value="Semestral">Semestral</option>
                        <option value="Anual">Anual</option>
                    </select>
                    {formErrors.plan && <p className="text-red-600 text-sm mt-1">{formErrors.plan}</p>}
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                    >
                        Modalidad:
                    </label>
                    <select
                        value={formData.modality}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, modality: e.target.value }))}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    >
                        <option>Selecciona una modalidad</option>
                        <option>Presencial</option>
                        <option>Virtual</option>
                    </select>
                    {formErrors.modality && <p className="text-red-600 text-sm mt-1">{formErrors.modality}</p>}
                </div>
            </div>
        </div>
    );
};

export default GeneralDataSection;
