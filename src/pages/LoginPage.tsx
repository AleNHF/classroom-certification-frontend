import React from 'react';
import LoginForm from '../components/LoginForm';
import loginImage from '../assets/login_image.svg';
import HeaderComponent from '../components/HeaderComponent';

const LoginPage: React.FC = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                {/* Header */}
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-center mt-2 w-full max-w-6xl px-4">
                    {/* Left Section (Image) */}
                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                        <img
                            src={loginImage}
                            alt="Certification Illustration"
                            className="w-full object-cover"
                        />
                    </div>

                    {/* Right Section (Form) */}
                    <div className="w-full md:w-1/2">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
