import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    try {
      const userData = await login(email, password);
      // Role-based redirect: admin goes to admin panel, students go to dashboard
      if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent mb-2">Welcome Back! 👋</h1>
          <p className="text-textMuted text-sm">Sign in to access your courses, mock tests, and notes</p>
        </div>

        {/* Quick Demo Helper Chips */}
        <div className="mb-6 p-3 rounded-xl bg-accent/5 border border-accent/20">
          <p className="text-[11px] text-textMuted uppercase font-bold tracking-wider mb-2 text-center">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => { setEmail('student@example.com'); setPassword('password123'); }}
              className="py-1.5 px-3 rounded-lg bg-background hover:bg-accent/10 border border-border hover:border-accent text-textPrimary transition-all text-center font-medium"
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@example.com'); setPassword('password123'); }}
              className="py-1.5 px-3 rounded-lg bg-background hover:bg-accent/10 border border-border hover:border-accent text-textPrimary transition-all text-center font-medium"
            >
              ⚡ Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-textPrimary">Email Address</label>
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
            <label className="block text-sm font-medium mb-2 text-textPrimary">Password</label>
            <input 
              type="password" 
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center font-bold"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            Sign In to LMS
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-textMuted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-accent hover:underline font-bold">
            Register for free &rarr;
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
