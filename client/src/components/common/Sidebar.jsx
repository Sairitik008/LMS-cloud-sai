import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaThLarge, FaUserGraduate, FaBook, FaVideo, 
  FaFileAlt, FaTrophy, FaBullhorn, FaUserFriends, 
  FaChevronLeft, FaSignOutAlt, FaCog, FaGraduationCap
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const menuSections = isAdmin ? [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', icon: <FaThLarge />, path: '/admin' }
      ]
    },
    {
      label: 'ACADEMICS & CONTENT',
      items: [
        { name: 'Manage Courses', icon: <FaBook />, path: '/admin/courses' },
        { name: 'Manage Tutorials', icon: <FaVideo />, path: '/admin/tutorials' },
        { name: 'Study Materials', icon: <FaFileAlt />, path: '/admin/materials' },
        { name: 'Mock Tests', icon: <FaTrophy />, path: '/admin/mocktests' }
      ]
    },
    {
      label: 'ADMINISTRATION',
      items: [
        { name: 'Announcements', icon: <FaBullhorn />, path: '/admin/announcements' },
        { name: 'View Students', icon: <FaUserFriends />, path: '/admin/students' },
        { name: 'Settings', icon: <FaCog />, path: '/settings' }
      ]
    }
  ] : [
    {
      label: 'MY LEARNING HUB',
      items: [
        { name: 'Student Dashboard', icon: <FaThLarge />, path: '/dashboard' }
      ]
    },
    {
      label: 'PREPARATION ARENA',
      items: [
        { name: 'Placement Courses', icon: <FaBook />, path: '/courses' },
        { name: 'Video Tutorials', icon: <FaVideo />, path: '/tutorials' },
        { name: 'SDE & GATE Notes', icon: <FaFileAlt />, path: '/materials' },
        { name: 'Mock Assessments', icon: <FaTrophy />, path: '/mocktests' }
      ]
    },
    {
      label: 'CAMPUS COMMUNITY',
      items: [
        { name: 'All-India Leaderboard', icon: <FaUserGraduate />, path: '/leaderboard' },
        { name: 'Profile & Settings', icon: <FaCog />, path: '/settings' }
      ]
    }
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 260 : 78 }}
      className="fixed left-0 top-0 h-screen bg-[#070A11]/95 backdrop-blur-2xl border-r border-white/[0.06] z-50 flex flex-col transition-all duration-300 select-none"
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-white/[0.06]">
        {isOpen ? (
          <Logo className="w-8 h-8" textSize="text-lg" showBadge={true} />
        ) : (
          <div className="w-full flex justify-center">
            <Logo className="w-8 h-8" withText={false} />
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          className="text-slate-500 hover:text-sky-400 p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
        >
          <FaChevronLeft className={`text-xs transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-6">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {isOpen && (
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group relative
                   ${isActive 
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/25 shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'}`
                }
              >
                <div className="text-base flex-shrink-0 transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                {isOpen && (
                  <span className="whitespace-nowrap tracking-tight">{item.name}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer Student / Admin Status & Logout */}
      <div className="p-3 border-t border-white/[0.06] space-y-2">
        {isOpen && (
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center text-sm flex-shrink-0">
              <FaGraduationCap />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-extrabold text-white truncate">
                {isAdmin ? 'Campus Placement Admin' : 'Batch of 2026'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {isAdmin ? 'Placement Officer Portal' : 'Active Placement Track'}
              </p>
            </div>
          </div>
        )}

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
        >
          <FaSignOutAlt className="text-sm flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
