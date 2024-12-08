// FormModalContent.tsx
import React, { useEffect, useState } from 'react';
import { FormDataProps, Platform } from '../../../types';
import apiService from '../../../services/apiService';

interface FormModalContentProps {
    formData: FormDataProps;
    setFormData: React.Dispatch<React.SetStateAction<FormDataProps>>;
    formErrors: Record<string, string>;
}

const FormModalContent: React.FC<FormModalContentProps> = ({ formData, setFormData, formErrors }) => {
    const [platformList, setPlatformList] = useState<Platform[]>([]);

    useEffect(() => {
        // Cargar las plataformas al montar el componente
        const loadPlatforms = async () => {
            try {
                const data = await apiService.getPlatforms();
                setPlatformList(data.data.platforms);
            } catch (error) {
                console.error('Error al cargar las plataformas:', error);
            }
        };

        loadPlatforms();
    }, []);

    return (
        <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        value={formData.name}
                        disabled
                        //onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                    {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Servidor</label>
                    <select
                        value={formData.server}
                        onChange={(e) => setFormData((prev) => ({ ...prev, server: e.target.value }))}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    >
                        <option value="">Selecciona un servidor</option>
                        {platformList.map((platform) => (
                            <option key={platform.id} value={platform.id}>
                                {platform.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.server && <p className="text-red-600 text-sm">{formErrors.server}</p>}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Autor de Contenido</label>
                <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
                {formErrors.author && <p className="text-red-600 text-sm mt-1">{formErrors.author}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Carrera</label>
                    <input
                        type="text"
                        value={formData.career}
                        onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                    {formErrors.career && <p className="text-red-600 text-sm mt-1">{formErrors.career}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Director/a</label>
                    <input
                        type="text"
                        value={formData.director}
                        onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                        className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                    {formErrors.director && <p className="text-red-600 text-sm mt-1">{formErrors.director}</p>}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Responsable DEDTE-F</label>
                <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
                {formErrors.responsible && <p className="text-red-600 text-sm mt-1">{formErrors.responsible}</p>}
            </div>
        </form>
    );
};

export default FormModalContent;