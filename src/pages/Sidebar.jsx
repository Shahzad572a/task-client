import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    // Retrieve userInfo from local storage
    const userInfo = localStorage.getItem('userInfo'); // Adjust this if necessary
    const userRole = localStorage.getItem('userRole'); // Retrieve user role directly

     

    return (
        <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
            <div className="p-4 text-lg font-bold">Task Manager</div>
            <nav className="flex-1 p-4">
                <ul>
                    {userInfo ? (
                        // Check for user roles and render links accordingly
                        userRole === "admin" ? (
                            <>
                                <li className="mb-2">
                                    <Link to="/all-tasks" className="block p-2 rounded hover:bg-gray-700">Tasks Management</Link>
                                </li>
                                
                                <li>
                                <Link to="/users" className="block p-2 rounded hover:bg-gray-700"> Users Management</Link>
                            </li>
                            <li>
                                <Link to="/logout" className="block p-2 rounded hover:bg-gray-700"> Logout</Link>
                            </li>
                            
                            </>
                        ) : userRole === "manager" ? (
                            <>
                                
                                <li className="mb-2">
                                    <Link to="/team" className="block p-2 rounded hover:bg-gray-700">My Team</Link>
                                </li>
                                <li>
                                <Link to="/logout" className="block p-2 rounded hover:bg-gray-700"> Logout</Link>
                            </li>
                            </>
                        ) : userRole === "regular" ? (
                            <>
                                <li className="mb-2">
                                    <Link to="/task" className="block p-2 rounded hover:bg-gray-700">My Tasks</Link>
                                </li>
                                <li>
                                <Link to="/logout" className="block p-2 rounded hover:bg-gray-700"> Logout</Link>
                            </li>
                            </>
                        ) : null
                    ) : (
                        // If no userInfo, show only Login and Register
                        <>
                            <li className="mb-2">
                                <Link to="/login" className="block p-2 rounded hover:bg-gray-700">Login</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/register" className="block p-2 rounded hover:bg-gray-700">Regester</Link>
                            </li>
                            
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
