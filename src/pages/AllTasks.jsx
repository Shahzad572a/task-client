import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('pending');

    // Fetch tasks on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/tasks/all');
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    // Handle task update
    const handleUpdate = async (id) => {
        const updatedTask = { title, description, dueDate, status };
        try {
            await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });
            setTasks(tasks.map(task => (task._id === id ? { ...task, ...updatedTask } : task)));
            resetForm();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    // Handle task delete
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'DELETE',
            });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Handle editing
    const editTask = (task) => {
        setEditingTask(task._id);
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.dueDate);
        setStatus(task.status);
    };

    const resetForm = () => {
        setEditingTask(null);
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('pending');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Tasks</h1>
            {editingTask && (
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Edit Task</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 mr-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 mr-2 rounded"
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="border p-2 mr-2 rounded"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border p-2 mr-2 rounded"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => handleUpdate(editingTask)} className="bg-blue-500 text-white p-2 rounded">
                        Update Task
                    </button>
                    <button onClick={resetForm} className="bg-gray-500 text-white p-2 rounded ml-2">
                        Cancel
                    </button>
                </div>
            )}
            {tasks.length === 0 ? (
                <p>No tasks available</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300 rounded">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                        <th className="py-2 px-4">User ID</th>
                            <th className="py-2 px-4">Title</th>
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">Due Date</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task._id} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-4">{task.user}</td>
                                <td className="py-2 px-4">{task.title}</td>
                                <td className="py-2 px-4">{task.description}</td>
                                <td className="py-2 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                                <td className="py-2 px-4">{task.status}</td>
                                <td className="py-2 px-4 flex space-x-2">
                                    <button onClick={() => editTask(task)} className="text-yellow-500">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(task._id)} className="text-red-500">
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllTasks;
