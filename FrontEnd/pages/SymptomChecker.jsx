import React, { useState, useRef } from 'react';
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
    navigate('/', { state: { diseaseCode } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Premium Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
          AI Diagnostic Intelligence
        </h2>
        <p className="text-slate-500 font-medium">Combining visual analysis with semantic symptom matching</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center px-4 max-w-md mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
              step >= s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > s ? <span className="material-icons-outlined">check</span> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="premium-card p-8 min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Select Species</h3>
              <p className="text-slate-500">Choose the type of animal you are examining</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {['cattle', 'goat', 'sheep'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSpecies(s); setStep(2); }}
                  className={`group relative aspect-square rounded-3xl border-2 transition-all duration-300 p-6 flex flex-col items-center justify-center gap-4 ${
                    species === s ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-100 bg-slate-50 hover:border-primary/30 hover:bg-white'
                  }`}
                >
                  <span className="material-icons-outlined text-5xl text-slate-400 group-hover:text-primary transition-colors">
                    {s === 'cattle' ? 'pets' : s === 'goat' ? 'agriculture' : 'cloud'}
                  </span>
                  <span className="font-bold capitalize text-lg">{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Identify Symptoms</h3>
              <p className="text-slate-500">Search by word or select observable matshwao (symptoms)</p>
            </div>

            {/* Manual Word Search Input */}
            <div className="relative group">
              <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                placeholder="Type symptoms here (e.g. skin lumps, fever...)"
                className="input-field pl-12"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableSymptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSymptomToggle(s)}
                  className={`px-4 py-3 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${
                    symptoms.includes(s) ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="pt-8 flex justify-between gap-4">
              <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
              <button onClick={() => setStep(3)} disabled={symptoms.length === 0} className="btn-primary flex-1">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Visual Analysis</h3>
              <p className="text-slate-500">Upload a clear photo for 90%+ diagnostic accuracy</p>
            </div>
            
            <div className="flex justify-center">
              {photo ? (
                <div className="relative group w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img src={photo} alt="Upload" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => setPhoto(null)} className="btn-secondary !bg-red-500 !text-white !border-none">Replace Photo</button>
                  </div>
                </div>
              ) : (
                <label className="w-full max-w-sm aspect-square rounded-3xl border-4 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-100 hover:border-primary/30 transition-all">
                  <span className="material-icons-outlined text-6xl text-slate-300">add_a_photo</span>
                  <span className="font-bold text-slate-400 text-center px-6">Click to upload or take a photo of the affected area</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="pt-8 flex gap-4">
              <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
              <button 
                onClick={handleAnalyze} 
                disabled={loading} 
                className={`btn-primary flex-1 flex items-center justify-center gap-3 ${loading ? 'animate-pulse' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="material-icons-outlined animate-spin">psychology</span>
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <span className="material-icons-outlined">auto_fix_high</span>
                    Start AI Diagnosis
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 4 && results && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Diagnostic Results</h3>
              <p className="text-slate-500">Based on multi-modal semantic analysis</p>
            </div>

            <div className="space-y-4">
              {results.possibleDiseases.map((d, i) => (
                <div key={i} className={`p-6 rounded-3xl border-2 transition-all hover:scale-[1.01] ${
                  i === 0 ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-xl text-slate-900">{d.name}</h4>
                        {i === 0 && <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest">Confidence Score</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {d.matchSources?.keyword > 0 && <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-1 rounded-md">Symptoms Match</span>}
                        {d.matchSources?.visual > 0 && <span className="text-[9px] font-black uppercase text-purple-500 bg-purple-50 px-2 py-1 rounded-md">Visual Identity</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-primary">{Math.round(d.confidence * 100)}%</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Match Probability</div>
                    </div>
                  </div>
                  <button onClick={() => handleViewInKnowledgeBase(d.diseaseCode)} className="w-full btn-secondary text-primary border-primary/20 hover:bg-primary hover:text-white group">
                    View Treatment Plan
                    <span className="material-icons-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(1)} className="w-full btn-secondary">New Diagnosis</button>
          </div>
        )}
      </div>

      {showFMDWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] p-10 max-w-lg w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-icons-outlined text-6xl">warning</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Notifiable Disease</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              High confidence (80%+) detection of Foot and Mouth Disease (FMD). This condition must be reported to the Department of Veterinary Services immediately.
            </p>
            <button onClick={() => setShowFMDWarning(false)} className="w-full btn-primary !bg-red-600 !shadow-red-200">Acknowledge & Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
