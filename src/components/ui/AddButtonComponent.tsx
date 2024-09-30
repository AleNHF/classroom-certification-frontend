import React from 'react';

interface AddButtonComponentProps {
    onClick: () => void;
}

const AddButtonComponent: React.FC<AddButtonComponentProps> = ({ onClick }) => {
    return (
        <div className="flex w-full justify-end mb-4">
            <button 
                className="bg-primary-red-color text-white text-sm px-10 py-2 rounded-lg ml-2" 
                onClick={onClick}
            >
                AGREGAR
            </button>
        </div>
    );
};

export default AddButtonComponent;
