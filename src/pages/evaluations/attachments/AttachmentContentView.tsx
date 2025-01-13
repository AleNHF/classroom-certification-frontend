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
                console.log(contentJson);
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
                                    <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                                        {section.name.trim() || `Sección ${index + 1}`}
                                    </h2>

                                    {/* Resumen de la sección */}
                                    {section.summary && (
                                        <div
                                            className="text-gray-600 text-sm mb-4"
                                            dangerouslySetInnerHTML={{ __html: section.summary }}
                                        />
                                    )}

                                    {/* Listado de módulos */}
                                    <ul className="space-y-6">
                                        {section.modules?.map((module: any, moduleIndex: any) => (
                                            <li
                                                key={moduleIndex}
                                                className="border-b last:border-none pb-4"
                                            >
                                                {/* Nombre del módulo */}
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-lg font-medium text-gray-700">
                                                        {module.name || "Módulo sin título"}
                                                    </h3>
                                                </div>

                                                {/* Descripción del módulo */}
                                                {module.description && (
                                                    <p
                                                        className="text-gray-600 text-sm mb-2"
                                                        dangerouslySetInnerHTML={{ __html: module.description }}
                                                    />
                                                )}

                                                {/* Información de disponibilidad */}
                                                {module.availabilityinfo && (
                                                    <div className="mb-2">
                                                        <h4 className="text-sm font-semibold text-yellow-600">
                                                            Disponibilidad
                                                        </h4>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            dangerouslySetInnerHTML={{
                                                                __html: module.availabilityinfo,
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Detalles de finalización */}
                                                {module.completiondata && (
                                                    <div className="mb-2">
                                                        <h4 className="text-sm font-semibold text-gray-800">
                                                            Detalles de finalización
                                                        </h4>
                                                        {module.completiondata.details?.length > 0 && (
                                                            <ul className="list-disc pl-6 text-gray-600 text-sm">
                                                                {module.completiondata.details.map(
                                                                    (detail: any, detailIndex: any) => (
                                                                        <li key={detailIndex}>
                                                                            {detail.rulevalue.description ||
                                                                                "Acción requerida"}
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        )}
                                                        <p className="text-sm">
                                                            Automático:{" "}
                                                            {module.completiondata.isautomatic
                                                                ? "Sí (se completa automáticamente)"
                                                                : "No (requiere acción manual)"}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Contenidos */}
                                                {module.contents?.length > 0 && (
                                                    <div className="mb-2">
                                                        <h4 className="text-sm font-semibold text-gray-800">
                                                            Contenido
                                                        </h4>
                                                        <ul className="pl-4 mt-2 space-y-1">
                                                            {module.contents.map((content: any, contentIndex: any) => {
                                                                if (
                                                                    module.modname === "book" &&
                                                                    content.filename === "structure"
                                                                ) {
                                                                    return null; // Ignorar si el tipo es "structure"
                                                                }
                                                                return (
                                                                    <li
                                                                        key={contentIndex}
                                                                        className="text-gray-600 text-sm"
                                                                    >
                                                                        {module.modname === "book" ? (
                                                                            <span>
                                                                                {content.content ||
                                                                                    "Contenido no disponible"}
                                                                            </span>
                                                                        ) : (
                                                                            <a
                                                                                href={content.fileurl || "#"}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="underline text-blue-600 hover:text-blue-800"
                                                                            >
                                                                                {content.filename || "Archivo sin título"}
                                                                            </a>
                                                                        )}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                )}
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