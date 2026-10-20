import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/common/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter your email and password');
    }

    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'student') {
      setEmail('student@example.com');
      setPassword('password123');
    } else {
      setEmail('admin@example.com');
      setPassword('password123');
    }
    toast.success(`${role === 'student' ? 'Student' : 'Admin'} credentials populated`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070A11] px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-grid-tech opacity-40 pointer-events-none"></div>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-6 sm:p-8 rounded-2xl border-white/[0.08] relative z-10 shadow-2xl bg-[#090E1A]/90"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="mb-4">
            <Logo className="w-11 h-11" textSize="text-2xl" subtitle="CAMPUS PLACEMENT OS" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Sign in to continue your placement preparation & mock tests
          </p>
        </div>

        {/* 1-Click Quick Demo Access */}
        <div className="mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2 text-center">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('student')}
              className="py-2 px-3 rounded-lg bg-[#0C1220] hover:bg-sky-500/10 border border-white/[0.06] hover:border-sky-500/30 text-slate-300 hover:text-sky-400 transition-all text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="py-2 px-3 rounded-lg bg-[#0C1220] hover:bg-sky-500/10 border border-white/[0.06] hover:border-sky-500/30 text-slate-300 hover:text-sky-400 transition-all text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              ⚡ Admin Demo
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-300">
              Email Address
            </label>
            <input 
              type="email" 
              className="input-field"
              placeholder="e.g. rahul.sharma@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-slate-500 hover:text-sky-400 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field pr-10"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In to Dashboard <FaArrowRight className="text-xs" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-slate-400">
          New to SaiCloud LMS?{' '}
          <Link to="/register" className="text-sky-400 hover:text-sky-300 font-bold ml-1 inline-flex items-center gap-1">
            Create an account &rarr;
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
