import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaChevronDown, FaChevronUp, FaFileAlt, FaSearch } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  const { loading, fetchData } = useFetch();

  const getCourses = async () => {
    try {
      const data = await fetchData('/courses');
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCourse) {
    return (
      <AnimatedPage>
        <div className="space-y-8">
          <button 
            onClick={() => setSelectedCourse(null)}
            className="text-accent underline flex items-center gap-2 mb-4 hover:text-accent/80 transition-all font-bold"
          >
            &larr; Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6 overflow-hidden">
                <div className="aspect-video relative mb-6 rounded-xl overflow-hidden">
                    {selectedCourse.thumbnail ? (
                      <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent">
                        <FaBook className="text-4xl" />
                      </div>
                    )}
                </div>
                <h1 className="text-2xl font-bold mb-4">{selectedCourse.title}</h1>
                <span className="text-xs bg-accent/20 text-accent px-3 py-1 rounded-full uppercase font-black tracking-widest">
                  {selectedCourse.category}
                </span>
                <p className="text-textMuted mt-6 text-sm leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                  <FaBook className="text-accent" /> Course Modules
              </h2>
              {selectedCourse.modules?.map((module, index) => (
                  <div key={index} className="glass-card overflow-hidden">
                    <button 
                      onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all"
                    >
                        <div className="flex items-center gap-4 text-left">
                          <span className="w-8 h-8 flex items-center justify-center bg-accent/10 text-accent rounded-lg font-bold text-sm">
                              {index + 1}
                          </span>
                          <h3 className="font-bold text-textPrimary leading-tight">{module.title}</h3>
                        </div>
                        {expandedModule === index ? <FaChevronUp className="text-textMuted" /> : <FaChevronDown className="text-textMuted" />}
                    </button>
                    <AnimatePresence>
                        {expandedModule === index && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 py-6 border-t border-border bg-background/50 text-textMuted text-sm leading-relaxed"
                          >
                            <div 
                              className="prose prose-invert max-w-none"
                              dangerouslySetInnerHTML={{ __html: module.content }} 
                            />
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">All Courses</h1>
            <p className="text-textMuted mt-1">Structured learning paths for next-gen IT skills.</p>
          </div>
          <div className="bg-background px-4 py-2 rounded-xl border border-border flex items-center gap-4 max-w-md w-full">
            <FaSearch className="text-textMuted" />
            <input 
              type="text" 
              placeholder="Search for courses..." 
              className="bg-transparent border-none outline-none text-sm w-full text-textPrimary placeholder:text-textMuted"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <motion.div 
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                className="glass-card flex flex-col group cursor-pointer h-full"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="aspect-video relative overflow-hidden">
                  {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                      <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent">
                        <FaBook className="text-4xl" />
                      </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded-full uppercase font-black w-fit">
                    {course.category}
                  </span>
                  <h3 className="text-xl font-bold mt-4 mb-2 group-hover:text-accent transition-colors">
                      {course.title}
                  </h3>
                  <p className="text-sm text-textMuted line-clamp-2 leading-relaxed flex-1">
                    {course.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between pt-6 border-t border-border">
                      <span className="text-xs text-textMuted flex items-center gap-2">
                        <FaBook className="text-accent" /> {course.modules?.length || 0} Modules
                      </span>
                      <span className="text-xs font-bold text-accent">View Details &rarr;</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredCourses.length === 0 && (
              <EmptyState 
                icon="course" 
                title="No Courses Found" 
                message="We couldn't find any courses matching your search. Try a different term or category." 
              />
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Courses;
