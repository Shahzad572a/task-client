// src/components/TeamMembers.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserTasks from './UserTasks';

const TeamMembers = ({ managerId }) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/team/${managerId}`);
                setTeamMembers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMembers();
    }, [managerId]);

    const handleUserClick = (userId) => {
        setSelectedUserId(userId);
    };

    const handleBack = () => {
        setSelectedUserId(null);
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <>
            {selectedUserId ? (
                // Show UserTasks component if a user is selected
                <UserTasks userId={selectedUserId} onBack={handleBack} />
            ) : (
                // Show Team Members list if no user is selected
                <div className="max-w-2xl mx-auto p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Team Members</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Username</th>
                                <th className="border border-gray-300 p-2 text-left">Email</th>
                                <th className="border border-gray-300 p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map(member => (
                                <tr
                                    key={member._id}
                                    className="border-b border-gray-300 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => handleUserClick(member._id)}
                                >
                                    <td className="border border-gray-300 p-2">{member.username}</td>
                                    <td className="border border-gray-300 p-2">{member.email}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button
                                            onClick={() => handleUserClick(member._id)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                                        >
                                            View Tasks
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default TeamMembers;
