import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

const LanguageToggle = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tn' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      icon="translate"
      className={className}
    >
      <span className="hidden sm:inline">
        {language === 'en' ? 'English' : 'Setswana'}
      </span>
      <span className="sm:hidden">
        {language === 'en' ? 'EN' : 'TN'}
      </span>
    </Button>
  );
};

LanguageToggle.propTypes = {
  className: PropTypes.string,
};

export default LanguageToggle;