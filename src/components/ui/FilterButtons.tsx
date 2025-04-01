import { ClassroomStatus } from "../../utils/enums/classroomStatus";

export const FilterButtons: React.FC<{ filter: ClassroomStatus | '', setFilter: (filter: ClassroomStatus | '') => void }> = ({ filter, setFilter }) => {
    const buttons = [
        { label: 'Todas', value: ClassroomStatus.ALL },
        { label: 'Pendiente', value: ClassroomStatus.PENDING },
        { label: 'En Proceso', value: ClassroomStatus.PROCESSING },
        { label: 'Evaluada', value: ClassroomStatus.EVALUATED },
        { label: 'Certificada', value: ClassroomStatus.CERTIFIED }
    ];

    return (
        <div className="hidden md:flex w-full space-x-4">
            {buttons.map(button => (
                <button
                    key={button.value}
                    className={`px-4 py-2 rounded-full border ${filter === button.value ? 'bg-red-500 text-white' : 'border-red-500 text-red-500'}`}
                    onClick={() => setFilter(button.value)}
                >
                    {button.label}
                </button>
            ))}
        </div>
    );
};