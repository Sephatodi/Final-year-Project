import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, Camera, UploadCloud, Send, User, ShieldCheck, 
  Clock, CheckCircle2, AlertTriangle, ChevronRight, Plus, Search,
  Phone, Video, FileText, MapPin, Tractor, Activity, Loader2,
  Wifi, WifiOff, Info, Download, Calendar, Filter, LogOut, Edit2, ArrowLeft, Bell
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';
import consultationApi from '../services/consultationApi';
import livestockApi from '../services/livestockApi';
import NotificationsModal from '../components/telehealth/NotificationsModal';
import io from 'socket.io-client';

const IntegratedTelehealth = () => {
  // Get current user from auth context
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isVeterinarian = user?.role === 'veterinarian' || user?.role === 'vet';
  const isFarmer = user?.role === 'farmer';
  console.log("role",user?.role);
  
  // Determine dashboard route based on user role
  const getDashboardRoute = () => {
    return isVeterinarian ? '/vet-dashboard' : '/dashboard';
  };
  
  // State management
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [pendingMessages, setPendingMessages] = useState([]);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Socket connection for real-time
  const socket = useRef(null);
  
  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Diagnosis Form State (for veterinarian)
  const [diagnosisForm, setDiagnosisForm] = useState({
    clinicalDiagnosis: '',
    confidenceLevel: 85,
    treatmentInstructions: '',
    followUpDate: '',
    notifiable: false
  });
  
  // Create consultation form state (for farmer)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [livestock, setLivestock] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [newConsultationForm, setNewConsultationForm] = useState({
    livestockIds: [],
    subject: '',
    description: '',
    symptoms: [],
    priority: 'normal'
  });
  const [submittedConsultationId, setSubmittedConsultationId] = useState(null);
  
  // Notifications Modal State
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Fetch consultations from database
  useEffect(() => {
    fetchLivestock();
    fetchConsultations();
    
    
    
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [isFarmer, user?.id]);
  
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await consultationApi.getConsultations();
      setConsultations(response.consultations || []);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchLivestock = async () => {
    try {
      console.log('Fetching livestock... isFarmer:', isFarmer);
      if (isFarmer) {
        const livestockList = await livestockApi.getLivestock();
        console.log('Successfully fetched livestock:', livestockList);
        setLivestock(livestockList || []);
      } else {
        console.log('User is not a farmer, skipping livestock fetch');
      }
    } catch (err) {
      console.error('Error fetching livestock:', err);
    }
  };
  
  const fetchMessages = async (consultationId) => {
    try {
      const response = await consultationApi.getMessages(consultationId);
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Debug: Log when isFarmer or user changes
  useEffect(() => {
    console.log('User role changed - isFarmer:', isFarmer, 'user.id:', user?.id, 'user.role:', user?.role);
  }, [user?.id, user?.role]);
  
  // When consultation is selected, fetch its messages
  useEffect(() => {
    if (activeConsultation?.id) {
      fetchMessages(activeConsultation.id);
      console.log('Active consultation changed to:',  activeConsultation.name || activeConsultation.subject || activeConsultation.description || activeConsultation.id);  
      console.log(messages.length, 'messages loaded for consultation ID:', activeConsultation.id);
    }
  }, [activeConsultation]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncPendingMessages();
    };
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Initialize WebSocket connection
  useEffect(() => {
    if (!isOffline) {
      socket.current = io(process.env.REACT_APP_SOCKET_URL, {
        auth: { token: localStorage.getItem('token') }
      });
      
      socket.current.on('new-message', handleNewMessage);
      socket.current.on('consultation-assigned', handleConsultationAssigned);
      socket.current.on('treatment-plan', handleTreatmentPlan);
      
      return () => socket.current.disconnect();
    }
  }, [isOffline]);
  
  // Sync pending messages when back online
  const syncPendingMessages = async () => {
    for (const msg of pendingMessages) {
      await sendMessageToServer(msg);
    }
    setPendingMessages([]);
  };
  
  // Handle AI symptom analysis
  const analyzeSymptoms = async (species, symptoms, photos = []) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result = {
      possibleDiseases: [
        { name: "Foot and Mouth Disease", confidence: 89, priority: "critical", notifiable: true },
        { name: "Lumpy Skin Disease", confidence: 45, priority: "medium", notifiable: true }
      ],
      recommendations: [
        "Isolate affected animals immediately",
        "Do not move livestock",
        "Contact veterinary services within 24 hours"
      ]
    };
    
    setAiAnalysis(result);
    setIsAnalyzing(false);
    return result;
  };
  
  // Send message (works offline)
  const sendMessage = async (message) => {
    if (!message.trim() || !activeConsultation) return;
    
    const messageObj = {
      id: Date.now(),
      sender: user?.id,
      senderName: user?.name,
      senderRole: user?.role,
      text: message,
      timestamp: new Date().toISOString(),
      consultationId: activeConsultation?.id
    };
    
    if (isOffline) {
      // Store in local queue
      setPendingMessages(prev => [...prev, messageObj]);
      // Show offline indicator
      alert("Message saved offline. Will send when connection restored.");
    } else {
      try {
        await consultationApi.sendMessage(activeConsultation.id, message);
      } catch (err) {
        console.error('Error sending message:', err);
        alert('Failed to send message. Please try again.');
        return;
      }
    }
    
    setMessages(prev => [...prev, messageObj]);
    setInputText('');
  };
  
  const sendMessageToServer = async (message) => {
    socket.current.emit('send-message', message);
  };
  
  // Handle incoming messages
  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    // Play notification sound
    new Audio('/notification.mp3').play();
  };

  const handleConsultationAssigned = (data) => {
    // Refresh consultations when a new one is assigned
    console.log('Consultation assigned:', data);
    fetchConsultations();
    // Play notification sound
    new Audio('/notification.mp3').play();
  };

  const handleTreatmentPlan = (plan) => {
    // Handle incoming treatment plan
    console.log('Treatment plan received:', plan);
    // You can update state here if needed
    // Play notification sound
    new Audio('/notification.mp3').play();
  };
  
  // Create new consultation (farmer only)
  const handleCreateConsultation = async () => {
    if (selectedAnimals.length === 0 || !newConsultationForm.subject) {
      alert('Please select at least one animal and provide a subject');
      return;
    }
    
    try {
      const payload = {
        livestockIds: selectedAnimals,
        subject: newConsultationForm.subject,
        description: newConsultationForm.description,
        symptoms: newConsultationForm.symptoms || [],
        priority: newConsultationForm.priority || 'normal'
      };
      console.log('Submitting consultation payload:', payload);
      const response = await consultationApi.createConsultation(payload);
      console.log('Consultation created successfully:', response);
      alert('Consultation request submitted successfully!');
      setSubmittedConsultationId(response.consultationId || response.consultations?.[0]?.id || true);
      setShowCreateForm(false);
      setSelectedAnimals([]);
      setNewConsultationForm({
        livestockIds: [],
        subject: '',
        description: '',
        symptoms: [],
        priority: 'normal'
      });
      // Refresh consultations list
      fetchConsultations();
    } catch (err) {
      console.error('Error creating consultation:', err);
      alert('Failed to create consultation: ' + err.message);
    }
  };

  // Toggle animal selection
  const toggleAnimalSelection = (animalId) => {
    setSelectedAnimals(prev =>
      prev.includes(animalId)
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId]
    );
  };
  
  // Accept consultation (veterinarian only)
  const handleAcceptConsultation = async (consultationId) => {
    try {
      await consultationApi.acceptConsultation(consultationId);
      // Refresh consultations list
      fetchConsultations();
      alert('Consultation accepted!');
    } catch (err) {
      console.error('Error accepting consultation:', err);
      alert('Failed to accept consultation: ' + err.message);
    }
  };
  
  // Submit diagnosis (veterinarian only)
  const submitDiagnosis = async () => {
    if (!diagnosisForm.clinicalDiagnosis) {
      alert('Please enter a clinical diagnosis');
      return;
    }
    
    try {
      await consultationApi.submitDiagnosis(activeConsultation.id, {
        ...diagnosisForm,
        submittedAt: new Date().toISOString(),
        status: 'completed'
      });
      
      alert('Diagnosis submitted successfully!');
      // Refresh consultations
      fetchConsultations();
      
      // Reset form
      setDiagnosisForm({
        clinicalDiagnosis: '',
        confidenceLevel: 85,
        treatmentInstructions: '',
        followUpDate: '',
        notifiable: false
      });
    } catch (err) {
      console.error('Error submitting diagnosis:', err);
      alert('Failed to submit diagnosis: ' + err.message);
    }
  };
  
  // Start video call
  const startVideoCall = () => {
    setIsVideoCallActive(true);
  };
  
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar 
        title="Integrated Telehealth" 
        subtitle="Video consultation & diagnosis" 
        showBack={true}
        backTo="/vet-dashboard"
      />
      
      <div className="flex flex-1 mt-6">
      
      {/* Sidebar - Active Consultations / Request Section */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-lg">
                {isVeterinarian ? 'Pending Consultations' : 'My Consultations'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isVeterinarian ? `${consultations.filter(c => c.status === 'pending').length} urgent cases` : 'Request veterinary support'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowNotificationsModal(true)}
                className="bg-yellow-100 text-yellow-600 p-2 rounded-lg hover:bg-yellow-200 transition relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {isFarmer && (
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-[#ea580c] text-white p-2 rounded-lg hover:bg-orange-600 transition"
                  title="Request new consultation"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => navigate(getDashboardRoute())}
                className="bg-gray-200 text-gray-600 p-2 rounded-lg hover:bg-gray-300 transition"
                title="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchConsultations}
              className="text-xs text-red-600 hover:text-red-700 mt-2 font-semibold"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Farmer creating new consultation form */}
        {isFarmer && showCreateForm && (
          <div className="p-4 border-b border-gray-100 bg-orange-50 space-y-3">
            <h3 className="font-bold text-gray-900">Request Consultation</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Select Animals (Multiple)</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-white max-h-48 overflow-y-auto space-y-2">
                {livestock.length === 0 ? (
                  <p className="text-xs text-gray-500">No livestock available</p>
                ) : (
                  livestock.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`animal-${item.id}`}
                        checked={selectedAnimals.includes(item.id)}
                        onChange={() => toggleAnimalSelection(item.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <label
                        htmlFor={`animal-${item.id}`}
                        className="text-sm text-gray-700 cursor-pointer flex-1"
                      >
                        {item.tagId || item.name} ({item.species})
                      </label>
                    </div>
                  ))
                )}
              </div>
              {selectedAnimals.length > 0 && (
                <p className="text-xs text-orange-600 font-semibold">{selectedAnimals.length} animal(s) selected</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">What is wrong with those animals?</label>
              <textarea
                value={newConsultationForm.description}
                onChange={(e) => setNewConsultationForm({...newConsultationForm, description: e.target.value})}
                placeholder="Describe the issue or symptoms..."
                className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none h-24"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Subject/Title</label>
              <input
                type="text"
                value={newConsultationForm.subject}
                onChange={(e) => setNewConsultationForm({...newConsultationForm, subject: e.target.value})}
                placeholder="Brief subject for the consultation..."
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Priority</label>
              <select
                value={newConsultationForm.priority}
                onChange={(e) => setNewConsultationForm({...newConsultationForm, priority: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCreateConsultation}
                className="flex-1 bg-[#ea580c] text-white py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 transition"
              >
                Request
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold text-sm hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Consultations list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {consultations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No consultations yet</p>
            </div>
          ) : (
            consultations.map(consult => (
              <div 
                key={consult.id}
                onClick={() => setActiveConsultation(consult)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  activeConsultation?.id === consult.id 
                    ? 'bg-orange-50 border-2 border-orange-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">
                    {isFarmer ? 'Your Request' : consult.farmer?.name || 'Unknown'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    consult.priority === 'emergency' ? 'bg-red-500 text-white' :
                    consult.priority === 'high' ? 'bg-orange-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {consult.priority?.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 truncate mb-2">
                  {consult.subject || consult.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    consult.status === 'completed' ? 'bg-green-100 text-green-700' :
                    consult.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {consult.status?.replace('_', ' ').toUpperCase()}
                  </span>
                  
                  {/* Accept button for veterinarians */}
                  {isVeterinarian && consult.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptConsultation(consult.id);
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 font-semibold"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Offline Status Indicator */}
        {isOffline && (
          <div className="p-4 bg-amber-50 border-t border-amber-100">
            <div className="flex items-center gap-2 text-amber-700">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">Offline Mode - Messages queued</span>
            </div>
            {pendingMessages.length > 0 && (
              <p className="text-xs text-amber-600 mt-1">{pendingMessages.length} messages pending sync</p>
            )}
          </div>
        )}
      </aside>
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        
        {/* Chat Header */}
        {activeConsultation && (
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {isFarmer ? 'Veterinarian Support' : activeConsultation.farmer?.name || 'Farmer'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeConsultation.subject}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={startVideoCall}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="Start video call"
                >
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100" title="Phone call">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100" title="View details">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Consultation status and info */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Status: <span className="font-bold capitalize">{activeConsultation.status?.replace('_', ' ')}</span></span>
                <span className="text-gray-600">Priority: <span className="font-bold capitalize">{activeConsultation.priority}</span></span>
              </div>
            </div>
          </div>
        )}
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-center">No messages yet. Start the consultation to communicate.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUserMessage = msg.sender === user?.id;
              const isVetMessage = msg.sender?.role === 'veterinarian' || msg.sender?.role === 'vet';
              
              return (
                <div key={msg.id} className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-xl ${
                    isCurrentUserMessage
                      ? 'bg-[#ea580c] text-white' 
                      : isVetMessage
                      ? 'bg-blue-100 text-gray-900'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    <p className="text-xs font-bold mb-1 opacity-75">{msg.sender?.name || 'User'}</p>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <span className={`text-xs mt-1 block ${isCurrentUserMessage ? 'opacity-70' : 'opacity-60'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }} className="flex gap-3">
            <button type="button" className="p-2 rounded-lg hover:bg-gray-100">
              <Camera className="w-5 h-5 text-gray-500" />
            </button>
            <button type="button" className="p-2 rounded-lg hover:bg-gray-100">
              <UploadCloud className="w-5 h-5 text-gray-500" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isFarmer ? "Describe your concern..." : "Provide guidance to farmer..."}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button type="submit" className="px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-orange-600">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
        
        {/* Diagnosis Form (veterinarian only) - Shown below messages */}
        {isVeterinarian && activeConsultation && activeConsultation.status !== 'completed' && (
          <div className="p-6 bg-white border-t border-gray-200 max-h-80 overflow-y-auto">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5 text-[#ea580c]" />
              Diagnosis & Treatment Plan
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700 uppercase">Clinical Diagnosis</label>
                <input
                  type="text"
                  value={diagnosisForm.clinicalDiagnosis}
                  onChange={(e) => setDiagnosisForm({...diagnosisForm, clinicalDiagnosis: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                  placeholder="Disease name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700 uppercase">Confidence</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={diagnosisForm.confidenceLevel}
                    onChange={(e) => setDiagnosisForm({...diagnosisForm, confidenceLevel: parseInt(e.target.value)})}
                    className="flex-1 h-2 bg-gray-200 rounded-lg"
                  />
                  <span className="font-bold text-[#ea580c] text-sm w-10 text-right">{diagnosisForm.confidenceLevel}%</span>
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-2 text-gray-700 uppercase">Treatment</label>
                <textarea
                  rows="2"
                  value={diagnosisForm.treatmentInstructions}
                  onChange={(e) => setDiagnosisForm({...diagnosisForm, treatmentInstructions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none text-sm"
                  placeholder="Treatment instructions..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700 uppercase">Follow-up</label>
                <input
                  type="date"
                  value={diagnosisForm.followUpDate}
                  onChange={(e) => setDiagnosisForm({...diagnosisForm, followUpDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                />
              </div>
              
              <label className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200 h-fit">
                <input
                  type="checkbox"
                  checked={diagnosisForm.notifiable}
                  onChange={(e) => setDiagnosisForm({...diagnosisForm, notifiable: e.target.checked})}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-yellow-900">Notifiable</span>
              </label>
              
              <button
                onClick={submitDiagnosis}
                className="col-span-2 bg-[#ea580c] text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Diagnosis
              </button>
            </div>
          </div>
        )}
        
      </main>
      
      {/* Video Call Modal */}
      {isVideoCallActive && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden">
            <div className="p-4 bg-gray-800 flex items-center justify-between">
              <h3 className="text-white font-bold">Video Consultation</h3>
              <button onClick={() => setIsVideoCallActive(false)} className="text-white">✕</button>
            </div>
            <div className="aspect-video bg-gray-950 flex items-center justify-center">
              <p className="text-gray-500">Video feed placeholder</p>
            </div>
            <div className="p-4 bg-gray-800 flex items-center justify-center gap-4">
              <button className="p-3 bg-red-600 rounded-full text-white">End Call</button>
              <button className="p-3 bg-gray-700 rounded-full text-white">Mute</button>
              <button className="p-3 bg-gray-700 rounded-full text-white">Camera</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        userRole={user?.role}
      />
      
      </div>
    </div>
  );
};

export default IntegratedTelehealth;