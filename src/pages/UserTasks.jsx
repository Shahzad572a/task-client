// src/components/UserTasks.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants';
const UserTasks = ({ userId, onBack }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending',
        user: userId
    });

    useEffect(() => {
        const fetchUserTasks = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/tasks/${userId}`);
                setTasks(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserTasks();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status,
            user: task.user
        });
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${BASE_URL}/api/tasks/${editingTask._id}`, newTask);
            setTasks(tasks.map(task => (task._id === editingTask._id ? response.data : task)));
            setNewTask({ title: '', description: '', dueDate: '', status: 'pending', user: userId });
            setEditingTask(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`${BASE_URL}/api/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="text-center">Loading tasks...</p>;
    if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

    return (
        <div className="w-[70rem] mx-auto bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold text-center mb-4">{editingTask ? 'Edit Task' : 'Manage Tasks'}</h3>

            {/* Back Button */}
            <button onClick={onBack} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
                Back back
            </button>

            {editingTask && (
                <form onSubmit={handleUpdateTask} className="space-y-4 mb-6">
                    <input
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        placeholder="Task Title"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="text"
                        name="description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        placeholder="Task Description"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={newTask.dueDate}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <select
                        name="status"
                        value={newTask.status}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Update Task
                    </button>
                </form>
            )}

            <h4 className="text-lg font-semibold mt-6">Task List</h4>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Title</th>
                        <th className="border border-gray-300 p-2 text-left">Description</th>
                        <th className="border border-gray-300 p-2 text-left">Due Date</th>
                        <th className="border border-gray-300 p-2 text-left">Status</th>
                        <th className="border border-gray-300 p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task._id} className="border-b border-gray-300">
                            <td className="border border-gray-300 p-2">{task.title}</td>
                            <td className="border border-gray-300 p-2">{task.description}</td>
                            <td className="border border-gray-300 p-2">{task.dueDate}</td>
                            <td className="border border-gray-300 p-2">{task.status}</td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    onClick={() => handleEditTask(task)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition ml-2"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTasks;
