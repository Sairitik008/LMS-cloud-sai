import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaBookOpen, FaVideo, FaFileAlt, FaTrophy, 
  FaCalendarAlt, FaArrowRight, FaCheckCircle, 
  FaClock, FaChartLine, FaFire, FaLaptopCode
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import AnimatedPage from '../components/common/AnimatedPage';

const Dashboard = () => {
  const { user } = useAuth();
  const { fetchData } = useFetch();
  const [stats, setStats] = useState({
    courses: 0,
    tutorials: 0,
    materials: 0,
    avgScore: 0,
    scoreRaw: 0
  });
  const [recentResults, setRecentResults] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getDashboardData = async () => {
    try {
      const [coursesData, tutorialsData, materialsData, resultsData, testsData] = await Promise.all([
        fetchData('/courses'),
        fetchData('/tutorials'),
        fetchData('/materials'),
        fetchData('/results/me'),
        fetchData('/mocktests')
      ]);

      const avgScore = resultsData && resultsData.length > 0 
        ? Math.round(resultsData.reduce((acc, r) => acc + r.score, 0) / resultsData.length)
        : 0;

      setStats({
        courses: coursesData?.courses?.length || 0,
        tutorials: tutorialsData?.tutorials?.length || 0,
        materials: materialsData?.materials?.length || 0,
        avgScore: `${avgScore}%`,
        scoreRaw: avgScore
      });

      setRecentResults((resultsData || []).slice(0, 3));
      setUpcomingTests((testsData?.tests || []).slice(0, 3));

    } catch (err) {
      console.error('Error fetching dashboard data', err);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <AnimatedPage>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Welcome Command Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 rounded-2xl border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-[#0C1222] via-[#0E162B] to-[#121B33]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                  CAMPUS PLACEMENT COHORT 2026
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {getTimeOfDayGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">{user?.name || 'Student'}</span>! 🎯
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Track your DSA practice, revise interview cheatsheets, and attempt scheduled company mock assessments.
              </p>
            </div>

            {/* Quick Readiness Badge */}
            <div className="flex items-center gap-4 bg-[#080E1B]/80 px-5 py-3.5 rounded-xl border border-white/[0.06] flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center text-xl">
                <FaChartLine />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Readiness</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-white">
                    {stats.scoreRaw > 0 ? `${stats.scoreRaw}%` : 'Diagnostic Needed'}
                  </span>
                  {stats.scoreRaw >= 70 && (
                    <span className="text-[11px] font-bold text-emerald-400">On Track</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            icon={<FaBookOpen />} 
            title="Active Courses" 
            count={stats.courses} 
            subtitle="DSA & Full-Stack tracks"
            gradient="from-blue-500/20 to-sky-500/10 text-sky-400 border-sky-500/25"
          />
          <StatCard 
            icon={<FaVideo />} 
            title="Video Tutorials" 
            count={stats.tutorials} 
            subtitle="Code walkthroughs"
            gradient="from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/25"
          />
          <StatCard 
            icon={<FaFileAlt />} 
            title="Revision Notes" 
            count={stats.materials} 
            subtitle="GATE & SDE cheatsheets"
            gradient="from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/25"
          />
          <StatCard 
            icon={<FaTrophy />} 
            title="Average Test Score" 
            count={stats.avgScore} 
            subtitle="Timed mock evaluations"
            gradient="from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/25"
          />
        </div>

        {/* Two-Column Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Performance & Review */}
          <section className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <FaTrophy className="text-sky-400 text-sm" /> Recent Mock Assessments
              </h2>
              <Link to="/leaderboard" className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors">
                View All-India Leaderboard &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {recentResults.map((result) => {
                const isPass = result.score >= 70;
                return (
                  <Link 
                    key={result._id} 
                    to={`/test-result/${result._id}`} 
                    className="block group"
                  >
                    <div className="glass-card-interactive p-4 sm:p-5 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isPass ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}>
                            {isPass ? 'PASSED' : 'PRACTICE'}
                          </span>
                          <h3 className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
                            {result.mockTest?.title || 'Technical Assessment'}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400">
                          Completed on {new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className={`text-xl font-extrabold font-mono ${isPass ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {result.score}%
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold">Review Answers</p>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {recentResults.length === 0 && (
                <div className="glass-card p-10 text-center rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] text-slate-500 flex items-center justify-center text-xl mx-auto mb-3">
                    <FaClock />
                  </div>
                  <p className="text-sm font-bold text-slate-300">No mock assessments attempted yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Take your first timed mock test to gauge your current placement readiness score.
                  </p>
                  <Link to="/mocktests" className="btn-primary mt-4 py-2 px-5 text-xs">
                    Start First Mock Test
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Scheduled Placement Mock Drives */}
          <section className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <FaCalendarAlt className="text-sky-400 text-sm" /> Available Mock Drives
              </h2>
              <Link to="/mocktests" className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors">
                All Tests &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingTests.map((test) => (
                <div 
                  key={test._id} 
                  className="glass-card p-4 sm:p-5 rounded-xl flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/25">
                        TIMED DRIVE
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {test.duration} Mins · {test.questions?.length || 0} MCQs
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">
                      {test.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <span className="text-[11px] text-slate-500 font-medium">Auto-evaluated</span>
                    <Link 
                      to={`/mocktest/${test._id}`}
                      className="btn-primary py-1.5 px-4 text-xs font-bold"
                    >
                      Attempt Test
                    </Link>
                  </div>
                </div>
              ))}

              {upcomingTests.length === 0 && (
                <div className="glass-card p-10 text-center rounded-xl">
                  <p className="text-sm font-bold text-slate-300">No active test drives right now</p>
                  <p className="text-xs text-slate-500 mt-1">Check back soon or explore course tutorials.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </AnimatedPage>
  );
};

const StatCard = ({ icon, title, count, subtitle, gradient }) => (
  <div className="glass-card p-5 rounded-xl border-white/[0.08] flex items-center gap-4 relative overflow-hidden group hover:border-white/[0.15] transition-all">
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${gradient} border flex items-center justify-center text-xl flex-shrink-0 shadow-inner transition-transform group-hover:scale-105`}>
      {icon}
    </div>
    <div className="overflow-hidden">
      <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider truncate">{title}</h3>
      <p className="text-2xl font-black text-white leading-tight font-mono">{count}</p>
      <p className="text-[10px] text-slate-500 truncate mt-0.5">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
