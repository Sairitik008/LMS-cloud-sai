import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaQuestionCircle, FaCheckCircle, FaChevronRight, FaChevronLeft, FaPlay, FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import toast from 'react-hot-toast';
import Logo from '../../components/common/Logo';

const MockTest = () => {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, fetchData } = useFetch();
  const navigate = useNavigate();

  const getTests = async () => {
    try {
      const data = await fetchData('/mocktests');
      setTests(data.tests || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTests();
  }, []);

  const startTest = (test) => {
    setActiveTest(test);
    setTimeLeft(test.duration * 60);
    setUserAnswers(test.questions.map((q, index) => ({
      questionIndex: index,
      selectedOption: ''
    })));
    setTestStarted(true);
    setCurrentQuestionIndex(0);
    
    // Request full screen for better experience
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
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const resultData = {
        mockTestId: activeTest._id,
        answers: userAnswers,
        timeTaken: (activeTest.duration * 60) - timeLeft
      };
      
      const response = await fetchData('/results', 'post', resultData);
      toast.success('Test submitted successfully!');
      
      // Exit full screen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      
      navigate(`/test-result/${response._id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  }, [activeTest, userAnswers, timeLeft, isSubmitting, fetchData, navigate]);

  // Timer logic
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (testStarted && timeLeft === 0) {
      submitTest();
    }
  }, [testStarted, timeLeft, submitTest]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 1. Initial Test List View
  if (!testStarted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary text-center">Interactive Mock Tests</h1>
          <p className="text-textMuted mt-1 text-center">Test your knowledge with timed assessments and get real-time results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test) => (
            <motion.div 
              key={test._id}
              whileHover={{ y: -5 }}
              className="glass-card p-8 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-3xl mb-6 transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                <FaGamepad />
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">{test.title}</h3>
              <p className="text-sm text-textMuted mb-6 flex-1">{test.description}</p>
              
              <div className="flex gap-4 w-full mb-8 pt-6 border-t border-border">
                <div className="flex-1 text-center">
                  <p className="text-[10px] text-textMuted uppercase font-black">Duration</p>
                  <p className="text-sm font-bold flex items-center justify-center gap-1">
                    <FaClock className="text-accent" /> {test.duration}m
                  </p>
                </div>
                <div className="flex-1 text-center border-l border-border">
                  <p className="text-[10px] text-textMuted uppercase font-black">Questions</p>
                  <p className="text-sm font-bold flex items-center justify-center gap-1">
                    <FaQuestionCircle className="text-accent" /> {test.questions?.length}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => startTest(test)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <FaPlay className="text-xs" /> Start Test Now
              </button>
            </motion.div>
          ))}
          {tests.length === 0 && !loading && (
             <div className="col-span-full py-20 text-center glass-card">
                <FaGamepad className="text-5xl text-accent/20 mx-auto mb-4" />
                <p className="text-textMuted">No mock tests available at the moment.</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Mock Test Player View
  const currentQuestion = activeTest.questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / activeTest.questions.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-background text-textPrimary overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-background/90 backdrop-blur-md py-4 z-10 border-b border-border">
          <div className="flex items-center gap-4">
            <Logo className="w-8 h-8" textSize="text-2xl" />
            <div className="h-6 w-px bg-border"></div>
            <h2 className="font-bold text-lg hidden sm:block">{activeTest.title}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono text-xl transition-colors
              ${timeLeft < 60 ? 'border-red-500 text-red-500 animate-pulse' : 'border-accent/40 text-accent'}`}
            >
              <FaClock /> {formatTime(timeLeft)}
            </div>
            <button 
              onClick={submitTest}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Finish Test'}
            </button>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-card h-2 rounded-full mb-10 border border-border">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="bg-accent h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          />
        </div>

        {/* Question Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 flex-1">
          <div className="lg:col-span-3 space-y-8">
            <motion.div 
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-10 min-h-[400px] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-lg font-bold">
                  Question {currentQuestionIndex + 1}
                </span>
                <span className="text-textMuted text-sm">of {activeTest.questions.length}</span>
              </div>

              <h2 className="text-2xl font-bold mb-10 leading-tight">
                {currentQuestion.questionText}
              </h2>

              <div className="space-y-4 flex-1">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQuestionIndex].selectedOption === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group
                      ${isSelected 
                        ? 'border-accent bg-accent/10 border-opacity-100 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                        : 'border-border bg-card hover:border-accent/40 hover:bg-accent/5'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-lg border-2 transition-colors
                        ${isSelected ? 'bg-accent border-accent text-white' : 'bg-background border-border text-textMuted group-hover:border-accent/50'}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`flex-1 font-medium ${isSelected ? 'text-textPrimary' : 'text-textMuted group-hover:text-textPrimary'}`}>
                        {option}
                      </span>
                      {isSelected && <FaCheckCircle className="text-accent text-xl animate__animated animate__bounceIn" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-between pt-10 border-t border-border">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-textMuted hover:text-textPrimary hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft /> Previous
                </button>
                
                {currentQuestionIndex === activeTest.questions.length - 1 ? (
                  <button
                    onClick={submitTest}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transition-all"
                  >
                    Finish Test <FaCheckCircle />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold shadow-lg transition-all"
                  >
                    Next Question <FaChevronRight />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="glass-card p-6 h-fit sticky top-32">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-textPrimary">
                   Question Navigator
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3">
                   {userAnswers.map((ans, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all
                          ${currentQuestionIndex === idx ? 'ring-2 ring-accent ring-offset-4 ring-offset-background' : ''}
                          ${ans.selectedOption ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card text-textMuted border border-border hover:border-accent/40'}`}
                      >
                         {idx + 1}
                      </button>
                   ))}
                </div>
                
                <div className="mt-10 pt-6 border-t border-border">
                   <div className="flex items-center gap-3 text-xs text-textMuted mb-4">
                      <div className="w-3 h-3 rounded bg-accent/20 border border-accent/30"></div>
                      <span>Answered</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs text-textMuted">
                      <div className="w-3 h-3 rounded bg-card border border-border"></div>
                      <span>Not Answered</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
