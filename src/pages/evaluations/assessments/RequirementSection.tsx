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
                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
                <input
                    type="text"
                    name="url"
                    placeholder="URL"
                    value={newRequirement.url}
                    onChange={onRequirementChange}
                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
                <button
                    onClick={onAddRequirement}
                    className="ml-2 bg-primary-red-color hover:bg-red-400 text-white p-2 mt-2 rounded-md"
                >
                    AGREGAR
                </button>
            </div>
            <RequirementsTable
                requirements={requirements}
                onDeleteRequirement={onDeleteRequirement}
            />
        </div>
    );
};