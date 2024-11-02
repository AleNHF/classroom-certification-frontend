// SearchInputComponent.tsx
import React from 'react';

interface SearchInputComponentProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    fieldTerm: string;
    setFieldTerm: (term: string) => void;
    onSearch: () => void;
}

const SearchInputComponent: React.FC<SearchInputComponentProps> = ({ searchTerm, setSearchTerm, fieldTerm, setFieldTerm, onSearch }) => {
    return (
        <div className="flex items-center w-full max-w-3xl flex-wrap">
            <div className="flex-grow border border-gray-300 bg-transparent rounded-full shadow-md px-2 mb-2 sm:mb-0">
                <div className="flex items-center">
                    <select
                        value={fieldTerm || 'id'}
                        onChange={(e) => setFieldTerm(e.target.value)}
                        className="bg-transparent text-black outline-none mr-2 border border-transparent focus:border-white focus:ring-2 focus:ring-white rounded-md">
                        <option value="id">Identificador</option>
                        <option value="fullname">Nombre</option>
                        <option value="shortname">Código</option>
                    </select>
                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                    <input
                        type="text"
                        placeholder="Ingresa el nombre o código del aula que deseas buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow bg-transparent text-black outline-none border-b border-white focus:border-b-2 focus:border-white px-2 py-1.5" // Reduce el padding vertical
                    />
                </div>
            </div>
            <button
                onClick={onSearch}
                className="ml-0 sm:ml-4 bg-primary-red-color text-white text-sm px-4 py-2 rounded-md w-full sm:w-24 flex items-center justify-center"
            >
                BUSCAR
            </button>
        </div>
    );
};

export default SearchInputComponent;
