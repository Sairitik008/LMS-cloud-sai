import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaTrophy, FaCheckCircle, FaTimesCircle, FaClock, 
  FaRedo, FaList, FaLightbulb, FaBookOpen, FaChartPie, FaGraduationCap
} from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';

const TestResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const { loading, fetchData } = useFetch();

  const getResult = useCallback(async () => {
    try {
      const data = await fetchData(`/results/${id}`);
      if (data && data._id) {
        setResult(data);
        return;
      }
    } catch {
      // Fallback to searching /results/me
    }

    try {
      const myResults = await fetchData('/results/me');
      const current = Array.isArray(myResults) ? myResults.find((r) => r._id === id) : null;
      setResult(current);
    } catch (err) {
      console.error(err);
    }
  }, [id, fetchData]);

  useEffect(() => {
    getResult();
  }, [getResult]);

  if (loading || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-12 h-12 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-mono">Analyzing assessment analytics...</p>
      </div>
    );
  }

  const isPass = result.score >= 70;
  const isFair = result.score >= 50 && result.score < 70;

  const feedback = isPass ? {
    title: 'Outstanding Performance! 🚀',
    badge: 'Placement Ready Cutoff Met',
    badgeClass: 'badge-emerald',
    note: 'Your score comfortably clears the initial screening cutoff for Tier-1/Tier-2 campus placement drives. Excellent job!'
  } : isFair ? {
    title: 'Solid Effort & Good Potential! ⚡',
    badge: 'On the Right Track',
    badgeClass: 'badge-warm',
    note: 'You are close to the placement benchmark. Carefully review the questions you missed below to sharpen your edge.'
  } : {
    title: 'Valuable Learning Session! 🌱',
    badge: 'Foundational Phase',
    badgeClass: 'badge-purple',
    note: 'Do not be discouraged! Mock tests exist to pinpoint gaps before the real interviews. Study the detailed answers below and re-attempt.'
  };

  const avgSecondsPerQuestion = result.totalQuestions > 0 
    ? Math.round(result.timeTaken / result.totalQuestions) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Hero Feedback Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-6 sm:p-10 rounded-2xl border-white/[0.08] text-center relative overflow-hidden bg-gradient-to-b from-[#0E1528] to-[#0A0F1E]"
      >
        <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-4xl mx-auto mb-5 shadow-inner">
          <FaTrophy />
        </div>

        <span className={`${feedback.badgeClass} text-[10px] uppercase font-mono tracking-wider mb-2 inline-block`}>
          {feedback.badge}
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          {feedback.title}
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed">
          {feedback.note}
        </p>

        <p className="text-[11px] text-slate-500 mt-3 font-mono">
          Assessment: <span className="text-slate-300 font-bold">{result.mockTest?.title || 'Technical Assessment'}</span>
        </p>
      </motion.div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-white/[0.08] text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold font-mono">Final Score</p>
          <p className={`text-2xl sm:text-3xl font-black font-mono mt-1 ${isPass ? 'text-emerald-400' : isFair ? 'text-sky-400' : 'text-amber-400'}`}>
            {result.score}%
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Accuracy Metric</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-white/[0.08] text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold font-mono">Correct Answers</p>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            {result.correctAnswers} / {result.totalQuestions}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Total Questions</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-white/[0.08] text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold font-mono">Total Time</p>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Session Duration</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-white/[0.08] text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold font-mono">Pacing</p>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            ~{avgSecondsPerQuestion}s
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Per Question</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Link 
          to="/mocktests" 
          className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2"
        >
          <FaRedo className="text-[10px]" /> Attempt Another Test
        </Link>
        <Link 
          to="/materials" 
          className="py-2.5 px-6 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-all"
        >
          <FaBookOpen className="text-[11px]" /> Revise Topic Cheatsheets
        </Link>
        <Link 
          to="/dashboard" 
          className="py-2.5 px-6 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-xs font-bold text-slate-400 flex items-center justify-center gap-2 transition-all"
        >
          <FaList className="text-[10px]" /> Return to Dashboard
        </Link>
      </div>

      {/* Answer Review Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <FaCheckCircle className="text-sky-400 text-sm" /> Question Breakdown & Answers
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {result.answers?.length || 0} Evaluated
          </span>
        </div>

        <div className="space-y-3">
          {result.answers?.map((ans, idx) => {
            const questionData = result.mockTest?.questions?.[ans.questionIndex];
            const isCorrect = ans.isCorrect;

            return (
              <div 
                key={idx} 
                className={`glass-card p-5 rounded-2xl border transition-all ${
                  isCorrect 
                    ? 'border-emerald-500/25 bg-emerald-500/[0.02]' 
                    : 'border-rose-500/25 bg-rose-500/[0.02]'
                }`}
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    Question {idx + 1}
                  </span>
                  {isCorrect ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                      <FaCheckCircle className="text-[10px]" /> Correct (+1)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-500/10 border border-rose-500/25 px-2.5 py-0.5 rounded-full">
                      <FaTimesCircle className="text-[10px]" /> Incorrect
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed mb-4">
                  {questionData?.questionText || 'Question statement'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${
                    isCorrect 
                      ? 'bg-emerald-500/10 border-emerald-500/25' 
                      : 'bg-rose-500/10 border-rose-500/25'
                  }`}>
                    <p className="text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Your Selected Option</p>
                    <p className={`font-bold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {ans.selectedOption || 'No answer submitted'}
                    </p>
                  </div>

                  {!isCorrect && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                      <p className="text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Correct Solution Option</p>
                      <p className="text-emerald-300 font-bold">
                        {questionData?.correctAnswer || 'Answer Key'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default TestResult;
