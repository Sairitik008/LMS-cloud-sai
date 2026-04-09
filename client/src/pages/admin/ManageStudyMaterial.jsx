import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilePdf, FaLink, FaStickyNote } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const ManageStudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fileUrl: '',
    type: 'pdf'
  });

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

  const handleOpenModal = (material = null) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        title: material.title,
        description: material.description,
        category: material.category,
        fileUrl: material.fileUrl,
        type: material.type
      });
    } else {
      setEditingMaterial(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        fileUrl: '',
        type: 'pdf'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        await fetchData(`/materials/${editingMaterial._id}`, 'put', formData);
        toast.success('Material updated successfully');
      } else {
        await fetchData('/materials', 'post', formData);
        toast.success('Material created successfully');
      }
      setIsModalOpen(false);
      getMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await fetchData(`/materials/${id}`, 'delete');
        toast.success('Material deleted successfully');
        getMaterials();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-400" />;
      case 'link': return <FaLink className="text-blue-400" />;
      case 'notes': return <FaStickyNote className="text-yellow-400" />;
      default: return <FaFilePdf />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Study Materials</h1>
          <p className="text-textMuted mt-1">Manage PDFs, external links, and text notes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add New Material
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6 bg-background px-4 py-2 rounded-xl border border-border max-w-md">
          <FaSearch className="text-textMuted" />
          <input 
            type="text" 
            placeholder="Search materials..." 
            className="bg-transparent border-none outline-none text-sm w-full text-textPrimary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-textMuted text-sm uppercase tracking-wider border-b border-border">
                <th className="pb-4 px-4">Title</th>
                <th className="pb-4 px-4">Type</th>
                <th className="pb-4 px-4">Category</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {materials.map((m) => (
                <tr key={m._id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        {getIcon(m.type)}
                      </div>
                      <span className="font-bold text-textPrimary">{m.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="capitalize text-sm px-2 py-1 bg-border rounded text-textMuted">{m.type}</span>
                  </td>
                  <td className="py-4 px-4 text-textMuted">{m.category}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(m)}
                        className="p-2 hover:bg-accent/10 text-textMuted hover:text-accent rounded-lg transition-all"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(m._id)}
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
        title={editingMaterial ? 'Edit Material' : 'Add New Material'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-bold text-textPrimary">Material Title</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. AWS Design Patterns PDF"
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
                  placeholder="e.g. Cloud Architecture"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textPrimary">Type</label>
            <div className="flex gap-4">
              {['pdf', 'link', 'notes'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({...formData, type: t})}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-3 capitalize
                  ${formData.type === t ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border text-textMuted hover:border-accent/50'}`}
                >
                  {getIcon(t)} {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textPrimary">File URL / Download Link</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="https://example.com/file.pdf"
              value={formData.fileUrl}
              onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textPrimary">Description (Optional)</label>
            <textarea 
              className="input-field h-24 resize-none"
              placeholder="Short description of the material..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              {loading ? 'Saving...' : (editingMaterial ? 'Update Material' : 'Add Material')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageStudyMaterial;
