import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';

const RelatedArticles = ({ articles, onArticleClick }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleClick = (articleId) => {
    if (onArticleClick) {
      onArticleClick(articleId);
    } else {
      navigate(`/knowledge-base/${articleId}`);
    }
  };

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">
        {t('knowledgeBase.relatedArticles') || 'Related Articles'}
      </h3>

      <div className="space-y-4">
        {articles.slice(0, 4).map(article => (
          <button
            key={article.id}
            onClick={() => handleClick(article.id)}
            className="w-full text-left group"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-colors">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-icons-outlined text-primary">
                  {article.category === 'disease' ? 'coronavirus' :
                   article.category === 'prevention' ? 'shield' :
                   article.category === 'treatment' ? 'medical_services' :
                   'article'}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {language === 'en' ? article.titleEn : article.titleTn || article.titleEn}
                </h4>
                <p className="text-xs text-sage-500 mt-1 line-clamp-1">
                  {article.readTime || '5 min read'} • {article.viewCount || 0} views
                </p>
              </div>

              {/* Chevron */}
              <span className="material-icons-outlined text-sage-400 group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </div>
          </button>
        ))}
      </div>

      {articles.length > 4 && (
        <div className="mt-4 pt-4 border-t border-sage-200 dark:border-sage-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* View all related */}}
            icon="arrow_forward"
            iconPosition="right"
            fullWidth
          >
            {t('common.viewAll') || 'View All'}
          </Button>
        </div>
      )}
    </Card>
  );
};

RelatedArticles.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      titleEn: PropTypes.string,
      titleTn: PropTypes.string,
      category: PropTypes.string,
      readTime: PropTypes.string,
      viewCount: PropTypes.number,
    })
  ),
  onArticleClick: PropTypes.func,
};

export default RelatedArticles;