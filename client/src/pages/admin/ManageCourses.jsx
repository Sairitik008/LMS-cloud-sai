import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBook, FaList, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/common/Modal';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
    modules: []
  });

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

  const handleOpenModal = (course = null) => {
    setThumbnailFile(null);
    setPreviewUrl('');
    
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        thumbnail: course.thumbnail || '',
        modules: course.modules || []
      });
      if (course.thumbnail) setPreviewUrl(course.thumbnail);
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        thumbnail: '',
        modules: []
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use FormData for file uploads
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('modules', JSON.stringify(formData.modules));
    
    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    } else {
      data.append('thumbnail', formData.thumbnail);
    }

    try {
      if (editingCourse) {
        await fetchData(`/courses/${editingCourse._id}`, 'put', data, {
          'Content-Type': 'multipart/form-data',
        });
        toast.success('Course updated successfully');
      } else {
        await fetchData('/courses', 'post', data, {
          'Content-Type': 'multipart/form-data',
        });
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
      getCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await fetchData(`/courses/${id}`, 'delete');
        toast.success('Course deleted successfully');
        getCourses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', content: '', order: formData.modules.length + 1 }]
    });
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeModule = (index) => {
    const updatedModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: updatedModules });
  };

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Manage Courses</h1>
            <p className="text-textMuted mt-1">Create and organize curriculum modules.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Create New Course
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6 bg-background px-4 py-2 rounded-xl border border-border max-w-md">
            <FaSearch className="text-textMuted" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="bg-transparent border-none outline-none text-sm w-full text-textPrimary"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-textMuted text-sm uppercase tracking-wider border-b border-border">
                  <th className="pb-4 px-4">Course</th>
                  <th className="pb-4 px-4">Category</th>
                  <th className="pb-4 px-4">Modules</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <SkeletonLoader type="table-row" count={5} />
                ) : (
                  <>
                    {courses.map((course) => (
                      <tr key={course._id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent overflow-hidden">
                              {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                              ) : (
                                <FaBook />
                              )}
                            </div>
                            <span className="font-bold text-textPrimary">{course.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-textMuted">{course.category}</td>
                        <td className="py-4 px-4">
                          <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-bold">
                            {course.modules?.length || 0} Modules
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleOpenModal(course)}
                              className="p-2 hover:bg-accent/10 text-textMuted hover:text-accent rounded-lg transition-all"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(course._id)}
                              className="p-2 hover:bg-red-400/10 text-textMuted hover:text-red-400 rounded-lg transition-all"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && (
                      <tr>
                        <td colSpan="4">
                           <EmptyState 
                             icon="course" 
                             title="No Courses" 
                             message="You haven't created any courses yet." 
                             actionLabel="Create Now"
                             actionLink="#"
                           />
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-textPrimary">Course Title</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="e.g. Master React in 30 Days"
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
                placeholder="e.g. Web Development"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textPrimary">Description</label>
            <textarea 
              className="input-field h-24 resize-none"
              placeholder="Brief overview of what students will learn..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textPrimary">Course Banner (Cloudinary Upload)</label>
            {previewUrl ? (
              <div className="relative group w-full aspect-video rounded-xl overflow-hidden border border-border">
                 <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-accent hover:text-white transition-all">
                       Change Image
                       <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <button 
                      type="button" 
                      onClick={() => { setThumbnailFile(null); setPreviewUrl(''); setFormData({...formData, thumbnail: ''}); }}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      <FaTimes />
                    </button>
                 </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all cursor-pointer">
                <FaCloudUploadAlt className="text-4xl text-textMuted mb-2" />
                <span className="text-sm text-textMuted font-medium">Click to upload banner image</span>
                <span className="text-[10px] text-textMuted uppercase mt-1">Recommended: 1280x720 (16:9)</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FaList className="text-accent" /> Course Modules
              </h3>
              <button 
                type="button"
                onClick={addModule}
                className="text-xs bg-accent/10 text-accent font-bold px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-all"
              >
                + Add Module
              </button>
            </div>

            {formData.modules.map((module, index) => (
              <div key={index} className="p-4 border border-border rounded-xl space-y-4 bg-background/50">
                <div className="flex justify-between items-center">
                  <span className="text-accent font-bold">Module {index + 1}</span>
                  <button 
                    type="button" 
                    onClick={() => removeModule(index)}
                    className="text-red-400 hover:text-red-500 p-1"
                  >
                    <FaTrash />
                  </button>
                </div>
                <input 
                  type="text" 
                  className="input-field bg-card"
                  placeholder="Module Title"
                  value={module.title}
                  onChange={(e) => updateModule(index, 'title', e.target.value)}
                  required
                />
                <textarea 
                  className="input-field bg-card h-20 resize-none"
                  placeholder="Module Content (Markdown/Rich Text supported)"
                  value={module.content}
                  onChange={(e) => updateModule(index, 'content', e.target.value)}
                  required
                />
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
              {loading ? 'Processing...' : (editingCourse ? 'Update Course' : 'Create Course')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
    </AnimatedPage>
  );
};

export default ManageCourses;
