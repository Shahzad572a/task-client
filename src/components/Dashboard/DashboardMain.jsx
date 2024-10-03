import React from 'react';
import Sidebar from '../../pages/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Tasks from '../../pages/Tasks';
import LoginPage from '../Auth/Login';
import ProtectedRoute from '../../utils/ProtectedRoute';
import AllTasks from '../../pages/AllTasks';
import ManageUsers from '../Auth/ManageUsers';
import TeamMembers from '../../pages/TeamMembers';
import Logout from '../Auth/Logout';
import RegisterPage from '../Auth/RegisterPage';

const DashboardMain = () => {
  const managerId = localStorage.getItem('userInfoId');

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col w-full overflow-auto">
        <Routes>
          <Route path="/task" element={<Tasks />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<ProtectedRoute element={ManageUsers} allowedRoles={['admin']} />} />
          <Route path="/all-tasks" element={<ProtectedRoute element={AllTasks} allowedRoles={['admin']} />} />
          <Route path="/team" element={<ProtectedRoute element={TeamMembers} managerId={managerId} allowedRoles={['manager']} />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardMain;
