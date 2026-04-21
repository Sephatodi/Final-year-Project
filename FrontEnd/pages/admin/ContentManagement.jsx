import React, { useState, useEffect } from 'react';
import { adminQueries } from '../../db/adminQueries';

const ContentManagement = () => {
  const [articles, setArticles] = useState([]);
  const [pendingArticles, setPendingArticles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleTn: '',
    contentEn: '',
    contentTn: '',
    species: 'all',
    symptoms: '',
    treatment: '',
    prevention: '',
    notifiable: false,
    tags: ''
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const allArticles = await adminQueries.getAllArticles();
      const pending = await adminQueries.getPendingArticles();
      setArticles(allArticles);
      setPendingArticles(pending);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const newArticle = await adminQueries.createArticle({
        ...formData,
        symptoms: formData.symptoms.split(',').map(s => s.trim()),
        tags: formData.tags.split(',').map(t => t.trim().toLowerCase())
      });
      setArticles(prev => [...prev, newArticle]);
      setPendingArticles(prev => [...prev, newArticle]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add article:', error);
      alert('Failed to add article');
    }
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    try {
      const updatedArticle = await adminQueries.updateArticle(editingArticle.id, {
        ...formData,
        symptoms: formData.symptoms.split(',').map(s => s.trim()),
        tags: formData.tags.split(',').map(t => t.trim().toLowerCase())
      });
      setArticles(prev => prev.map(a => a.id === editingArticle.id ? updatedArticle : a));
      setPendingArticles(prev => [...prev, updatedArticle]);
      setEditingArticle(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update article:', error);
      alert('Failed to update article');
    }
  };

  const handleApproveArticle = async (id) => {
    try {
      const approvedArticle = await adminQueries.approveArticle(id);
      setArticles(prev => prev.map(a => a.id === id ? approvedArticle : a));
      setPendingArticles(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to approve article:', error);
      alert('Failed to approve article');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await adminQueries.deleteArticle(id);
        setArticles(prev => prev.filter(a => a.id !== id));
        setPendingArticles(prev => prev.filter(a => a.id !== id));
      } catch (error) {
        console.error('Failed to delete article:', error);
        alert('Failed to delete article');
      }
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setFormData({
      titleEn: article.titleEn,
      titleTn: article.titleTn,
      contentEn: article.contentEn,
      contentTn: article.contentTn,
      species: article.species,
      symptoms: article.symptoms ? article.symptoms.join(', ') : '',
      treatment: article.treatment || '',
      prevention: article.prevention || '',
      notifiable: article.notifiable || false,
      tags: article.tags ? article.tags.join(', ') : ''
    });
  };

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleTn: '',
      contentEn: '',
      contentTn: '',
      species: 'all',
      symptoms: '',
      treatment: '',
      prevention: '',
      notifiable: false,
      tags: ''
    });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Content Management</h3>
          <p className="text-sage-500 text-sm">Manage knowledge base articles and disease information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <span className="material-icons-outlined">add_circle</span>
          Add Article
        </button>
      </div>

      {/* Pending Approvals */}
      {pendingArticles.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-icons-outlined text-yellow-600">pending_actions</span>
            Pending Article Approvals ({pendingArticles.length})
          </h3>
          
          <div className="space-y-4">
            {pendingArticles.map(article => (
              <div key={article.id} className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{article.titleEn}</p>
                  <p className="text-sm text-sage-500">Species: {article.species} | Version: {article.version}</p>
                  <p className="text-xs text-sage-500 mt-1">Created: {new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditArticle(article)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <span className="material-icons-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => handleApproveArticle(article.id)}
                    className="btn-primary px-4 py-2"
                  >
                    <span className="material-icons-outlined">check</span>
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <span className="material-icons-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800">
          <h3 className="font-bold text-lg">All Articles ({articles.length})</h3>
        </div>
        
        <div className="divide-y divide-sage-100 dark:divide-sage-800">
          {articles.map(article => (
            <div key={article.id} className="p-4 hover:bg-sage-50/50 dark:hover:bg-sage-900/10 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{article.titleEn}</h4>
                    {article.isApproved ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Approved</span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
                    )}
                    {article.notifiable && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Notifiable</span>
                    )}
                  </div>
                  <p className="text-sm text-sage-500">Species: {article.species}</p>
                  <p className="text-xs text-sage-400 mt-1">Updated: {new Date(article.updatedAt || article.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditArticle(article)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <span className="material-icons-outlined">edit</span>
                  </button>
                  {!article.isApproved && (
                    <button
                      onClick={() => handleApproveArticle(article.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <span className="material-icons-outlined">check_circle</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <span className="material-icons-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Article Modal */}
      {(showAddModal || editingArticle) && (
        <ArticleModal
          isEditing={!!editingArticle}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={editingArticle ? handleUpdateArticle : handleAddArticle}
          onClose={() => {
            setShowAddModal(false);
            setEditingArticle(null);
            resetForm();
          }}
        />
      )}
    </div>
  );
};

// Article Modal Component
const ArticleModal = ({ isEditing, formData, onChange, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-sage-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-sage-900 pb-4">
          <h3 className="text-xl font-bold">
            {isEditing ? 'Edit Article' : 'Add New Article'}
          </h3>
          <button onClick={onClose}>
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title (English) *</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={onChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title (Setswana) *</label>
              <input
                type="text"
                name="titleTn"
                value={formData.titleTn}
                onChange={onChange}
                className="input-field"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Species *</label>
            <select
              name="species"
              value={formData.species}
              onChange={onChange}
              className="input-field"
            >
              <option value="all">All Species</option>
              <option value="cattle">Cattle</option>
              <option value="goat">Goats</option>
              <option value="sheep">Sheep</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Symptoms (comma-separated)</label>
            <input
              type="text"
              name="symptoms"
              value={formData.symptoms}
              onChange={onChange}
              className="input-field"
              placeholder="e.g., Fever, Lameness, Salivation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Treatment *</label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={onChange}
              rows="3"
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Prevention *</label>
            <textarea
              name="prevention"
              value={formData.prevention}
              onChange={onChange}
              rows="3"
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content (English) *</label>
            <textarea
              name="contentEn"
              value={formData.contentEn}
              onChange={onChange}
              rows="6"
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content (Setswana) *</label>
            <textarea
              name="contentTn"
              value={formData.contentTn}
              onChange={onChange}
              rows="6"
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onChange}
              className="input-field"
              placeholder="e.g., cattle, fever, vaccine"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notifiable"
              checked={formData.notifiable}
              onChange={onChange}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
            <label className="text-sm font-medium">This is a notifiable disease (must be reported to DVS)</label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {isEditing ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManagement;
