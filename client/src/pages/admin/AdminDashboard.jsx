import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaPuzzlePiece, FaBullhorn, FaPlus, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    testResults: 0,
    announcements: 0
  });

  const { loading, fetchData } = useFetch();

  const getStats = async () => {
    try {
      const data = await fetchData('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="p-6 md:p-10 bg-background min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Admin Panel</h1>
          <p className="text-textMuted mt-1">Manage users, courses, and content from one place.</p>
        </div>
        <Link to="/admin/courses" className="btn-primary mt-4 md:mt-0 flex items-center">
          <FaPlus className="mr-2" /> Quick Create Course
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading ? (
          <SkeletonLoader type="card" count={4} />
        ) : (
          <>
            <AdminStatCard icon={<FaUsers />} label="Total Students" value={stats.students} />
            <AdminStatCard icon={<FaBook />} label="Active Courses" value={stats.courses} />
            <AdminStatCard icon={<FaPuzzlePiece />} label="Mock Tests Taken" value={stats.testResults} />
            <AdminStatCard icon={<FaBullhorn />} label="Announcements" value={stats.announcements} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section className="glass-card p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                 <FaCog className="mr-3 text-accent" /> Management Quick Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <QuickLink to="/admin/courses" title="Manage Courses" desc="Add, edit or delete courses." />
                 <QuickLink to="/admin/tutorials" title="Manage Tutorials" desc="Upload and organize video tutorials." />
                 <QuickLink to="/admin/materials" title="Manage Study Materials" desc="Upload PDF and document resources." />
                 <QuickLink to="/admin/mocktests" title="Manage Mock Tests" desc="Create and schedule assessments." />
              </div>
           </section>

           <section className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Updates</h2>
                <span className="text-xs text-textMuted italic tracking-widest uppercase">Live from Database</span>
              </div>
              <div className="space-y-4">
                 <div className="p-4 border border-border rounded-xl bg-white/5">
                    <p className="text-sm text-textPrimary">Welcome to the integrated LMS Admin Panel.</p>
                    <p className="text-xs text-textMuted mt-1">System status: All services operational.</p>
                 </div>
              </div>
           </section>
        </div>

        <aside className="space-y-8">
           <section className="glass-card p-6 border-accent/20">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                 <FaBullhorn className="mr-3 text-accent" /> Strategic Focus
              </h2>
              <div className="space-y-6">
                 <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                    <h3 className="font-bold text-accent">Student Engagement</h3>
                    <p className="text-sm text-textMuted mt-2">Monitor mock test participation to identify struggling learners.</p>
                 </div>
                 <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                    <h3 className="font-bold text-green-500">Course Quality</h3>
                    <p className="text-sm text-textMuted mt-2">Update your learning modules regularly to maintain technical edge.</p>
                 </div>
              </div>
              <Link to="/admin/announcements" className="btn-primary w-full mt-6 py-2 text-sm text-center block">Post New Announcement</Link>
           </section>
        </aside>
      </div>
    </div>
  );
};

const AdminStatCard = ({ icon, label, value }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 flex flex-col items-center text-center group"
  >
    <div className="text-accent text-3xl mb-3 transition-transform group-hover:scale-110">{icon}</div>
    <div className="text-sm text-textMuted mb-1">{label}</div>
    <div className="text-2xl font-black">{value}</div>
  </motion.div>
);

const QuickLink = ({ to, title, desc }) => (
  <Link to={to} className="p-4 border border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300">
    <h3 className="font-bold text-accent mb-1">{title}</h3>
    <p className="text-xs text-textMuted">{desc}</p>
  </Link>
);

export default AdminDashboard;
