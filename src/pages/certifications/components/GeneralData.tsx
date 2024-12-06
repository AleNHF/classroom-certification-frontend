import React from "react";
import { CertificationFormData } from "../../../types";

interface Props {
    formData: CertificationFormData;
    setFormData: React.Dispatch<React.SetStateAction<CertificationFormData>>;
}

const GeneralDataSection: React.FC<Props> = ({ formData, setFormData }) => {
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
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                    >
                        Carrera:
                    </label>
                    <input
                        type="text"
                        value={formData.career}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, career: e.target.value }))}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
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
                </div>
            </div>
        </div>
    );
};

export default GeneralDataSection;
