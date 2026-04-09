import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaCheckCircle, FaTimesCircle, FaClock, FaRedo, FaList } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';

const TestResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const { loading, fetchData } = useFetch();

  const getResult = async () => {
    try {
      const data = await fetchData(`/results/me`);
      const currentResult = data.find(r => r._id === id);
      setResult(currentResult);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getResult();
  }, [id]);

  if (loading || !result) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-textPrimary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const scoreColor = result.score >= 70 ? 'text-green-500' : result.score >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent text-5xl mx-auto mb-6"
        >
          <FaTrophy />
        </motion.div>
        <h1 className="text-4xl font-bold mb-2">Test Completed!</h1>
        <p className="text-textMuted">You've successfully finished the {result.mockTest?.title} assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResultCard label="Final Score" value={`${result.score}%`} color={scoreColor} />
        <ResultCard label="Correct Answers" value={`${result.correctAnswers} / ${result.totalQuestions}`} color="text-textPrimary" />
        <ResultCard label="Time Taken" value={`${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`} color="text-textPrimary" />
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 py-8 border-b border-border">
          <Link to="/mocktests" className="btn-primary flex items-center gap-2 px-8">
            <FaRedo /> Try Another Test
          </Link>
          <Link to="/dashboard" className="px-8 py-3 rounded-lg border border-border hover:bg-white/5 flex items-center gap-2 transition-all">
            <FaList /> Back to Dashboard
          </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <FaCheckCircle className="text-accent" /> Review Answers
        </h2>
        
        {result.answers.map((ans, idx) => (
          <div key={idx} className={`glass-card p-6 border-l-4 ${ans.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex justify-between items-start gap-4 mb-4">
               <h3 className="font-bold text-lg flex-1">
                 Question {idx + 1}
               </h3>
               {ans.isCorrect ? (
                 <span className="flex items-center gap-1 text-green-500 text-sm font-bold">
                    <FaCheckCircle /> Correct
                 </span>
               ) : (
                 <span className="flex items-center gap-1 text-red-500 text-sm font-bold">
                    <FaTimesCircle /> Incorrect
                 </span>
               )}
            </div>
            
            <p className="text-textPrimary mb-4">{result.mockTest?.questions?.[ans.questionIndex]?.questionText || 'Question text not available.'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-6">
               <div className="p-4 rounded-xl bg-background border border-border">
                  <p className="text-xs text-textMuted uppercase font-black mb-2 tracking-widest">Your Answer</p>
                  <p className={ans.isCorrect ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{ans.selectedOption || 'No answer selected'}</p>
               </div>
               {!ans.isCorrect && (
                 <div className="p-4 rounded-xl bg-background border border-border">
                    <p className="text-xs text-textMuted uppercase font-black mb-2 tracking-widest">Correct Answer</p>
                    <p className="text-green-500 font-bold">{result.mockTest?.questions?.[ans.questionIndex]?.correctAnswer}</p>
                 </div>
               )}
            </div>
            
            {result.mockTest?.questions?.[ans.questionIndex]?.explanation && (
              <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20 text-sm">
                <p className="text-accent font-bold mb-1 italic">Explanation:</p>
                <p className="text-textMuted leading-relaxed">{result.mockTest.questions[ans.questionIndex].explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultCard = ({ label, value, color }) => (
  <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
    <p className="text-xs text-textMuted uppercase font-black tracking-widest mb-2">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

export default TestResult;
