import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import ArticleCard from './ArticleCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

const ArticleList = ({ 
  articles = [], 
  loading = false, 
  onSearch,
  onFilter,
  onRefresh,
  totalCount = 0 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOffline } = useOffline();
  
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  useEffect(() => {
    filterArticles();
  }, [articles, selectedCategory]);

  const filterArticles = () => {
    let filtered = [...articles];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category === selectedCategory || 
        article.species?.includes(selectedCategory)
      );
    }
    
    setFilteredArticles(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (onFilter) {
      onFilter(category);
    }
  };

  const handleSearch = (query) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleReadMore = (articleId) => {
    navigate(`/knowledge-base/${articleId}`);
  };

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-sage-900 dark:text-white">
            {t('knowledgeBase.title') || 'Knowledge Base'}
          </h2>
          <p className="text-sage-500 dark:text-sage-400 mt-1">
            {t('knowledgeBase.subtitle') || 'Learn about livestock diseases, prevention, and treatment'}
          </p>
        </div>

        {isOffline && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full">
            <span className="material-icons-outlined text-amber-600 dark:text-amber-400 text-sm">cloud_off</span>
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
              {t('common.offlineMode') || 'Offline Mode'}
            </span>
          </div>
        )}
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex gap-2">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          <div className="flex border border-sage-200 dark:border-sage-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-sage-900 text-sage-600 hover:bg-sage-50'
              }`}
            >
              <span className="material-icons-outlined">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-sage-900 text-sage-600 hover:bg-sage-50'
              }`}
            >
              <span className="material-icons-outlined">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-sage-500">
          {t('knowledgeBase.showing') || 'Showing'} {currentArticles.length} {t('knowledgeBase.of') || 'of'} {filteredArticles.length} {t('knowledgeBase.articles') || 'articles'}
        </p>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-icons-outlined text-sm">refresh</span>
            {t('common.refresh') || 'Refresh'}
          </button>
        )}
      </div>

      {/* Articles Grid/List */}
      {filteredArticles.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => handleReadMore(article.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {currentArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="list"
                  onClick={() => handleReadMore(article.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-sage-200 dark:border-sage-800 disabled:opacity-50"
              >
                <span className="material-icons-outlined">chevron_left</span>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-primary text-white'
                      : 'border border-sage-200 dark:border-sage-800 hover:bg-sage-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-sage-200 dark:border-sage-800 disabled:opacity-50"
              >
                <span className="material-icons-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <Card className="p-12 text-center">
          <span className="material-icons-outlined text-5xl text-sage-300 mb-4">menu_book</span>
          <h3 className="text-lg font-bold mb-2">
            {t('knowledgeBase.noArticles') || 'No Articles Found'}
          </h3>
          <p className="text-sage-500 mb-6">
            {t('knowledgeBase.noArticlesMessage') || 'Try adjusting your search or filter to find what you\'re looking for.'}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory('all');
              onSearch?.('');
            }}
          >
            {t('common.clearFilters') || 'Clear Filters'}
          </Button>
        </Card>
      )}
    </div>
  );
};

ArticleList.propTypes = {
  articles: PropTypes.array,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  onFilter: PropTypes.func,
  onRefresh: PropTypes.func,
  totalCount: PropTypes.number,
};

export default ArticleList;