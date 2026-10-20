import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSearch, FaFire } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ isOpen }) => {
  const { user } = useAuth();

  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-[#070A11]/85 backdrop-blur-xl border-b border-white/[0.06] z-40 flex items-center justify-between px-6 sm:px-8 transition-all duration-300
      ${isOpen ? 'left-64' : 'left-20'}`}
    >
      {/* Quick Search with Keyboard Hint */}
      <div className="flex items-center gap-3 bg-[#0C1220] px-3.5 py-1.5 rounded-xl border border-white/[0.08] w-72 sm:w-80 group focus-within:border-sky-500/50 focus-within:ring-2 focus-within:ring-sky-500/15 transition-all">
        <FaSearch className="text-slate-500 text-xs flex-shrink-0 group-focus-within:text-sky-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Quick search (courses, tests, notes)..." 
          className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-white placeholder:text-slate-500"
        />
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-white/[0.05] border border-white/[0.08] rounded">
          ⌘K
        </kbd>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Streak Indicator for Students */}
        {user?.role !== 'admin' && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold shadow-sm">
            <FaFire className="text-amber-400 animate-bounce text-xs" />
            <span>5-Day Prep Streak</span>
          </div>
        )}

        {/* Notifications */}
        <button 
          title="Campus Announcements"
          className="relative text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          <FaBell className="text-base" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full ring-2 ring-[#070A11] animate-pulse"></span>
        </button>

        {/* User Profile Pill */}
        <Link 
          to="/settings"
          className="flex items-center gap-3 pl-4 border-l border-white/[0.08] hover:opacity-90 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-extrabold text-white leading-tight">{user?.name || 'Student'}</p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">{user?.role || 'student'}</p>
            </div>
          </div>

          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-[1.5px] flex-shrink-0 shadow-md">
            <div className="w-full h-full bg-[#0B1220] rounded-[10px] flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-black text-sky-400">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
