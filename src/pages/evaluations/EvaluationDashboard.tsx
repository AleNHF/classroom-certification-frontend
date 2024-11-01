import { useLocation } from "react-router-dom";
import { HeaderComponent, PageHeaderComponent } from "../../components";

interface Course {
    id: string;
    name: string;
    status: 'PENDIENTE' | 'COMPLETADO';
}

const EvaluationDashboard = () => {
    const course: Course = {
        id: '[1-2021]',
        name: 'INTRODUCCION A LA SOCIOLOGIA - TV',
        status: 'PENDIENTE'
    };

    const location = useLocation();
    const classroom = location.state?.classroom;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title={`${course.id} ${course.name}`} />
                    <div className="container mx-auto px-6 py-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6">
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <div className="space-y-2">
                                        {/* <h2 className="text-lg font-medium text-gray-900">
                                            {course.id} {course.name}
                                        </h2> */}
                                        <p className="text-gray-700">
                                            ESTADO: <span className="font-medium">{course.status}</span>
                                        </p>
                                    </div>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium"
                                        onClick={() => console.log('Iniciar evaluación')}
                                    >
                                        INICIAR EVALUACIÓN
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EvaluationDashboard;