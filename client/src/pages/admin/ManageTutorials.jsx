import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaVideo, FaTag, FaCloudUploadAlt, FaTimes, FaFilm } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/common/Modal';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const ManageTutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    thumbnail: '',
    videoUrl: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const { loading, fetchData } = useFetch();

  const getTutorials = async () => {
    try {
      const data = await fetchData('/tutorials');
      setTutorials(data.tutorials || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTutorials();
  }, []);

  const handleOpenModal = (tutorial = null) => {
    setThumbnailFile(null);
    setVideoFile(null);
    setPreviewUrl('');
    
    if (tutorial) {
      setEditingTutorial(tutorial);
      setFormData({
        title: tutorial.title,
        description: tutorial.description,
        category: tutorial.category,
        content: tutorial.content || '',
        thumbnail: tutorial.thumbnail || '',
        videoUrl: tutorial.videoUrl || '',
        tags: tutorial.tags || []
      });
      if (tutorial.thumbnail) setPreviewUrl(tutorial.thumbnail);
    } else {
      setEditingTutorial(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        content: '',
        thumbnail: '',
        videoUrl: '',
        tags: []
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'thumbnail') {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else if (type === 'video') {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for example
        return toast.error('Video size should be less than 50MB');
      }
      setVideoFile(file);
      toast.success(`Video selected: ${file.name}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('content', formData.content);
    data.append('tags', JSON.stringify(formData.tags));
    
    if (thumbnailFile) data.append('thumbnail', thumbnailFile);
    else data.append('thumbnail', formData.thumbnail);

    if (videoFile) data.append('video', videoFile);
    else data.append('videoUrl', formData.videoUrl);

    try {
      if (editingTutorial) {
        await fetchData(`/tutorials/${editingTutorial._id}`, 'put', data, {
          'Content-Type': 'multipart/form-data',
        });
        toast.success('Tutorial updated successfully');
      } else {
        await fetchData('/tutorials', 'post', data, {
          'Content-Type': 'multipart/form-data',
        });
        toast.success('Tutorial created successfully');
      }
      setIsModalOpen(false);
      getTutorials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await fetchData(`/tutorials/${id}`, 'delete');
        toast.success('Tutorial deleted successfully');
        getTutorials();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Manage Tutorials</h1>
            <p className="text-textMuted mt-1">Upload and categorize video learning content.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Post New Tutorial
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6 bg-background px-4 py-2 rounded-xl border border-border max-w-md">
            <FaSearch className="text-textMuted" />
            <input 
              type="text" 
              placeholder="Search tutorials..." 
              className="bg-transparent border-none outline-none text-sm w-full text-textPrimary"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-textMuted text-sm uppercase tracking-wider border-b border-border">
                  <th className="pb-4 px-4">Tutorial</th>
                  <th className="pb-4 px-4">Category</th>
                  <th className="pb-4 px-4">Tags</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <SkeletonLoader type="table-row" count={5} />
                ) : (
                  <>
                    {tutorials.map((tutorial) => (
                      <tr key={tutorial._id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent overflow-hidden">
                              {tutorial.thumbnail ? (
                                <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover" />
                              ) : (
                                <FaVideo />
                              )}
                            </div>
                            <span className="font-bold text-textPrimary">{tutorial.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-textMuted">{tutorial.category}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {tutorial.tags?.slice(0, 2).map((tag, i) => (
                              <span key={i} className="bg-border text-textMuted px-2 py-0.5 rounded text-[10px] uppercase">
                                {tag}
                              </span>
                            ))}
                            {tutorial.tags?.length > 2 && (
                              <span className="text-xs text-textMuted px-1">+{tutorial.tags.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleOpenModal(tutorial)}
                              className="p-2 hover:bg-accent/10 text-textMuted hover:text-accent rounded-lg transition-all"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(tutorial._id)}
                              className="p-2 hover:bg-red-400/10 text-textMuted hover:text-red-400 rounded-lg transition-all"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tutorials.length === 0 && (
                      <tr>
                        <td colSpan="4">
                          <EmptyState 
                            icon="video" 
                            title="No Tutorials" 
                            message="You haven't posted any tutorials yet." 
                            actionLabel="Post Now"
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
        title={editingTutorial ? 'Edit Tutorial' : 'Post New Tutorial'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-textPrimary">Tutorial Title</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="e.g. Introduction to GraphQL"
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
                placeholder="e.g. Backend Development"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textPrimary">Short Description</label>
            <textarea 
              className="input-field h-20 resize-none"
              placeholder="Brief summary..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-bold text-textPrimary">Thumbnail (Optional)</label>
                {previewUrl ? (
                   <div className="relative group w-full aspect-video rounded-xl overflow-hidden border border-border">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded-lg font-bold text-xs">
                            Change
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} />
                         </label>
                      </div>
                   </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all cursor-pointer">
                    <FaCloudUploadAlt className="text-2xl text-textMuted mb-1" />
                    <span className="text-[10px] text-textMuted font-medium text-center px-4">Upload Screenshot</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} />
                  </label>
                )}
             </div>

             <div className="space-y-2">
                <label className="text-sm font-bold text-textPrimary">Video Content</label>
                {videoFile || formData.videoUrl ? (
                   <div className="w-full aspect-video rounded-xl bg-accent/5 border border-accent/20 flex flex-col items-center justify-center p-4 text-center">
                      <FaFilm className="text-3xl text-accent mb-2" />
                      <span className="text-xs font-bold text-textPrimary truncate max-w-full">
                         {videoFile ? videoFile.name : 'Cloudinary Video Linked'}
                      </span>
                      <label className="mt-3 cursor-pointer text-[10px] text-accent font-black uppercase tracking-widest hover:underline">
                         Replace Video
                         <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
                      </label>
                   </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all cursor-pointer">
                    <FaVideo className="text-2xl text-textMuted mb-1" />
                    <span className="text-[10px] text-textMuted font-medium text-center px-4">Upload MP4 Video</span>
                    <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
                  </label>
                )}
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textPrimary">Tutorial Lesson Content (MD/HTML)</label>
            <textarea 
              className="input-field h-32 resize-none"
              placeholder="Detailed lesson instructions..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textPrimary">Tags (Press Enter to add)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, i) => (
                <span key={i} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                    <FaTimes size={10} />
                  </button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              className="input-field"
              placeholder="e.g. React, JavaScript"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
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
              {loading ? 'Processing Media...' : (editingTutorial ? 'Update Tutorial' : 'Post Tutorial')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
    </AnimatedPage>
  );
};

export default ManageTutorials;
