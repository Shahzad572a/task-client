import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { BASE_URL } from '../constants';
const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('pending');
    const [editingIndex, setEditingIndex] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDueDate, setFilterDueDate] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch(`${BASE_URL}/api/tasks`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('userInfo')}`,
            },
          });
        const data = await response.json();
        setTasks(data);
    };

    const addOrUpdateTask = async () => {
        const taskData = { title, description, dueDate, status };
        const token = localStorage.getItem('userInfo');
        if (editingIndex !== null) {
            await fetch(`${BASE_URL}/api/tasks/${tasks[editingIndex]._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
            setEditingIndex(null);
        } else {
            await fetch(`${BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                 },
                body: JSON.stringify(taskData),
            });
        }
        resetForm();
        fetchTasks();
    };

    const deleteTask = async (index) => {
        await fetch(`${BASE_URL}/api/tasks/${tasks[index]._id}`, {
            method: 'DELETE',
        });
        fetchTasks();
    };

    const editTask = (index) => {
        const taskToEdit = tasks[index];
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setDueDate(taskToEdit.dueDate);
        setStatus(taskToEdit.status);
        setEditingIndex(index);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('pending');
    };

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesDueDate = !filterDueDate || task.dueDate === filterDueDate;
        return matchesStatus && matchesDueDate;
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
            <div className="mb-4">
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
                <button onClick={addOrUpdateTask} className="bg-blue-500 text-white p-2 rounded">
                    {editingIndex !== null ? 'Update Task' : 'Add Task'}
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-2">Filters</h2>
            <div className="mb-4">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border p-2 mr-2 rounded"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <input
                    type="date"
                    value={filterDueDate}
                    onChange={(e) => setFilterDueDate(e.target.value)}
                    className="border p-2 mr-2 rounded"
                />
            </div>

            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            {filteredTasks.length === 0 ? (
                <p>No tasks available</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300 rounded">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="py-2 px-4">Title</th>
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">Due Date</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-4">{task.title}</td>
                                <td className="py-2 px-4">{task.description}</td>
                                <td className="py-2 px-4">{task.dueDate}</td>
                                <td className="py-2 px-4">{task.status}</td>
                                <td className="py-2 px-4 flex space-x-2">
                                    <button onClick={() => editTask(index)} className="text-yellow-500">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => deleteTask(index)} className="text-red-500">
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

export default Tasks;
