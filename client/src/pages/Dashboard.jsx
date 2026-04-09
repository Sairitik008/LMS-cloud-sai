import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaBookOpen, FaVideo, FaFileAlt, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import AnimatedPage from '../components/common/AnimatedPage';
import SkeletonLoader from '../components/common/SkeletonLoader';

const Dashboard = () => {
  const { user } = useAuth();
  const { fetchData } = useFetch();
  const [stats, setStats] = useState({
    courses: 0,
    tutorials: 0,
    materials: 0,
    avgScore: 0
  });
  const [recentResults, setRecentResults] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);

  const getDashboardData = async () => {
    try {
      const [coursesData, tutorialsData, materialsData, resultsData, testsData] = await Promise.all([
        fetchData('/courses'),
        fetchData('/tutorials'),
        fetchData('/materials'),
        fetchData('/results/me'),
        fetchData('/mocktests')
      ]);

      const avgScore = resultsData.length > 0 
        ? Math.round(resultsData.reduce((acc, r) => acc + r.score, 0) / resultsData.length)
        : 0;

      setStats({
        courses: coursesData.courses?.length || 0,
        tutorials: tutorialsData.tutorials?.length || 0,
        materials: materialsData.materials?.length || 0,
        avgScore: `${avgScore}%`
      });

      setRecentResults(resultsData.slice(0, 3));
      setUpcomingTests(testsData.tests?.slice(0, 2) || []);

    } catch (err) {
      console.error('Error fetching dashboard data', err);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <AnimatedPage>
      <div className="space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-textPrimary">
            Welcome back, <span className="text-accent">{user?.name}</span>!
          </h1>
          <p className="text-textMuted mt-2">Ready to continue your IT mastery journey?</p>
        </motion.div>

        {/* Using a simple row skeleton for stats if needed, or just let useFetch handle initial nulls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaBookOpen />} title="Courses" count={stats.courses} color="bg-blue-500" />
          <StatCard icon={<FaVideo />} title="Tutorials" count={stats.tutorials} color="bg-purple-500" />
          <StatCard icon={<FaFileAlt />} title="Materials" count={stats.materials} color="bg-green-500" />
          <StatCard icon={<FaTrophy />} title="Avg Score" count={stats.avgScore} color="bg-yellow-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FaTrophy className="text-accent" /> Recent Performance
            </h2>
            <div className="space-y-4">
              {recentResults.map((result) => (
                <Link key={result._id} to={`/test-result/${result._id}`} className="block group">
                  <div className="glass-card p-6 flex justify-between items-center group-hover:border-accent transition-all">
                    <div>
                      <h3 className="font-bold group-hover:text-accent transition-colors">{result.mockTest?.title}</h3>
                      <p className="text-xs text-textMuted">{new Date(result.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-xl font-black ${result.score >= 70 ? 'text-green-500' : 'text-accent'}`}>
                      {result.score}%
                    </div>
                  </div>
                </Link>
              ))}
              {recentResults.length === 0 && (
                 <div className="glass-card p-10 text-center text-textMuted italic">
                    No tests taken yet. Start with your first mock test!
                 </div>
              )}
            </div>
            <Link to="/mocktests" className="mt-6 inline-block text-accent hover:underline font-bold text-sm">
              Take a new test &rarr;
            </Link>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FaCalendarAlt className="text-accent" /> Available Mock Tests
            </h2>
            <div className="space-y-4">
               {upcomingTests.map((test) => (
                 <div key={test._id} className="glass-card p-6 flex justify-between items-center">
                   <div>
                     <h3 className="font-bold">{test.title}</h3>
                     <p className="text-sm text-textMuted">{test.duration} Minutes • {test.questions?.length} Questions</p>
                   </div>
                   <Link to="/mocktests" className="btn-primary text-sm px-4 py-2">
                      Start
                   </Link>
                 </div>
               ))}
               {upcomingTests.length === 0 && (
                  <div className="glass-card p-10 text-center text-textMuted italic">
                     No upcoming tests scheduled.
                  </div>
               )}
            </div>
          </section>
        </div>
      </div>
    </AnimatedPage>
  );
};

const StatCard = ({ icon, title, count, color }) => (
  <div className="glass-card p-6 flex items-center">
    <div className={`${color} p-4 rounded-xl text-white mr-5 text-2xl shadow-lg`}>
      {icon}
    </div>
    <div>
      <h3 className="text-textMuted text-xs uppercase font-black tracking-widest">{title}</h3>
      <p className="text-2xl font-black">{count}</p>
    </div>
  </div>
);

export default Dashboard;
