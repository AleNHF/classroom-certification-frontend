import React from 'react';
import HeaderComponent from '../components/HeaderComponent';

const HomePage: React.FC = () => {
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');

    return (
        <>
            <div className="flex flex-col items-center justify-center bg-white h-full">
                {/* Header */}
                <HeaderComponent />

                {/* Main Content */}
                <div className="flex items-center justify-center mt-2 w-full max-w-6xl">
                    <h1>Bienvenido, {name}</h1>
                    <p>Tu nombre de usuario es: {username}</p>
                </div>
            </div>
        </>
    );
};

export default HomePage;
