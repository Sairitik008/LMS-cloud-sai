import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaCode, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';

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

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center bg-background px-4 overflow-y-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-lg p-8 my-8 relative overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-accent/20 w-full">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: '25%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>

        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-accent mb-2">Build Your Profile</h1>
          <p className="text-textMuted text-sm">Step {step} of 4</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h3 className="font-bold text-lg text-textPrimary text-center mb-4">Let's start with the basics!</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary">Full Name *</label>
                <input type="text" className="input-field" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary">Email Address *</label>
                <input type="email" className="input-field" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary">Password *</label>
                <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary">Confirm Password *</label>
                <input type="password" className="input-field" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h3 className="font-bold text-lg text-textPrimary text-center mb-4">What's your story?</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary">Short Bio</label>
                <textarea 
                  className="input-field h-24 resize-none" placeholder="I am a passionate developer who loves building things..."
                  value={bio} onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary">Educational Background</label>
                <input type="text" className="input-field" placeholder="e.g. BS Computer Science, Year 3" value={educationalBackground} onChange={(e) => setEducationalBackground(e.target.value)} />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h3 className="font-bold text-lg text-textPrimary text-center mb-4">What makes you... you?</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary">Skills (Comma separated)</label>
                <input type="text" className="input-field" placeholder="e.g. React, Node.js, Python, Leadership" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary">Hobbies (Comma separated)</label>
                <input type="text" className="input-field" placeholder="e.g. Reading, Gaming, Hiking, Open Source" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <h3 className="font-bold text-lg text-textPrimary text-center mb-4">Where can people find your awesome code?</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary flex items-center gap-2">
                  <FaGithub /> GitHub Link
                </label>
                <input type="url" className="input-field" placeholder="https://github.com/johndoe" value={github} onChange={(e) => setGithub(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary flex items-center gap-2">
                  <FaCode /> HackerRank Link
                </label>
                <input type="url" className="input-field" placeholder="https://hackerrank.com/profile/johndoe" value={hackerrank} onChange={(e) => setHackerrank(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-textPrimary flex items-center gap-2">
                  <FaLinkedin color="#0072b1" /> LinkedIn Link
                </label>
                <input type="url" className="input-field" placeholder="https://linkedin.com/in/johndoe" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
          {step > 1 ? (
            <button type="button" onClick={handlePrev} className="btn-secondary flex items-center gap-2">
              <FaArrowLeft /> Back
            </button>
          ) : (
            <div></div> /* Spacer */
          )}
          
          {step < 4 ? (
            <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-2">
              Next Step <FaArrowRight />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit} 
              disabled={loading}
              className="btn-primary flex items-center gap-2 shadow-lg"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <><FaCheck /> Finish Setup</>
              )}
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-textMuted pt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-bold">
            Log in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
