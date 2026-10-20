import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaCode, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import Logo from '../components/common/Logo';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [bio, setBio] = useState('');
  const [educationalBackground, setEducationalBackground] = useState('');
  
  const [skills, setSkills] = useState('');
  const [hobbies, setHobbies] = useState('');
  
  const [github, setGithub] = useState('');
  const [hackerrank, setHackerrank] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        return toast.error('Please fill in all core fields');
      }
      if (password !== confirmPassword) {
        return toast.error('Passwords do not match');
      }
      if (password.length < 6) {
        return toast.error('Password must be at least 6 characters');
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    try {
      const extraData = {
        bio,
        educationalBackground,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        hobbies: hobbies.split(',').map(s => s.trim()).filter(Boolean),
        socialLinks: { github, hackerrank, linkedin }
      };

      await register(name, email, password, extraData);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    { num: 1, label: "Account" },
    { num: 2, label: "Academics" },
    { num: 3, label: "Tech Stack" },
    { num: 4, label: "Coding Profiles" }
  ];

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center bg-[#070A11] px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-grid-tech opacity-40 pointer-events-none"></div>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-2xl border-white/[0.08] relative z-10 shadow-2xl bg-[#090E1A]/90"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="mb-3">
            <Logo className="w-10 h-10" textSize="text-2xl" subtitle="CAMPUS PLACEMENT OS" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Create Student Profile
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Build your campus placement readiness portfolio
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {stepTitles.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div 
                  className={`w-full h-1.5 rounded-full transition-all duration-300 mb-1.5 ${
                    isCompleted 
                      ? 'bg-emerald-400' 
                      : isCurrent 
                        ? 'bg-sky-400 shadow-sm shadow-sky-400/50' 
                        : 'bg-white/[0.08]'
                  }`}
                />
                <span className={`text-[10px] font-bold truncate ${
                  isCurrent ? 'text-sky-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Rahul Sharma" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                  College Email Address *
                </label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="e.g. rahul.sharma@gmail.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                  Password * (Min 6 characters)
                </label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter strong password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                  Confirm Password *
                </label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Re-enter password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                  Degree, Branch & College Name
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. B.Tech CSE, 3rd Year (NIT / JNTU / Anna Univ)" 
                  value={educationalBackground} 
                  onChange={(e) => setEducationalBackground(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                  Career Goals & Aspirations
                </label>
                <textarea 
                  className="input-field h-24 resize-none" 
                  placeholder="e.g. Final year B.Tech CSE student preparing for SDE-1 placement drives and cracking tier-1 tech rounds."
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                  Programming Languages & Core Skills
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Java, Data Structures, Spring Boot, React, SQL" 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                />
                <p className="text-[11px] text-slate-500 mt-1">Separate skills with commas</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300">
                  Interests & Competitive Coding
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Competitive Programming, Hackathons, Cricket, Chess" 
                  value={hobbies} 
                  onChange={(e) => setHobbies(e.target.value)} 
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300 flex items-center gap-2">
                  <FaCode className="text-amber-400" /> LeetCode / HackerRank URL
                </label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="https://leetcode.com/rahul_sharma" 
                  value={hackerrank} 
                  onChange={(e) => setHackerrank(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300 flex items-center gap-2">
                  <FaGithub className="text-white" /> GitHub Profile URL
                </label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="https://github.com/rahul-sharma" 
                  value={github} 
                  onChange={(e) => setGithub(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-300 flex items-center gap-2">
                  <FaLinkedin className="text-sky-400" /> LinkedIn Profile URL
                </label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="https://linkedin.com/in/rahulsharma" 
                  value={linkedin} 
                  onChange={(e) => setLinkedin(e.target.value)} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/[0.06]">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={handlePrev} 
              className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" /> Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <button 
              type="button" 
              onClick={handleNext} 
              className="btn-primary py-2 px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              Next Step <FaArrowRight className="text-[10px]" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit} 
              disabled={loading}
              className="btn-primary py-2 px-6 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/25"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <><FaCheck className="text-[10px]" /> Complete Registration</>
              )}
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 font-bold ml-1">
            Sign in &rarr;
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
