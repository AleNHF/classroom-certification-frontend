import React from 'react';

interface CourseProgressProps {
    courseName: string;
    cycleInfo: string;
    progress: number;
    labels: string[];
}

const CourseProgress: React.FC<CourseProgressProps> = ({
    courseName,
    cycleInfo,
    progress,
    labels
}) => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 mb-6">
                <h1 className="text-xl font-medium">CERTIFICACIÓN DE AULAS</h1>
            </div>

            {/* Course Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
                {/* Course Title */}
                <h2 className="text-gray-800 text-lg mb-4">{courseName}</h2>

                {/* Cycle Info */}
                <p className="text-sm text-gray-600 mb-6">{cycleInfo}</p>

                {/* Progress Bar Container */}
                <div className="mb-6">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Labels */}
                <div className="space-y-2">
                    {labels.map((label, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-sm text-gray-600">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Example usage component
const CertificationView = () => {
    return (
        <CourseProgress
            courseName="[1-2021] INTRODUCCIÓN A LA SOCIOLOGÍA - TV"
            cycleInfo="CICLO I - DISEÑO TÉCNICO"
            progress={50}
            labels={[
                "Etiqueta",
                "Carpeta Pedagógica - Datos de la asignatura"
            ]}
        />
    );
};

export default CertificationView;