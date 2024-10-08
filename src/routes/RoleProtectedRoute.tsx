import React, { useMemo } from "react";
import { Navigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";
import { RoleProtectedRouteProps } from "../types/utils/protedtedRouteTypes";

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, element }) => {
    const { isAuthenticated, getUserRole } = useAuthContext();

    const userRole = useMemo(() => getUserRole(), [getUserRole]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verifica que el usuario tenga el rol adecuado
    if (!allowedRoles.includes(userRole!)) {
        return <Navigate to="/no-access" replace />;
    }

    return <>{element}</>;
};

export default RoleProtectedRoute;
