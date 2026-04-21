import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Camera, 
  UploadCloud, 
  Send, 
  ShieldAlert, 
  Bell, 
  CheckCircle2, 
  FileText,
  AlertOctagon,
  ArrowRight,
  Wifi,
  WifiOff,
  Loader2,
  X,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import diseaseReportService from '../services/diseaseReportService';
import geolocationService from '../services/geolocationService';
import { useAuth } from '../context/AuthContext';

const ReportSuspectedDisease = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [caseId, setCaseId] = useState(null);
  
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    district: 'Central',
    area: 'Gaborone West',
    verified: false,
    loading: false
  });

  const [formData, setFormData] = useState({
    species: 'Cattle',
    herdSize: '',
    symptoms: '',
    photos: []
  });

  const [photoPreview, setPhotoPreview] = useState([]);

  // Get geolocation on component mount
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-detect location
    detectLocation();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const detectLocation = async () => {
    setLocation(prev => ({ ...prev, loading: true }));
    try {
      const position = await geolocationService.getCurrentPosition();
      setLocation(prev => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        verified: true,
        loading: false
      }));
    } catch (err) {
      console.error('Geolocation error:', err);
      setLocation(prev => ({ ...prev, loading: false }));
      // Use fallback location
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 photos
    if (formData.photos.length + files.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(prev => [...prev, reader.result]);
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const saveToLocalQueue = (reportData) => {
    const queue = JSON.parse(localStorage.getItem('diseaseReportQueue') || '[]');
    queue.push({
      ...reportData,
      timestamp: new Date().toISOString(),
      synced: false
    });
    localStorage.setItem('diseaseReportQueue', JSON.stringify(queue));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const reportPayload = {
        userId: user?.id,
        species: formData.species,
        herdSizeAffected: parseInt(formData.herdSize) || 0,
        symptomsDescription: formData.symptoms,
        latitude: location.latitude,
        longitude: location.longitude,
        district: location.district,
        area: location.area,
        priority: formData.symptoms.toLowerCase().includes('fmd') || 
                 formData.symptoms.toLowerCase().includes('foot and mouth') ? 'critical' : 'medium'
      };

      if (isOnline) {
        // Submit directly to DVS backend
        setIsSyncing(true);
        const response = await diseaseReportService.create(reportPayload);
        
        // Upload photos if any
        if (formData.photos.length > 0 && response.id) {
          await diseaseReportService.uploadPhotos(response.id, formData.photos);
        }

        setCaseId(response.caseId || `DVS-${response.id}`);
        setReportId(response.id);
        setIsSyncing(false);
      } else {
        // Save locally for offline sync
        saveToLocalQueue({
          ...reportPayload,
          photos: photoPreview.map(p => p.split(',')[1]) // Save base64 strings
        });
        setCaseId(`OFFLINE-${Date.now()}`);
        setReportId(`OFFLINE-${Date.now()}`);
        setError('Report saved locally. Will sync when online.');
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit report:', err);
      
      // Fallback: save to local queue
      if (!isOnline || err.response?.status === 503) {
        saveToLocalQueue(reportPayload);
        setCaseId(`OFFLINE-${Date.now()}`);
        setReportId(`OFFLINE-${Date.now()}`);
        setIsSubmitted(true);
        setError('Network error. Report saved locally and will sync later.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans text-slate-800 flex justify-center">
      <div className="w-full max-w-xl mx-auto px-4 relative">
        
      {/* Header */}
      <header className="flex justify-between items-center py-6 border-b border-gray-100 mb-8">
        <div className="flex items-center gap-3">
           <div className="bg-[#1e293b] p-2 rounded-xl text-white">
             <ShieldAlert className="w-5 h-5" />
           </div>
           <div>
             <div className="font-black text-xs uppercase tracking-widest text-slate-400 leading-none mb-1">Official Report</div>
             <div className="font-bold text-sm text-slate-900 leading-none">Dept. of Veterinary Services</div>
           </div>
        </div>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700">
              <Wifi className="w-3 h-3" /> Online
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">
              <WifiOff className="w-3 h-3" /> Offline
            </div>
          )}
          <button className="bg-slate-50 p-2 rounded-full text-slate-400">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

        {!isSubmitted ? (
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight text-slate-900">Disease Report</h1>
            <p className="text-sm text-slate-400 font-medium mb-10">Your report helps protect Botswana's livestock industry.</p>

            <form className="space-y-12" onSubmit={handleSubmit}>
            {/* Location Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ea580c]" /> Incident Location
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  location.verified ? 'text-green-600 bg-green-50 border-green-100' : 'text-amber-600 bg-amber-50 border-amber-100'
                }`}>
                  {location.loading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Getting location...
                    </>
                  ) : location.verified ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> GPS Verified
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3" /> Manual Entry
                    </>
                  )}
                </span>
              </div>
              
              <div className="relative w-full h-56 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 mb-4 bg-slate-200">
                {/* Simulated map */}
                <div className="absolute inset-0 bg-[#5b8b78]/20 flex items-center justify-center">
                  <div className="w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#ea580c]/20 rounded-full animate-ping absolute"></div>
                    <MapPin className="w-10 h-10 text-[#ea580c] relative z-10 drop-shadow-lg" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm border border-white">
                  District: {location.district} • {location.area}
                </div>
                {location.loading && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm border border-white animate-pulse">
                    Detecting location...
                  </div>
                )}
              </div>
            </section>

              {/* Animal Details */}
              <section className="space-y-6">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                   <AlertOctagon className="w-4 h-4 text-[#ea580c]" /> Affected Livestock
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 pl-1">Species</label>
                    <div className="relative">
                      <select 
                        value={formData.species}
                        onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                        className="w-full appearance-none bg-slate-50 border border-slate-100 text-slate-900 py-4 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 font-bold text-sm"
                      >
                        <option>Cattle</option>
                        <option>Goat</option>
                        <option>Sheep</option>
                        <option>Pig</option>
                        <option>Poultry</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 pl-1">Herd Size Affected</label>
                    <input 
                      type="number" 
                      value={formData.herdSize}
                      onChange={(e) => setFormData({ ...formData, herdSize: e.target.value })}
                      placeholder="0" 
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 py-4 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 font-bold text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 pl-1">Symptoms Description</label>
                  <textarea 
                    rows="4" 
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="Describe clinical signs (e.g. blisters, salivation, fever)..." 
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 py-4 px-4 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 resize-none font-bold text-sm"
                  ></textarea>
                </div>
              </section>

              {/* Photos */}
              <section className="space-y-6">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#ea580c]" /> Evidence Photos ({formData.photos.length}/5)
                </h2>
                
                {photoPreview.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {photoPreview.map((preview, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-100 h-32">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col items-center justify-center gap-3 bg-orange-50 border-2 border-dashed border-orange-100 py-10 rounded-[2rem] hover:bg-orange-100 transition-all cursor-pointer">
                    <Camera className="w-8 h-8 text-[#ea580c]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#ea580c]">Open Camera</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <label className="flex flex-col items-center justify-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 py-10 rounded-[2rem] hover:bg-slate-100 transition-all cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-slate-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Upload</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </section>

              {error && (
                <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                  error.includes('offline') ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSyncing || isLoading}
                className="w-full bg-[#ea580c] hover:bg-[#c44e13] text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading || isSyncing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> 
                    {isSyncing ? 'Syncing with DVS...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Submit Official Report
                  </>
                )}
              </button>
              
            </form>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center pt-20">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 border-4 shadow-lg ${
              reportId?.toString().startsWith('OFFLINE') 
                ? 'bg-amber-100 text-amber-600 border-amber-50' 
                : 'bg-green-100 text-green-600 border-green-50'
            }`}>
              <CheckCircle2 className="w-12 h-12" strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              {reportId?.toString().startsWith('OFFLINE') ? 'Report Saved Locally' : 'Report Logged'}
            </h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xs mb-10">
              Your report code is <span className="font-black text-slate-900">{caseId}</span>. 
              {reportId?.toString().startsWith('OFFLINE') 
                ? ' Will sync when online.' 
                : ' Veterinary officers have been alerted.'}
            </p>
            
            <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-left mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white p-2 rounded-xl border border-slate-100"><FileText className="w-4 h-4 text-[#ea580c]" /></div>
                <div className="text-xs font-bold text-slate-900 leading-none">Case ID: {caseId}</div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {reportId?.toString().startsWith('OFFLINE') 
                  ? `Report saved locally and queued for sync. Check **Alerts** page once online for updates.`
                  : `Stay updated via the **Alerts** page. Movement restrictions in your zone have been updated to **HIGH RISK**.`
                }
              </p>
            </div>

            <Link 
              to="/dashboard"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
            >
              Return to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* Offline Reliable Sync Notice */}
        {!isSubmitted && (
          <div className="mt-12 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-start gap-4">
            <div className="bg-[#ea580c] p-1.5 rounded-lg"><ShieldAlert className="w-4 h-4 text-white" /></div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Offline Reliability</h4>
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                {isOnline 
                  ? 'Report will be submitted to DVS immediately upon submission.'
                  : 'Report is cached locally and will sync instantly upon network detection.'}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportSuspectedDisease;
