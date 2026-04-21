// pages/admin/KnowledgeBaseAdmin.js
import React, { useState, useEffect } from 'react';
import { knowledgeBaseQueries } from '../../db/knowledgeBaseQueries';

const KnowledgeBaseAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [language, setLanguage] = useState('en');

  const [formData, setFormData] = useState({
    id: '',
    diseaseCode: '',
    titleEn: '',
    titleTn: '',
    contentEn: '',
    contentTn: '',
    species: 'all',
    symptoms: [],
    treatment: '',
    prevention: '',
    notifiable: false,
    tags: []
  });

  const [symptomInput, setSymptomInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await knowledgeBaseQueries.getAllArticles();
      setArticles(data);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesText = article.titleEn.toLowerCase().includes(searchText.toLowerCase()) ||
                       article.diseaseCode.toLowerCase().includes(searchText.toLowerCase());
    const matchesSpecies = filterSpecies === 'all' || article.species === filterSpecies;
    return matchesText && matchesSpecies;
  });

  const handleNewArticle = () => {
    setFormData({
      id: '',
      diseaseCode: '',
      titleEn: '',
      titleTn: '',
      contentEn: '',
      contentTn: '',
      species: 'all',
      symptoms: [],
      treatment: '',
      prevention: '',
      notifiable: false,
      tags: []
    });
    setIsCreating(true);
    setEditingArticle(null);
  };

  const handleEditArticle = (article) => {
    setFormData(article);
    setEditingArticle(article.id);
    setIsCreating(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim() && !formData.symptoms.includes(symptomInput.trim())) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptomInput.trim()]
      }));
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (index) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!formData.diseaseCode || !formData.titleEn) {
      alert('Disease Code and English Title are required');
      return;
    }

    if (!formData.id) {
      formData.id = `${formData.diseaseCode}-${Date.now()}`;
    }

    try {
      await knowledgeBaseQueries.saveArticle(formData);
      await loadArticles();
      setEditingArticle(null);
      setIsCreating(false);
      alert('Article saved successfully');
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await knowledgeBaseQueries.deleteArticle(id);
        await loadArticles();
        alert('Article deleted successfully');
      } catch (error) {
        console.error('Failed to delete article:', error);
        alert('Failed to delete article');
      }
    }
  };

  const handleCancel = () => {
    setEditingArticle(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-sage-900 dark:text-slate-100">
            Knowledge Base Admin
          </h2>
          <p className="text-sage-500 mt-1">Manage disease articles and information</p>
        </div>
        <button
          onClick={handleNewArticle}
          className="btn-primary"
        >
          <span className="material-icons-outlined">add</span>
          New Article
        </button>
      </div>

      {/* Edit/Create Form */}
      {(isCreating || editingArticle) && (
        <div className="card p-8 space-y-6">
          <h3 className="text-2xl font-bold">
            {isCreating ? 'Create New Article' : 'Edit Article'}
          </h3>

          {/* Language Toggle */}
          <div className="flex justify-end">
            <div className="flex bg-sage-100 dark:bg-sage-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  language === 'en'
                    ? 'bg-white dark:bg-sage-700 shadow-sm'
                    : 'text-sage-600 dark:text-sage-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('tn')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  language === 'tn'
                    ? 'bg-white dark:bg-sage-700 shadow-sm'
                    : 'text-sage-600 dark:text-sage-400'
                }`}
              >
                Setswana
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Disease Code (Required)</label>
              <input
                type="text"
                name="diseaseCode"
                value={formData.diseaseCode}
                onChange={handleInputChange}
                placeholder="e.g., FMD"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Species</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="all">All Species</option>
                <option value="cattle">Cattle</option>
                <option value="goat">Goats</option>
                <option value="sheep">Sheep</option>
              </select>
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">English Title (Required)</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
                placeholder="Disease name in English"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Setswana Title</label>
              <input
                type="text"
                name="titleTn"
                value={formData.titleTn}
                onChange={handleInputChange}
                placeholder="Disease name in Setswana"
                className="input-field w-full"
              />
            </div>
          </div>

          {/* Content */}
          {language === 'en' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">English Content</label>
                <textarea
                  name="contentEn"
                  value={formData.contentEn}
                  onChange={handleInputChange}
                  rows={8}
                  placeholder="Detailed English content..."
                  className="input-field w-full"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Treatment (English)</label>
                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Treatment recommendations..."
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prevention (English)</label>
                  <textarea
                    name="prevention"
                    value={formData.prevention}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Prevention measures..."
                    className="input-field w-full"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Setswana Content</label>
              <textarea
                name="contentTn"
                value={formData.contentTn}
                onChange={handleInputChange}
                rows={8}
                placeholder="Detailed Setswana content..."
                className="input-field w-full"
              />
            </div>
          )}

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium mb-2">Symptoms</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
                placeholder="Type symptom and press Enter"
                className="input-field flex-1"
              />
              <button onClick={handleAddSymptom} className="btn-secondary">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.symptoms.map((symptom, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {symptom}
                  <button onClick={() => handleRemoveSymptom(idx)} className="hover:text-blue-900">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Type tag and press Enter"
                className="input-field flex-1"
              />
              <button onClick={handleAddTag} className="btn-secondary">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  #{tag}
                  <button onClick={() => handleRemoveTag(idx)} className="hover:text-purple-900">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notifiable */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notifiable"
              name="notifiable"
              checked={formData.notifiable}
              onChange={handleInputChange}
              className="cursor-pointer"
            />
            <label htmlFor="notifiable" className="cursor-pointer">
              This is a notifiable disease (must be reported to DVS)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-sage-200 dark:border-sage-800">
            <button onClick={handleCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex-1">
              {isCreating ? 'Create Article' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Articles List */}
      {!isCreating && !editingArticle && (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-400">
                search
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search articles..."
                className="input-field pl-12 w-full"
              />
            </div>
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Species</option>
              <option value="cattle">Cattle</option>
              <option value="goat">Goats</option>
              <option value="sheep">Sheep</option>
            </select>
          </div>

          {/* Articles Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-sage-200 dark:border-sage-800">
                <tr>
                  <th className="text-left p-4 font-bold">Disease Code</th>
                  <th className="text-left p-4 font-bold">English Title</th>
                  <th className="text-left p-4 font-bold">Species</th>
                  <th className="text-left p-4 font-bold">Notifiable</th>
                  <th className="text-right p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map(article => (
                  <tr key={article.id} className="border-b border-sage-100 dark:border-sage-800 hover:bg-sage-50 dark:hover:bg-sage-800/50">
                    <td className="p-4 font-medium">{article.diseaseCode}</td>
                    <td className="p-4">{article.titleEn}</td>
                    <td className="p-4">
                      <span className="text-sm bg-sage-100 dark:bg-sage-800 px-2 py-1 rounded">
                        {article.species}
                      </span>
                    </td>
                    <td className="p-4">
                      {article.notifiable ? (
                        <span className="text-red-600 font-bold">Yes</span>
                      ) : (
                        <span className="text-sage-500">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredArticles.length === 0 && (
              <div className="p-8 text-center text-sage-500">
                No articles found
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card p-4 bg-sage-50 dark:bg-sage-800/30">
            <p className="text-sm text-sage-600 dark:text-sage-400">
              Showing {filteredArticles.length} of {articles.length} articles
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default KnowledgeBaseAdmin;
