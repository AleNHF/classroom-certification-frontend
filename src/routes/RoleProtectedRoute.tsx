import React, { useMemo } from "react";
import { Navigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";
import { RoleProtectedRouteProps } from "../types/protedtedRouteTypes";

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, element }) => {
    const { isAuthenticated, getUserRole } = useAuthContext();

    const userRole = useMemo(() => getUserRole(), [getUserRole]);  // Memoize user role
    console.log('userRole', userRole);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole!)) {
        return <Navigate to="/no-access" replace />;
    }

    return <>{element}</>;
};

export default RoleProtectedRoute;
