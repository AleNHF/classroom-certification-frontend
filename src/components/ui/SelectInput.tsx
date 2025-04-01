export const SelectInput: React.FC<{
    label: string;
    value: string;
    options: any[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
}> = ({ label, value, options, onChange, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
            <option value="">Selecciona una opción</option>
            {options.map((option: any) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
);