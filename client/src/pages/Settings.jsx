import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserCircle, FaEnvelope, FaLock, FaCamera, 
  FaSave, FaGithub, FaLinkedin, FaGraduationCap, 
  FaCode, FaHeart, FaShieldAlt, FaExternalLinkAlt, FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/common/AnimatedPage';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    educationalBackground: '',
    skills: '',
    hobbies: '',
    socialLinks: { github: '', hackerrank: '', linkedin: '' }
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        bio: user.bio || '',
        educationalBackground: user.educationalBackground || '',
        skills: user.skills ? user.skills.join(', ') : '',
        hobbies: user.hobbies ? user.hobbies.join(', ') : '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          hackerrank: user.socialLinks?.hackerrank || '',
          linkedin: user.socialLinks?.linkedin || '',
        }
      });
      if (user.avatar) {
        setPreviewUrl(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setFormData({
      ...formData,
      socialLinks: { ...formData.socialLinks, [e.target.name]: e.target.value }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('bio', formData.bio);
    submitData.append('educationalBackground', formData.educationalBackground);
    submitData.append('skills', formData.skills);
    submitData.append('hobbies', formData.hobbies);
    submitData.append('socialLinks', JSON.stringify(formData.socialLinks));
    
    if (formData.password) {
      submitData.append('password', formData.password);
    }
    
    if (avatarFile) {
      submitData.append('avatar', avatarFile);
    }

    try {
      await updateProfile(submitData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parsedSkills = formData.skills
    ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                ENGINEER PROFILE & SETTINGS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personal Profile & Preferences
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Keep your profile, target technologies, and resume social handles current for mock drive reviews.
            </p>
          </div>
          <span className="badge-purple text-xs">
            {user?.role === 'admin' ? 'Faculty Admin' : 'Student Candidate'}
          </span>
        </div>

        {/* Profile Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden border border-white/[0.08] shadow-xl"
        >
          {/* Cover Gradient */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-sky-900/60 via-indigo-900/40 to-slate-900/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>
          
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar & Header Identity */}
            <div className="relative -mt-16 sm:-mt-20 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-[#070B14] bg-slate-900 overflow-hidden relative shadow-2xl">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-sky-500/10 text-sky-400 text-4xl">
                        <FaUserCircle />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white backdrop-blur-[2px]">
                      <FaCamera className="text-xl mb-1 text-sky-400" />
                      <span className="text-[10px] font-bold">Update Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                <div className="mb-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                    {formData.name || 'Your Name'}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {formData.email || 'student@domain.edu'}
                  </p>
                </div>
              </div>

              {/* Skills Preview Pills */}
              {parsedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-w-sm justify-start sm:justify-end">
                  {parsedSkills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.04] text-sky-300 border border-sky-500/20">
                      {skill}
                    </span>
                  ))}
                  {parsedSkills.length > 4 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      +{parsedSkills.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Primary Identity Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FaUserCircle className="text-sky-400" /> Full Display Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    className="input-field"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FaEnvelope className="text-sky-400" /> Academic / Personal Email
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    className="input-field"
                    placeholder="e.g. rahul.sharma@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Placement & Developer Details */}
              <div className="space-y-4 border-t border-white/[0.06] pt-6">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <FaGraduationCap className="text-sky-400" /> Academic & Career Background
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Information shown on your student cohort profile and mock interview evaluations.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-300">Bio / Career Objective</label>
                    <input 
                      type="text" name="bio" className="input-field"
                      placeholder="e.g. 3rd year CSE undergraduate preparing for SDE roles, passionate about distributed systems."
                      value={formData.bio} onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">College & Degree</label>
                    <input 
                      type="text" name="educationalBackground" className="input-field"
                      placeholder="e.g. B.Tech Computer Science, NIT / State University"
                      value={formData.educationalBackground} onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <FaCode className="text-indigo-400" /> Core Tech Skills (Comma separated)
                    </label>
                    <input 
                      type="text" name="skills" className="input-field"
                      placeholder="e.g. Java, Spring Boot, React, DSA, PostgreSQL, Docker"
                      value={formData.skills} onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Coding & Professional Handles */}
              <div className="space-y-4 border-t border-white/[0.06] pt-6">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <FaCode className="text-sky-400" /> Professional Coding Handles
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Link your public repositories and competitive coding profiles.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <FaGithub /> GitHub
                    </label>
                    <input 
                      type="url" name="github" className="input-field text-xs" 
                      placeholder="https://github.com/username" 
                      value={formData.socialLinks.github} 
                      onChange={handleSocialChange} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      LeetCode / HackerRank
                    </label>
                    <input 
                      type="url" name="hackerrank" className="input-field text-xs" 
                      placeholder="https://leetcode.com/username" 
                      value={formData.socialLinks.hackerrank} 
                      onChange={handleSocialChange} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <FaLinkedin className="text-sky-400" /> LinkedIn
                    </label>
                    <input 
                      type="url" name="linkedin" className="input-field text-xs" 
                      placeholder="https://linkedin.com/in/username" 
                      value={formData.socialLinks.linkedin} 
                      onChange={handleSocialChange} 
                    />
                  </div>
                </div>
              </div>

              {/* Security Credentials */}
              <div className="space-y-3 border-t border-white/[0.06] pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <FaShieldAlt className="text-amber-400" /> Security & Authentication
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Encrypted with Argon2/Bcrypt
                  </span>
                </div>
                <div className="max-w-md space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FaLock className="text-amber-400" /> Update Password (Optional)
                  </label>
                  <input 
                    type="password" 
                    name="password"
                    className="input-field"
                    placeholder="Leave blank to keep existing password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Form Submit Footer */}
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Updates reflect instantly across your learning dashboard.
                </span>
                <button 
                  type="submit" 
                  className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    'Saving Updates...'
                  ) : (
                    <>
                      <FaSave className="text-[11px]" /> Save Profile Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Settings;
