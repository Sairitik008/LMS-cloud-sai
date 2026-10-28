import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBook, FaChevronDown, FaChevronUp, FaSearch, 
  FaClock, FaGraduationCap, FaCheckCircle, FaArrowLeft, 
  FaLaptopCode 
} from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import DOMPurify from 'dompurify';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedModule, setExpandedModule] = useState(0);

  const { loading, fetchData } = useFetch();

  const getCourses = useCallback(async () => {
    try {
      const data = await fetchData('/courses');
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  // Derive unique categories
  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyLevel = (modulesCount) => {
    if (modulesCount > 8) return { label: 'Comprehensive Track', badge: 'badge-purple' };
    if (modulesCount > 4) return { label: 'Intermediate Core', badge: 'badge-warm' };
    return { label: 'Beginner Friendly', badge: 'badge-emerald' };
  };

  if (selectedCourse) {
    const difficulty = getDifficultyLevel(selectedCourse.modules?.length || 0);

    return (
      <AnimatedPage>
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedCourse(null)}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-2 font-bold text-sm transition-colors py-2 px-3 rounded-lg hover:bg-white/[0.04]"
            >
              <FaArrowLeft className="text-xs" /> Back to All Learning Tracks
            </button>
            <div className="flex items-center gap-2">
              <span className={`${difficulty.badge} text-[10px]`}>
                {difficulty.label}
              </span>
              <span className="badge-warm text-[10px] uppercase font-mono">
                {selectedCourse.category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Course Overview Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-6 rounded-2xl border-white/[0.08] relative overflow-hidden">
                <div className="aspect-video relative mb-5 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                  {selectedCourse.thumbnail ? (
                    <img 
                      src={selectedCourse.thumbnail} 
                      alt={selectedCourse.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <FaGraduationCap className="text-5xl" />
                    </div>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight">
                  {selectedCourse.title}
                </h1>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {selectedCourse.description}
                </p>

                {/* Course Metadata Stats */}
                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <FaBook className="text-sky-400" /> Syllabus Modules
                    </span>
                    <span className="font-bold text-white font-mono">
                      {selectedCourse.modules?.length || 0} Modules
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <FaClock className="text-amber-400" /> Est. Time to Master
                    </span>
                    <span className="font-bold text-white font-mono">
                      ~{(selectedCourse.modules?.length || 1) * 45} mins
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-400" /> Level
                    </span>
                    <span className="font-bold text-white">
                      Placement Focus
                    </span>
                  </div>
                </div>

                {/* Supportive Learning Advice Box */}
                <div className="mt-6 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-300">
                  <p className="font-bold text-sky-300 flex items-center gap-1.5 mb-1">
                    <FaLaptopCode /> Hands-On Advice
                  </p>
                  Work through each module sequentially and write out code solutions locally to build muscle memory.
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Modules Accordion */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
                  <FaBook className="text-sky-400" /> Course Curriculum & Chapters
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  Click chapter to view notes
                </span>
              </div>

              {selectedCourse.modules?.map((module, index) => {
                const isExpanded = expandedModule === index;
                return (
                  <div 
                    key={index} 
                    className={`glass-card rounded-xl overflow-hidden border transition-all ${
                      isExpanded ? 'border-sky-500/40 shadow-lg' : 'border-white/[0.08] hover:border-white/[0.15]'
                    }`}
                  >
                    <button 
                      onClick={() => setExpandedModule(isExpanded ? null : index)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-3.5 text-left">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-mono font-bold text-xs transition-colors ${
                          isExpanded 
                            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' 
                            : 'bg-white/[0.05] text-slate-400'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm text-white leading-tight">
                            {module.title}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            Chapter {index + 1} of {selectedCourse.modules.length}
                          </span>
                        </div>
                      </div>
                      <div className="text-slate-400 pl-4">
                        {isExpanded ? <FaChevronUp className="text-sky-400" /> : <FaChevronDown />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-6 py-5 border-t border-white/[0.08] bg-[#090E1D]/80 text-slate-300 text-sm leading-relaxed"
                        >
                          <div 
                            className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(module.content || '<p>No content provided for this module yet.</p>') }} 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {(!selectedCourse.modules || selectedCourse.modules.length === 0) && (
                <EmptyState 
                  icon="book"
                  title="Curriculum Under Construction"
                  message="Mentors are finalizing the detailed notes and code snippets for this curriculum track."
                  tip="In the meantime, you can explore other active courses or video masterclasses."
                  actionLabel="Back to Courses"
                  onAction={() => setSelectedCourse(null)}
                />
              )}
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header with Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                PLACEMENT PREPARATION TRACKS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated Engineering Courses
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Structured modules covering core CS subjects, DSA problem-solving patterns, and production system architecture.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-[#090E1D] px-4 py-2.5 rounded-xl border border-white/[0.08] flex items-center gap-3 w-full md:w-80 shadow-inner">
            <FaSearch className="text-slate-500 text-xs" />
            <input 
              type="text" 
              placeholder="Search e.g. DSA, MERN, DBMS..." 
              className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-white placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Strip */}
        {categories.length > 1 && (
          <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat 
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 border border-sky-400/40' 
                    : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Course Cards Grid or Skeleton Loader */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const diff = getDifficultyLevel(course.modules?.length || 0);

              return (
                <motion.div 
                  key={course._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card flex flex-col group cursor-pointer rounded-2xl overflow-hidden border border-white/[0.08] hover:border-sky-500/40 transition-all shadow-lg hover:shadow-sky-500/5"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-900">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                        <FaGraduationCap className="text-4xl group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`${diff.badge} text-[10px]`}>
                        {diff.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] bg-white/[0.05] text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">
                        {course.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {course.modules?.length || 0} chapters
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed flex-1">
                      {course.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                        <FaClock className="text-slate-500 text-[10px]" /> ~{(course.modules?.length || 1) * 45} mins
                      </span>
                      <span className="text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Start Learning &rarr;
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredCourses.length === 0 && (
              <div className="col-span-full">
                <EmptyState 
                  icon="search" 
                  title="No Matching Courses Found" 
                  message={
                    searchTerm 
                      ? `We couldn't find any courses matching "${searchTerm}". Try searching for 'DSA', 'Java', or 'Full Stack'.`
                      : "No courses are published in this category yet. Check back soon!"
                  }
                  actionLabel="Reset Filters"
                  onAction={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  tip="Company technical screenings prioritize core DSA (Linked Lists, Binary Trees, Dynamic Programming)."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Courses;
