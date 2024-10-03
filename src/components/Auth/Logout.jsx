import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data from localStorage
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userInfoId');
        localStorage.removeItem('userRole');

        // Redirect to the home page after logout
        navigate('/'); // Redirecting to home page
        
        // Refresh the page
        window.location.reload(); // This will refresh the page
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-lg">Logging out, please wait...</p>
        </div>
    );
}

export default Logout;
