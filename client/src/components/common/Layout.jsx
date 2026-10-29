import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-textPrimary relative selection:bg-blue-600/20 selection:text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className={`transition-all duration-300 min-h-screen flex flex-col relative z-10
        ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}
      >
        <Navbar isOpen={isSidebarOpen} />
        <main className="flex-1 mt-16 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
