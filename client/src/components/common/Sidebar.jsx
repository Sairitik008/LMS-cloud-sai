import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaThLarge, FaUserGraduate, FaBook, FaVideo, 
  FaFileAlt, FaTrophy, FaBullhorn, FaUserFriends, 
  FaChevronLeft, FaSignOutAlt, FaCog 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const menuItems = isAdmin ? [
    { name: 'Dashboard', icon: <FaThLarge />, path: '/admin' },
    { name: 'Manage Courses', icon: <FaBook />, path: '/admin/courses' },
    { name: 'Manage Tutorials', icon: <FaVideo />, path: '/admin/tutorials' },
    { name: 'Study Materials', icon: <FaFileAlt />, path: '/admin/materials' },
    { name: 'Mock Tests', icon: <FaTrophy />, path: '/admin/mocktests' },
    { name: 'Announcements', icon: <FaBullhorn />, path: '/admin/announcements' },
    { name: 'View Students', icon: <FaUserFriends />, path: '/admin/students' },
    { name: 'Settings', icon: <FaCog />, path: '/settings' },
  ] : [
    { name: 'Dashboard', icon: <FaThLarge />, path: '/dashboard' },
    { name: 'My Courses', icon: <FaBook />, path: '/courses' },
    { name: 'Tutorials', icon: <FaVideo />, path: '/tutorials' },
    { name: 'Study Materials', icon: <FaFileAlt />, path: '/materials' },
    { name: 'Mock Tests', icon: <FaTrophy />, path: '/mocktests' },
    { name: 'Leaderboard', icon: <FaUserGraduate />, path: '/leaderboard' },
    { name: 'Settings', icon: <FaCog />, path: '/settings' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="fixed left-0 top-0 h-screen bg-card border-r border-border z-50 flex flex-col transition-all duration-300"
    >
      <div className="p-6 flex items-center justify-between border-b border-border">
        {isOpen ? (
          <Logo className="w-8 h-8" textSize="text-xl" />
        ) : (
          <div className="w-full flex justify-center">
             <Logo className="w-8 h-8" withText={false} />
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="text-textMuted hover:text-accent p-1 hover:bg-background rounded-lg transition-colors"
        >
          <FaChevronLeft className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
               ${isActive ? 'bg-accent/10 text-accent border border-accent/20' : 'text-textMuted hover:bg-accent/5 hover:text-textPrimary'}`
            }
          >
            <div className="text-lg flex-shrink-0">{item.icon}</div>
            {isOpen && (
              <span className="font-medium whitespace-nowrap">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={logout}
          className={`w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 group`}
        >
          <FaSignOutAlt className="text-lg flex-shrink-0" />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
