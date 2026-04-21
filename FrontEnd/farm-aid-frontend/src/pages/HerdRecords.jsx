import React, { useState, useEffect } from 'react';
import { NavLink ,Link} from 'react-router-dom';
import {
   Search, Bell, User,  PawPrint, Activity, 
  Store, BookOpen, Settings, RefreshCw, AlertTriangle, 
  ArrowUpRight, PlusCircle, Stethoscope, Headphones, 
  ChevronDown, TrendingUp, CheckCircle2, X, Syringe, 
  Banknote, ShieldAlert, FileText, Lock, GraduationCap, Database,
  Camera, UploadCloud, Loader2, Wifi, WifiOff, Info, PhoneCall, Check 
    ,Filter, MoreVertical, Plus, CloudOff, Calendar,  Save,  Download, AlertCircle, Loader ,LayoutDashboard} from 'lucide-react';
import ExportModal from '../components/common/ExportModal';
import Sidebar from '../components/layout/Sidebar';
import livestockApi from '../services/livestockApi';
import * as aiService from '../../ai/aiService';
//separate modal symptom checker 
   const SymptomCheckerComponent = ({ onClose }) => {
     const [selectedSymptoms, setSelectedSymptoms] = useState([]);
     const [conditionDescription, setConditionDescription] = useState('');
     const [isOffline, setIsOffline] = useState(!navigator.onLine);
     const [isChecking, setIsChecking] = useState(false);
     const [resultReady, setResultReady] = useState(false);
     const [diagnosisResults, setDiagnosisResults] = useState(null);
     const [selectedSpecies, setSelectedSpecies] = useState('Cattle');
     const [aiInitialized, setAiInitialized] = useState(false);
   
     useEffect(() => {
       const handleOnline = () => setIsOffline(false);
       const handleOffline = () => setIsOffline(true);
       window.addEventListener('online', handleOnline);
       window.addEventListener('offline', handleOffline);
       
       // Initialize AI service on component mount
       aiService.initializeAI()
         .then(() => setAiInitialized(true))
         .catch(err => {
           console.error('Failed to initialize AI:', err);
           setAiInitialized(true); // Allow to proceed even if initialization fails
         });
       
       return () => {
         window.removeEventListener('online', handleOnline);
         window.removeEventListener('offline', handleOffline);
       };
     }, []);
   
     const toggleSymptom = (symptom) => {
       setSelectedSymptoms(prev =>
         prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
       );
     };
   
     const saveToLocalQueue = async (data) => {
       const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
       queue.push(data);
       localStorage.setItem('syncQueue', JSON.stringify(queue));
     };
   
     const showEmergencyAlert = () => {
       alert('🚨 EMERGENCY: High confidence FMD detected! Contact DVS immediately.');
     };
   
     const createConsultationRequest = async (result) => {
       console.log('Consultation request created:', result);
     };
   
     const handleCheck = async () => {
       setIsChecking(true);
       setResultReady(false);
       
       try {
         if (!aiInitialized) {
           throw new Error('AI service not initialized');
         }
         
         // Combine symptoms and optional description for search
         const searchQuery = conditionDescription 
           ? `${selectedSymptoms.join(' ')} ${conditionDescription}` 
           : selectedSymptoms.join(' ');
         
         // Call the AI service with unified search
         const searchResults = await aiService.unifiedSearch({
           text: searchQuery,
           symptoms: selectedSymptoms,
           species: selectedSpecies.toLowerCase()
         });
         
         // If offline, save result locally
         if (isOffline) {
           await saveToLocalQueue({
             type: 'symptom_check',
             data: searchResults,
             timestamp: new Date()
           });
         }
         
         // Format results for display
         if (searchResults.length > 0) {
           const topResult = searchResults[0];
           
           // Handle recommendations - can be array or string
           let recommendations = ['Consult a veterinarian'];
           if (topResult.treatment) {
             recommendations = typeof topResult.treatment === 'string' 
               ? topResult.treatment.split('\n').filter(t => t.trim())
               : Array.isArray(topResult.treatment) ? topResult.treatment : ['Consult a veterinarian'];
           } else if (topResult.recommendations) {
             recommendations = Array.isArray(topResult.recommendations) 
               ? topResult.recommendations 
               : [topResult.recommendations];
           }
           
           setDiagnosisResults({
             disease: topResult.name || topResult.diseaseCode || 'Unknown Disease',
             confidence: topResult.confidence || 0,
             priority: topResult.priority || 'medium',
             recommendations: recommendations,
             description: topResult.description || ''
           });
           
           // If high confidence match and appears to be critical, trigger emergency
           if (topResult.confidence > 0.85 && topResult.diseaseCode?.toUpperCase() === 'FMD') {
             showEmergencyAlert();
             await createConsultationRequest(topResult);
           }
         } else {
           setDiagnosisResults({
             disease: 'No Match Found',
             confidence: 0,
             priority: 'low',
             recommendations: ['Consult a veterinarian for professional diagnosis', 'Consider submitting photos for visual analysis']
           });
         }
         
         setResultReady(true);
       } catch (error) {
         console.error('Diagnosis failed:', error);
         setDiagnosisResults({
           disease: 'Error',
           confidence: 0,
           priority: 'low',
           recommendations: ['Please check your internet connection', 'Try again later', 'Contact support if issue persists']
         });
         setResultReady(true);
       } finally {
         setIsChecking(false);
       }
     };
   
     const symptomsList = [
       'Excessive salivation',
       'Blisters on mouth',
       'Lameness',
       'Fever',
       'Loss of appetite',
       'Weight loss'
     ];
   
     return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
         <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 shadow-2xl">
           <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
             <div>
               <h2 className="text-2xl font-extrabold text-gray-900">AI Symptom Checker</h2>
               <p className="text-sm text-gray-500 mt-1">Offline-capable diagnosis for livestock</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
               <X className="w-5 h-5" />
             </button>
           </div>
   
           <div className="p-6 space-y-6">
             {/* Offline Status */}
             <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isOffline ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
               {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
               <span className="text-sm font-medium">{isOffline ? 'Offline Mode - Results will sync when online' : 'Online Mode'}</span>
             </div>
   
             {/* Species Selection */}
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Species</label>
               <div className="grid grid-cols-3 gap-3">
                 {['Cattle', 'Goat', 'Sheep'].map(species => (
                   <button
                     key={species}
                     onClick={() => setSelectedSpecies(species)}
                     className={`py-3 rounded-xl border-2 transition-all font-semibold ${
                       selectedSpecies === species 
                         ? 'border-[#12ca49] bg-green-50 text-[#12ca49]' 
                         : 'border-gray-200 text-gray-500 hover:border-gray-300'
                     }`}
                   >
                     {species}
                   </button>
                 ))}
               </div>
             </div>
   
             {/* Condition Description (Optional) */}
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Condition Description (Optional)</label>
               <textarea
                 value={conditionDescription}
                 onChange={(e) => setConditionDescription(e.target.value)}
                 placeholder="Describe the animal's condition in detail (e.g., behavior changes, visible signs, duration of symptoms...)"
                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#12ca49] resize-none"
                 rows="4"
               />
               <p className="text-xs text-gray-500 mt-1">Providing details improves diagnosis accuracy</p>
             </div>

             {/* Symptoms Selection */}
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Select Symptoms</label>
               <div className="grid grid-cols-2 gap-3">
                 {symptomsList.map(symptom => (
                   <button
                     key={symptom}
                     onClick={() => toggleSymptom(symptom)}
                     className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                       selectedSymptoms.includes(symptom)
                         ? 'border-[#12ca49] bg-green-50'
                         : 'border-gray-200 hover:border-gray-300'
                     }`}
                   >
                     <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                       selectedSymptoms.includes(symptom) ? 'bg-[#12ca49] border-[#12ca49]' : 'border-gray-300'
                     }`}>
                       {selectedSymptoms.includes(symptom) && <Check className="w-3 h-3 text-white" />}
                     </div>
                     <span className="text-sm font-medium text-gray-700">{symptom}</span>
                   </button>
                 ))}
               </div>
             </div>
   
             {/* Photo Upload */}
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Visual Evidence (Optional)</label>
               <div className="grid grid-cols-2 gap-4">
                 <button className="flex flex-col items-center gap-2 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-100 transition">
                   <Camera className="w-6 h-6 text-gray-400" />
                   <span className="text-xs text-gray-500">Take Photo</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-100 transition">
                   <UploadCloud className="w-6 h-6 text-gray-400" />
                   <span className="text-xs text-gray-500">Upload</span>
                 </button>
               </div>
             </div>
   
             {/* Check Button */}
             <button
               onClick={handleCheck}
               disabled={isChecking || selectedSymptoms.length === 0 || !aiInitialized}
               className="w-full bg-[#12ca49] hover:bg-[#0ea83d] text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               title={!aiInitialized ? 'AI service initializing...' : ''}
             >
               {isChecking ? (
                 <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
               ) : !aiInitialized ? (
                 <><Loader2 className="w-5 h-5 animate-spin" /> Initializing AI...</>
               ) : (
                 <><Activity className="w-5 h-5" /> Run AI Diagnosis</>
               )}
             </button>
   
             {/* Results */}
             {resultReady && diagnosisResults && (
               <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in duration-300">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase mb-1">
                       <AlertTriangle className="w-4 h-4" /> Diagnosis Result
                     </div>
                     <h3 className="text-xl font-extrabold text-gray-900">{diagnosisResults.disease}</h3>
                   </div>
                   <div className="text-right">
                     <div className="text-2xl font-black text-[#12ca49]">{Math.round(diagnosisResults.confidence * 100)}%</div>
                     <div className="text-xs text-gray-500">confidence</div>
                   </div>
                 </div>
                 
                 <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                   <div className="h-full bg-[#12ca49] rounded-full" style={{ width: `${diagnosisResults.confidence * 100}%` }} />
                 </div>
                 
                 <div className="space-y-2">
                   {diagnosisResults.recommendations.map((rec, idx) => (
                     <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                       <CheckCircle2 className="w-4 h-4 text-[#12ca49] mt-0.5 flex-shrink-0" />
                       <span>{rec}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </div>
       </div>
     );
   };
   //main herd record
const HerdRecords = () => {
   const [livestock, setLivestock] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [showExportModal, setShowExportModal] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [speciesFilter, setSpeciesFilter] = useState('All Species');
   const [successMessage, setSuccessMessage] = useState('');
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
   
   // Add Animal Modal state
   const [addAnimalForm, setAddAnimalForm] = useState({
      tagId: '',
      name: '',
      species: '',
      breed: '',
      gender: '',
      birthDate: '',
      acquisitionMethod: 'born',
   });
   
   // Health Event Modal state
   const [healthEventForm, setHealthEventForm] = useState({
      animalId: '',
      eventType: 'Vaccination',
      eventDate: new Date().toISOString().split('T')[0],
      details: '',
      dosage: '',
      medicineType: '',
   });

   // Fetch livestock data
   useEffect(() => {
      const fetchLivestock = async () => {
         try {
            setLoading(true);
            setError(null);
            const speciesValue = speciesFilter !== 'All Species' ? speciesFilter.toLowerCase() : undefined;
            const response = await livestockApi.getLivestock({
               species: speciesValue,
            });
            setLivestock(response || []);
         } catch (err) {
            console.error('Error fetching livestock:', err);
            setError(err.message || 'Failed to fetch livestock data');
            // Fall back to demo data
            setLivestock([
               {
                  id: 'BW-192',
                  tagId: 'BW-192',
                  name: 'Barnaby',
                  species: 'cattle',
                  breed: 'Brahman Hybrid',
                  healthStatus: 'recovering',
                  vaccinationStatus: { lastVaccination: '2023-11-12' },
                  createdAt: '2023-10-15'
               },
               {
                  id: 'BW-194',
                  tagId: 'BW-194',
                  name: 'Daisy',
                  species: 'cattle',
                  breed: 'Holstein',
                  healthStatus: 'healthy',
                  vaccinationStatus: { lastVaccination: '2024-01-05' },
                  createdAt: '2023-12-20'
               }
            ]);
         } finally {
            setLoading(false);
         }
      };
      
      fetchLivestock();
   }, [speciesFilter]);

   
   const closeModal = () => setIsModalOpen(false);
   const openModal = () => setIsModalOpen(true);

   // Handle Add Animal form submission
   const handleAddAnimal = async (e) => {
      e.preventDefault();
      try {
         if (!addAnimalForm.tagId || !addAnimalForm.species || !addAnimalForm.gender) {
            setError('Please fill in all required fields');
            return;
         }
         
         await livestockApi.createLivestock({
            tagId: addAnimalForm.tagId,
            name: addAnimalForm.name,
            species: addAnimalForm.species,
            breed: addAnimalForm.breed,
            gender: addAnimalForm.gender,
            birthDate: addAnimalForm.birthDate,
            acquisitionMethod: addAnimalForm.acquisitionMethod,
         });
         
         setSuccessMessage('Animal added successfully!');
         setAddAnimalForm({ tagId: '', name: '', species: '', breed: '', gender: '', birthDate: '', acquisitionMethod: 'born' });
         setIsModalOpen(false);
         
         // Refresh livestock list
         const response = await livestockApi.getLivestock();
         setLivestock(Array.isArray(response) ? response : (response.data || []));
         
         setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
         console.error('Error adding animal:', err);
         setError(err.message || 'Failed to add animal');
      }
   };

   // Handle Health Event form submission
   const handleHealthEvent = async (e) => {
      e.preventDefault();
      try {
         if (!healthEventForm.animalId) {
            setError('Please select an animal');
            return;
         }
         
         await livestockApi.logHealthEvent(healthEventForm.animalId, {
            eventType: healthEventForm.eventType,
            eventDate: healthEventForm.eventDate,
            details: healthEventForm.details,
            dosage: healthEventForm.dosage,
            medicineType: healthEventForm.medicineType,
         });
         
         setSuccessMessage('Health event logged successfully!');
         setHealthEventForm({
            animalId: '',
            eventType: 'Vaccination',
            eventDate: new Date().toISOString().split('T')[0],
            details: '',
            dosage: '',
            medicineType: '',
         });
         setIsModalOpen(false);
         
         setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
         setError(err.message || 'Failed to log health event');
      }
   };

   // Filtered livestock based on search
   const filteredLivestock = livestock.filter(animal => 
      animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.tagId?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   

   return (
      <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-800">

          {/* Left Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col fixed h-full z-10 shrink-0 shadow-sm">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50 shrink-0 gap-3">
          <div className="bg-[#12ca49] p-2 rounded-xl flex items-center justify-center">
             <div className="w-5 h-5 flex flex-col justify-center items-center gap-0.5 relative">
                <div className="w-4 h-2 bg-white rounded-t-sm"></div>
                <div className="flex w-full gap-1 justify-between">
                   <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                   <div className="w-2 h-2 bg-white rounded-full mt-0.5"></div>
                </div>
             </div>
          </div>
          <span className="font-extrabold text-[#111827] text-xl tracking-tight">Farm-Aid</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold rounded-xl transition-colors"> 
          
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/herd-records" className="flex items-center gap-3 px-4 py-3.5 bg-[#eafbf0] text-[#12ca49] font-bold rounded-xl transition-colors">
            <PawPrint className="w-5 h-5" /> My Herd
          </Link>
          <button 
            onClick={() => setShowSymptomChecker(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold rounded-xl transition-colors"
          >
            <Activity className="w-5 h-5" /> Health Checker
          </button>
          <Link to="/alerts" className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold rounded-xl transition-colors">
            <Bell className="w-5 h-5" /> Alerts
          </Link>
          <div className="flex items-center gap-3 px-4 py-3.5 text-gray-400 font-semibold rounded-xl cursor-not-allowed opacity-50">
            <Store className="w-5 h-5" /> Market (Offline)
          </div>
          <Link to="/knowledge-base" className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold rounded-xl transition-colors">
            <BookOpen className="w-5 h-5" /> Knowledge Base
          </Link>
          <Link to="/learn" className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold rounded-xl transition-colors">
            <GraduationCap className="w-5 h-5" /> Learn & Impact
          </Link>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 shrink-0 space-y-2">
          <div className="bg-[#F8F9FA] rounded-xl p-4 mb-2 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sync Status</span>
              <RefreshCw className="w-4 h-4 text-[#12ca49]" />
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mb-2 overflow-hidden">
               <div className="h-full bg-[#12ca49] w-[100%] rounded-full"></div>
            </div>
            <p className="text-xs text-green-600 font-bold">All records synced</p>
          </div>
          
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-bold rounded-xl transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </div>
      </aside>
         <div className="flex-1 ml-20 overflow-auto">
            <div className="bg-[#f8fafc] font-sans text-gray-800 min-h-screen relative">
               <div className={`p-8 max-w-6xl mx-auto transition-all ${isModalOpen ? 'opacity-50' : ''}`}>

                  {/* Success Message */}
                  {successMessage && (
                     <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {successMessage}
                     </div>
                  )}

                  {/* Error Message */}
                  {error && (
                     <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                     </div>
                  )}

                  {/* Header */}
                  <header className="flex justify-between items-center mb-8">
                     <div>
                        <h1 className="text-3xl font-extrabold text-[#111827] mb-1 tracking-tight">Herd Records</h1>
                        <p className="text-gray-500 font-medium text-sm">Manage and track your livestock offline and online.</p>
                     </div>

                     <div className="flex items-center gap-3">
                        <button
                           onClick={() => setShowExportModal(true)}
                           className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition shadow-sm border border-gray-200"
                        >
                           <Download className="w-4 h-4" /> Export
                        </button>
                        <button
                           onClick={openModal}
                           className="bg-[#1e9d56] hover:bg-[#15803d] text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition shadow-sm"
                        >
                           <Plus className="w-4 h-4" /> Add Animal
                        </button>
                     </div>
                  </header>

                  {/* Toolbar */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex justify-between items-center shadow-sm">
                     <div className="relative w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                           type="text" 
                           placeholder="Search by BAITS tag or name..." 
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-200 focus:border-[#1e9d56] focus:ring-1 focus:ring-[#1e9d56] rounded-lg py-2 pl-9 pr-4 text-sm font-medium focus:outline-none" 
                        />
                     </div>

                     <div className="flex gap-2">
                        <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition">
                           <Filter className="w-4 h-4" /> Filter
                        </button>
                        <select 
                           value={speciesFilter}
                           onChange={(e) => setSpeciesFilter(e.target.value)}
                           className="border border-gray-200 text-gray-600 bg-white focus:outline-none font-bold text-sm px-4 py-2 rounded-lg shadow-sm"
                        >
                           <option value="All Species">All Species</option>
                           <option value="Cattle">Cattle</option>
                           <option value="Goat">Goat</option>
                           <option value="Sheep">Sheep</option>
                           <option value="Pig">Pig</option>
                           <option value="Chicken">Poultry</option>
                        </select>
                     </div>
                  </div>

                  {/* Loading State */}
                  {loading && (
                     <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 text-[#1e9d56] animate-spin" />
                     </div>
                  )}

                  {/* Desktop Table View */}
                  {!loading && !isModalOpen && (
                     <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
                        <table className="w-full text-left font-sans">
                           <thead className="bg-[#f8fafc] border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                              <tr>
                                 <th className="px-6 py-4">BAITS Tag / Name</th>
                                 <th className="px-6 py-4">Species & Breed</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4">Last Vaccine</th>
                                 <th className="px-6 py-4 text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 text-sm">
                              {filteredLivestock.length > 0 ? (
                                 filteredLivestock.map((animal) => (
                                    <tr key={animal.id} className="hover:bg-gray-50/50 cursor-pointer transition">
                                       <td className="px-6 py-4">
                                          <span className="font-extrabold text-gray-900 block">#{animal.tagId}</span>
                                          <span className="text-xs text-gray-500 font-medium">{animal.name || '–'}</span>
                                       </td>
                                       <td className="px-6 py-4">
                                          <span className="font-bold text-gray-700 block mb-0.5 flex items-center gap-1.5">
                                             <div className="w-2 h-2 bg-[#1e9d56] rounded-full"></div> {animal.species?.charAt(0).toUpperCase() + animal.species?.slice(1)}
                                          </span>
                                          <span className="text-xs text-gray-500">{animal.breed || '–'}</span>
                                       </td>
                                       <td className="px-6 py-4">
                                          <span 
                                             className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                                                animal.healthStatus === 'healthy' 
                                                   ? 'bg-green-100 text-green-700 border-green-200'
                                                   : animal.healthStatus === 'sick'
                                                   ? 'bg-orange-100 text-[#ea580c] border-orange-200'
                                                   : animal.healthStatus === 'recovering'
                                                   ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                   : animal.healthStatus === 'quarantine'
                                                   ? 'bg-red-100 text-red-700 border-red-200'
                                                   : 'bg-gray-100 text-gray-700 border-gray-200'
                                             }`}
                                          >
                                             {animal.healthStatus?.charAt(0).toUpperCase() + animal.healthStatus?.slice(1) || 'Unknown'}
                                          </span>
                                       </td>
                                       <td className="px-6 py-4 text-gray-500 font-medium">
                                          {animal.vaccinationStatus?.lastVaccination 
                                             ? new Date(animal.vaccinationStatus.lastVaccination).toLocaleDateString()
                                             : 'N/A'
                                          }
                                       </td>
                                       <td className="px-6 py-4 text-center text-gray-400 hover:text-gray-800">
                                          <MoreVertical className="w-5 h-5 mx-auto" />
                                       </td>
                                    </tr>
                                 ))
                              ) : (
                                 <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                       No livestock found. Add your first animal to get started!
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  )}
               {/* Modal Overlay - Add Animal or Log Health Event */}
               {isModalOpen && (
                  <div 
                     className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a5553]/60 backdrop-blur-[2px]"
                     onClick={() => setIsModalOpen(false)}
                  >

                     {/* Modal Container - Add Animal Form */}
                     <div 
                        className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-[640px] flex flex-col overflow-hidden relative border border-white/50"
                        onClick={(e) => e.stopPropagation()}
                     >

                        {/* Header Area */}
                        <div className="bg-[#f4fcf6] px-8 py-6 border-b border-green-50 shadow-sm relative">
                           <button
                              onClick={() => setIsModalOpen(false)}
                              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1"
                           >
                              <X className="w-5 h-5" />
                           </button>

                           <div className="flex items-center gap-4">
                              <div className="bg-[#bdf3c5] text-[#12ca49] w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner border border-[#12ca49]/10">
                                 <Plus className="w-6 h-6 fill-current text-white" />
                              </div>
                              <div>
                                 <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Add Animal to Herd</h2>
                                 <p className="text-[#64748b] text-sm font-medium mt-0.5">Register a new livestock animal.</p>
                              </div>
                           </div>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleAddAnimal} className="p-8 space-y-6">

                           {/* BAITS Tag Number */}
                           <div className="space-y-2">
                              <label className="block text-[13px] font-bold text-slate-700">BAITS Tag Number *</label>
                              <input
                                 type="text"
                                 required
                                 value={addAnimalForm.tagId}
                                 onChange={(e) => setAddAnimalForm({ ...addAnimalForm, tagId: e.target.value })}
                                 placeholder="e.g., BW-192"
                                 className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-800 text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20"
                              />
                           </div>

                           {/* Animal Name */}
                           <div className="space-y-2">
                              <label className="block text-[13px] font-bold text-slate-700">Animal Name</label>
                              <input
                                 type="text"
                                 value={addAnimalForm.name}
                                 onChange={(e) => setAddAnimalForm({ ...addAnimalForm, name: e.target.value })}
                                 placeholder="e.g., Barnaby, Daisy"
                                 className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-800 text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20"
                              />
                           </div>

                           {/* Species & Gender */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="block text-[13px] font-bold text-slate-700">Species *</label>
                                 <select
                                    required
                                    value={addAnimalForm.species}
                                    onChange={(e) => setAddAnimalForm({ ...addAnimalForm, species: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-800 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20 appearance-none cursor-pointer"
                                 >
                                    <option value="">Select Species</option>
                                    <option value="cattle">Cattle</option>
                                    <option value="goat">Goat</option>
                                    <option value="sheep">Sheep</option>
                                    <option value="pig">Pig</option>
                                    <option value="chicken">Poultry</option>
                                 </select>
                              </div>

                              <div className="space-y-2">
                                 <label className="block text-[13px] font-bold text-slate-700">Gender *</label>
                                 <select
                                    required
                                    value={addAnimalForm.gender}
                                    onChange={(e) => setAddAnimalForm({ ...addAnimalForm, gender: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-800 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20 appearance-none cursor-pointer"
                                 >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                 </select>
                              </div>
                           </div>

                           {/* Breed */}
                           <div className="space-y-2">
                              <label className="block text-[13px] font-bold text-slate-700">Breed</label>
                              <input
                                 type="text"
                                 value={addAnimalForm.breed}
                                 onChange={(e) => setAddAnimalForm({ ...addAnimalForm, breed: e.target.value })}
                                 placeholder="e.g., Brahman Hybrid"
                                 className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-800 text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20"
                              />
                           </div>

                           {/* Birth Date & Acquisition Method */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="block text-[13px] font-bold text-slate-700">Date of Birth</label>
                                 <div className="relative">
                                    <input
                                       type="date"
                                       value={addAnimalForm.birthDate}
                                       onChange={(e) => setAddAnimalForm({ ...addAnimalForm, birthDate: e.target.value })}
                                       className="w-full pl-4 pr-10 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-800 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                       <Calendar className="w-4 h-4 text-slate-400" />
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="block text-[13px] font-bold text-slate-700">How Acquired</label>
                                 <select
                                    value={addAnimalForm.acquisitionMethod}
                                    onChange={(e) => setAddAnimalForm({ ...addAnimalForm, acquisitionMethod: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-800 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20 appearance-none cursor-pointer"
                                 >
                                    <option value="born">Born on Farm</option>
                                    <option value="purchased">Purchased</option>
                                    <option value="gifted">Gifted</option>
                                    <option value="inherited">Inherited</option>
                                 </select>
                              </div>
                           </div>

                        </form>

                        {/* Footer */}
                        <div className="px-8 pb-8 space-y-5">
                           {/* Action Buttons */}
                           <div className="flex gap-4">
                              <button
                                 onClick={() => setIsModalOpen(false)}
                                 className="w-1/3 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-800 font-bold py-4 rounded-xl transition-colors active:scale-95 text-[15px] cursor-pointer"
                              >
                                 Cancel
                              </button>
                              <button 
                                 onClick={handleAddAnimal}
                                 className="flex-1 bg-[#12ca49] hover:bg-[#0fa63b] text-white font-bold py-4 rounded-xl shadow-[0_4px_12px_rgba(18,202,73,0.3)] transition-colors active:scale-95 flex items-center justify-center gap-2 text-[15px] cursor-pointer"
                              >
                                 <Save className="w-5 h-5 fill-current" /> Add Animal
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
{/* Symptom Checker Modal */}
      {showSymptomChecker && (
        <SymptomCheckerComponent onClose={() => setShowSymptomChecker(false)} />
      )}
         <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            data={filteredLivestock}
            title="Herd Records"
            dataType="livestock"
            filename="herd-records"
         />
      </div>
   );
};

export default HerdRecords;

