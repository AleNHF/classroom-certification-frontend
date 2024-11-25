import { useNavigate } from "react-router-dom";

interface CardProps {
    title: string;
    route: string;
    onClick?: () => void; // Prop opcional para manejar clics personalizados
}


const Card: React.FC<CardProps> = ({ title, route, onClick }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (onClick) {
            onClick(); // Ejecutar la función personalizada si está definida
        } else {
            navigate(route); // Redirigir usando el route predeterminado
        }
    };

    return (
        <div className="bg-card-color shadow-md rounded-lg p-4 max-w-xs w-full flex flex-col items-center justify-between h-full">
            <h3 className="text-lg font-semibold mb-4 text-center flex-grow">{title}</h3>
            <button
                className="w-4/6 bg-primary-red-color text-white px-4 py-2 rounded-md hover:bg-red-400 transition-colors"
                onClick={handleRedirect}
            >
                INGRESAR
            </button>
        </div>
    );
};

export default Card;
