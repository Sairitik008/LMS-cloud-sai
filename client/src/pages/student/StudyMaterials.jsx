import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFilePdf, FaLink, FaStickyNote, FaSearch, 
  FaDownload, FaExternalLinkAlt, FaBookOpen, FaLightbulb, FaBookmark
} from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const { loading, fetchData } = useFetch();

  const getMaterials = useCallback(async () => {
    try {
      const data = await fetchData('/materials');
      setMaterials(data.materials || []);
    } catch (err) {
      console.error(err);
    }
  }, [fetchData]);

  useEffect(() => {
    getMaterials();
  }, [getMaterials]);

  const types = ['All', 'pdf', 'link', 'notes'];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (m.category && m.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'All' || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-rose-400" />;
      case 'link': return <FaLink className="text-sky-400" />;
      case 'notes': return <FaStickyNote className="text-amber-400" />;
      default: return <FaBookOpen className="text-emerald-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'pdf': return 'PDF Document';
      case 'link': return 'External Guide';
      case 'notes': return 'Revision Notes';
      default: return 'Study Resource';
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                INTERVIEW CHEATSHEETS & NOTES
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated Placement Materials
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              High-yield PDF summaries, formula sheets, and curated links for rapid revision before campus interviews.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-[#090E1D] px-4 py-2.5 rounded-xl border border-white/[0.08] flex items-center gap-3 w-full md:w-80 shadow-inner">
            <FaSearch className="text-slate-500 text-xs" />
            <input 
              type="text" 
              placeholder="Search notes e.g. DBMS, Striver, OS..." 
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

        {/* Resource Type Filter Pills */}
        <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                selectedType === type 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 border border-emerald-400/40' 
                  : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {type === 'All' ? 'All Formats' : getTypeLabel(type)}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((m) => (
              <motion.div 
                key={m._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-5 rounded-2xl flex flex-col h-full border border-white/[0.08] hover:border-emerald-500/40 transition-all shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xl shadow-inner">
                    {getIcon(m.type)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.08] px-2 py-0.5 rounded font-mono uppercase font-bold">
                      {m.category || 'General'}
                    </span>
                    <span className="badge-emerald text-[10px]">
                      {getTypeLabel(m.type)}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white mb-1.5 leading-snug">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 mb-5 flex-1 leading-relaxed">
                  {m.description || 'Verified study resource compiled for upcoming placement evaluations.'}
                </p>

                <div className="pt-4 border-t border-white/[0.06] mt-auto">
                  <a 
                    href={m.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full btn-primary py-2 px-4 flex items-center justify-center gap-2 text-xs font-bold"
                  >
                    {m.type === 'link' ? <FaExternalLinkAlt className="text-[11px]" /> : <FaDownload className="text-[11px]" />}
                    {m.type === 'link' ? 'Open Resource Link' : 'Download Reference Material'}
                  </a>
                </div>
              </motion.div>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="col-span-full">
                <EmptyState 
                  icon="inbox" 
                  title="No Resources Found" 
                  message={
                    searchTerm 
                      ? `We couldn't find any resources matching "${searchTerm}". Try adjusting your query.` 
                      : "No study materials match this format category yet."
                  }
                  actionLabel="Show All Resources"
                  onAction={() => { setSelectedType('All'); setSearchTerm(''); }}
                  tip="Company technical tests frequently ask about ACID properties, Deadlock conditions, and B-Tree heights."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default StudyMaterials;
