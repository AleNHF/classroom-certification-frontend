import { useLocation } from "react-router-dom";
import { Card, HeaderComponent, PageHeaderComponent } from "../../components";
import { ClassroomStatus } from "../../utils/enums/classroomStatus";

const mapStatusToText = (status: ClassroomStatus): string => {
    switch (status) {
        case ClassroomStatus.PENDING:
            return 'Pendiente';
        case ClassroomStatus.PROCESSING:
            return 'En Proceso';
        case ClassroomStatus.EVALUATED:
            return 'Evaluada';
        case ClassroomStatus.CERTIFIED:
            return 'Certificada'
        default:
            return status;
    }
}

const EvaluationDashboard = () => {
    const location = useLocation();
    const classroom = location.state?.classroom;

    if (!classroom || !classroom.id) {
        return <div>Error: No se encontró información del aula</div>;
    }

    const routes = {
        evaluation: `/classrooms/evaluation-personal/${classroom.id}`,
        form: `/classrooms/evaluation-formulario/${classroom.id}`,
        certificates: `/classrooms/certificates/${classroom.id}`
    }

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title={`${classroom.code}: ${classroom.name}`} />

                    <div className="flex justify-between items-center w-full my-4">
                        <p className="text-gray-700">
                            ESTADO: <span className="font-medium">{mapStatusToText(classroom.status)}</span>
                        </p>
                        <button
                            className="bg-primary-red-color hover:bg-red-400 text-white px-6 py-2 rounded-md transition-colors duration-200"
                            onClick={() => console.log('Iniciar evaluación')}
                        >
                            INICIAR EVALUACIÓN
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 w-full">
                        {(classroom.status === ClassroomStatus.PROCESSING || classroom.status === ClassroomStatus.EVALUATED || classroom.status === ClassroomStatus.CERTIFIED) && (
                            <Card title='INFORMES DE EVALUACIÓN' route={routes.evaluation} />
                        )}
                        {(classroom.status === ClassroomStatus.EVALUATED || classroom.status === ClassroomStatus.CERTIFIED) && (
                            <Card title='VALORACIÓN DE AULA VIRTUAL' route={routes.form}/>
                        )}
                        {(classroom.status === ClassroomStatus.EVALUATED || classroom.status === ClassroomStatus.CERTIFIED) && (
                            <Card title='CERTIFICADOS' route={routes.certificates} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EvaluationDashboard;
