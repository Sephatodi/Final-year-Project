import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Input from '../common/Input';

const SearchBar = ({ onSearch, placeholder, initialValue = '' }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialValue);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Handle click outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      onSearch(searchQuery);
      setShowRecent(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleRecentClick = (search) => {
    setQuery(search);
    handleSearch(search);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowRecent(true)}
          placeholder={placeholder || t('knowledgeBase.searchPlaceholder') || 'Search articles...'}
          icon="search"
          fullWidth
        />
      </form>

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-800 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-sage-500">
                {t('knowledgeBase.recentSearches') || 'Recent Searches'}
              </span>
              <button
                onClick={clearRecent}
                className="text-xs text-primary hover:underline"
              >
                {t('common.clear') || 'Clear'}
              </button>
            </div>
            
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentClick(search)}
                className="w-full px-3 py-2 text-left hover:bg-sage-50 dark:hover:bg-sage-800 rounded-lg flex items-center gap-2"
              >
                <span className="material-icons-outlined text-sage-400 text-sm">history</span>
                <span className="text-sm">{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Tips */}
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-xs text-sage-400">
          {t('knowledgeBase.searchTips') || 'Try:'}
        </span>
        {['FMD', 'Heartwater', 'Vaccination', 'Cattle'].map((tip, index) => (
          <button
            key={index}
            onClick={() => {
              setQuery(tip);
              handleSearch(tip);
            }}
            className="text-xs px-2 py-1 bg-sage-100 dark:bg-sage-800 rounded-full hover:bg-primary/10 transition-colors"
          >
            {tip}
          </button>
        ))}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
};

export default SearchBar;