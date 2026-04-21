
import React, { useState, useEffect } from 'react';
/**
 * FarmerDashboard - Main Farmer Portal
 * 
 * ✅ FUNCTIONAL FEATURES:
 * - Herd statistics and overview
 * - AI Symptom Checker (offline-capable)
 * - Navigation to implemented pages (herd-records, alerts, knowledge-base)
 * - Request Consultation link (points to /telehealth)
 * - Health Checker modal with diagnosis
 * - Critical disease alerts display
 * 
 * ❌ DISABLED/NON-FUNCTIONAL:
 * - Watch Tutorial button - Resource page not implemented (disabled with tooltip)
 * - Market feature - Already marked as "(Offline)" in sidebar
 */
import { 
  Search, Bell, User, LayoutDashboard, PawPrint, Activity, 
  Store, BookOpen, Settings, RefreshCw, AlertTriangle, 
  ArrowUpRight, PlusCircle, Stethoscope, Headphones, 
  ChevronDown, TrendingUp, CheckCircle2, X, Syringe, 
  Banknote, ShieldAlert, FileText, Lock, GraduationCap, Database,
  Camera, UploadCloud, Loader2, Wifi, WifiOff, Info, PhoneCall, Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EducationalTooltip from '../components/dashboard/EducationalTooltip';
import aiService from '../services/aiService';
import Card from '../components/common/Card';
import livestockApi from '../services/livestockApi';



// StatCard Component
const StatCard = ({ title, value, icon, trend, tooltipContent, color = "green", subtitle }) => {
  const colorClasses = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600"
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <Card content={tooltipContent}>
          <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
            {icon}
          </div>
        </Card>
        {trend && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-extrabold text-gray-900">{value}</span>
      </div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};

// Separate SymptomChecker Component
const SymptomCheckerComponent = ({ onClose }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState('Cattle');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
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

  // Simulate local AI model prediction
  const localAIModel = {
    predict: async (symptoms) => {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fmdSymptoms = ['Excessive salivation', 'Blisters on mouth', 'Lameness'];
      const hasFMD = symptoms.some(s => fmdSymptoms.includes(s));
      
      if (hasFMD || symptoms.length >= 3) {
        return {
          disease: 'FMD',
          confidence: 0.92,
          priority: 'critical',
          recommendations: ['Isolate animal', 'Report to DVS', 'Do not move livestock']
        };
      }
      
      return {
        disease: 'Minor Infection',
        confidence: 0.65,
        priority: 'low',
        recommendations: ['Monitor symptoms', 'Rest animal', 'Hydrate']
      };
    }
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
      // Call the real AI service
      const aiResult = await aiService.checkSymptoms(
        selectedSpecies.toLowerCase(),
        selectedSymptoms
      );
      
      // If offline, save result locally
      if (isOffline) {
        await saveToLocalQueue({
          type: 'symptom_check',
          data: aiResult,
          timestamp: new Date()
        });
      }
      
      setDiagnosisResults(aiResult);
      
      // If FMD detected with high confidence, trigger emergency
      if (aiResult.disease === 'FMD' && aiResult.confidence > 0.85) {
        showEmergencyAlert();
        await createConsultationRequest(aiResult);
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
            disabled={isChecking || selectedSymptoms.length === 0}
            className="w-full bg-[#12ca49] hover:bg-[#0ea83d] text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
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

// Main FarmerDashboard Component
const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  
  // Dashboard stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Fetch herd statistics on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const response = await livestockApi.getHerdStats();
        setStats(response.data || response);
      } catch (error) {
        console.error('Failed to fetch herd stats:', error);
        setStatsError(error.message);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3.5 bg-[#eafbf0] text-[#12ca49] font-bold rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/herd-records" className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold rounded-xl transition-colors">
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
          <Link to="/telehealth" className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold rounded-xl transition-colors">
            <GraduationCap className="w-5 h-5" /> Request Consultation
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
          
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-bold rounded-xl transition-colors">
            <Settings className="w-5 h-5" /> Home
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] flex flex-col min-h-screen">
        
        {/* Top Bar */}
        <header className="h-20 bg-[#F8F9FA] flex items-center justify-between px-10 shrink-0 z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Farmer Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back. Here's your farm at a glance.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search livestock or help..." 
                className="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#12ca49] focus:outline-none"
              />
            </div>
            
            <button className="relative text-gray-500 hover:text-gray-700 transition">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#F8F9FA]"></span>
            </button>
            
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-10 pt-4 flex-1 overflow-y-auto w-full max-w-[1400px] mx-auto">
          
          {/* Educational Banner - Collapsible */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 overflow-hidden mb-8">
            <button 
              onClick={() => toggleSection('tutorial')}
              className="w-full flex items-start gap-4 p-5 hover:bg-green-100/50 transition text-left"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-green-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-800 text-lg mb-1">New to Farm-Aid?</h3>
                <p className="text-green-700 text-sm">
                  Quick tutorial and learning resources
                </p>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-green-700 transition-transform flex-shrink-0 ${
                  expandedSections.tutorial ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedSections.tutorial && (
              <div className="border-t border-green-200 p-5 bg-white/50">
                <p className="text-green-700 text-sm mb-4">
                  Watch our 5-minute video tutorial to learn how to manage your herd, check symptoms, and consult veterinarians.
                </p>
                <button 
                  disabled
                  title="Tutorial resource not yet available"
                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed opacity-50"
                >
                  Watch Tutorial → 
                </button>
              </div>
            )}
          </div>
          
          {/* Alert Banner */}
          <div className="bg-[#fef2f2] border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-start gap-4 mb-8">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-700 font-bold text-base mb-1">Critical Disease Outbreak Alert</h3>
              <p className="text-red-600/90 text-sm">FMD (Foot and Mouth Disease) warning issued for Kweneng District. Restrict movement of livestock immediately.</p>
            </div>
            <button onClick={() => navigate('/alerts')} className="text-red-700 font-bold text-sm underline shrink-0 mt-0.5 hover:text-red-800 transition">
              View Map
            </button>
          </div>

          {/* Herd Stats Card - Expandable */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <button 
              onClick={() => toggleSection('herdStats')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Herd Statistics</h3>
                  <p className="text-xs text-gray-500">Livestock counts by species</p>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSections.herdStats ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {
              <div className="border-t border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {statsLoading ? (
                  <div className="col-span-4 flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading statistics...</span>
                  </div>
                ) : statsError ? (
                  <div className="col-span-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <span>Error loading statistics: {statsError}</span>
                  </div>
                ) : stats ? (
                  <>
                    <StatCard 
                      title="Total Livestock" 
                      value={stats.total?.toString() || "0"} 
                      icon={<Database className="w-5 h-5" />}
                      trend={stats.recentAdditions > 0 ? `+${stats.recentAdditions} this month` : "No recent additions"}
                      tooltipContent="All livestock on your farm"
                      color="green"
                    />
                    <StatCard 
                      title="Cattle" 
                      value={(stats.bySpecies?.find(s => s.species === 'cattle')?.count || 0).toString()}
                      icon={<div className="text-xl">🐄</div>}
                      tooltipContent="Cattle count"
                      color="blue"
                    />
                    <StatCard 
                      title="Sheep" 
                      value={(stats.bySpecies?.find(s => s.species === 'sheep')?.count || 0).toString()}
                      icon={<div className="text-xl">🐑</div>}
                      tooltipContent="Sheep count"
                      color="orange"
                    />
                    <StatCard 
                      title="Goats" 
                      value={(stats.bySpecies?.find(s => s.species === 'goat')?.count || 0).toString()}
                      icon={<div className="text-xl">🐐</div>}
                      tooltipContent="Goats count"
                      color="purple"
                    />
                  </>
                ) : (
                  <div className="col-span-4 text-center py-8 text-gray-500">
                    No livestock data available
                  </div>
                )}
              </div>
            }
          </div>

          {/* BAITS Compliance Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <button 
              onClick={() => toggleSection('baits')}
              className="w-full h-1.5 bg-[#12ca49] hover:bg-[#0fa838] transition"
              aria-label="Toggle BAITS details"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-gray-900 text-lg">BAITS Compliance Status</h3>
                <span className="bg-[#e4f9e8] text-[#12ca49] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Compliant</span>
              </div>
              {expandedSections.baits && (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Your herd registration and movement records are up to date for the current quarter. 
                    BAITS compliance ensures you can legally move and sell your livestock.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => navigate('/compliance')} className="bg-[#f4f6f8] hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-lg text-sm transition-colors">
                      View Certificate
                    </button>
                    <button onClick={() => navigate('/learn/baits')} className="text-[#12ca49] font-bold text-sm hover:underline transition">
                      Learn about BAITS →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Tips Section - Collapsible */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 overflow-hidden mb-8">
            <button 
              onClick={() => toggleSection('tips')}
              className="w-full flex items-start gap-3 p-5 hover:bg-blue-100/50 transition text-left"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-800 text-sm">Quick Tip: Offline Mode</h4>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-blue-600 transition-transform flex-shrink-0 ${
                  expandedSections.tips ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedSections.tips && (
              <div className="border-t border-blue-200 p-5 bg-white/50">
                <p className="text-sm text-blue-700 mb-3">
                  The AI symptom checker works completely offline! You can diagnose diseases even in areas with no internet connection. All your data is saved locally and syncs automatically when you're back online.
                </p>
                <button onClick={() => navigate('/learn/offline')} className="text-blue-600 text-sm font-semibold hover:underline transition">
                  Learn More →
                </button>
              </div>
            )}
          </div>

          {/* Recent Activities and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities - Collapsible */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <button 
                onClick={() => toggleSection('activities')}
                className="w-full p-6 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSections.activities ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {expandedSections.activities && (
                <div className="p-6 space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="w-5 h-5 text-[#12ca49]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-0.5">Herd Vaccination Completed</h4>
                      <p className="text-sm text-gray-500 mb-1">FMD routine booster administered to 45 adult cattle.</p>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Today, 10:30 AM</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Stethoscope className="w-5 h-5 text-[#ea580c]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-0.5">Reported Sick Animal</h4>
                      <p className="text-sm text-gray-500 mb-1">Tag #BW-192 showing signs of mild lameness. AI triage launched.</p>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Yesterday, 3:15 PM</span>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={() => navigate('/activity-log')} className="w-full px-6 py-3 text-sm font-bold text-[#12ca49] hover:bg-gray-50 border-t border-gray-100 transition">
                View All Activities
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/herd-records')}
                  className="h-24 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition"
                >
                  <PlusCircle className="w-6 h-6 text-gray-500" />
                  <span className="font-bold text-sm text-gray-700">Add Animal</span>
                </button>
                <button 
                  onClick={() => navigate('/herd-records')}
                  className="h-24 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition"
                >
                  <Activity className="w-6 h-6 text-gray-500" />
                  <span className="font-bold text-sm text-gray-700">Log Health</span>
                </button>
                <button 
                  onClick={() => setShowSymptomChecker(true)}
                  className="h-24 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition"
                >
                  <Stethoscope className="w-6 h-6 text-gray-500" />
                  <span className="font-bold text-sm text-gray-700">Check Symptom</span>
                </button>
                <button 
                  onClick={() => navigate('/knowledge-base')}
                  className="h-24 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition"
                >
                  <BookOpen className="w-6 h-6 text-gray-500" />
                  <span className="font-bold text-sm text-gray-700">Knowledge Base</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Symptom Checker Modal */}
      {showSymptomChecker && (
        <SymptomCheckerComponent onClose={() => setShowSymptomChecker(false)} />
      )}

      {/* Sync Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a5553]/60 backdrop-blur-[3px]">
          <div className="absolute top-6 right-8 bg-white rounded-xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.15)] flex items-center gap-4 p-4 pr-6 border border-slate-100">
             <div className="w-10 h-10 bg-[#12ca49] rounded-full flex items-center justify-center text-white shrink-0 shadow-[0_2px_10px_rgba(18,202,73,0.3)]">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
                <h4 className="font-extrabold text-gray-900 text-[15px]">Synchronisation Complete!</h4>
                <p className="text-slate-500 font-medium text-[13px] mt-0.5">12 records updated successfully.</p>
             </div>
             <button onClick={() => setIsSyncModalOpen(false)} className="ml-4 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;