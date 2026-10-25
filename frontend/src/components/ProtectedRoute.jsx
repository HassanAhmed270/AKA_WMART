import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false, roles }) => {
    const user = useSelector(store => store.user.user);

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Admin or worker dashboard access
    if (adminOnly && !(user.role === "admin" || user.role === "worker")) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;