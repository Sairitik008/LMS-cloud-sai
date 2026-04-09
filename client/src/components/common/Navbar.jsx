import React from 'react';
import { FaUserCircle, FaBell, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ isOpen }) => {
  const { user } = useAuth();

  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-8 transition-all duration-300
      ${isOpen ? 'left-64' : 'left-20'}`}
    >
      <div className="flex items-center gap-4 bg-background px-4 py-2 rounded-xl border border-border w-1/3 min-w-[200px]">
        <FaSearch className="text-textMuted" />
        <input 
          type="text" 
          placeholder="Search for tutorials, courses..." 
          className="bg-transparent border-none outline-none text-sm w-full text-textPrimary placeholder:text-textMuted"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-textMuted hover:text-accent transition-colors">
          <FaBell className="text-xl" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-card"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-textPrimary">{user?.name}</p>
            <p className="text-xs text-textMuted capitalize">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <FaUserCircle className="text-2xl" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
