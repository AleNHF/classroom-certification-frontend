import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ContentToPDF: React.FC<{ contentData: any[], classroom: any }> = ({ contentData, classroom }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!contentRef.current) return;

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
                    currentY += imgHeight + 20;
                    
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
        }
    };

    return (
        <div>
            <div className="flex w-full justify-end mb-4">
                <button
                    className="bg-black hover:bg-slate-700 text-white text-sm w-44 h-9 p-2 rounded-lg ml-2"
                    onClick={() => downloadPDF()}
                >
                    DESCARGAR
                </button>
            </div>

            <div ref={contentRef}>
                <div className="space-y-6 w-full mt-6 mb-2">
                    {contentData.map((section, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Encabezado de la sección */}
                            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                                {section.name.trim()}
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
            </div>
        </div>
    );
};

export default ContentToPDF;