import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { knowledgeBaseQueries } from '../db/knowledgeBaseQueries';
import { useOffline } from '../context/OfflineContext';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const { isOffline } = useOffline();
  
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [textQuery, setTextQuery] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showFMDWarning, setShowFMDWarning] = useState(false);

  const availableSymptoms = [
    'fever', 'lameness', 'salivation', 'blisters', 'nodules', 
    'coughing', 'diarrhea', 'weight loss', 'lethargy', 'anorexia'
  ];

  const handleSymptomToggle = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      // High-Performance Multi-Modal Search
      const searchInputs = {
        text: textQuery,
        symptoms: symptoms,
        image: photo,
        species: species
      };

      const unifiedResults = await knowledgeBaseQueries.unifiedSearch(searchInputs);
      
      const possibleDiseases = unifiedResults.map(res => ({
        name: res.titleEn,
        diseaseCode: res.diseaseCode,
        confidence: res.confidence,
        symptoms: res.symptoms || [],
        matchSources: res.matchSources,
        priority: res.notifiable ? 'critical' : 'high'
      }));

      // Check for FMD (Critical Priority)
      const fmdMatch = possibleDiseases.find(d => d.diseaseCode === 'FMD');
      if (fmdMatch && fmdMatch.confidence > 0.8) setShowFMDWarning(true);

      setResults({
        possibleDiseases,
        recommendations: [
          'Isolate affected animals immediately',
          'Ensure access to clean water and soft feed',
          'Contact veterinary services for confirmation',
          possibleDiseases[0]?.priority === 'critical' ? 'URGENT: This condition is notifiable' : 'Monitor temperature daily'
        ]
      });

      console.log(`[UI] Analysis completed in ${Math.round(performance.now() - startTime)}ms`);
      setStep(4);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInKnowledgeBase = (diseaseCode) => {
    navigate('/knowledge-base', { state: { diseaseCode } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      {/* Premium Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
          AI Diagnostic Intelligence
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Combining visual analysis with semantic symptom matching</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center px-4 max-w-md mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 border-2 ${
              step >= s ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-transparent border-slate-200 text-slate-500'
            }`}>
              {step > s ? <span className="material-icons-outlined">check</span> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 min-h-[500px] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Connection status badge */}
        <div className="absolute top-6 right-8">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isOffline ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`}></span>
            {isOffline ? 'Offline Analysis' : 'Cloud Connected'}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Select Species</h3>
              <p className="text-slate-500 font-medium">Choose the animal type for target diagnosis</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {['cattle', 'goat', 'sheep'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSpecies(s); setStep(2); }}
                  className={`group relative aspect-square rounded-[32px] border-2 transition-all duration-300 p-6 flex flex-col items-center justify-center gap-4 ${
                    species === s ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary/30 hover:bg-white'
                  }`}
                >
                  <span className={`material-icons-outlined text-5xl transition-colors ${species === s ? 'text-primary' : 'text-slate-300 group-hover:text-primary'}`}>
                    {s === 'cattle' ? 'pets' : s === 'goat' ? 'agriculture' : 'cloud'}
                  </span>
                  <span className="font-black capitalize text-lg tracking-tight uppercase">{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Identify Symptoms</h3>
              <p className="text-slate-500 font-medium">Select primary clinical signs observed</p>
            </div>

            {/* Manual Word Search Input */}
            <div className="relative group">
              <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                placeholder="Describe condition (e.g. skin lumps, excessive drooling...)"
                className="w-full px-6 py-4 pl-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSymptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSymptomToggle(s)}
                  className={`px-4 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    symptoms.includes(s) ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:border-primary/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="pt-8 flex justify-between gap-4">
              <button 
                onClick={() => setStep(1)} 
                className="flex-[0.5] px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                disabled={symptoms.length === 0 && !textQuery} 
                className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Continue to Scan
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Visual Analysis</h3>
              <p className="text-slate-500 font-medium">Upload photo for AI visual pattern recognition</p>
            </div>
            
            <div className="flex justify-center">
              {photo ? (
                <div className="relative group w-full max-w-sm aspect-square rounded-[40px] overflow-hidden shadow-2xl ring-8 ring-primary/5">
                  <img src={photo} alt="Upload" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button onClick={() => setPhoto(null)} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs border-none shadow-xl">Replace Photo</button>
                  </div>
                </div>
              ) : (
                <label className="w-full max-w-sm aspect-square rounded-[40px] border-4 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white dark:hover:bg-slate-800 hover:border-primary/30 transition-all group">
                  <div className="w-20 h-20 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-icons-outlined text-4xl">add_a_photo</span>
                  </div>
                  <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest text-center px-12 leading-relaxed">Capture or upload clinical signs image</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                onClick={() => setStep(2)} 
                className="flex-[0.5] px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleAnalyze} 
                disabled={loading} 
                className={`flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${loading ? 'animate-pulse' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="material-icons-outlined animate-spin text-sm">psychology</span>
                    Engine Processing...
                  </>
                ) : (
                  <>
                    <span className="material-icons-outlined text-sm">auto_fix_high</span>
                    Generate AI Diagnosis
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 4 && results && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Clinical Diagnosis</h3>
              <p className="text-slate-500 font-medium">High-confidence matches from knowledge engine</p>
            </div>

            <div className="space-y-4">
              {results.possibleDiseases.map((d, i) => (
                <div key={i} className={`p-6 rounded-[32px] border-2 transition-all hover:scale-[1.01] ${
                  i === 0 ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
                }`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">{d.name}</h4>
                        {d.priority === 'critical' && <span className="bg-red-500 text-white text-[8px] px-2 py-1 rounded-full font-black uppercase tracking-widest">Notifiable</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {d.matchSources?.keyword > 0 && <span className="text-[8px] font-black uppercase text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md">Heuristic Match</span>}
                        {d.matchSources?.visual > 0 && <span className="text-[8px] font-black uppercase text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-md">Visual ID</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-primary leading-none mb-1">{Math.round(d.confidence * 100)}%</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Match Strength</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewInKnowledgeBase(d.diseaseCode)} 
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border-2 border-primary/20 text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white group transition-all"
                  >
                    Open Clinical Protocol
                    <span className="material-icons-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setStep(1)} 
              className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
              Reset Diagnostic Session
            </button>
          </div>
        )}
      </div>

      {showFMDWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[48px] p-12 max-w-lg w-full text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50">
              <span className="material-icons-outlined text-6xl">warning</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Security Alert</h3>
              <p className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Notifiable Disease Detected</p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              AI core has identified <span className="font-black text-slate-900 dark:text-white">Foot and Mouth Disease (FMD)</span> with critical confidence. Protocol requires immediate notification to the Dept of Veterinary Services.
            </p>
            <button 
              onClick={() => setShowFMDWarning(false)} 
              className="w-full py-5 bg-red-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Acknowledge Secure Protocol
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;