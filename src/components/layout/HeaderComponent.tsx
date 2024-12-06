import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Platform } from "../../types";
import apiService from "../../services/apiService";

const HeaderComponent: React.FC = () => {
    const { isAuthenticated, logout } = useAuthContext();
    // Obtén el nombre de usuario desde el localStorage
    const username = localStorage.getItem('name') || '';
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState<string>("");
    const [selectedOptionName, setSelectedOptionName] = useState<string>("Selecciona un servidor");
    const [platformList, setPlatformList] = useState<Platform[]>([]);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await apiService.getPlatforms();
                setPlatformList(data.data.platforms)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        };
        loadData();
    }, [platformList]);

    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const selectedName = platformList.find((platform) => String(platform.id) === selectedId)?.name || "Selecciona un servidor";

        setSelectedOptionId(selectedId);
        setSelectedOptionName(selectedName);

        if (selectedId) {
            try {
                const platform = await apiService.selectPlatform(selectedId);
                localStorage.setItem('token_platform', platform.data.token);
            } catch (error) {
                console.error("Error selecting platform:", error);
            }
        }
    };

    return (
        <header className="w-full bg-primary-black-color text-white font-semibold px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
            {/* Title Section */}
            <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-0 text-center sm:text-left">
                CERTIFICACIÓN DE AULAS
            </h1>

            {/* User Dropdown */}
            {isAuthenticated && (
                <div className="relative flex items-center">
                    {/* Select Dropdown */}
                    <select
                        value={selectedOptionId}
                        onChange={handleSelectChange}
                        className="mr-10 px-2 py-1 bg-transparent text-white text-sm rounded-md focus:outline-none"
                    >
                        <option className="text-gray-900" value="">
                            Selecciona un servidor
                        </option>
                        {platformList.map((option) => (
                            <option className="text-gray-900" key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={toggleDropdown}
                        className="flex items-center text-sm sm:text-base text-white focus:outline-none space-x-2"
                    >
                        {/* User Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 sm:w-6 sm:h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                        <span>{username}</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-7 top-5 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
                            <button
                                onClick={logout}
                                className="flex items-center px-4 py-3 text-sm w-full text-left rounded-lg hover:bg-gray-200 space-x-2"
                            >
                                <svg
                                    width="16"
                                    height="14"
                                    viewBox="0 0 16 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                                        fill="#90A4AE"
                                    />
                                </svg>
                                <span className="text-gray-500">Cerrar sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default HeaderComponent;
