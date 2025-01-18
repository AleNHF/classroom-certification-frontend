import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ContentToPDF: React.FC<{ contentData: any[] }> = ({ contentData }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!contentRef.current) return;

        try {
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margins = 40;

            // Agregar título en la primera página
            pdf.setFontSize(16);
            pdf.text('Contenido del Aula', pdfWidth / 2, margins, { align: 'center' });

            // Obtener todos los elementos de sección
            const sections = contentRef.current.querySelectorAll('.pdf-section');
            let currentY = margins + 30; // Empezar después del título

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];

                // Capturar cada sección como canvas
                const canvas = await html2canvas(section as HTMLElement, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                });

                // Convertir a imagen
                const imgData = canvas.toDataURL('image/png');

                // Calcular dimensiones de la imagen
                const imgWidth = pdfWidth - (margins * 2);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Si la imagen no cabe en el espacio restante de la página actual
                if (currentY + imgHeight > pdfHeight - margins) {
                    pdf.addPage(); // Agregar nueva página
                    currentY = margins; // Resetear Y al inicio de la nueva página
                }

                // Agregar imagen a la página actual
                pdf.addImage(imgData, 'PNG', margins, currentY, imgWidth, imgHeight);
                currentY += imgHeight + 20; // Agregar espacio entre secciones
            }

            pdf.save('contenido-aula.pdf');
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
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow pdf-section"
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
                                        className="border-b last:border-none pb-4"
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