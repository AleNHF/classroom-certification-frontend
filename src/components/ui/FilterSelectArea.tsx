import { AreaNames } from "../../utils/enums/areaNames";

export const FilterSelectArea: React.FC<{ filter: AreaNames | '', setFilter: (filter: AreaNames | '') => void }> = ({ filter, setFilter }) => (
    <select
        className="w-full px-4 py-2 border border-red-500 rounded-full focus:outline-none focus:ring focus:ring-red-300 bg-white md:hidden mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value as '' | AreaNames)}
    >
        <option value="">Todas</option>
        <option value={AreaNames.FORMACION}>Diseño de Formación</option>
        <option value={AreaNames.TECNICO}>Diseño Técnico</option>
        <option value={AreaNames.GRAFICO}>Diseño Gráfico</option>
        <option value={AreaNames.ACADEMICO}>CALIDAD ACADÉMICA</option>
    </select>
);