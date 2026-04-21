// src/components/diseaseReporting/DiseaseClassifier.jsx
import React, { useState, useRef, useEffect } from 'react';
import { loadModel, classifyFromFile, classifyFromCamera, getModelStatus } from '../../services/modelLoader';
import { getDiseaseMetadata } from '../../services/db';

const DiseaseClassifier = () => {
  const [modelStatus, setModelStatus] = useState({ isLoaded: false, isLoading: false });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [results, setResults] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  
  // Load model on component mount
  useEffect(() => {
    const initModel = async () => {
      try {
        setModelStatus({ isLoaded: false, isLoading: true });
        await loadModel();
        setModelStatus({ isLoaded: true, isLoading: false });
      } catch (err) {
        setError('Failed to load AI model: ' + err.message);
        setModelStatus({ isLoaded: false, isLoading: false });
      }
    };
    initModel();
    
    // Cleanup camera on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResults([]);
      setError(null);
    }
  };
  
  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setError(null);
    } catch (err) {
      setError('Cannot access camera: ' + err.message);
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };
  
  // Capture from camera
  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    
    setClassifying(true);
    setError(null);
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      setSelectedImage(imageBlob);
      setImagePreview(canvas.toDataURL('image/jpeg'));
      
      const classificationResults = await classifyFromFile(imageBlob);
      
      // Enrich results with metadata
      const enrichedResults = await Promise.all(
        classificationResults.map(async (result) => {
          const metadata = await getDiseaseMetadata(result.diseaseId);
          return { ...result, metadata };
        })
      );
      
      setResults(enrichedResults);
      stopCamera();
    } catch (err) {
      setError('Classification failed: ' + err.message);
    } finally {
      setClassifying(false);
    }
  };
  
  // Classify uploaded image
  const classifyImage = async () => {
    if (!selectedImage) return;
    
    setClassifying(true);
    setError(null);
    
    try {
      const classificationResults = await classifyFromFile(selectedImage);
      
      const enrichedResults = await Promise.all(
        classificationResults.map(async (result) => {
          const metadata = await getDiseaseMetadata(result.diseaseId);
          return { ...result, metadata };
        })
      );
      
      setResults(enrichedResults);
    } catch (err) {
      setError('Classification failed: ' + err.message);
    } finally {
      setClassifying(false);
    }
  };
  
  // Reset all
  const reset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults([]);
    setError(null);
    setCameraActive(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    stopCamera();
  };
  
  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Get confidence width percentage
  const getConfidenceWidth = (confidence) => `${Math.min(confidence * 100, 100)}%`;
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-2">
         <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">AI Disease Detector</h1>
         <div className="flex items-center gap-2">
            {modelStatus.isLoaded ? (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Offline AI Ready
              </span>
            ) : modelStatus.isLoading ? (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-spin"></span> Loading Core Intelligence...
              </span>
            ) : null}
         </div>
      </div>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Leverage our edge-AI technology to identify livestock diseases in real-time. Simply upload a photo or capture one using your camera.
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      {/* Image Source Selection */}
      {!imagePreview && !cameraActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative overflow-hidden bg-white hover:bg-orange-50 border-2 border-dashed border-gray-200 hover:border-orange-300 rounded-2xl p-10 text-center transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
               <svg className="w-24 h-24 text-orange-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
            </div>
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📁</div>
            <div className="font-bold text-xl text-gray-800 mb-1">Local Repository</div>
            <div className="text-sm text-gray-500">Upload from gallery or filesystem</div>
          </button>
          
          <button
            onClick={startCamera}
            className="group relative overflow-hidden bg-white hover:bg-green-50 border-2 border-dashed border-gray-200 hover:border-green-300 rounded-2xl p-10 text-center transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
               <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.172-1.172A1 1 0 009.828 3H6.172a1 1 0 00-.707.293L4.293 4.707A1 1 0 013.586 5H4z"></path></svg>
            </div>
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📸</div>
            <div className="font-bold text-xl text-gray-800 mb-1">Live Capture</div>
            <div className="text-sm text-gray-500">Scan animal using device camera</div>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
      
      {/* Camera View */}
      {cameraActive && (
        <div className="relative mb-8 overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full bg-black aspect-video object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex justify-center gap-4">
            <button
              onClick={captureFromCamera}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition active:scale-95 flex items-center gap-2"
            >
              <span className="w-3 h-3 rounded-full bg-white animate-ping"></span> Snapshot Now
            </button>
            <button
              onClick={stopCamera}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-3 px-8 rounded-full transition"
            >
              Exit Camera
            </button>
          </div>
        </div>
      )}
      
      {/* Image Preview */}
      {imagePreview && !cameraActive && (
        <div className="mb-8 group relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl max-w-lg mx-auto">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              onClick={classifyImage}
              disabled={classifying || !modelStatus.isLoaded}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-8 rounded-xl shadow-2xl transform scale-90 group-hover:scale-100 transition disabled:opacity-50 flex items-center gap-2"
            >
              {classifying ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                <>🔍 Run Neural Diagnosis</>
              )}
            </button>
            <button
              onClick={reset}
              className="bg-white text-gray-900 font-bold py-4 px-8 rounded-xl transition hover:bg-gray-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      {/* Results */}
      {results.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
             </div>
             <h2 className="text-2xl font-black text-gray-800">Neural Diagnosis Report</h2>
          </div>
          
          <div className="space-y-6">
            {results.slice(0, 3).map((result, index) => {
              const metadata = result.metadata;
              const isHealthy = result.diseaseId === 'disease_healthy';
              const confidence = Math.round(result.confidence * 100);
              const confidenceColor = confidence >= 85 ? 'text-green-600' : confidence >= 60 ? 'text-orange-600' : 'text-red-500';
              const progressColor = isHealthy ? 'bg-green-500' : confidence >= 85 ? 'bg-orange-500' : 'bg-orange-300';
              
              return (
                <div
                  key={index}
                  className={`relative overflow-hidden border rounded-2xl p-6 transition-all duration-500 ${
                    index === 0 
                      ? 'border-orange-200 bg-white shadow-lg ring-1 ring-orange-50 scale-[1.02] z-10' 
                      : 'border-transparent bg-gray-100 hover:bg-white hover:shadow-md'
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0 py-1 px-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                      Primary Match
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-black text-xl mb-1 ${index === 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                        {metadata?.name || result.diseaseId}
                      </h3>
                      {metadata?.localName && (
                        <p className="text-gray-400 text-sm font-medium italic">{metadata.localName}</p>
                      )}
                    </div>
                    <div className={`text-2xl font-black tabular-nums ${confidenceColor}`}>
                      {confidence}%
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-6 relative overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${progressColor}`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                  
                  {!isHealthy && metadata?.treatment && (
                    <div className="grid md:grid-cols-2 gap-4 animate-in fade-in duration-700 delay-300">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Protocol Treatment</p>
                        <ul className="space-y-2">
                          {metadata.treatment.slice(0, 3).map((step, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-700 items-start">
                               <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex-shrink-0 flex items-center justify-center text-[10px] mt-0.5">✓</span>
                               {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {metadata.medicines?.length > 0 && (
                        <div>
                           <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Recommended Pharmacology</p>
                           <div className="flex flex-wrap gap-2">
                              {metadata.medicines.map((med, i) => (
                                <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                                   💊 {med}
                                </span>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isHealthy && (
                    <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-500 delay-300">
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="font-black text-sm">System Health Verified</p>
                        <p className="text-xs opacity-80">Subject displays no identified visual symptoms. Consistent with normal phenotypic range.</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-orange-100/30 border border-orange-100 rounded-xl text-[10px] text-orange-600 leading-relaxed italic">
            <strong>DISCLAIMER:</strong> This analytical report is generated by an algorithmic neural network for preliminary screening purposes only. It does not constitute a clinical diagnosis. Immediate validation by a licensed veterinary professional is mandatory for all identified pathologies. 
          </div>
        </div>
      )}
      
      {/* Model Status Info */}
      <div className="mt-8 text-center">
         <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-[2px]">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Edge Computing Native <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Zero Network Dependency <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
         </div>
      </div>
    </div>
  );
};

export default DiseaseClassifier;
