import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Card from '../common/Card';

const LanguageSettings = ({ onUpdate }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [success, setSuccess] = useState(false);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      description: 'International language support'
    },
    {
      code: 'tn',
      name: 'Setswana',
      nativeName: 'Setswana',
      flag: '🇧🇼',
      description: 'Local language support'
    }
  ];

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
  };

  const handleSave = () => {
    i18n.changeLanguage(selectedLanguage);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    if (onUpdate) {
      onUpdate(selectedLanguage);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('settings.language') || 'Language Settings'}</h2>

        {success && (
          <Alert
            type="success"
            message={t('settings.languageUpdated') || 'Language preference updated!'}
            className="mb-6"
            dismissible
            autoDismiss
          />
        )}

        <div className="space-y-6">
          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedLanguage === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'border-sage-200 dark:border-sage-800 hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{lang.name}</h3>
                      {selectedLanguage === lang.code && (
                        <span className="material-icons-outlined text-primary">check_circle</span>
                      )}
                    </div>
                    <p className="text-sm text-sage-500">{lang.nativeName}</p>
                    <p className="text-xs text-sage-400 mt-2">{lang.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Language Preferences */}
          <div className="mt-8 pt-8 border-t border-sage-200 dark:border-sage-800">
            <h3 className="font-bold text-lg mb-4">{t('settings.languagePreferences') || 'Language Preferences'}</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">{t('settings.translateContent') || 'Auto-translate content'}</p>
                  <p className="text-xs text-sage-500">
                    {t('settings.translateHelp') || 'Automatically translate articles and notifications'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
                  defaultChecked
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">{t('settings.showOriginal') || 'Show original text'}</p>
                  <p className="text-xs text-sage-500">
                    {t('settings.originalHelp') || 'Display original alongside translation'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>

          {/* Date/Time Format */}
          <div className="mt-8 pt-8 border-t border-sage-200 dark:border-sage-800">
            <h3 className="font-bold text-lg mb-4">{t('settings.dateTimeFormat') || 'Date & Time Format'}</h3>
            
            <div className="space-y-4">
              <select className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900">
                <option value="local">{t('settings.localFormat') || 'Local format (DD/MM/YYYY)'}</option>
                <option value="iso">{t('settings.isoFormat') || 'ISO format (YYYY-MM-DD)'}</option>
                <option value="us">{t('settings.usFormat') || 'US format (MM/DD/YYYY)'}</option>
              </select>

              <select className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900">
                <option value="12h">{t('settings.12hour') || '12-hour format'}</option>
                <option value="24h">{t('settings.24hour') || '24-hour format'}</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              onClick={handleSave}
              icon="save"
            >
              {t('common.saveChanges') || 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

LanguageSettings.propTypes = {
  onUpdate: PropTypes.func,
};

export default LanguageSettings;