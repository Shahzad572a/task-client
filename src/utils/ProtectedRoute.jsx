import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, allowedRoles, ...props }) => {
    // Retrieve user info and role from local storage
    const userInfo = localStorage.getItem('userInfo'); // Check if user is logged in
    const userRole = localStorage.getItem('userRole'); // Get user role

    // Check if the user is allowed based on their role
    const isAllowed = userInfo && allowedRoles.includes(userRole);

    // If allowed, render the component with any additional props
    return isAllowed ? <Element {...props} /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
