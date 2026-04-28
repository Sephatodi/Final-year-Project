import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const RatingModal = ({ isOpen, onClose, onSubmit, expertName }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [categories, setCategories] = useState({
    expertise: 0,
    communication: 0,
    helpfulness: 0
  });

  if (!isOpen) return null;

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleCategoryRating = (category, value) => {
    setCategories(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      overall: rating,
      ...categories,
      feedback,
      submittedAt: new Date().toISOString()
    });
    onClose();
  };

  const renderStars = (value, setValue, size = 'md') => {
    const starSize = size === 'lg' ? 'text-3xl' : 'text-2xl';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <span className={`material-icons-outlined ${starSize} ${
              star <= (hoverRating || value) 
                ? 'text-amber-500' 
                : 'text-sage-300'
            }`}>
              star
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{t('telehealth.rateConsultation') || 'Rate Your Consultation'}</h2>
              <p className="text-sage-500 mt-1">
                {t('telehealth.rateWith') || 'How was your experience with'} {expertName}?
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-lg transition-colors"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>

          {/* Overall Rating */}
          <div className="mb-8 text-center">
            <p className="font-medium mb-3">{t('telehealth.overallRating') || 'Overall Rating'}</p>
            <div className="flex justify-center">
              {renderStars(rating, handleRatingClick, 'lg')}
            </div>
            <p className="text-sm text-sage-500 mt-2">
              {rating === 0 ? t('telehealth.tapToRate') || 'Tap to rate' :
               rating === 1 ? t('telehealth.poor') || 'Poor' :
               rating === 2 ? t('telehealth.fair') || 'Fair' :
               rating === 3 ? t('telehealth.good') || 'Good' :
               rating === 4 ? t('telehealth.veryGood') || 'Very Good' :
               t('telehealth.excellent') || 'Excellent'}
            </p>
          </div>

          {/* Category Ratings */}
          <div className="space-y-6 mb-8">
            <div>
              <p className="font-medium mb-2">{t('telehealth.expertise') || 'Expertise & Knowledge'}</p>
              {renderStars(categories.expertise, (v) => handleCategoryRating('expertise', v))}
            </div>
            
            <div>
              <p className="font-medium mb-2">{t('telehealth.communication') || 'Communication & Clarity'}</p>
              {renderStars(categories.communication, (v) => handleCategoryRating('communication', v))}
            </div>
            
            <div>
              <p className="font-medium mb-2">{t('telehealth.helpfulness') || 'Helpfulness & Support'}</p>
              {renderStars(categories.helpfulness, (v) => handleCategoryRating('helpfulness', v))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-8">
            <label className="block font-medium mb-2">
              {t('telehealth.additionalFeedback') || 'Additional Feedback (Optional)'}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900/20 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder={t('telehealth.feedbackPlaceholder') || 'Share your experience...'}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={rating === 0}
              fullWidth
            >
              {t('common.submit') || 'Submit Rating'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

RatingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  expertName: PropTypes.string,
};

export default RatingModal;