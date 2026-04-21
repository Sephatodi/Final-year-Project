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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="w-full px-4 py-3 pl-12 rounded-xl border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all w-40"
          >
            <option value="all">{language === 'en' ? 'All Species' : 'Ditsa tsotlhe'}</option>
            <option value="cattle">{language === 'en' ? 'Cattle' : 'Dikgomo'}</option>
            <option value="goat">{language === 'en' ? 'Goats' : 'Dipodi'}</option>
            <option value="sheep">{language === 'en' ? 'Sheep' : 'Dinku'}</option>
          </select>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700 rounded-xl cursor-pointer transition-all">
            <span className="material-icons-outlined">photo_camera</span>
            <span className="hidden sm:inline font-medium">{language === 'en' ? 'Scan Image' : 'Tshwantsha Setshwantsho'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <label className="flex items-center gap-2 px-4 py-2 bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700 rounded-xl cursor-pointer transition-all">
            <span className="material-icons-outlined">videocam</span>
            <span className="hidden sm:inline font-medium">{language === 'en' ? 'Scan Video' : 'Tshwantsha Video'}</span>
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
        <div className="bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">
              {language === 'en' ? 'Disease Scan Result' : 'Tlhahlobo ya Bolwetse'}
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
            <div className="w-48 h-48 bg-sage-100 dark:bg-sage-800 rounded-lg overflow-hidden shrink-0">
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
                      <div key={index} className="flex justify-between items-center p-3 bg-sage-50 dark:bg-sage-800/50 rounded-xl border border-sage-100 dark:border-sage-700">
                        <span className="font-bold text-sage-900 dark:text-white uppercase">{result.diseaseCode}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-sage-200 dark:bg-sage-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${result.confidence * 100}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-primary">{Math.round(result.confidence * 100)}%</span>
                        </div>
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
        <div className="bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-800 rounded-2xl p-6 shadow-sm">
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
                      <div key={index} className="flex justify-between items-center p-3 bg-sage-50 dark:bg-sage-800/50 rounded-xl border border-sage-100 dark:border-sage-700">
                        <span className="font-bold text-sage-900 dark:text-white uppercase">{result.diseaseCode}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-sage-200 dark:bg-sage-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${result.confidence * 100}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-primary">{Math.round(result.confidence * 100)}%</span>
                        </div>
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

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        {/* Articles List */}
        {(!isMobile || !selectedArticle) && (
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-bold text-lg mb-3">
              {language === 'en' ? 'Disease Library' : 'Mokgatho wa Malwetse'}
            </h3>
            
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {filteredArticles.length === 0 ? (
                <div className="bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-800 rounded-2xl p-8 text-center text-sage-500">
                  {language === 'en' ? 'No articles found' : 'Ga go na dikgang tse di fitlhegileng'}
                </div>
              ) : (
                filteredArticles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => handleArticleClick(article)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedArticle?.id === article.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900 hover:border-primary/50 hover:bg-sage-50 dark:hover:bg-sage-800/30'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-sage-100">
                        <img src={article.imageUrl || getSpeciesImage(article.species)} alt={article.species} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm truncate">
                            {language === 'en' ? article.titleEn : article.titleTn}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getSpeciesBadgeColor(article.species)}`}>
                            {article.species}
                          </span>
                          {article.notifiable && (
                            <span className="text-[10px] text-red-500 font-bold uppercase flex items-center gap-0.5">
                              <span className="material-icons-outlined text-[12px]">warning</span>
                              Notifiable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Article Detail */}
        {(selectedArticle || !isMobile) && (
          <div className="lg:col-span-2">
            {selectedArticle ? (
              <div className="bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-800 rounded-2xl p-6 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                {isMobile && (
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 text-primary font-bold mb-6 hover:translate-x-[-4px] transition-transform"
                  >
                    <span className="material-icons-outlined">arrow_back</span>
                    Back to Library
                  </button>
                )}
                
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8 shadow-inner">
                  <img src={selectedArticle.imageUrl || getSpeciesImage(selectedArticle.species)} alt={selectedArticle.species} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                      {language === 'en' ? selectedArticle.titleEn : selectedArticle.titleTn}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getSpeciesBadgeColor(selectedArticle.species)}`}>
                    Target: {selectedArticle.species === 'all' ? 'All Livestock' : selectedArticle.species}
                  </span>
                  {selectedArticle.notifiable && (
                    <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                      <span className="material-icons-outlined text-sm">warning</span>
                      Notifiable Disease
                    </span>
                  )}
                </div>

                <div className="space-y-8">
                  <section>
                    <h4 className="text-sm font-black text-sage-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                       {language === 'en' ? 'Clinical Symptoms' : 'Matshwao'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedArticle.symptoms?.map((symptom, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-900/30">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          <span className="text-sm font-medium text-red-900 dark:text-red-200">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-black text-sage-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
                       {language === 'en' ? 'Treatment Protocol' : 'Kalafo'}
                    </h4>
                    <div className="p-5 bg-sage-50 dark:bg-sage-800/50 rounded-2xl border border-sage-100 dark:border-sage-700 leading-relaxed font-medium">
                      {selectedArticle.treatment}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-black text-sage-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
                       {language === 'en' ? 'Prevention & Biosecurity' : 'Tshireletso'}
                    </h4>
                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 leading-relaxed font-medium">
                      {selectedArticle.prevention}
                    </div>
                  </section>
                  
                  {/* Action Bar */}
                  <div className="grid grid-cols-2 gap-4 pt-8 border-t border-sage-100 dark:border-sage-800">
                    <button 
                      onClick={() => window.location.href = '/symptom-checker'}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <span className="material-icons-outlined">search</span>
                      Run Check
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-4 bg-sage-100 dark:bg-sage-800 text-sage-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-sage-200 dark:hover:bg-sage-700 transition-all">
                      <span className="material-icons-outlined">share</span>
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-800 rounded-2xl p-16 text-center shadow-sm">
                <div className="w-24 h-24 bg-sage-50 dark:bg-sage-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons-outlined text-5xl text-sage-300">menu_book</span>
                </div>
                <h3 className="text-2xl font-black text-sage-900 dark:text-white mb-2 tracking-tight">
                  {language === 'en' ? 'Select an Article' : 'Tlhopa Bolwetse'}
                </h3>
                <p className="text-sage-500 max-w-sm mx-auto">
                  {language === 'en' 
                    ? 'Explore the disease library for expert advice on livestock health management.'
                    : 'Bala kaga malwetse a farologaneng a dikgomo, dinku le dipodi.'}
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