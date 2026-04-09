import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaLock, FaCamera, FaSave, FaGithub, FaLinkedin } from 'react-icons/fa';
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
    } else if (user.avatar && !previewUrl) {
      // Logic if they clear the avatar, though we didn't add a clear button here for simplicity.
      submitData.append('avatar', '');
    }

    try {
      await updateProfile(submitData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Profile Settings</h1>
          <p className="text-textMuted mt-1">Manage your account details and personalization.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-accent/40 to-purple-500/40 relative"></div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-8 flex justify-between items-end">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-card bg-background overflow-hidden relative shadow-xl">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent text-5xl">
                      <FaUserCircle />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                    <FaCamera className="text-2xl mb-1" />
                    <span className="text-xs font-bold">Change</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold capitalize">
                  {user?.role} Account
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <FaUserCircle className="text-accent" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    className="input-field"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-textPrimary flex items-center gap-2">
                    <FaEnvelope className="text-accent" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    className="input-field"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-6 mt-6">
                <h3 className="font-bold text-lg text-accent">Extended Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-textPrimary">Short Bio</label>
                    <input 
                      type="text" name="bio" className="input-field"
                      placeholder="I am a passionate developer..."
                      value={formData.bio} onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-textPrimary">Educational Background</label>
                    <input 
                      type="text" name="educationalBackground" className="input-field"
                      placeholder="e.g. BS Computer Science, Year 3"
                      value={formData.educationalBackground} onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-textPrimary">Skills (Comma separated)</label>
                    <input 
                      type="text" name="skills" className="input-field"
                      placeholder="e.g. React, Node.js, Python"
                      value={formData.skills} onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-textPrimary">Hobbies (Comma separated)</label>
                    <input 
                      type="text" name="hobbies" className="input-field"
                      placeholder="e.g. Formally gaming, Hiking"
                      value={formData.hobbies} onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-6 mt-6">
                <h3 className="font-bold text-lg text-accent">Online Presence</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-textPrimary flex items-center gap-2"><FaGithub /> GitHub Link</label>
                    <input type="url" name="github" className="input-field" placeholder="https://github.com/in/..." value={formData.socialLinks.github} onChange={handleSocialChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-textPrimary flex items-center gap-2">HackerRank Link</label>
                    <input type="url" name="hackerrank" className="input-field" placeholder="https://hackerrank.com/..." value={formData.socialLinks.hackerrank} onChange={handleSocialChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-textPrimary flex items-center gap-2"><FaLinkedin color="#0072b1"/> LinkedIn Link</label>
                    <input type="url" name="linkedin" className="input-field" placeholder="https://linkedin.com/in/..." value={formData.socialLinks.linkedin} onChange={handleSocialChange} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-border pt-6 mt-6">
                <h3 className="font-bold text-lg text-red-400 mb-4">Security</h3>
                <label className="text-sm font-bold text-textPrimary flex items-center gap-2">
                  <FaLock className="text-accent" /> New Password
                </label>
                <input 
                  type="password" 
                  name="password"
                  className="input-field max-w-md"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <button 
                  type="submit" 
                  className="btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (
                    <>
                      <FaSave /> Save Changes
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
