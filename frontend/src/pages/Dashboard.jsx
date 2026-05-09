import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Sidebar */}
      <div className="w-full md:w-auto md:h-screen md:sticky md:top-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full bg-[var(--color-background)] min-h-screen">
        <Outlet />
      </div>

    </div>
  );
};

export default Dashboard;