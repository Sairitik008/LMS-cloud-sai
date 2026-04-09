import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaVideo, FaTag, FaPlayCircle } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const { loading, fetchData } = useFetch();

  const getTutorials = async () => {
    try {
      const data = await fetchData('/tutorials');
      setTutorials(data.tutorials || []);
      setFilteredTutorials(data.tutorials || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTutorials();
  }, []);

  const categories = ['All', ...new Set(tutorials.map(t => t.category))];

  useEffect(() => {
    let result = tutorials;
    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (searchTerm) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredTutorials(result);
  }, [searchTerm, selectedCategory, tutorials]);

  if (selectedTutorial) {
    return (
      <AnimatedPage>
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedTutorial(null)}
            className="text-accent underline flex items-center gap-2 mb-4 hover:text-accent/80 transition-all font-bold"
          >
            &larr; Back to Tutorials
          </button>
          <div className="glass-card p-6 md:p-10">
            <h1 className="text-3xl font-bold mb-4">{selectedTutorial.title}</h1>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase transition-all">
                {selectedTutorial.category}
              </span>
              {selectedTutorial.tags?.map((tag, i) => (
                <span key={i} className="bg-border text-textMuted px-3 py-1 rounded-full text-xs transition-all">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="aspect-video bg-black rounded-2xl border border-border mb-8 overflow-hidden flex items-center justify-center relative shadow-2xl">
              {selectedTutorial.videoUrl ? (
                <video 
                  src={selectedTutorial.videoUrl} 
                  controls 
                  className="w-full h-full object-contain"
                  poster={selectedTutorial.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center p-10 max-w-lg">
                    <FaPlayCircle className="text-6xl text-accent mx-auto mb-4 opacity-50" />
                    <p className="text-textMuted text-lg font-bold mb-2">Video Content Loading...</p>
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-1/3 animate-pulse"></div>
                    </div>
                </div>
              )}
            </div>

            <div 
              className="prose prose-invert max-w-none text-textMuted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedTutorial.content }}
            />
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Video Tutorials</h1>
          <p className="text-textMuted mt-1">Enhance your IT skills with our expert-led video content.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-background px-4 py-2 rounded-xl border border-border flex items-center gap-4">
            <FaSearch className="text-textMuted" />
            <input 
              type="text" 
              placeholder="Search tutorials..." 
              className="bg-transparent border-none outline-none text-sm w-full text-textPrimary placeholder:text-textMuted"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1 overflow-x-auto glass-card border-none bg-card/50">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-300
                ${selectedCategory === cat ? 'bg-accent text-white shadow-lg' : 'text-textMuted hover:bg-accent/5 hover:text-textPrimary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => (
              <motion.div 
                key={tutorial._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => setSelectedTutorial(tutorial)}
              >
                <div className="aspect-video relative overflow-hidden">
                  {tutorial.thumbnail ? (
                    <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent">
                       <FaVideo className="text-4xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <FaPlayCircle className="text-5xl text-accent" />
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded uppercase font-black tracking-widest">
                    {tutorial.category}
                  </span>
                  <h3 className="text-xl font-bold mt-4 mb-2 group-hover:text-accent transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-textMuted line-clamp-2 leading-relaxed">
                    {tutorial.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {tutorial.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] text-textMuted flex items-center gap-1">
                        <FaTag className="text-accent/50" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredTutorials.length === 0 && (
              <EmptyState 
                icon="video" 
                title="No Tutorials Found" 
                message="We couldn't find any tutorials matching your filters. Try a different search term." 
              />
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Tutorials;
