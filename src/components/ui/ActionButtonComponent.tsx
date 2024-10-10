import React from 'react';

interface ActionButtonProps {
    label: string;
    onClick: () => void;
    bgColor: string;
}

const ActionButtonComponent: React.FC<ActionButtonProps> = ({ label, onClick, bgColor }) => {
    return (
        <button
            className={`${bgColor} text-white text-sm px-4 py-2 rounded-md w-full md:w-24 flex items-center justify-center`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default ActionButtonComponent;
