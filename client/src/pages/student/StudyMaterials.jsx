import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaLink, FaStickyNote, FaSearch, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const { loading, fetchData } = useFetch();

  const getMaterials = async () => {
    try {
      const data = await fetchData('/materials');
      setMaterials(data.materials || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMaterials();
  }, []);

  const types = ['All', 'pdf', 'link', 'notes'];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-400" />;
      case 'link': return <FaLink className="text-blue-400" />;
      case 'notes': return <FaStickyNote className="text-yellow-400" />;
      default: return <FaFilePdf />;
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Study Resources</h1>
          <p className="text-textMuted mt-1">Download and access PDFs, links, and curated technical notes.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-background px-4 py-2 rounded-xl border border-border flex items-center gap-4">
            <FaSearch className="text-textMuted" />
            <input 
              type="text" 
              placeholder="Search materials by title, description or category..." 
              className="bg-transparent border-none outline-none text-sm w-full text-textPrimary placeholder:text-textMuted"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1 overflow-x-auto glass-card border-none bg-card/50">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-300
                ${selectedType === type ? 'bg-accent text-white shadow-lg' : 'text-textMuted hover:bg-accent/5 hover:text-textPrimary'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((m) => (
              <motion.div 
                key={m._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="glass-card p-6 flex flex-col h-full"
              >
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl">
                       {getIcon(m.type)}
                    </div>
                    <span className="text-[10px] bg-border text-textMuted px-2 py-1 rounded uppercase font-black tracking-widest">
                       {m.category}
                    </span>
                 </div>
                 
                 <h3 className="text-xl font-bold mb-2 text-textPrimary">{m.title}</h3>
                 <p className="text-sm text-textMuted line-clamp-3 mb-6 flex-1 leading-relaxed">
                   {m.description || 'No description available for this resource.'}
                 </p>

                 <div className="pt-6 border-t border-border mt-auto">
                    <a 
                      href={m.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full btn-primary flex items-center justify-center gap-3 text-sm"
                    >
                       {m.type === 'link' ? <FaExternalLinkAlt /> : <FaDownload />}
                       {m.type === 'link' ? 'Visit URL' : 'Download Resource'}
                    </a>
                 </div>
              </motion.div>
            ))}

            {filteredMaterials.length === 0 && (
              <EmptyState 
                icon="inbox" 
                title="No Materials Found" 
                message="We couldn't find any study materials matching your filters." 
              />
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default StudyMaterials;
