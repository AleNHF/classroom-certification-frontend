import { Requeriment } from "../../../types";
import { RequirementsTable } from "./RequirementTable";

interface RequirementsSectionProps {
    requirements: Requeriment[];
    newRequirement: Requeriment;
    onRequirementChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddRequirement: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onDeleteRequirement: (id: string) => void;
}

export const RequirementsSection: React.FC<RequirementsSectionProps> = ({
    requirements,
    newRequirement,
    onRequirementChange,
    onAddRequirement,
    onDeleteRequirement,
}) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Requerimientos</h3>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={newRequirement.name}
                    onChange={onRequirementChange}
                    className="flex-1 p-2 border rounded"
                />
                <input
                    type="text"
                    name="url"
                    placeholder="URL"
                    value={newRequirement.url}
                    onChange={onRequirementChange}
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={onAddRequirement}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Agregar
                </button>
            </div>
            <RequirementsTable
                requirements={requirements}
                onDeleteRequirement={onDeleteRequirement}
            />
        </div>
    );
};