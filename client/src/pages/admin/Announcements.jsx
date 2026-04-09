import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/common/Modal';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  const { loading, fetchData } = useFetch();

  const getAnnouncements = async () => {
    try {
      const data = await fetchData('/announcements');
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchData('/announcements', 'post', formData);
      toast.success('Announcement posted successfully');
      setFormData({ title: '', message: '' });
      setIsModalOpen(false);
      getAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await fetchData(`/announcements/${id}`, 'delete');
        toast.success('Announcement removed');
        getAnnouncements();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">System Announcements</h1>
            <p className="text-textMuted mt-1">Broadcast important updates to all students.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> New Announcement
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
             <SkeletonLoader type="list-item" count={3} />
          ) : (
            <>
              {announcements.map((announcement) => (
                <motion.div 
                  key={announcement._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-6 flex flex-col md:flex-row justify-between items-start gap-6 border-l-4 border-l-accent"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                         <FaBullhorn />
                      </div>
                      <h3 className="text-xl font-bold text-textPrimary">{announcement.title}</h3>
                    </div>
                    <p className="text-textMuted text-sm leading-relaxed mb-4">
                      {announcement.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-textMuted/50 italic">
                      <FaCalendarAlt /> {new Date(announcement.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(announcement._id)}
                    className="p-3 bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white rounded-xl transition-all"
                  >
                    <FaTrash />
                  </button>
                </motion.div>
              ))}

              {announcements.length === 0 && (
                <EmptyState 
                  icon="inbox" 
                  title="No Announcements" 
                  message="System broadcast is currently clear." 
                  actionLabel="Broadcast Now"
                  actionLink="#"
                />
              )}
            </>
          )}
        </div>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Post New Announcement"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-textPrimary">Announcement Title</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="e.g. Server Maintenance"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-textPrimary">Message</label>
              <textarea 
                className="input-field h-32 resize-none"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              />
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-textMuted hover:text-textPrimary transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Announcement'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AnimatedPage>
  );
};

export default Announcements;
