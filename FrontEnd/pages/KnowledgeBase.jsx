// pages/KnowledgeBase.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { knowledgeBaseQueries } from '../db/knowledgeBaseQueries';
import { useOffline } from '../context/OfflineContext';
import { useSync } from '../context/SyncContext';
import cattleImg from '../assets/cattle.png';
import goatImg from '../assets/goat.png';
import sheepImg from '../assets/sheep.png';

const getSpeciesImage = (species) => {
  if (species === 'cattle') return cattleImg;
  if (species === 'goat') return goatImg;
  if (species === 'sheep') return sheepImg;
  return cattleImg; // Default placeholder
};

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoAnalysis, setVideoAnalysis] = useState(null);
  const [analyzingVideo, setAnalyzingVideo] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [language, setLanguage] = useState('en'); // 'en' or 'tn'
  const [systemStatus, setSystemStatus] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const { isOffline } = useOffline();
  const { isSyncing } = useSync();
  const location = useLocation();

  // Load knowledge base on mount
  useEffect(() => {
    const init = async () => {
      await knowledgeBaseQueries.initializeKnowledgeBase();
      await loadKnowledgeBase();
    };
    init();

    // Check system status periodically
    const checkStatus = async () => {
      const status = await knowledgeBaseQueries.getSystemStatus();
      setSystemStatus(status);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 3000);

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto-select article if navigated from Symptom Checker
  useEffect(() => {
    if (articles.length > 0 && location.state?.diseaseCode) {
      const targetArticle = articles.find(a => a.diseaseCode === location.state.diseaseCode);
      if (targetArticle) {
        setSelectedArticle(targetArticle);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [articles, location.state]);

  // Filter articles when search or filter changes
  useEffect(() => {
    filterArticles();
  }, [searchText, speciesFilter, articles]);

  const loadKnowledgeBase = async () => {
    setLoading(true);
    try {
      const data = await knowledgeBaseQueries.getAllArticles();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];
    
    // Species filter
    if (speciesFilter !== 'all') {
      filtered = filtered.filter(article => 
        article.species === 'all' || article.species === speciesFilter
      );
    }
    
    // Text search
    if (searchText.trim()) {
      filtered = filtered.filter(article => {
        const title = language === 'en' ? article.titleEn : article.titleTn;
        const content = language === 'en' ? article.contentEn : article.contentTn;
        const searchLower = searchText.toLowerCase();
        
        return title.toLowerCase().includes(searchLower) ||
               content.toLowerCase().includes(searchLower) ||
               article.tags.some(tag => tag.toLowerCase().includes(searchLower));
      });
    }
    
    setFilteredArticles(filtered);
  };

  const handleArticleClick = async (article) => {
    setSelectedArticle(article);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageBase64 = reader.result;
      setUploadedImage(imageBase64);
      setAnalyzingImage(true);
      setVideoAnalysis(null);
      setVideoError(null);
      
      try {
        const results = await knowledgeBaseQueries.recognizeDiseaseFromImage(imageBase64);
        setImageAnalysis(results);
        
        if (results && results.length > 0) {
          const topMatch = results[0];
          const matchingArticle = await knowledgeBaseQueries.getArticleByDiseaseCode(topMatch.diseaseCode);
          if (matchingArticle) {
            setSelectedArticle(matchingArticle);
          }
        }
      } catch (error) {
        console.error('Image analysis failed:', error);
      } finally {
        setAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedVideo(URL.createObjectURL(file));
    setAnalyzingVideo(true);
    setVideoError(null);
    setImageAnalysis(null);

    try {
      const results = await knowledgeBaseQueries.recognizeDiseaseFromVideo(file);
      setVideoAnalysis(results);

      if (results && results.length > 0) {
        const topMatch = results[0];
        const matchingArticle = await knowledgeBaseQueries.getArticleByDiseaseCode(topMatch.diseaseCode);
        if (matchingArticle) {
          setSelectedArticle(matchingArticle);
        }
      }
    } catch (error) {
      console.error('Video analysis failed:', error);
      setVideoError(error.message || 'Video recognition failed.');
    } finally {
      setAnalyzingVideo(false);
    }
  };

  const getSpeciesBadgeColor = (species) => {
    if (species === 'cattle') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (species === 'goat') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (species === 'sheep') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Ingestion Progress Banner */}
      {systemStatus && systemStatus.status !== 'idle' && (
        <div className="bg-primary/10 border-2 border-primary/20 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-icons-outlined text-primary animate-spin">psychology</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-primary">AI Studying Farm Data...</span>
                <span className="text-xs font-mono text-primary/70">{systemStatus.current} / {systemStatus.total}</span>
              </div>
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${(systemStatus.current / systemStatus.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-primary/60 mt-1 uppercase tracking-wider font-bold">
                {systemStatus.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-sage-900 dark:text-slate-100">
          Disease Knowledge Base
        </h2>
        <p className="text-sage-500 mt-1">
          {language === 'en' 
            ? 'Search diseases, treatments, and prevention methods - available offline' 
            : 'Batla malwetse, kalafo le tshireletso - di a kgona le fa go se inthanete'}
        </p>
      </div>

      {/* Language Toggle */}
      <div className="flex justify-end">
        <div className="flex bg-sage-100 dark:bg-sage-800 rounded-lg p-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              language === 'en'
                ? 'bg-white dark:bg-sage-700 shadow-sm text-sage-900 dark:text-white'
                : 'text-sage-600 dark:text-sage-400 hover:text-sage-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('tn')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              language === 'tn'
                ? 'bg-white dark:bg-sage-700 shadow-sm text-sage-900 dark:text-white'
                : 'text-sage-600 dark:text-sage-400 hover:text-sage-900'
            }`}
          >
            Setswana
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-400">
            search
          </span>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={language === 'en' ? 'Search diseases, symptoms, or treatments...' : 'Batla malwetse, matshwao, kana kalafo...'}
            className="input-field pl-12"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">{language === 'en' ? 'All Species' : 'Ditsa tsotlhe'}</option>
            <option value="cattle">{language === 'en' ? 'Cattle' : 'Dikgomo'}</option>
            <option value="goat">{language === 'en' ? 'Goats' : 'Dipodi'}</option>
            <option value="sheep">{language === 'en' ? 'Sheep' : 'Dinku'}</option>
          </select>
          
          {/* Image Upload Button */}
          <label className="btn-secondary cursor-pointer">
            <span className="material-icons-outlined">photo_camera</span>
            <span className="hidden sm:inline">{language === 'en' ? 'Scan Image' : 'Tshwantsha Setshwantsho'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* Video Upload Button */}
          <label className="btn-secondary cursor-pointer">
            <span className="material-icons-outlined">videocam</span>
            <span className="hidden sm:inline">{language === 'en' ? 'Scan Video' : 'Tshwantsha Video'}</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Image Analysis Section */}
      {uploadedImage && (
        <div className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">
              {language === 'en' ? 'Disease Scan' : 'Tlhahlobo ya Bolwetse'}
            </h3>
            <button
              onClick={() => {
                setUploadedImage(null);
                setImageAnalysis(null);
              }}
              className="text-sage-400 hover:text-sage-600"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-48 h-48 bg-sage-100 dark:bg-sage-800 rounded-lg overflow-hidden">
              <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              {analyzingImage ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>{language === 'en' ? 'Analyzing image...' : 'E tlhahloba setshwantsho...'}</span>
                </div>
              ) : imageAnalysis && imageAnalysis.length > 0 ? (
                <div>
                  <h4 className="font-bold mb-2">
                    {language === 'en' ? 'Detected Possible Diseases:' : 'Malwetse a a lemotseng:'}
                  </h4>
                  <div className="space-y-2">
                    {imageAnalysis.map((result, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-sage-50 dark:bg-sage-800/50 rounded">
                        <span className="font-medium">{result.diseaseCode}</span>
                        <span className="text-sm text-primary">{Math.round(result.confidence * 100)}% match</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sage-500">
                  {language === 'en' 
                    ? 'No diseases clearly identified. Try uploading a clearer photo or use symptom search.'
                    : 'Ga go na bolwetse jo bo lemotseng. Leka go tshwantsha setshwantsho se se tlhakgametseng.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Analysis Section */}
      {uploadedVideo && (
        <div className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">
              {language === 'en' ? 'Video Disease Scan' : 'Tlhahlobo ya Bolwetse ka Video'}
            </h3>
            <button
              onClick={() => {
                setUploadedVideo(null);
                setVideoAnalysis(null);
                setVideoError(null);
              }}
              className="text-sage-400 hover:text-sage-600"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 bg-sage-100 dark:bg-sage-800 rounded-lg overflow-hidden">
              <video src={uploadedVideo} controls className="w-full h-full rounded-lg" />
            </div>

            <div className="flex-1">
              {analyzingVideo ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>{language === 'en' ? 'Analyzing video...' : 'E tlhahloba video...'}</span>
                </div>
              ) : videoError ? (
                <div className="text-red-600 dark:text-red-300">
                  {language === 'en' ? 'Video recognition failed:' : 'Tlhahlobo ya video e paletswe:'} {videoError}
                </div>
              ) : videoAnalysis && videoAnalysis.length > 0 ? (
                <div>
                  <h4 className="font-bold mb-2">
                    {language === 'en' ? 'Detected Possible Diseases:' : 'Malwetse a a lemotseng:'}
                  </h4>
                  <div className="space-y-2">
                    {videoAnalysis.map((result, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-sage-50 dark:bg-sage-800/50 rounded">
                        <span className="font-medium">{result.diseaseCode}</span>
                        <span className="text-sm text-primary">{Math.round(result.confidence * 100)}% match</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sage-500">
                  {language === 'en' 
                    ? 'No disease suggestions found in this video yet. Try a clearer clip or a different animal view.'
                    : 'Ga go na ditshupetso tse di fitlhelweng mo videong. Leka video e e tlhamaletseng.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offline/Sync Status */}
      {(isOffline || isSyncing) && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isOffline 
            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
        }`}>
          <span className="material-icons-outlined text-sm">
            {isOffline ? 'cloud_off' : 'sync'}
          </span>
          <span className="text-sm">
            {isOffline 
              ? (language === 'en' ? 'Working offline - content is cached' : 'O dira o sa kgolagane - dikang di bolokilwe')
              : (isSyncing 
                ? (language === 'en' ? 'Syncing latest content...' : 'E kgolaganya dikang...')
                : '')}
          </span>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Articles List - Hidden on mobile if article selected */}
        {(!isMobile || !selectedArticle) && (
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-bold text-lg mb-3">
              {language === 'en' ? 'Disease Library' : 'Mokgatho wa Malwetse'}
            </h3>
            
            {filteredArticles.length === 0 ? (
              <div className="card p-8 text-center text-sage-500">
                {language === 'en' ? 'No articles found' : 'Ga go na dikgang tse di fitlhegileng'}
              </div>
            ) : (
              filteredArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedArticle?.id === article.id
                      ? 'border-primary bg-primary/5'
                      : 'border-sage-200 dark:border-sage-800 hover:border-primary/50 hover:bg-sage-50 dark:hover:bg-sage-800/30'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-sage-100">
                      <img src={article.imageUrl || getSpeciesImage(article.species)} alt={article.species} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm">
                          {language === 'en' ? article.titleEn : article.titleTn}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSpeciesBadgeColor(article.species)} shrink-0 ml-2`}>
                          {article.species === 'all' 
                            ? (language === 'en' ? 'All' : 'Tsotlhe')
                            : article.species}
                        </span>
                      </div>
                      {article.notifiable && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="material-icons-outlined text-red-500 text-[14px]">warning</span>
                          <span className="text-[10px] text-red-500 font-medium">
                            {language === 'en' ? 'Notifiable' : 'Bolwetse jo bo itsiswang'}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.symptoms?.slice(0, 2).map((symptom, idx) => (
                          <span key={idx} className="text-[10px] text-sage-500 bg-sage-100 dark:bg-sage-800 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Article Detail */}
        {(selectedArticle || !isMobile) && (
          <div className="lg:col-span-2">
            {selectedArticle ? (
              <div className="card p-6">
                {/* Mobile Back Button */}
                {isMobile && (
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 text-primary font-bold mb-4"
                  >
                    <span className="material-icons-outlined">arrow_back</span>
                    Back to Library
                  </button>
                )}
                {/* Article Header */}
              <div className="border-b border-sage-200 dark:border-sage-800 pb-4 mb-4">
                <div className="w-full h-56 rounded-xl overflow-hidden mb-6">
                  <img src={selectedArticle.imageUrl || getSpeciesImage(selectedArticle.species)} alt={selectedArticle.species} className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold">
                    {language === 'en' ? selectedArticle.titleEn : selectedArticle.titleTn}
                  </h3>
                  {selectedArticle.notifiable && (
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold">
                      {language === 'en' ? 'REPORT IMMEDIATELY' : 'ITSISE KABONAKO'}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSpeciesBadgeColor(selectedArticle.species)}`}>
                    {selectedArticle.species === 'all' 
                      ? (language === 'en' ? 'All Species' : 'Ditsa Tsotlhe')
                      : selectedArticle.species}
                  </span>
                  {selectedArticle.tags?.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="text-xs text-sage-500 bg-sage-100 dark:bg-sage-800 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Article Content */}
              <div className="space-y-6">
                {/* Symptoms Section */}
                {selectedArticle.symptoms && selectedArticle.symptoms.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <span className="material-icons-outlined text-primary">sick</span>
                      {language === 'en' ? 'Symptoms' : 'Matshwao'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.symptoms.map((symptom, idx) => (
                        <span key={idx} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment Section */}
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-primary">medical_services</span>
                    {language === 'en' ? 'Treatment' : 'Kalafo'}
                  </h4>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">
                      {language === 'en' ? selectedArticle.treatment : selectedArticle.treatment}
                    </p>
                  </div>
                </div>

                {/* Prevention Section */}
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-primary">shield</span>
                    {language === 'en' ? 'Prevention' : 'Tshireletso'}
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">
                      {language === 'en' ? selectedArticle.prevention : selectedArticle.prevention}
                    </p>
                  </div>
                </div>

                {/* Full Content */}
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-primary">menu_book</span>
                    {language === 'en' ? 'Detailed Information' : 'Tshedimosetso e e Tlhalosang'}
                  </h4>
                  <div className="bg-sage-50 dark:bg-sage-800/30 rounded-lg p-4 whitespace-pre-wrap">
                    {language === 'en' ? selectedArticle.contentEn : selectedArticle.contentTn}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-sage-200 dark:border-sage-800">
                  <button 
                    onClick={() => {
                      // Navigate to symptom checker with this disease
                      window.location.href = '/symptom-checker';
                    }}
                    className="btn-primary flex-1"
                  >
                    <span className="material-icons-outlined">search</span>
                    {language === 'en' ? 'Check Symptoms' : 'Tlhahloba Matshwao'}
                  </button>
                  <button className="btn-secondary flex-1">
                    <span className="material-icons-outlined">share</span>
                    {language === 'en' ? 'Share' : 'Abelana'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <span className="material-icons-outlined text-6xl text-sage-300 mb-4">menu_book</span>
              <h3 className="text-xl font-bold mb-2">
                {language === 'en' ? 'Select a Disease' : 'Tlhopa Bolwetse'}
              </h3>
              <p className="text-sage-500">
                {language === 'en' 
                  ? 'Choose a disease from the list to view detailed information about symptoms, treatment, and prevention.'
                  : 'Tlhopa bolwetse go bona tshedimosetso ka matshwao, kalafo le tshireletso.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
};

export default KnowledgeBase;
