import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaGamepad, FaClock, FaQuestionCircle } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/common/Modal';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const ManageMockTests = () => {
  const [tests, setTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: 30, // minutes
    questions: []
  });

  const { loading, fetchData } = useFetch();

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

  const handleOpenModal = (test = null) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        title: test.title,
        description: test.description,
        category: test.category,
        duration: test.duration || 30,
        questions: test.questions || []
      });
    } else {
      setEditingTest(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        duration: 30,
        questions: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) {
      return toast.error('Please add at least one question');
    }
    
    try {
      if (editingTest) {
        await fetchData(`/mocktests/${editingTest._id}`, 'put', formData);
        toast.success('Mock Test updated successfully');
      } else {
        await fetchData('/mocktests', 'post', formData);
        toast.success('Mock Test created successfully');
      }
      setIsModalOpen(false);
      getTests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await fetchData(`/mocktests/${id}`, 'delete');
        toast.success('Mock Test deleted successfully');
        getTests();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions, 
        { questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }
      ]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData({ ...formData, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: updated });
  };

  const removeQuestion = (index) => {
    setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== index) });
  };

  return (
    <AnimatedPage>
      <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Mock Tests</h1>
          <p className="text-textMuted mt-1">Design assessments with timed countdowns.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Create Mock Test
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6 bg-background px-4 py-2 rounded-xl border border-border max-w-md">
          <FaSearch className="text-textMuted" />
          <input 
            type="text" 
            placeholder="Search tests..." 
            className="bg-transparent border-none outline-none text-sm w-full text-textPrimary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-textMuted text-sm uppercase tracking-wider border-b border-border">
                <th className="pb-4 px-4">Test Title</th>
                <th className="pb-4 px-4">Duration</th>
                <th className="pb-4 px-4">Questions</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tests.map((test) => (
                <tr key={test._id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <FaGamepad />
                      </div>
                      <span className="font-bold text-textPrimary">{test.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-textMuted">
                    <span className="flex items-center gap-2">
                       <FaClock className="text-xs" /> {test.duration} mins
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-bold">
                       {test.questions?.length || 0} Questions
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(test)}
                        className="p-2 hover:bg-accent/10 text-textMuted hover:text-accent rounded-lg transition-all"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(test._id)}
                        className="p-2 hover:bg-red-400/10 text-textMuted hover:text-red-400 rounded-lg transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTest ? 'Edit Mock Test' : 'Create Mock Test'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-textPrimary">Test Title</label>
                 <input 
                   type="text" 
                   className="input-field"
                   placeholder="e.g. JavaScript Advanced Patterns"
                   value={formData.title}
                   onChange={(e) => setFormData({...formData, title: e.target.value})}
                   required
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-textPrimary">Category</label>
                 <input 
                   type="text" 
                   className="input-field"
                   placeholder="e.g. JavaScript"
                   value={formData.category}
                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                   required
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-textPrimary">Duration (Minutes)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    className="input-field"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    required
                  />
                  <FaClock className="text-textMuted" />
                </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold text-textPrimary">Description</label>
              <textarea 
                className="input-field h-16 resize-none"
                placeholder="Instructions for the test..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
           </div>

           <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FaQuestionCircle className="text-accent" /> Questions Loader
                </h3>
                <button 
                  type="button"
                  onClick={addQuestion}
                  className="text-xs bg-accent/10 text-accent font-bold px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-all"
                >
                  + Add Question
                </button>
              </div>

              {formData.questions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 border border-border rounded-xl space-y-4 bg-background/50">
                  <div className="flex justify-between items-center">
                    <span className="text-accent font-bold">Question {qIdx + 1}</span>
                    <button 
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="text-red-400 hover:text-red-500 p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <textarea 
                    className="input-field bg-card h-20 resize-none"
                    placeholder="Enter question text..."
                    value={q.questionText}
                    onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex gap-2 items-center">
                        <span className="text-xs text-textMuted font-bold w-4">
                           {String.fromCharCode(65 + oIdx)}
                        </span>
                        <input 
                          type="text" 
                          className="input-field bg-card flex-1 text-sm py-2"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-textMuted">Correct Answer</label>
                      <select 
                        className="input-field bg-card text-sm py-2"
                        value={q.correctAnswer}
                        onChange={(e) => updateQuestion(qIdx, 'correctAnswer', e.target.value)}
                        required
                      >
                        <option value="">Select correct option...</option>
                        {q.options.filter(o => o.trim() !== '').map((o, idx) => (
                          <option key={idx} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-textMuted">Explanation (Optional)</label>
                      <input 
                        type="text" 
                        className="input-field bg-card text-sm py-2"
                        placeholder="Why is this correct?"
                        value={q.explanation}
                        onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
           </div>

           <div className="pt-6 border-t border-border flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-textMuted hover:text-textPrimary transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingTest ? 'Update Test' : 'Create Test')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
    </AnimatedPage>
  );
};

export default ManageMockTests;
