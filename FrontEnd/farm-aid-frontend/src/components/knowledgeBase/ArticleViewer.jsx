import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import RelatedArticles from './RelatedArticles';
import LanguageToggle from './LanguageToggle';

const ArticleViewer = ({ article, onRelatedClick, loading = false }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isOffline } = useOffline();
  
  const [content, setContent] = useState({});
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    if (article) {
      setContent({
        title: language === 'en' ? article.titleEn : article.titleTn || article.titleEn,
        content: language === 'en' ? article.contentEn : article.contentTn || article.contentEn,
        symptoms: article.symptoms || [],
        treatment: article.treatment || '',
        prevention: article.prevention || '',
      });
    }
  }, [article, language]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'disease': return 'coronavirus';
      case 'prevention': return 'shield';
      case 'treatment': return 'medical_services';
      case 'nutrition': return 'restaurant';
      case 'breeding': return 'pets';
      default: return 'article';
    }
  };

  const getSpeciesIcon = (species) => {
    switch(species) {
      case 'cattle': return 'pets';
      case 'goat': return 'cruelty_free';
      case 'sheep': return 'agriculture';
      default: return 'pets';
    }
  };

  const handleDownload = () => {
    const content = `
      ${content.title}
      
      ${content.content}
      
      Symptoms:
      ${content.symptoms.join('\n')}
      
      Treatment:
      ${content.treatment}
      
      Prevention:
      ${content.prevention}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.titleEn.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-sage-200 dark:bg-sage-800 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-sage-200 dark:bg-sage-800 rounded w-1/2 mx-auto"></div>
          <div className="space-y-3">
            <div className="h-32 bg-sage-200 dark:bg-sage-800 rounded"></div>
            <div className="h-32 bg-sage-200 dark:bg-sage-800 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!article) {
    return (
      <Card className="p-12 text-center">
        <span className="material-icons-outlined text-5xl text-sage-300 mb-4">error</span>
        <h3 className="text-lg font-bold mb-2">{t('knowledgeBase.notFound') || 'Article Not Found'}</h3>
        <p className="text-sage-500 mb-6">
          {t('knowledgeBase.notFoundMessage') || 'The article you\'re looking for doesn\'t exist.'}
        </p>
        <Button onClick={() => navigate('/knowledge-base')}>
          {t('knowledgeBase.backToLibrary') || 'Back to Library'}
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/knowledge-base')}
          icon="arrow_back"
        >
          {t('common.back') || 'Back'}
        </Button>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            icon="download"
          >
            {t('common.download') || 'Download'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            icon="print"
          >
            {t('common.print') || 'Print'}
          </Button>
        </div>
      </div>

      {/* Main Article */}
      <Card className="overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-6 border-b border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <span className="material-icons-outlined text-4xl text-primary">
                {getCategoryIcon(article.category)}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="primary" size="sm">
                  {article.category}
                </Badge>
                
                {article.notifiable && (
                  <Badge variant="critical" size="sm" icon="warning">
                    {t('knowledgeBase.notifiable') || 'Notifiable'}
                  </Badge>
                )}
                
                {article.difficulty && (
                  <Badge variant={
                    article.difficulty === 'beginner' ? 'success' :
                    article.difficulty === 'intermediate' ? 'warning' : 'critical'
                  } size="sm">
                    {article.difficulty}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{content.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-sage-500">
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">schedule</span>
                  <span>{article.readTime || '5 min read'}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">visibility</span>
                  <span>{article.viewCount || 0} views</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">update</span>
                  <span>{t('knowledgeBase.lastUpdated') || 'Last updated'}: {new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Species Tags */}
              {article.species && article.species.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.species.map(s => (
                    <div key={s} className="flex items-center gap-1 bg-white dark:bg-sage-800 px-3 py-1.5 rounded-full">
                      <span className="material-icons-outlined text-sm text-primary">{getSpeciesIcon(s)}</span>
                      <span className="text-sm font-medium capitalize">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-8 prose dark:prose-invert max-w-none">
          {/* Main Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('knowledgeBase.overview') || 'Overview'}</h2>
            <div className="text-sage-700 dark:text-sage-300 leading-relaxed whitespace-pre-wrap">
              {content.content}
            </div>
          </div>

          {/* Symptoms */}
          {content.symptoms.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t('knowledgeBase.symptoms') || 'Symptoms'}</h2>
              <ul className="space-y-2">
                {content.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="material-icons-outlined text-primary text-sm">check_circle</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Treatment */}
          {content.treatment && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t('knowledgeBase.treatment') || 'Treatment'}</h2>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sage-700 dark:text-sage-300 leading-relaxed">{content.treatment}</p>
              </div>
            </div>
          )}

          {/* Prevention */}
          {content.prevention && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t('knowledgeBase.prevention') || 'Prevention'}</h2>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sage-700 dark:text-sage-300 leading-relaxed">{content.prevention}</p>
              </div>
            </div>
          )}

          {/* Images */}
          {article.images && article.images.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{t('knowledgeBase.images') || 'Images'}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {article.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden cursor-zoom-in"
                    onClick={() => window.open(image, '_blank')}
                  >
                    <img
                      src={image}
                      alt={`${content.title} - ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources/References */}
          {article.sources && article.sources.length > 0 && (
            <div className="mt-8 pt-8 border-t border-sage-200 dark:border-sage-800">
              <h3 className="font-bold mb-2">{t('knowledgeBase.sources') || 'Sources'}</h3>
              <ul className="space-y-1">
                {article.sources.map((source, index) => (
                  <li key={index} className="text-sm text-sage-500">
                    • {source}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              {t('knowledgeBase.disclaimer') || 'Disclaimer: This information is for educational purposes only. Always consult with a qualified veterinarian for proper diagnosis and treatment.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Related Articles */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <RelatedArticles
          articles={article.relatedArticles}
          onArticleClick={onRelatedClick}
        />
      )}
    </div>
  );
};

ArticleViewer.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    titleEn: PropTypes.string,
    titleTn: PropTypes.string,
    contentEn: PropTypes.string,
    contentTn: PropTypes.string,
    category: PropTypes.string,
    species: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.string,
    readTime: PropTypes.string,
    viewCount: PropTypes.number,
    notifiable: PropTypes.bool,
    symptoms: PropTypes.arrayOf(PropTypes.string),
    treatment: PropTypes.string,
    prevention: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    sources: PropTypes.arrayOf(PropTypes.string),
    relatedArticles: PropTypes.array,
    updatedAt: PropTypes.string,
  }),
  onRelatedClick: PropTypes.func,
  loading: PropTypes.bool,
};

export default ArticleViewer;