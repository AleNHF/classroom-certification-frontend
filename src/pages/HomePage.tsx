import React from 'react';
import HeaderComponent from '../components/HeaderComponent';

const HomePage: React.FC = () => {
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                {/* Header */}
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-center mt-2 w-full max-w-6xl px-4">
                    <h1>Bienvenido, {name}</h1>
                    <p>Tu nombre de usuario es: {username}</p>
                </div>
            </div>
        </>
    );
};

export default HomePage;
