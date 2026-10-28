import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaUserCircle, FaMedal, FaChartLine, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { loading, fetchData } = useFetch();

  const getLeaderboard = useCallback(async () => {
    try {
      const data = await fetchData('/results/leaderboard');
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return {
          icon: <FaMedal className="text-yellow-400 text-lg" />,
          label: '1st Place',
          border: 'border-yellow-400/40 bg-yellow-400/10 text-yellow-300'
        };
      case 1:
        return {
          icon: <FaMedal className="text-slate-300 text-lg" />,
          label: '2nd Place',
          border: 'border-slate-300/40 bg-slate-300/10 text-slate-200'
        };
      case 2:
        return {
          icon: <FaMedal className="text-amber-500 text-lg" />,
          label: '3rd Place',
          border: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
        };
      default:
        return {
          icon: null,
          label: `#${index + 1}`,
          border: 'border-white/10 bg-white/[0.03] text-slate-400'
        };
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-sky-500/10 border border-sky-500/25 rounded-2xl flex items-center justify-center text-sky-400 text-3xl mx-auto shadow-inner"
          >
            <FaTrophy />
          </motion.div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest">
              CAMPUS COHORT RANKINGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            All-India Student Leaderboard 🏆
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Rankings recalibrate automatically after every mock drive. Consistent practice elevates your placement readiness standing.
          </p>
        </div>

        {/* Motivational Callout */}
        <div className="tip-card p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-base flex-shrink-0 mt-0.5 sm:mt-0">
              <FaChartLine />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                How Rankings Work
              </p>
              <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                Ranks are calculated based on your cumulative mock test accuracy and frequency. Take regular tests to climb the leaderboard!
              </p>
            </div>
          </div>
          <Link 
            to="/mocktests" 
            className="btn-primary py-2 px-4 text-xs font-bold flex-shrink-0 flex items-center gap-1.5 self-end sm:self-center"
          >
            Take a Mock Test <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {/* Leaderboard Table Card */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.08] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-slate-400 text-[10px] sm:text-xs uppercase font-mono font-bold tracking-wider border-b border-white/[0.06]">
                  <th className="py-4 px-6 text-center w-20">Rank</th>
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6 text-center">Tests Attempted</th>
                  <th className="py-4 px-6 text-right">Average Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  <SkeletonLoader type="table-row" count={5} />
                ) : (
                  leaderboard.map((student, index) => {
                    const rank = getRankBadge(index);
                    const avgScore = Math.round(student.avgScore || 0);

                    return (
                      <motion.tr 
                        key={student._id || index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group transition-colors ${
                          index < 3 ? 'hover:bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        {/* Rank Column */}
                        <td className="py-4 px-6 text-center">
                          <div className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg border font-mono font-bold text-xs ${rank.border}`}>
                            {rank.icon}
                            <span>{rank.label}</span>
                          </div>
                        </td>

                        {/* Student Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300 overflow-hidden flex-shrink-0">
                              {student.studentInfo?.avatar ? (
                                <img 
                                  src={student.studentInfo.avatar} 
                                  alt={student.studentInfo?.name || 'Student'} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <FaUserCircle className="text-xl text-slate-500" />
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors block">
                                {student.studentInfo?.name || 'Fellow Engineer'}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                Student Candidate
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Tests Taken */}
                        <td className="py-4 px-6 text-center font-mono text-xs font-semibold text-slate-300">
                          {student.testsTaken} {student.testsTaken === 1 ? 'drive' : 'drives'}
                        </td>

                        {/* Average Score */}
                        <td className="py-4 px-6 text-right">
                          <span className={`text-base sm:text-lg font-black font-mono ${
                            avgScore >= 70 ? 'text-emerald-400' : avgScore >= 50 ? 'text-sky-400' : 'text-amber-400'
                          }`}>
                            {avgScore}%
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && leaderboard.length === 0 && (
            <div className="p-8">
              <EmptyState 
                icon="trophy"
                title="Leaderboard Resetting"
                message="Be the first student to complete a timed mock assessment and take the #1 spot on the leaderboard!"
                actionLabel="Attempt First Mock Test"
                actionLink="/mocktests"
                tip="Consistently scoring 70%+ puts your profile on the radar of visiting recruiters."
              />
            </div>
          )}
        </div>

      </div>
    </AnimatedPage>
  );
};

export default Leaderboard;
