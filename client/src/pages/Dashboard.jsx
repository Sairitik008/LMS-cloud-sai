import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaBookOpen, FaVideo, FaFileAlt, FaTrophy, 
  FaCalendarAlt, FaArrowRight, FaClock, FaChartLine, 
  FaFire, FaLightbulb, FaCheckCircle, FaRocket, FaGraduationCap
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import AnimatedPage from '../components/common/AnimatedPage';
import EmptyState from '../components/common/EmptyState';

const DAILY_TIPS = [
  {
    topic: 'DSA & Complexity',
    tip: 'Whenever you see an unsorted array where you need pairs or triplets, sorting first allows two-pointer traversal in O(N) time and O(1) space!',
    tag: 'Interview Must-Know'
  },
  {
    topic: 'System Design',
    tip: 'Explain trade-offs first: CAP theorem dictates you cannot have Consistency, Availability, and Partition Tolerance all simultaneously under network splits.',
    tag: 'Architecture Tip'
  },
  {
    topic: 'DBMS Indexing',
    tip: 'B-Trees minimize disk I/O for range queries, while Hash Indexes give O(1) point lookups. Use composite indexes ordered by cardinality.',
    tag: 'Core CS'
  },
  {
    topic: 'Behavioral Rounds',
    tip: 'Structure your answers using STAR (Situation, Task, Action, Result). State your specific personal contribution, not just what the team did.',
    tag: 'HR & Culture'
  }
];

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

  // Select tip of the day based on day of month
  const todayTip = useMemo(() => {
    const day = new Date().getDate();
    return DAILY_TIPS[day % DAILY_TIPS.length];
  }, []);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getReadinessTier = (score) => {
    if (score >= 75) {
      return {
        label: 'Placement Ready 🚀',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        note: 'High interview confidence'
      };
    }
    if (score >= 50) {
      return {
        label: 'Steady Contender ⚡',
        color: 'text-sky-400',
        bg: 'bg-sky-500/10 border-sky-500/30',
        note: 'Keep practicing timed MCQs'
      };
    }
    return {
      label: 'Explorer Mode 🌱',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      note: 'Take a test to calibrate'
    };
  };

  const getDashboardData = useCallback(async () => {
    try {
      // Use allSettled so one slow or recovering endpoint never blanks the whole dashboard
      const [coursesRes, tutorialsRes, materialsRes, resultsRes, testsRes] = await Promise.allSettled([
        fetchData('/courses'),
        fetchData('/tutorials'),
        fetchData('/materials'),
        fetchData('/results/me'),
        fetchData('/mocktests')
      ]);

      const coursesData = coursesRes.status === 'fulfilled' ? coursesRes.value : null;
      const tutorialsData = tutorialsRes.status === 'fulfilled' ? tutorialsRes.value : null;
      const materialsData = materialsRes.status === 'fulfilled' ? materialsRes.value : null;
      const resultsData = resultsRes.status === 'fulfilled' && Array.isArray(resultsRes.value) ? resultsRes.value : [];
      const testsData = testsRes.status === 'fulfilled' ? testsRes.value : null;

      const avgScore = resultsData.length > 0 
        ? Math.round(resultsData.reduce((acc, r) => acc + (r.score || 0), 0) / resultsData.length)
        : 0;

      setStats({
        courses: coursesData?.courses?.length || 0,
        tutorials: tutorialsData?.tutorials?.length || 0,
        materials: materialsData?.materials?.length || 0,
        avgScore: `${avgScore}%`,
        scoreRaw: avgScore
      });

      setRecentResults(resultsData.slice(0, 3));
      setUpcomingTests(Array.isArray(testsData?.tests) ? testsData.tests.slice(0, 3) : []);

    } catch (err) {
      console.error('Error fetching dashboard data', err);
    }
  }, [fetchData]);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  const readiness = getReadinessTier(stats.scoreRaw);

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
                <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FaGraduationCap className="text-sm" /> CAMPUS PLACEMENT COHORT 2026
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {getTimeOfDayGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">{user?.name || 'Fellow Engineer'}</span>! 🎯
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Welcome back to your personalized prep station. Practice interview MCQs, review engineering notes, and keep your prep momentum soaring.
              </p>
            </div>

            {/* Quick Readiness Badge */}
            <div className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border flex-shrink-0 backdrop-blur-md ${readiness.bg}`}>
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xl">
                <FaChartLine className={readiness.color} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Calibration</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-white">
                    {stats.scoreRaw > 0 ? `${stats.scoreRaw}%` : 'Diagnostic Needed'}
                  </span>
                  <span className={`text-[11px] font-bold ${readiness.color}`}>
                    {readiness.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{readiness.note}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Interview Pro-Tip Callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="tip-card p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-base flex-shrink-0 mt-0.5 sm:mt-0">
              <FaLightbulb />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-mono">
                  Daily Interview Pro-Tip · {todayTip.topic}
                </span>
                <span className="badge-warm text-[10px]">
                  {todayTip.tag}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                "{todayTip.tip}"
              </p>
            </div>
          </div>
          <Link 
            to="/materials" 
            className="flex-shrink-0 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 self-end sm:self-center"
          >
            Review Cheatsheets <FaArrowRight className="text-[10px]" />
          </Link>
        </motion.div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            icon={<FaBookOpen />} 
            title="Curated Courses" 
            count={stats.courses} 
            subtitle="DSA & Full-Stack tracks"
            gradient="from-blue-500/20 to-sky-500/10 text-sky-400 border-sky-500/25"
            linkTo="/courses"
          />
          <StatCard 
            icon={<FaVideo />} 
            title="Video Masterclasses" 
            count={stats.tutorials} 
            subtitle="Step-by-step walkthroughs"
            gradient="from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/25"
            linkTo="/tutorials"
          />
          <StatCard 
            icon={<FaFileAlt />} 
            title="Revision Notes" 
            count={stats.materials} 
            subtitle="GATE & SDE cheatsheets"
            gradient="from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/25"
            linkTo="/materials"
          />
          <StatCard 
            icon={<FaTrophy />} 
            title="Average Accuracy" 
            count={stats.avgScore} 
            subtitle="Calculated over mock drives"
            gradient="from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/25"
            linkTo="/leaderboard"
          />
        </div>

        {/* Two-Column Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Performance & Review */}
          <section className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <FaTrophy className="text-sky-400 text-sm" /> Recent Mock Assessments
              </h2>
              <Link to="/leaderboard" className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
                Leaderboard <FaArrowRight className="text-[10px]" />
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
                            {isPass ? 'PASSED · 70%+' : 'NEEDS PRACTICE'}
                          </span>
                          <h3 className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
                            {result.mockTest?.title || 'Technical Assessment'}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <FaClock className="text-[10px] text-slate-500" />
                          Completed on {new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className={`text-xl font-extrabold font-mono ${isPass ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {result.score}%
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold group-hover:text-slate-300 transition-colors">
                          Review Answers &rarr;
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {recentResults.length === 0 && (
                <EmptyState 
                  icon="trophy"
                  title="No Mock Drives Attempted Yet"
                  message="Don't worry, everyone starts somewhere! Attempt your first live assessment to calibrate your placement readiness."
                  actionLabel="Attempt First Mock Test"
                  actionLink="/mocktests"
                  tip="Company mock tests help you get comfortable with tight 30-minute timers and negative marking."
                />
              )}
            </div>
          </section>

          {/* Right Column: Scheduled Placement Mock Drives */}
          <section className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <FaCalendarAlt className="text-sky-400 text-sm" /> Available Mock Drives
              </h2>
              <Link to="/mocktests" className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
                All Drives <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingTests.map((test) => (
                <div 
                  key={test._id} 
                  className="glass-card p-4 sm:p-5 rounded-xl flex flex-col justify-between gap-4 hover:border-sky-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/25">
                        TIMED ASSESSMENT
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <FaClock className="text-[10px] text-slate-500" />
                        {test.duration} Mins · {test.questions?.length || 0} Questions
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">
                      {test.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <span className="text-[11px] text-slate-500 font-medium">Instant auto-scoring</span>
                    <Link 
                      to="/mocktests"
                      className="btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1.5"
                    >
                      <FaRocket className="text-[10px]" /> Start Drive
                    </Link>
                  </div>
                </div>
              ))}

              {upcomingTests.length === 0 && (
                <EmptyState 
                  icon="calendar"
                  title="No Scheduled Drives Right Now"
                  message="Mentors are curating new industry-standard mock assessment questions for this week."
                  actionLabel="Revise Notes While Waiting"
                  actionLink="/materials"
                  tip="A quick 10-minute brush-up on HashMaps or SQL joins will give you an edge on the next test."
                />
              )}
            </div>
          </section>

        </div>
      </div>
    </AnimatedPage>
  );
};

const StatCard = ({ icon, title, count, subtitle, gradient, linkTo }) => {
  const content = (
    <div className="glass-card p-5 rounded-xl border-white/[0.08] flex items-center gap-4 relative overflow-hidden group hover:border-white/[0.2] transition-all cursor-pointer">
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

  return linkTo ? <Link to={linkTo}>{content}</Link> : content;
};

export default Dashboard;
