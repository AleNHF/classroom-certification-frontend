import React, { createContext, useState, useContext } from 'react';

interface PlatformContextType {
    platformId: string;
    platformName: string;
    setPlatform: (id: string, name: string) => void;
}

const PlatformContext = createContext<PlatformContextType>({
    platformId: '',
    platformName: '',
    setPlatform: () => { }
});

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [platformId, setPlatformId] = useState(localStorage.getItem('platform_id') || '');
    const [platformName, setPlatformName] = useState(localStorage.getItem('platform_name') || '');

    const setPlatform = (id: string, name: string) => {
        setPlatformId(id);
        setPlatformName(name);
        localStorage.setItem('platform_id', id);
        localStorage.setItem('platform_name', name);
    };

    return (
        <PlatformContext.Provider value={{ platformId, platformName, setPlatform }}>
            {children}
        </PlatformContext.Provider>
    );
};

export const usePlatform = () => useContext(PlatformContext);