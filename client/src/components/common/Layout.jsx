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
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div 
        className={`transition-all duration-300 min-h-screen flex flex-col
        ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}
      >
        <Navbar isOpen={isSidebarOpen} />
        <main className="flex-1 mt-16 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
