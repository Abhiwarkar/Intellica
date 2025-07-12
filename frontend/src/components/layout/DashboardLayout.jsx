import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 md:ml-64">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;