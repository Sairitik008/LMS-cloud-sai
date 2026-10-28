import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaSearch, FaFire, FaBook, FaGamepad, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ isOpen }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchQuickLinks, setShowSearchQuickLinks] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchQuickLinks(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-[#080D18]/90 backdrop-blur-xl border-b border-white/[0.08] z-40 flex items-center justify-between px-4 sm:px-8 transition-all duration-300
      ${isOpen ? 'left-64' : 'left-20'}`}
    >
      {/* Quick Search with Contextual Dropdown */}
      <div className="relative">
        <form 
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 bg-[#0E1526] px-3.5 py-1.5 rounded-xl border border-white/[0.08] w-64 sm:w-80 group focus-within:border-sky-500/50 focus-within:ring-2 focus-within:ring-sky-500/15 transition-all shadow-inner"
        >
          <FaSearch className="text-slate-500 text-xs flex-shrink-0 group-focus-within:text-sky-400 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchQuickLinks(true)}
            onBlur={() => setTimeout(() => setShowSearchQuickLinks(false), 200)}
            placeholder="Search DSA, mock tests, cheatsheets..." 
            className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-white placeholder:text-slate-500 font-medium"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-white/[0.05] border border-white/[0.08] rounded">
            ↵
          </kbd>
        </form>

        {/* Friendly Quick-Search Suggestion Overlay */}
        {showSearchQuickLinks && (
          <div className="absolute top-11 left-0 w-80 bg-[#0E1628] border border-white/[0.12] rounded-xl p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">Quick Jump</p>
            <div className="space-y-1">
              <Link to="/courses" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors">
                <FaBook className="text-sky-400 text-xs" />
                <span>Explore Placement Courses</span>
              </Link>
              <Link to="/mocktests" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors">
                <FaGamepad className="text-amber-400 text-xs" />
                <span>Attempt Timed Mock Test</span>
              </Link>
              <Link to="/materials" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors">
                <FaFileAlt className="text-emerald-400 text-xs" />
                <span>Download SDE & GATE Notes</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Streak Indicator for Students */}
        {user?.role !== 'admin' && (
          <div 
            title="5 consecutive days of technical preparation! Keep the habit alive."
            className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm cursor-help hover:border-amber-400/50 transition-colors"
          >
            <FaFire className="text-amber-400 animate-pulse text-xs" />
            <span>5-Day Prep Streak</span>
          </div>
        )}

        {/* Notifications */}
        <Link 
          to={user?.role === 'admin' ? '/admin/announcements' : '/dashboard'}
          title="Announcements & Platform Alerts"
          className="relative text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <FaBell className="text-base" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full ring-2 ring-[#080D18] animate-pulse"></span>
        </Link>

        {/* User Profile Pill */}
        <Link 
          to="/settings"
          className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-white/[0.08] hover:opacity-90 transition-all group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-extrabold text-white leading-tight group-hover:text-sky-300 transition-colors">
              {user?.name || 'Student'}
            </p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <p className="text-[10px] font-bold text-sky-400/90 uppercase tracking-wider">
                {user?.role === 'admin' ? 'Placement Admin' : 'Enrolled Student'}
              </p>
            </div>
          </div>

          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-[1.5px] flex-shrink-0 shadow-md group-hover:shadow-sky-500/20 transition-shadow">
            <div className="w-full h-full bg-[#0C1222] rounded-[10px] flex items-center justify-center overflow-hidden">
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
