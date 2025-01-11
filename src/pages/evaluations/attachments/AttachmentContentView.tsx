import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeaderComponent, HeaderComponent, AlertComponent } from '../../../components';

const AttachmentContentView: React.FC = () => {
    const location = useLocation();
    const contentJson = location.state?.attachContent;

    const [contentData, setContentData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contentJson) {
                    const response = await fetch(contentJson);
                    if (!response.ok) {
                        throw new Error("Error al cargar los datos del aula.");
                    }
                    const data = await response.json();
                    setContentData(data);
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [contentJson]);

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-gray-50 min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title="CONTENIDO DEL AULA" />

                    {/* Indicador de carga o error */}
                    {isLoading && (
                        <AlertComponent type="info" message={"Cargando..."} className="mb-4 w-full" />
                    )}
                    {error && (
                        <p className="text-red-500 text-lg font-medium mt-4">
                            Error: {error}
                        </p>
                    )}

                    {/* Listado de secciones y módulos */}
                    {!isLoading && !error && (
                        <div className="space-y-6 w-full mt-6 mb-2">
                            {contentData.map((section, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    {/* Encabezado de la sección */}
                                    <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                                        {section.name || `Sección ${index + 1}`}
                                    </h2>

                                    {/* Lista de módulos */}
                                    <ul className="space-y-2">
                                        {section.modules?.map((module: any, moduleIndex: number) => (
                                            <li
                                                key={moduleIndex}
                                                className="border-b last:border-none pb-2"
                                            >
                                                <div className="flex justify-between">
                                                    <span className="text-gray-700 font-medium">
                                                        {module.name || "Sin título"}
                                                    </span>
                                                    <span className="text-gray-500 text-sm">
                                                        {module.modname}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AttachmentContentView;