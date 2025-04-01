import { AreaNames } from "../../utils/enums/areaNames";

export const FilterButtonsArea: React.FC<{ filter: AreaNames | '', setFilter: (filter: AreaNames | '') => void }> = ({ filter, setFilter }) => {
    const buttons = [
        { label: 'Todas', value: AreaNames.ALL },
        { label: 'Diseño Técnico', value: AreaNames.TECNICO },
        { label: 'Diseño de Formación', value: AreaNames.FORMACION },
        { label: 'Diseño Gráfico', value: AreaNames.GRAFICO },
        { label: 'Calidad Académica', value: AreaNames.ACADEMICO }
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