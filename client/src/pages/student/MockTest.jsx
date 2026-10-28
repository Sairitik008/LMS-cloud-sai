import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClock, FaQuestionCircle, FaCheckCircle, FaChevronRight, 
  FaChevronLeft, FaPlay, FaGamepad, FaLightbulb, FaShieldAlt,
  FaCheck, FaArrowLeft, FaExclamationTriangle
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import toast from 'react-hot-toast';
import Logo from '../../components/common/Logo';
import EmptyState from '../../components/common/EmptyState';

const MockTest = () => {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { loading, fetchData } = useFetch();
  const navigate = useNavigate();

  const getTests = useCallback(async () => {
    try {
      const data = await fetchData('/mocktests');
      setTests(data.tests || []);
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  useEffect(() => {
    getTests();
  }, [getTests]);

  const startTest = (test) => {
    setActiveTest(test);
    setTimeLeft(test.duration * 60);
    setUserAnswers(test.questions.map((q, index) => ({
      questionIndex: index,
      selectedOption: ''
    })));
    setTestStarted(true);
    setHasSubmitted(false);
    setCurrentQuestionIndex(0);
    setShowSubmitModal(false);
    
    // Request full screen for focused experience
    if (document.documentElement.requestFullscreen) {
       document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const handleSelectOption = (option) => {
    const updated = [...userAnswers];
    updated[currentQuestionIndex].selectedOption = option;
    setUserAnswers(updated);
  };

  const submitTest = useCallback(async () => {
    if (isSubmitting || hasSubmitted) return;
    setIsSubmitting(true);
    setHasSubmitted(true);
    setShowSubmitModal(false);
    
    try {
      const resultData = {
        mockTestId: activeTest._id,
        answers: userAnswers,
        timeTaken: (activeTest.duration * 60) - timeLeft
      };
      
      const response = await fetchData('/results', 'post', resultData);
      toast.success('Assessment evaluated successfully!');
      
      // Exit full screen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      
      navigate(`/test-result/${response._id}`);
    } catch (err) {
      console.error(err);
      toast.error('Submission encountered a network issue. Please click Finish Test again.');
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
  }, [activeTest, userAnswers, timeLeft, isSubmitting, hasSubmitted, fetchData, navigate]);

  // Timer countdown
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (testStarted && timeLeft === 0 && !hasSubmitted) {
      toast('Time elapsed! Auto-submitting assessment...', { icon: '⏳' });
      submitTest();
    }
  }, [testStarted, timeLeft, hasSubmitted, submitTest]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const answeredCount = userAnswers.filter(a => !!a.selectedOption).length;

  // 1. Initial Test Lobby View
  if (!testStarted) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Lobby Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                TIMED ASSESSMENT ARENA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campus Placement Mock Drives
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Simulate actual company screening rounds under realistic time pressure with instant AI score analytics.
            </p>
          </div>
          <Link 
            to="/leaderboard" 
            className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 bg-white/[0.04] px-4 py-2 rounded-xl border border-white/[0.08]"
          >
            View Student Rankings &rarr;
          </Link>
        </div>

        {/* Calming Reassurance Callout */}
        <div className="tip-card p-4 sm:p-5 rounded-2xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
            <FaShieldAlt />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              Low-Stakes Practice Environment
              <span className="badge-emerald text-[10px]">Zero Penalties</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Don't stress over perfect scores. Every mock test trains your pacing, reveals blind spots in your DSA foundations, and prepares you for real campus drives.
            </p>
          </div>
        </div>

        {/* Available Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <motion.div 
              key={test._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 flex flex-col justify-between rounded-2xl border border-white/[0.08] hover:border-sky-500/40 transition-all shadow-lg hover:shadow-sky-500/5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-xl group-hover:bg-sky-500 group-hover:text-white transition-all shadow-inner">
                    <FaGamepad />
                  </div>
                  <span className="badge-warm text-[10px]">
                    TIMED DRIVE
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors leading-snug mb-2">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {test.description || 'Full-pattern assessment testing algorithmic reasoning, time complexity, and core computer science fundamentals.'}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/[0.06] mb-5">
                  <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                    <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Duration</p>
                    <p className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 mt-0.5">
                      <FaClock className="text-sky-400 text-xs" /> {test.duration} Mins
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                    <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Questions</p>
                    <p className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 mt-0.5">
                      <FaQuestionCircle className="text-emerald-400 text-xs" /> {test.questions?.length || 0} MCQs
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => startTest(test)}
                  className="w-full btn-primary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 group-hover:shadow-sky-500/25"
                >
                  <FaPlay className="text-[10px]" /> Start Calibrated Assessment
                </button>
              </div>
            </motion.div>
          ))}

          {tests.length === 0 && !loading && (
            <div className="col-span-full">
              <EmptyState 
                icon="trophy"
                title="No Active Mock Assessments"
                message="Instructors are curating new assessment questions for the upcoming campus recruitment round."
                actionLabel="Explore Core Notes"
                actionLink="/materials"
                tip="Take 15 minutes to review OS process scheduling and SQL joins before the next test releases."
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Active Mock Test Player View
  const currentQuestion = activeTest.questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / activeTest.questions.length) * 100;
  const isTimeUrgent = timeLeft < 120; // under 2 minutes
  const isTimeCritical = timeLeft < 60; // under 1 minute

  return (
    <div className="fixed inset-0 z-[100] bg-[#070B14] text-white overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 min-h-screen flex flex-col">
        
        {/* Sticky Exam Topbar */}
        <header className="flex justify-between items-center mb-6 sticky top-0 bg-[#070B14]/90 backdrop-blur-md py-3 z-20 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <Logo className="w-7 h-7" textSize="text-xl" />
            <div className="h-5 w-px bg-white/10 hidden sm:block"></div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                {activeTest.title}
              </h2>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Stay calm, think through edge cases, and manage your pacing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Timer Pill */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm sm:text-base font-bold transition-colors ${
              isTimeCritical 
                ? 'border-rose-500 text-rose-400 bg-rose-500/10 animate-pulse' 
                : isTimeUrgent 
                ? 'border-amber-500 text-amber-400 bg-amber-500/10' 
                : 'border-white/10 text-sky-400 bg-white/[0.03]'
            }`}>
              <FaClock className="text-xs" /> {formatTime(timeLeft)}
            </div>

            {/* Finish Button */}
            <button 
              onClick={() => setShowSubmitModal(true)}
              className="px-4 sm:px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              disabled={isSubmitting}
            >
              <FaCheck className="text-[10px]" /> Finish Assessment
            </button>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-white/[0.05] h-1.5 rounded-full mb-8 overflow-hidden border border-white/[0.04]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-sm"
          />
        </div>

        {/* Question Area & Navigator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* Main Question Display */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div 
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="glass-card p-6 sm:p-8 rounded-2xl border-white/[0.08] min-h-[420px] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-sky-500/10 border border-sky-500/25 text-sky-300 px-3 py-1 rounded-lg text-xs font-mono font-bold">
                    Question {currentQuestionIndex + 1} of {activeTest.questions.length}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Single Choice MCQ
                  </span>
                </div>

                <h2 className="text-base sm:text-xl font-bold text-white mb-6 leading-relaxed">
                  {currentQuestion.questionText}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = userAnswers[currentQuestionIndex].selectedOption === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center gap-3.5 group ${
                          isSelected 
                            ? 'border-sky-500 bg-sky-500/15 shadow-md shadow-sky-500/10' 
                            : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-mono font-bold text-xs border transition-colors ${
                          isSelected 
                            ? 'bg-sky-500 border-sky-400 text-white' 
                            : 'bg-white/[0.05] border-white/10 text-slate-400 group-hover:text-white'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-xs sm:text-sm font-medium flex-1 ${isSelected ? 'text-white font-semibold' : 'text-slate-300'}`}>
                          {option}
                        </span>
                        {isSelected && <FaCheckCircle className="text-sky-400 text-base" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prev / Next Bottom Action Controls */}
              <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-[10px]" /> Previous
                </button>

                <div className="text-xs text-slate-500 font-mono">
                  {answeredCount} / {activeTest.questions.length} answered
                </div>
                
                {currentQuestionIndex === activeTest.questions.length - 1 ? (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all"
                  >
                    Finish Test <FaCheckCircle className="text-[11px]" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl btn-primary text-xs font-bold"
                  >
                    Next Question <FaChevronRight className="text-[10px]" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Question Navigator Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-5 rounded-2xl border-white/[0.08] sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">
                  Question Navigator
                </h3>
                <span className="badge-warm text-[10px]">
                  {answeredCount} of {activeTest.questions.length} Done
                </span>
              </div>

              {/* Grid of Question Number Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {userAnswers.map((ans, idx) => {
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = !!ans.selectedOption;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isCurrent 
                          ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#070B14] bg-sky-500 text-white' 
                          : isAnswered 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Navigator Legend */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50"></div>
                  <span>Answered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-white/[0.03] border border-white/[0.08]"></div>
                  <span>Unanswered / Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-sky-500"></div>
                  <span>Currently Viewing</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Submit Confirmation Modal */}
        <AnimatePresence>
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-card p-6 sm:p-8 rounded-2xl border-white/15 max-w-md w-full text-center space-y-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto border border-emerald-500/30">
                  <FaCheckCircle />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    Submit Mock Assessment?
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    You have answered <span className="text-emerald-400 font-bold font-mono">{answeredCount}</span> out of <span className="text-white font-bold font-mono">{activeTest.questions.length}</span> questions.
                    {answeredCount < activeTest.questions.length && (
                      <span className="block text-amber-300 mt-1 font-medium">
                        ⚠️ You have {activeTest.questions.length - answeredCount} unanswered questions.
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
                  >
                    Return to Test
                  </button>
                  <button
                    onClick={submitTest}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
                  >
                    {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default MockTest;
