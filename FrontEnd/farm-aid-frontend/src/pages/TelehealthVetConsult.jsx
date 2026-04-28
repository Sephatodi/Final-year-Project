// TelehealthVetConsult.jsx - Complete Vet Consultation Interface
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Shield, Search, Bell, MapPin, CheckCircle2, ChevronRight, 
  Filter, Upload, MessageSquare, AlertTriangle, Calendar, FileText,
  Send, Image, Camera, X, Phone, Video, Clock, Mic, Paperclip,
  Download, Printer, Share2, Users, PlusCircle, MinusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

// Mock API service
const api = {
  post: async (endpoint, data) => {
    console.log(`API POST ${endpoint}:`, data);
    return { data: { id: Date.now(), ...data } };
  }
};

// WebSocket hook
const useWebSocket = (url, onMessage) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Mock WebSocket for demo - in production, connect to real WS
    const mockSocket = {
      send: (data) => console.log('WebSocket send:', data),
      close: () => console.log('WebSocket closed')
    };
    
    setIsConnected(true);
    setSocket(mockSocket);
    
    // Simulate receiving messages
    const interval = setInterval(() => {
      if (onMessage && Math.random() > 0.7) {
        onMessage({
          type: 'typing',
          data: { farmerName: 'John Doe', isTyping: true }
        });
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { socket, isConnected, sendMessage: (data) => socket?.send(data) };
};

const TelehealthVetConsult = () => {
  // State for consultation data
  const [consultation, setConsultation] = useState({
    id: 'C-9921',
    farmer: {
      name: 'John Doe',
      farm: 'Green Valley Farm',
      location: 'Somerset, UK',
      avatar: 'https://i.pravatar.cc/100?img=33',
      phone: '+44 1234 567890',
      email: 'john.doe@greenvalley.com'
    },
    animal: {
      name: 'Barnaby',
      tagId: '#UK-742-109',
      species: 'Bovine',
      age: '4.2 years',
      breed: 'Holstein',
      gender: 'Male',
      weight: '680 kg'
    },
    aiDiagnosis: {
      disease: 'Foot and Mouth Disease',
      confidence: 0.92,
      symptoms: ['Lesions on mouth', 'Drooling', 'Fever', 'Lameness']
    },
    farmerLocation: 'Somerset, UK',
    status: 'active',
    priority: 'critical'
  });
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 'farmer',
      senderName: 'John Doe',
      content: "Barnaby hasn't been eating properly for 2 days. I noticed some drooling this morning.",
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      type: 'text'
    },
    {
      id: 2,
      senderId: 'vet',
      senderName: 'Dr. Kagiso',
      content: "Thank you, John. The AI has flagged some suspicious lesions on the mouth photos you sent. We need to act quickly.",
      timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
      type: 'text'
    },
    {
      id: 3,
      senderId: 'farmer',
      senderName: 'John Doe',
      content: "What should I do immediately? Should I separate him from the herd?",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      type: 'text'
    },
    {
      id: 4,
      senderId: 'vet',
      senderName: 'Dr. Kagiso',
      content: "Yes, immediate isolation is crucial. Also, please avoid moving any livestock off your farm until we confirm the diagnosis.",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      type: 'text'
    }
  ]);
  
  const [images, setImages] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=300&fit=crop',
      title: 'Upper Gum Lesions (AI Highlighted)',
      aiDetected: true,
      type: 'lesion'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1516467508483-721b4f0e5f6a?w=400&h=300&fit=crop',
      title: 'Hoof Condition Analysis',
      aiDetected: false,
      type: 'hoof'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [diagnosis, setDiagnosis] = useState({
    disease: 'Suspected Foot and Mouth Disease',
    confidence: 92,
    treatment: 'Immediate isolation from herd. Sanitize all contact points. Restricted movement order for the farm pending lab results. Monitor hydration and temperature daily.',
    followUp: '2024-05-15',
    isNotifiable: true,
    medications: [
      { name: 'Antibiotics', dosage: '10ml per 100kg', duration: '5 days' }
    ]
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // WebSocket connection
  const { isConnected, sendMessage } = useWebSocket('wss://api.farmaid.bw/ws', (data) => {
    if (data.type === 'message') {
      setMessages(prev => [...prev, data.data]);
    } else if (data.type === 'typing') {
      setIsTyping(data.data.isTyping);
    }
  });
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending text message
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    const message = {
      id: Date.now(),
      senderId: 'vet',
      senderName: 'Dr. Kagiso',
      content: text,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    // Send via WebSocket for real-time delivery
    if (sendMessage) {
      sendMessage(JSON.stringify({
        type: 'message',
        data: message
      }));
    }
    
    // Store in database (mock)
    await api.post(`/consultations/${consultation.id}/messages`, message);
    
    // Update local state
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate farmer typing response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const autoResponse = {
          id: Date.now() + 1,
          senderId: 'farmer',
          senderName: consultation.farmer.name,
          content: "Thank you doctor, I'll follow these instructions immediately.",
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        setMessages(prev => [...prev, autoResponse]);
      }, 3000);
    }, 1000);
  };
  
  // Handle image upload
  const handleSendImage = async (imageFile) => {
    // In production, upload to server
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('consultationId', consultation.id);
    
    // Mock upload response
    const response = await api.post('/consultations/upload-image', formData);
    
    // Add to images gallery
    const newImage = {
      id: Date.now(),
      url: URL.createObjectURL(imageFile),
      title: 'New Upload',
      aiDetected: false,
      type: 'upload'
    };
    setImages(prev => [...prev, newImage]);
    
    // Send image message
    await handleSendMessage(`📷 Uploaded new image: ${imageFile.name}`);
    setShowImageUpload(false);
  };
  
  // Handle diagnosis submission
  const handleDiagnosisSubmit = async () => {
    const diagnosisData = {
      consultationId: consultation.id,
      disease: diagnosis.disease,
      confidence: diagnosis.confidence / 100,
      treatment: diagnosis.treatment,
      followUp: diagnosis.followUp,
      isNotifiable: diagnosis.isNotifiable,
      medications: diagnosis.medications
    };
    
    // Submit final diagnosis
    await api.post(`/consultations/${consultation.id}/diagnosis`, diagnosisData);
    
    // If notifiable disease, auto-report to DVS
    if (diagnosis.isNotifiable) {
      await api.post('/disease-reports', {
        consultationId: consultation.id,
        disease: diagnosis.disease,
        location: consultation.farmerLocation,
        ...diagnosisData
      });
    }
    
    // Mark consultation as resolved
    setConsultation(prev => ({ ...prev, status: 'resolved' }));
    
    // Show success message
    alert('Diagnosis submitted successfully! Report has been sent to DVS.');
  };
  
  // Handle file input change
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleSendImage(file);
    }
  };
  
  // Toggle voice recording (mock)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage("[Voice Message] Isolate the animal immediately and contact local veterinary services.");
      }, 3000);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-gray-800">
      
      {/* Navbar */}
      <Navbar 
        title="Veterinary Telehealth" 
        subtitle="Consultation & Diagnosis" 
        showBack={true}
        backTo="/vet-dashboard"
      />

      {/* Main Content Area - 3 Column Layout */}
      <main className="flex-1 overflow-hidden grid grid-cols-12 gap-6 p-6">
        
        {/* Left Column: Context (Farmer & Animal) */}
        <div className="col-span-3 overflow-y-auto space-y-6 pr-2">
          
          {/* Farmer Info */}
          <section>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Farmer Information</h3>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 mt-1">
                <img src={consultation.farmer.avatar} alt="Farmer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg">{consultation.farmer.name}</h4>
                <p className="font-bold text-[#ea580c] text-xs mb-1">{consultation.farmer.farm}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {consultation.farmer.location}
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Call
                  </button>
                  <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Video className="w-3 h-3" /> Video
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Animal Record */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Animal Record</h3>
              <span className="bg-orange-50 text-[#ea580c] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-orange-100">
                {consultation.status === 'active' ? 'Live Case' : 'Resolved'}
              </span>
            </div>
            
            <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-2xl tracking-tight">{consultation.animal.name}</h4>
                  <p className="text-gray-500 text-xs mt-1">Tag ID: {consultation.animal.tagId}</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-[#ea580c]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3"/>
                    <circle cx="8" cy="14" r="2"/>
                    <circle cx="12" cy="10" r="2"/>
                    <circle cx="16" cy="14" r="2"/>
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Species</p>
                  <p className="text-sm font-semibold text-gray-800">{consultation.animal.species}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Age</p>
                  <p className="text-sm font-semibold text-gray-800">{consultation.animal.age}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Breed</p>
                  <p className="text-sm font-semibold text-gray-800">{consultation.animal.breed}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Gender</p>
                  <p className="text-sm font-semibold text-gray-800">{consultation.animal.gender}</p>
                </div>
              </div>
              
              {/* AI Diagnosis Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">AI Analysis</p>
                  <p className="text-sm font-bold text-orange-900">{consultation.aiDiagnosis.disease}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-orange-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600 rounded-full" style={{ width: `${consultation.aiDiagnosis.confidence * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-orange-900">{Math.round(consultation.aiDiagnosis.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* History Timeline */}
          <section>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">History Timeline</h3>
            
            <div className="relative pl-3 space-y-6">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200 -z-10"></div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 z-10">
                  <Shield className="w-4 h-4 text-blue-500" />
                </div>
                <div className="pt-1.5">
                  <h5 className="font-bold text-gray-800 text-sm leading-none">Vaccination</h5>
                  <p className="text-xs text-gray-500 mt-1">Jan 2024 • Foot & Mouth</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0 z-10">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="pt-1.5">
                  <h5 className="font-bold text-gray-800 text-sm leading-none">Routine Checkup</h5>
                  <p className="text-xs text-gray-500 mt-1">Nov 2023 • Stable health</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 z-10">
                  <FileText className="w-4 h-4 text-amber-500" />
                </div>
                <div className="pt-1.5">
                  <h5 className="font-bold text-gray-800 text-sm leading-none">Last Consultation</h5>
                  <p className="text-xs text-gray-500 mt-1">Aug 2023 • Minor lameness</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Middle Column: Chat & Diagnostics */}
        <div className="col-span-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          
          <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-[#ea580c] p-1 rounded-sm">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Diagnostic Assets
            </h2>
            <div className="flex gap-2">
              <button className="border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter AI
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#ea580c] text-white hover:bg-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Upload New
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>

          {/* Images Gallery */}
          <div className="p-5 flex gap-4 overflow-x-auto border-b border-gray-100 bg-gray-50/50 shrink-0">
            {images.map((img) => (
              <div key={img.id} className="w-1/2 flex flex-col shrink-0 relative group">
                <div className={`relative rounded-xl overflow-hidden aspect-[4/3] ${img.aiDetected ? 'bg-orange-900 border-2 border-orange-200' : 'bg-stone-800 border-2 border-gray-200'} shadow-sm`}>
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  {img.aiDetected && (
                    <div className="absolute top-3 left-3 bg-[#ea580c] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <AlertTriangle className="w-3 h-3" /> AI DETECTED: LESION
                    </div>
                  )}
                  {!img.aiDetected && img.type === 'hoof' && (
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-[#ea580c] rounded-full"></div>
                  )}
                  {img.type === 'upload' && (
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      New Upload
                    </div>
                  )}
                </div>
                <div className={`text-center py-2 text-xs font-bold rounded-b-xl border-x border-b ${img.aiDetected ? 'bg-orange-50 text-orange-900 border-orange-100' : 'bg-white text-gray-700 border-gray-200'}`}>
                  {img.title}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 bg-white relative flex flex-col gap-4">
            <div className="text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white pr-2">
                <div className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1 relative -top-0.5"></div> 
                Consultation Chat
              </span>
              <span className="absolute top-5 right-5 text-[10px] text-gray-400 font-bold">
                Session ID: #{consultation.id}
              </span>
            </div>
            
            {/* Messages */}
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.senderId === 'vet' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.senderId !== 'vet' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-2">
                    <img src={consultation.farmer.avatar} alt={msg.senderName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`max-w-[70%] ${msg.senderId === 'vet' ? 'bg-[#ea580c] text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl p-3 ${msg.senderId === 'vet' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                  <p className="text-[10px] font-bold mb-1 opacity-75">{msg.senderName}</p>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-[9px] mt-1 opacity-50">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.senderId === 'vet' && (
                  <div className="w-8 h-8 rounded-full bg-teal-100 overflow-hidden shrink-0 mt-2">
                    <img src="https://i.pravatar.cc/100?img=11" alt="You" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  <img src={consultation.farmer.avatar} alt="Farmer" className="w-full h-full object-cover" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-3 rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-100 shrink-0">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
              >
                <Image className="w-5 h-5" />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleRecording}
                className={`p-2 transition rounded-lg hover:bg-gray-100 ${isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
                  placeholder={isRecording ? "Recording voice message..." : "Type instructions or advice..."}
                  disabled={isRecording}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea580c] disabled:opacity-50"
                />
                <button 
                  onClick={() => handleSendMessage(newMessage)}
                  disabled={!newMessage.trim() || isRecording}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ea580c] hover:text-orange-600 transition p-1 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Quick Reply Suggestions */}
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => handleSendMessage("Please send photos of the affected areas.")}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                Request photos
              </button>
              <button 
                onClick={() => handleSendMessage("Isolate the animal immediately.")}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                Isolation instructions
              </button>
              <button 
                onClick={() => handleSendMessage("I'm prescribing medication. Details below.")}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                Prescription
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnosis Form */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-y-auto">
          <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
            <div className="text-[#ea580c]"><FileText className="w-5 h-5" /></div>
            Diagnosis Form
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Clinical Diagnosis</label>
              <input 
                type="text" 
                value={diagnosis.disease}
                onChange={(e) => setDiagnosis({ ...diagnosis, disease: e.target.value })}
                className="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-lg p-3 text-sm font-medium text-gray-900" 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-gray-700">Confidence Level</label>
                <span className="text-[#ea580c] font-bold text-sm">{diagnosis.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={diagnosis.confidence}
                  onChange={(e) => setDiagnosis({ ...diagnosis, confidence: parseInt(e.target.value) })}
                  className="w-full h-1.5 appearance-none bg-transparent"
                />
                <div 
                  className="bg-[#ea580c] h-1.5 rounded-full relative -mt-1.5 pointer-events-none"
                  style={{ width: `${diagnosis.confidence}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#ea580c] rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Treatment Instructions</label>
              <textarea 
                rows="4" 
                value={diagnosis.treatment}
                onChange={(e) => setDiagnosis({ ...diagnosis, treatment: e.target.value })}
                className="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-lg p-3 text-sm text-gray-700 resize-none font-sans" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Medications</label>
              {diagnosis.medications.map((med, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <input 
                    type="text"
                    value={med.name}
                    placeholder="Medication name"
                    onChange={(e) => {
                      const newMeds = [...diagnosis.medications];
                      newMeds[idx].name = e.target.value;
                      setDiagnosis({ ...diagnosis, medications: newMeds });
                    }}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={med.dosage}
                      placeholder="Dosage"
                      onChange={(e) => {
                        const newMeds = [...diagnosis.medications];
                        newMeds[idx].dosage = e.target.value;
                        setDiagnosis({ ...diagnosis, medications: newMeds });
                      }}
                      className="flex-1 border border-gray-200 rounded-lg p-2 text-sm"
                    />
                    <input 
                      type="text"
                      value={med.duration}
                      placeholder="Duration"
                      onChange={(e) => {
                        const newMeds = [...diagnosis.medications];
                        newMeds[idx].duration = e.target.value;
                        setDiagnosis({ ...diagnosis, medications: newMeds });
                      }}
                      className="flex-1 border border-gray-200 rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setDiagnosis({ 
                  ...diagnosis, 
                  medications: [...diagnosis.medications, { name: '', dosage: '', duration: '' }] 
                })}
                className="text-xs text-[#ea580c] font-bold flex items-center gap-1 hover:underline"
              >
                <PlusCircle className="w-3 h-3" /> Add Medication
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Follow-up Appointment</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="date" 
                  value={diagnosis.followUp}
                  onChange={(e) => setDiagnosis({ ...diagnosis, followUp: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg py-2.5 pl-9 pr-4 text-sm font-medium text-gray-800" 
                />
              </div>
            </div>

            {/* Notifiable Disease Alert */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <div className="mt-0.5">
                <div className="w-4 h-4 bg-red-600 border border-red-700 rounded flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-red-800 text-sm mb-1 leading-none">Notifiable Disease</h4>
                <p className="text-red-700 text-xs">
                  Confirmed: FMD - Foot and Mouth Disease. Notification will be sent to DVS automatically.
                </p>
              </div>
            </div>

            <button 
              onClick={handleDiagnosisSubmit}
              className="w-full bg-[#ea580c] hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md mt-6"
            >
              <CheckCircle2 className="w-5 h-5" /> Submit Diagnosis
            </button>
            
            <div className="flex gap-2 justify-center">
              <button className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <Download className="w-3 h-3" /> Export
              </button>
              <button className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <Printer className="w-3 h-3" /> Print
              </button>
              <button className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <Share2 className="w-3 h-3" /> Share
              </button>
            </div>
            
            <p className="text-center text-[9px] text-gray-400 pt-2 font-mono tracking-tight">
              Records are cryptographically signed and encrypted.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default TelehealthVetConsult;