import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ContentToPDF: React.FC<{ contentData: any[], classroom: any, type: any }> = ({ contentData, classroom, type }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPDF = async () => {
        if (!contentRef.current) return;

        setIsDownloading(true);

        try {
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margins = 30;
            const contentWidth = pdfWidth - (margins * 2);
            const headerHeight = 60;

            // Portada
            pdf.setFontSize(14);
            pdf.text('ANEXOS MATRIZ DE INDICADORES', pdfWidth / 2, margins + 10, { align: 'center' });
            pdf.text(`ASIGNATURA: ${classroom.code} - ${classroom.name}`, pdfWidth / 2, margins + 30, { align: 'center' });

            // Obtener todos los módulos
            const modules = Array.from(contentRef.current.querySelectorAll('.pdf-module'));
            let currentY = headerHeight;
            let isFirstModuleOnPage = true;

            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];

                // Capturar el módulo actual como canvas
                const canvas = await html2canvas(module as HTMLElement, {
                    scale: 1.5,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const aspectRatio = canvas.height / canvas.width;
                const imgWidth = contentWidth;
                const imgHeight = contentWidth * aspectRatio;

                // Si es el primer módulo de la página
                if (isFirstModuleOnPage) {
                    // Si no es el primer módulo del documento, agregar nueva página
                    if (i > 0) {
                        pdf.addPage();
                        currentY = margins;
                    }

                    // Agregar el primer módulo
                    pdf.addImage(imgData, 'PNG', margins, currentY, imgWidth, imgHeight);
                    currentY += imgHeight + 30;

                    // Verificar si hay espacio para otro módulo y si hay otro módulo disponible
                    if (i + 1 < modules.length) {
                        // Capturar el siguiente módulo para ver si cabe
                        const nextCanvas = await html2canvas(modules[i + 1] as HTMLElement, {
                            scale: 1.5,
                            useCORS: true,
                            logging: false,
                            backgroundColor: '#ffffff'
                        });

                        const nextImgHeight = contentWidth * (nextCanvas.height / nextCanvas.width);

                        // Si el siguiente módulo cabe en la página actual
                        if (currentY + nextImgHeight <= pdfHeight - margins) {
                            isFirstModuleOnPage = false;
                            continue;
                        }
                    }
                    isFirstModuleOnPage = true;
                } else {
                    // Es el segundo módulo de la página
                    pdf.addImage(imgData, 'PNG', margins, currentY, imgWidth, imgHeight);
                    isFirstModuleOnPage = true;
                }
            }

            pdf.save(`anexos-matriz-indicadores-${classroom.code}`);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Hubo un error al generar el PDF. Por favor, intente nuevamente.');
        } finally {
            setIsDownloading(false);
        }
    };

    const getBlockPeriodText = (blockperiod: number) => {
        if (blockperiod === 0) return "No bloquear discusiones";
        // El período está en segundos, convertir a días
        const days = blockperiod / (24 * 60 * 60);
        return `Bloquear después de ${days} días de inactividad`;
    };

    const renderForumContent = () => {
        return (
            <div className="space-y-6 w-full mt-6 mb-2">
                {contentData.map((forum, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow space-y-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                            {forum.name.trim() || "Foro sin nombre"}
                        </h3>

                        {/* Tipo de foro */}
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Tipo de foro
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">{forum.type}</p>
                        </div>

                        {/* Introducción */}
                        {forum.intro && (
                            <div className="mb-2">
                                <h4 className="text-sm font-semibold text-gray-800">
                                    Descripción
                                </h4>
                                <div
                                    className="text-gray-600 text-sm mb-2"
                                    dangerouslySetInnerHTML={{ __html: forum.intro }}
                                />
                            </div>
                        )}

                        {/* Configuración de archivos adjuntos */}
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Configuración de archivos adjuntos
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Número máximo de archivos adjuntos: {forum.maxattachments}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Tamaño máximo de archivo: {forum.maxbytes > 0 ? `${(forum.maxbytes / 1024 / 1024).toFixed(2)} MB` : 'Sin límite'}
                            </p>
                        </div>

                        {/* Suscripción y seguimiento */}
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Suscripción y seguimiento
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Modo de suscripción: {forum.forcesubscribe === 1 ? 'Suscripción forzosa' : 'Suscripción opcional'}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Seguimiento de lectura: {forum.trackingtype === 1 ? 'Habilitado' : 'Deshabilitado'}
                            </p>
                        </div>

                        {/* Bloqueo de discusiones */}
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Configuración de bloqueo
                            </h4>
                            <p className="text-gray-600 text-sm">
                                {getBlockPeriodText(forum.blockperiod)}
                            </p>
                            {forum.blockafter > 0 && (
                                <p className="text-gray-600 text-sm">
                                    Umbral de mensajes para bloqueo: {forum.blockafter}
                                </p>
                            )}
                            {forum.warnafter > 0 && (
                                <p className="text-gray-600 text-sm">
                                    Mostrar advertencia después de: {forum.warnafter} mensajes
                                </p>
                            )}
                        </div>

                        {/* Calificación */}
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Calificación
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Escala de calificación: {forum.scale > 0 ? `${forum.scale} puntos` : 'Sin calificación'}
                            </p>
                        </div>

                        {/* Discusiones */}
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Estado de discusiones
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Número de discusiones: {forum.numdiscussions}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Creación de discusiones: {forum.cancreatediscussions ? 'Permitida' : 'No permitida'}
                            </p>
                        </div>

                        {/* Ajustes comunes */}
                        <div className="mb-2">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Ajustes comunes del módulo
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Disponibilidad: {forum.uservisible ? 'Se muestra en la página del curso' : 'No se muestra en la página del curso'}
                            </p>
                            <p className="text-gray-600 text-sm">
                                ID del módulo: {forum.cmid || 'No especificado'}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Idioma: {forum.lang ? forum.lang : 'No forzado'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderGeneralContent = () => {
        return (
            <div className="space-y-6 w-full mt-6 mb-2">
                {contentData.map((section, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        {/* Encabezado de la sección */}
                        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                            {section.name.trim() || "Sección sin nombre"}
                        </h2>

                        {/* Listado de módulos */}
                        <ul className="space-y-6">
                            {section.modules?.map((module: any, moduleIndex: any) => (
                                <li
                                    key={moduleIndex}
                                    className="border-b last:border-none pb-4 pdf-module"
                                >
                                    {/* Nombre del módulo */}
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-medium text-gray-700">
                                            {module.name || "Módulo sin título"}
                                        </h3>
                                    </div>

                                    {/* Tipo de recurso */}
                                    {module.modplural && (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Recurso
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-2">{module.modplural}</p>
                                        </div>
                                    )}

                                    {/* Descripción del módulo */}
                                    {module.description ? (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Descripción
                                            </h4>
                                            <p
                                                className="text-gray-600 text-sm mb-2"
                                                dangerouslySetInnerHTML={{ __html: module.description }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Descripción
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-2">Ninguna</p>
                                        </div>
                                    )}

                                    {/* Información de disponibilidad */}
                                    {module.availabilityinfo ? (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Restricciones de acceso
                                            </h4>
                                            <p
                                                className="text-sm text-gray-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: module.availabilityinfo,
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Restricciones de acceso
                                            </h4>
                                            <p className="text-sm text-gray-600">Ninguna</p>
                                        </div>
                                    )}

                                    {/* Detalles de finalización */}
                                    {module.completiondata ? (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Finalización de la actividad
                                            </h4>
                                            {module.completiondata.details?.length > 0 ? (
                                                <>
                                                    <p className="text-sm text-gray-600">
                                                        El estudiante debe:
                                                    </p>
                                                    <ul className="list-disc pl-6 text-gray-600 text-sm">
                                                        {module.completiondata.details.map((detail: any, detailIndex: any) => (
                                                            <li key={detailIndex}>
                                                                {detail.rulevalue?.description || "Acción requerida"}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-600">
                                                    No hay detalles de finalización disponibles.
                                                </p>
                                            )}
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Rastreo de finalización
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {module.completiondata.isautomatic
                                                    ? "La actividad se completa cuando se cumplen las condiciones"
                                                    : "No se indica finalización de la actividad para este recurso"}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Finalización de la actividad
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                No indica la finalización de actividad para este recurso.
                                            </p>
                                        </div>
                                    )}

                                    {/* Disponibilidad */}
                                    {module.uservisible ? (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Disponibilidad
                                            </h4>
                                            <p className="text-sm text-gray-600">Se muestra en la página del curso</p>
                                        </div>
                                    ) : (
                                        <div className="mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Disponibilidad
                                            </h4>
                                            <p className="text-sm text-gray-600">No se muestra en la página del curso</p>
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
                                                        content.filename !== "index.html"
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
        );
    }

    return (
        <div>
            <div className="flex w-full justify-end mb-4">
                <button
                    className={`bg-black text-white text-sm w-44 h-9 p-2 rounded-lg ml-2 ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'
                        }`}
                    onClick={() => downloadPDF()}
                    disabled={isDownloading}
                >
                    {isDownloading ? 'DESCARGANDO...' : 'DESCARGAR'}
                </button>
            </div>

            <div ref={contentRef}>
                {type === 'forum' ? renderForumContent() : renderGeneralContent()}
            </div>
        </div>
    );
};

export default ContentToPDF;