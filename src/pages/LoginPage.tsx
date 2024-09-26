import React from 'react';
import LoginForm from '../components/LoginForm';
import loginImage from '../assets/login_image.svg';
import HeaderComponent from '../components/HeaderComponent';

const LoginPage: React.FC = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center bg-white h-full">
                {/* Header */}
                <HeaderComponent/>

                {/* Main Content */}
                <div className="flex items-center justify-center mt-2 w-full max-w-6xl">
                    {/* Left Section (Image/Illustration) */}
                    <div className="w-1/2 ">
                        <img
                            src={loginImage}
                            alt="Certification Illustration"
                            className="w-full object-cover"
                        />
                    </div>

                    {/* Right Section (Form) */}
                    <div className="w-1/2">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
