import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ArticleCard = ({ article, onClick, variant = 'grid' }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

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

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'critical';
      default: return 'default';
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

  const title = language === 'en' ? article.titleEn : article.titleTn || article.titleEn;
  const summary = language === 'en' ? article.summaryEn : article.summaryTn || article.summaryEn;

  if (variant === 'list') {
    return (
      <Card
        className="p-6 hover:shadow-lg transition-all cursor-pointer group"
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-icons-outlined text-3xl text-primary">
                {getCategoryIcon(article.category)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {title}
              </h3>
              {article.notifiable && (
                <Badge variant="critical" size="sm" icon="warning">
                  {t('knowledgeBase.notifiable') || 'Notifiable'}
                </Badge>
              )}
            </div>

            <p className="text-sage-600 dark:text-sage-400 text-sm mb-3 line-clamp-2">
              {summary}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="material-icons-outlined text-sage-400 text-sm">schedule</span>
                <span>{article.readTime || '5 min read'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="material-icons-outlined text-sage-400 text-sm">visibility</span>
                <span>{article.viewCount || 0} views</span>
              </div>

              {article.difficulty && (
                <Badge variant={getDifficultyColor(article.difficulty)} size="sm">
                  {article.difficulty}
                </Badge>
              )}
            </div>

            {/* Species Tags */}
            {article.species && article.species.length > 0 && (
              <div className="flex gap-2 mt-3">
                {article.species.map(s => (
                  <div key={s} className="flex items-center gap-1 text-xs bg-sage-100 dark:bg-sage-800 px-2 py-1 rounded">
                    <span className="material-icons-outlined text-xs">{getSpeciesIcon(s)}</span>
                    <span className="capitalize">{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chevron */}
          <div className="flex-shrink-0 self-center">
            <span className="material-icons-outlined text-sage-400 group-hover:text-primary transition-colors">
              chevron_right
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      className="p-6 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col"
      onClick={onClick}
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-icons-outlined text-2xl text-primary">
            {getCategoryIcon(article.category)}
          </span>
        </div>
        
        {article.notifiable && (
          <Badge variant="critical" size="sm" icon="warning">
            {t('knowledgeBase.notifiable') || 'Notifiable'}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Summary */}
      <p className="text-sage-600 dark:text-sage-400 text-sm mb-4 flex-1 line-clamp-3">
        {summary}
      </p>

      {/* Meta Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs text-sage-500">
          <div className="flex items-center gap-1">
            <span className="material-icons-outlined text-sm">schedule</span>
            <span>{article.readTime || '5 min'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons-outlined text-sm">visibility</span>
            <span>{article.viewCount || 0}</span>
          </div>
          {article.difficulty && (
            <Badge variant={getDifficultyColor(article.difficulty)} size="sm">
              {article.difficulty}
            </Badge>
          )}
        </div>

        {/* Species Tags */}
        {article.species && article.species.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.species.map(s => (
              <div key={s} className="flex items-center gap-1 text-xs bg-sage-100 dark:bg-sage-800 px-2 py-1 rounded">
                <span className="material-icons-outlined text-xs">{getSpeciesIcon(s)}</span>
                <span className="capitalize">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Read More Link */}
      <div className="mt-4 pt-4 border-t border-sage-200 dark:border-sage-800">
        <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          {t('common.readMore') || 'Read More'}
          <span className="material-icons-outlined text-sm">arrow_forward</span>
        </span>
      </div>
    </Card>
  );
};

ArticleCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    titleEn: PropTypes.string,
    titleTn: PropTypes.string,
    summaryEn: PropTypes.string,
    summaryTn: PropTypes.string,
    category: PropTypes.string,
    species: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.string,
    readTime: PropTypes.string,
    viewCount: PropTypes.number,
    notifiable: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['grid', 'list']),
};

export default ArticleCard;