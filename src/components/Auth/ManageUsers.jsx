import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { BASE_URL } from '../../constants';

// Set the app element for accessibility
Modal.setAppElement('#root');

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: '', managerId: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editedUserData, setEditedUserData] = useState({ username: '', email: '', role: '', managerId: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get(`${BASE_URL}/api/users`);
    setUsers(response.data);
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    const userData = {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      managerId: newUser.role === 'regular' ? newUser.managerId : null,
    };

    try {
      await axios.post(`${BASE_URL}/api/users/`, userData);
      fetchUsers();
      closeModal(); // Close modal after adding
      setNewUser({ username: '', email: '', password: '', role: '', managerId: '' });
    } catch (error) {
      console.error("Failed to add user:", error.response?.data);
      alert(`Error: ${error.response?.data?.message || "Unknown error occurred"}`);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleEditInputChange = (e) => {
    setEditedUserData({ ...editedUserData, [e.target.name]: e.target.value });
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditedUserData({ username: user.username, email: user.email, role: user.role, managerId: user.managerId });
  };

  const handleUpdateUser = async () => {
    await axios.put(`${BASE_URL}/api/users/${editingUser}`, editedUserData);
    setEditingUser(null);
    setEditedUserData({ username: '', email: '', role: '', managerId: '' });
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    await axios.delete(`${BASE_URL}/api/users/${userId}`);
    fetchUsers();
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-4xl mx-auto w-[70rem] p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create User </h1>

      {/* Button to Open Modal */}
      <button
        onClick={() => setModalIsOpen(true)}
        className="mb-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Add New User
      </button>

      <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
      <ul className="space-y-4">
        {currentUsers.map((user) => (
          <li key={user._id} className="flex justify-between items-center p-4 border-b">
            {editingUser === user._id ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  name="username"
                  value={editedUserData.username}
                  onChange={handleEditInputChange}
                  className="p-2 border rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  value={editedUserData.email}
                  onChange={handleEditInputChange}
                  className="p-2 border rounded-md"
                />
                <select
                  name="role"
                  value={editedUserData.role}
                  onChange={handleEditInputChange}
                  className="p-2 border rounded-md"
                >
                  <option value="manager">Manager</option>
                  <option value="regular">Regular User</option>
                </select>
                {editedUserData.role === 'regular' && (
                  <select
                    name="managerId"
                    value={editedUserData.managerId}
                    onChange={handleEditInputChange}
                    className="p-2 border rounded-md"
                  >
                    <option value="">Select Manager</option>
                    {users.filter(user => user.role === 'manager').map(manager => (
                      <option key={manager._id} value={manager._id}>
                        {manager.username}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex space-x-2">
                  <button onClick={handleUpdateUser} className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                    Update
                  </button>
                  <button onClick={() => setEditingUser(null)} className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow">
                {user.username} - {user.role} {user.managerId && `(Managed by ${users.find(u => u._id === user.managerId)?.username})`}
              </div>
            )}
            <div className="flex space-x-2">
              <button onClick={() => handleEditUser(user)} className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
                Edit
              </button>
              <button onClick={() => handleDeleteUser(user._id)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 p-2 border rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for Adding User */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <select name="role" value={newUser.role} onChange={handleInputChange} className="w-full p-2 border rounded-md">
            <option value="">Select Role</option>
            <option value="manager">Manager</option>
            <option value="regular">Regular User</option>
          </select>
          {newUser.role === 'regular' && (
            <select
              name="managerId"
              value={newUser.managerId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Manager</option>
              {users.filter(user => user.role === 'manager').map(manager => (
                <option key={manager._id} value={manager._id}>
                  {manager.username}
                </option>
              ))}
            </select>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleAddUser}
              className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
