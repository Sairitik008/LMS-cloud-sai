import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, FaVideo, FaTag, FaPlayCircle, FaArrowLeft, 
  FaClock, FaLightbulb, FaCheckSquare
} from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import DOMPurify from 'dompurify';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const { loading, fetchData } = useFetch();

  const getTutorials = useCallback(async () => {
    try {
      const data = await fetchData('/tutorials');
      setTutorials(data.tutorials || []);
      setFilteredTutorials(data.tutorials || []);
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  useEffect(() => {
    getTutorials();
  }, [getTutorials]);

  const categories = ['All', ...new Set(tutorials.map(t => t.category).filter(Boolean))];

  useEffect(() => {
    let result = tutorials;
    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (searchTerm) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    setFilteredTutorials(result);
  }, [searchTerm, selectedCategory, tutorials]);

  if (selectedTutorial) {
    return (
      <AnimatedPage>
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedTutorial(null)}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-2 font-bold text-sm transition-colors py-2 px-3 rounded-lg hover:bg-white/[0.04]"
            >
              <FaArrowLeft className="text-xs" /> Back to Masterclasses
            </button>
            <div className="flex items-center gap-2">
              <span className="badge-purple text-[10px]">
                Interactive Video Walkthrough
              </span>
              <span className="badge-warm text-[10px] uppercase font-mono">
                {selectedTutorial.category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Video & Content Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass-card p-4 sm:p-6 rounded-2xl border-white/[0.08]">
                {/* Responsive Video Container */}
                <div className="aspect-video bg-black rounded-xl border border-white/10 mb-6 overflow-hidden flex items-center justify-center relative shadow-2xl">
                  {selectedTutorial.videoUrl ? (
                    <video 
                      src={selectedTutorial.videoUrl} 
                      controls 
                      className="w-full h-full object-contain"
                      poster={selectedTutorial.thumbnail}
                    >
                      Your browser does not support the video player.
                    </video>
                  ) : (
                    <div className="text-center p-8 max-w-md">
                      <FaPlayCircle className="text-5xl text-sky-400 mx-auto mb-3 opacity-60" />
                      <p className="text-white text-base font-bold mb-1">Video Stream Initializing</p>
                      <p className="text-slate-400 text-xs mb-4">Direct stream buffer is preparing content.</p>
                      <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {selectedTutorial.title}
                  </h1>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {selectedTutorial.description}
                  </p>

                  {/* Tags */}
                  {selectedTutorial.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedTutorial.tags.map((tag, i) => (
                        <span key={i} className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rich Module Content */}
                {selectedTutorial.content && (
                  <div className="mt-8 pt-6 border-t border-white/[0.08]">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 font-mono">
                      Lesson Notes & Code Annotations
                    </h3>
                    <div 
                      className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedTutorial.content) }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Companion Panel */}
            <div className="lg:col-span-4 space-y-6">
              {/* Key Takeaways Card */}
              <div className="glass-card p-5 sm:p-6 rounded-2xl border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FaCheckSquare className="text-emerald-400" /> Active Learning Tips
                </h3>
                <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0"></span>
                    <span>Re-type the code snippets demonstrated rather than copy-pasting.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                    <span>Pause at key breakpoints and predict what the output will be.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                    <span>Test your edge cases (e.g. null inputs, empty collections, single items).</span>
                  </li>
                </ul>

                <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <FaLightbulb /> Mentor Note
                  </p>
                  Watch tricky sections at 1x speed and don't hesitate to rewind complex pointer manipulation logic.
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                ENGINEERING MASTERCLASSES
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interactive Video Tutorials
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              High-yield video deep-dives covering full-stack concepts, cloud containerization, and data structure walkthroughs.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-[#090E1D] px-4 py-2.5 rounded-xl border border-white/[0.08] flex items-center gap-3 w-full md:w-80 shadow-inner">
            <FaSearch className="text-slate-500 text-xs" />
            <input 
              type="text" 
              placeholder="Search tutorials e.g. Docker, DP, Spring..." 
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

        {/* Categories Strip */}
        {categories.length > 1 && (
          <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40' 
                    : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Video Tutorials Grid */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <motion.div 
                key={tutorial._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="glass-card flex flex-col group cursor-pointer rounded-2xl overflow-hidden border border-white/[0.08] hover:border-indigo-500/40 transition-all shadow-lg hover:shadow-indigo-500/5"
                onClick={() => setSelectedTutorial(tutorial)}
              >
                <div className="aspect-video relative overflow-hidden bg-slate-900">
                  {tutorial.thumbnail ? (
                    <img 
                      src={tutorial.thumbnail} 
                      alt={tutorial.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <FaVideo className="text-4xl group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <FaPlayCircle className="text-2xl text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-white/[0.05] text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">
                      {tutorial.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <FaClock className="text-[10px]" /> Walkthrough
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {tutorial.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed flex-1">
                    {tutorial.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                    {tutorial.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] text-slate-400 font-mono bg-white/[0.03] px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredTutorials.length === 0 && (
              <div className="col-span-full">
                <EmptyState 
                  icon="video" 
                  title="No Masterclasses Found" 
                  message={
                    searchTerm 
                      ? `We couldn't find any video masterclasses matching "${searchTerm}". Try browsing another category.` 
                      : "No tutorials currently match your category filter."
                  }
                  actionLabel="View All Tutorials"
                  onAction={() => { setSelectedCategory('All'); setSearchTerm(''); }}
                  tip="Watching tutorials while keeping a live scratchpad open triples information retention."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Tutorials;
