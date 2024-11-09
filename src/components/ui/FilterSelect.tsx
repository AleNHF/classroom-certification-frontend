import { ClassroomStatus } from "../../utils/enums/classroomStatus";

export const FilterSelect: React.FC<{ filter: ClassroomStatus | '', setFilter: (filter: ClassroomStatus | '') => void }> = ({ filter, setFilter }) => (
    <select
        className="w-full px-4 py-2 border border-red-500 rounded-full focus:outline-none focus:ring focus:ring-red-300 bg-white md:hidden mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value as '' | ClassroomStatus)}
    >
        <option value="">Todas</option>
        <option value={ClassroomStatus.PENDING}>Pendiente</option>
        <option value={ClassroomStatus.PROCESSING}>En Proceso</option>
        <option value={ClassroomStatus.EVALUATED}>Evaluada</option>
        <option value={ClassroomStatus.CERTIFIED}>Certificada</option>
    </select>
);