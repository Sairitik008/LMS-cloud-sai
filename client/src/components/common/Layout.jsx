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
    <div className="min-h-screen bg-[#070A11] text-textPrimary relative selection:bg-sky-500/20 selection:text-white">
      {/* Ambient Canvas Lighting */}
      <div className="fixed inset-0 bg-grid-tech opacity-30 pointer-events-none z-0"></div>
      <div className="fixed top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-sky-500/5 to-transparent blur-[120px] pointer-events-none z-0"></div>

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
