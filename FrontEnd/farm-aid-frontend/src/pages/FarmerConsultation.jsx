import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Camera, 
  UploadCloud, 
  Send, 
  User, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Plus,
  Search,
  Phone,
  Video,
  FileText,
  MapPin,
  Tractor,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import socketService from '../services/socketService';
import consultationService from '../services/consultationService';
import { useAuth } from '../context/AuthContext';

const FarmerTelehealth = ({ consultationId }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const [activeVet, setActiveVet] = useState({
    name: "Dr....",
    title: "Senior Veterinary Surgeon",
    location: "Gaborone District Office",
    status: "Online",
    avatar: "https://i.pravatar.cc/150?u=vet1"
  });

  const [messages, setMessages] = useState([
    { id: 1, sender: 'vet', text: 'Good morning John. I see you reported a suspected case in your cattle. How many animals are affected?', time: '09:12 AM' },
    { id: 2, sender: 'farmer', text: 'About 3 of them. One is drooling heavily and seems to be limping.', time: '09:15 AM' },
    { id: 3, sender: 'vet', text: 'I understand. Can you please send a close-up photo of the mouth and the hoof area? This will help the AI prioritize your case.', time: '09:16 AM' }
  ]);

  const [inputText, setInputText] = useState('');
  const [messageQueue, setMessageQueue] = useState([]);

  // Initialize WebSocket connection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Connect to socket if online and user is authenticated
    if (isOnline && user?.token) {
      socketService.connect(user.token);
      
      // Join consultation room
      if (consultationId) {
        socketService.joinConsultation(consultationId);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, user, consultationId]);

  // Listen for real-time messages
  useEffect(() => {
    const handleMessage = (data) => {
      const newMessage = {
        id: Date.now(),
        sender: data.senderId === user?.id ? 'farmer' : 'vet',
        text: data.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    };

    const handleTyping = (data) => {
      if (data.senderId !== user?.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    const handleConnect = () => {
      setIsConnected(true);
      // Sync any queued messages
      if (messageQueue.length > 0) {
        messageQueue.forEach(msg => {
          socketService.sendMessage(consultationId, msg);
        });
        setMessageQueue([]);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socketService.on('message', handleMessage);
    socketService.on('userTyping', handleTyping);
    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);

    return () => {
      socketService.off('message', handleMessage);
      socketService.off('userTyping', handleTyping);
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
    };
  }, [user, consultationId, messageQueue]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const messageText = inputText.trim();
    setInputText('');

    // Add to local state immediately (optimistic update)
    const newMessage = {
      id: Date.now(),
      sender: 'farmer',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);

    if (isOnline && isConnected) {
      // Send via WebSocket if online
      socketService.sendMessage(consultationId, messageText);
      
      // Also save to server for persistence
      try {
        await consultationService.sendMessage(consultationId, { 
          message: messageText,
          type: 'text'
        });
      } catch (error) {
        console.error('Failed to save message:', error);
      }
    } else {
      // Queue for later sync if offline
      const queuedMessage = {
        message: messageText,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessageQueue(prev => [...prev, queuedMessage]);
      localStorage.setItem('messageQueue', JSON.stringify([...messageQueue, queuedMessage]));
    }
  };

  const handleTyping = () => {
    if (isOnline && isConnected) {
      socketService.sendTyping(consultationId, true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-800">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="bg-[#ea580c] p-2 rounded-xl text-white">
            <Tractor className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-slate-400 leading-none">Consultation</h1>
            <div className="font-bold text-slate-900 leading-none mt-1">Telehealth Support</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span className="text-amber-600">Offline</span>
              </>
            )}
            {isConnected && (
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="hidden md:flex flex-col items-end">
             <div className="text-[10px] font-black text-green-600 uppercase tracking-widest">End-to-End Encrypted</div>
             <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Government Protected</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Panel: Active Chats & Request New */}
        <aside className="w-full md:w-80 bg-slate-50 border-r border-slate-100 flex flex-col overflow-y-auto">
          <div className="p-6">
            <button className="w-full bg-[#ea580c] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all mb-8">
              <Plus className="w-4 h-4" /> Request Consultation
            </button>
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Urgent Consultations</h3>
              
              <div className="bg-white p-4 rounded-2xl border-2 border-[#ea580c] shadow-sm flex items-center gap-4 cursor-pointer hover:bg-orange-50 transition-all">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 overflow-hidden">
                    <img src={activeVet.avatar} alt="Dr. Kagiso" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{activeVet.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 truncate">Symptom Review In-Progress</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-100 opacity-60 grayscale flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                   <img src="https://i.pravatar.cc/150?u=vet2" alt="Dr. Moloi" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">Dr. Moloi</h4>
                  <p className="text-[10px] font-medium text-slate-400">Case #DVS-102 Closed</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel: Chat Interface */}
        <section className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* Chat Profile Header */}
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 overflow-hidden">
                <img src={activeVet.avatar} alt="Vet" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 leading-none mb-1">{activeVet.name}</h2>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  {activeVet.status}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-50 shadow-sm">Official Telehealth Channel</span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex gap-3 ${msg.sender === 'farmer' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg overflow-hidden shrink-0 mt-1 shadow-sm ${msg.sender === 'farmer' ? 'bg-orange-100' : 'bg-slate-100'}`}>
                    <img src={msg.sender === 'farmer' ? "https://i.pravatar.cc/150?u=farmer" : activeVet.avatar} className="w-full h-full object-cover" alt="User" />
                  </div>
                  <div>
                    <div className={`p-4 rounded-[1.5rem] shadow-sm ${msg.sender === 'farmer' ? 'bg-[#ea580c] text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 font-medium'}`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <div className={`text-[9px] font-bold mt-1.5 tracking-tight uppercase ${msg.sender === 'farmer' ? 'text-right text-[#ea580c]' : 'text-left text-slate-400'}`}>
                      {msg.time} {msg.sender === 'farmer' && !isOnline && '• QUEUED'}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] flex gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 mt-1 shadow-sm bg-slate-100">
                    <img src={activeVet.avatar} className="w-full h-full object-cover" alt="Vet" />
                  </div>
                  <div className="bg-white text-slate-800 rounded-[1.5rem] rounded-tl-none border border-slate-100 p-4 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Box */}
          <footer className="p-6 bg-white border-t border-slate-50">
            {!isOnline && messageQueue.length > 0 && (
              <div className="mb-3 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                📤 {messageQueue.length} message{messageQueue.length > 1 ? 's' : ''} queued for sync
              </div>
            )}
            <form onSubmit={sendMessage} className="relative flex items-center gap-3">
              <div className="flex gap-2">
                <button type="button" className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all hover:text-[#ea580c]">
                  <Camera className="w-5 h-5" />
                </button>
                <button type="button" className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all hover:text-[#ea580c]">
                  <UploadCloud className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onInput={handleTyping}
                  disabled={!isOnline && !messageQueue.length}
                  placeholder={isOnline ? "Ask Dr. Kagiso a question..." : "Offline - messages will queue for sync"} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-4 pr-14 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 transition-all disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#ea580c] text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 hover:bg-[#c44e13] transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </footer>
        </section>

        {/* Right Panel: Case Details / Diagnostics */}
        <aside className="hidden lg:flex w-80 bg-slate-50 border-l border-slate-100 flex flex-col p-6 overflow-y-auto">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Case Diagnostic Overview</h3>
          
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-50 p-2 rounded-xl text-[#ea580c]"><AlertTriangle className="w-5 h-5" /></div>
              <h4 className="font-black text-slate-900 text-sm">Suspected FMD</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Confidence</span>
                <span className="text-sm font-black text-slate-900">89%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#ea580c] w-[89%] rounded-full shadow-[0_0_8px_rgba(234,88,12,0.4)]"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Consultation Progress</h3>
            <div className="flex gap-4">
              <div className="relative flex flex-col items-center">
                 <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white z-10 shadow-lg"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                 <div className="w-0.5 h-full bg-green-100 absolute top-0 -z-0"></div>
              </div>
              <div className="pb-6">
                <h5 className="font-bold text-slate-900 text-xs">Case Opened</h5>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">Today, 09:12 AM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative flex flex-col items-center">
                 <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white z-10 shadow-lg"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                 <div className="w-0.5 h-full bg-green-100 absolute top-0 -z-0"></div>
              </div>
              <div className="pb-6">
                <h5 className="font-bold text-slate-900 text-xs">AI Screening</h5>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">Today, 09:15 AM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative flex flex-col items-center">
                 <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-[#ea580c] z-10 shadow-md animate-pulse"><Clock className="w-3.5 h-3.5" /></div>
                 <div className="w-0.5 h-full bg-slate-100 absolute top-0 -z-0 border-dashed border-slate-200 border-l"></div>
              </div>
              <div className="pb-6">
                <h5 className="font-black text-[#ea580c] text-xs uppercase tracking-widest">Awaiting Images</h5>
                <p className="text-[10px] text-slate-400 mt-1 font-bold leading-normal">Dr. Kagiso requested close-up photos of lesions.</p>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default FarmerTelehealth;
