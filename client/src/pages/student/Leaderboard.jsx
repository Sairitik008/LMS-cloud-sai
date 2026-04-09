import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaUserCircle, FaMedal } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { loading, fetchData } = useFetch();

  const getLeaderboard = async () => {
    try {
      const data = await fetchData('/results/leaderboard');
      setLeaderboard(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  const getRankColor = (index) => {
    switch (index) {
      case 0: return 'text-yellow-500'; // Gold
      case 1: return 'text-slate-300';  // Silver
      case 2: return 'text-amber-600'; // Bronze
      default: return 'text-textMuted';
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <div className="text-center">
          <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent text-4xl mx-auto mb-6"
          >
            <FaTrophy />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
          <p className="text-textMuted">Compete with the top IT students and track your ranking.</p>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-card/50 text-textMuted text-xs uppercase font-black tracking-widest border-b border-border">
                 <th className="py-6 px-8">Rank</th>
                 <th className="py-6 px-8">Student</th>
                 <th className="py-6 px-8 text-center">Tests Taken</th>
                 <th className="py-6 px-8 text-right">Avg. Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <SkeletonLoader type="table-row" count={5} />
              ) : (
                <>
                  {leaderboard.map((student, index) => (
                    <motion.tr 
                      key={student._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-white/5 transition-all"
                    >
                      <td className="py-6 px-8">
                         <div className="flex items-center gap-3">
                            {index < 3 ? (
                              <FaMedal className={`text-2xl ${getRankColor(index)}`} />
                            ) : (
                              <span className="text-textMuted font-black w-6 text-center">{index + 1}</span>
                            )}
                         </div>
                      </td>
                      <td className="py-6 px-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/20 flex items-center justify-center text-accent overflow-hidden">
                               {student.studentInfo?.avatar ? (
                                  <img src={student.studentInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                               ) : (
                                  <FaUserCircle className="text-2xl" />
                               )}
                            </div>
                            <span className="font-bold text-lg text-textPrimary group-hover:text-accent transition-colors">
                              {student.studentInfo?.name || 'Unknown Student'}
                            </span>
                         </div>
                      </td>
                      <td className="py-6 px-8 text-center font-medium text-textMuted">
                        {student.testsTaken}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <span className="text-2xl font-black text-accent">
                          {Math.round(student.avgScore)}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {leaderboard.length === 0 && (
                     <tr>
                       <td colSpan="4" className="py-20 text-center text-textMuted italic">
                          No results have been recorded yet. Be the first to top the leaderboard!
                       </td>
                     </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Leaderboard;
