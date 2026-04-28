import React from 'react';
import { 
  Search, 
  Bell, 
  AlertTriangle, 
  Eye, 
  CloudLightning, 
  Truck, 
  FileText,
  Hash, 
  Info, 
  QrCode,
  AlertOctagon,
  CheckCircle2,
  AlertCircle,
   User,  PawPrint, Activity, Link,
  Store, BookOpen, Settings, RefreshCw, 
  ArrowUpRight, PlusCircle, Stethoscope, Headphones, 
  ChevronDown, TrendingUp, X, Syringe, 
  Banknote, ShieldAlert,  Lock, GraduationCap, Database,
  Camera, UploadCloud, Loader2, Wifi, WifiOff, PhoneCall, Check 
    ,Filter, MoreVertical, Plus, CloudOff, Calendar,  Save,  Download,  Loader ,LayoutDashboard
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';

const AlertsNotifications = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-800">
        {/* Left Sidebar */}
            <aside className=" flex-1 w-[280px] bg-white border-r border-gray-100 flex flex-col fixed h-full z-10 shrink-0 shadow-sm">
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
      <div className="flex-1 ml-[280px] overflow-auto font-sans text-gray-800">
        <div className="p-8 max-w-6xl">
          
          {/* Header */}
          <header className="mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-[#111827] mb-1 tracking-tight">Alerts & Notifications</h1>
              <p className="text-gray-500 font-medium">Stay updated on disease status, weather, and regulations.</p>
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="space-y-8">

            {/* --- Disease Alerts Section --- */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertOctagon className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Disease Alerts</h2>
                </div>
                <span className="bg-red-100 text-red-700 text-[11px] font-bold px-3 py-1 rounded-full">
                  High Priority
                </span>
              </div>

              {/* FMD Outbreak Card */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-red-700 font-extrabold text-lg mb-1">FMD Outbreak: Zone 6B</h3>
                    <p className="text-red-600 text-xs font-medium">Detected: Oct 24, 2023</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <div className="bg-white rounded-xl p-4 mb-4 border border-red-100">
                  <h4 className="text-red-800 font-bold text-sm mb-2">Movement Restrictions Active:</h4>
                  <p className="text-red-800/80 text-sm leading-relaxed">
                    Strict quarantine in effect. No livestock transport permitted within or out of Zone 6B without a certified veterinary permit.
                  </p>
                </div>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                  <Eye className="w-4 h-4" /> View Emergency Protocol
                </button>
              </div>
            </section>

            {/* --- Weather Alerts Section --- */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CloudLightning className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Weather Alerts</h2>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-bold text-base mb-1">Severe Storm Warning</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      Expected: Today, 4:00 PM. High winds and heavy precipitation. Secure loose equipment.
                    </p>
                    <p className="text-gray-400 text-xs font-medium">Issued 2 hours ago</p>
                  </div>
                </div>
              </div>
            </section>

            {/* --- Movement Restrictions Section --- */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Movement Restrictions</h2>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex gap-3 items-start mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-bold text-base mb-1">Transport Permit Rules</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      New digital permit requirements for inter-zone transport are now mandatory. Ensure all livestock are registered in BAITS before application.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button className="bg-[#1e9d56] hover:bg-[#15803d] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition">
                    Apply for Permit
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm px-6 py-2.5 rounded-lg transition">
                    Read Rules
                  </button>
                </div>
              </div>
            </section>

            {/* --- BAITS Updates Section --- */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Hash className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">BAITS Updates</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ear Tagging Reminder */}
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#ea580c] rounded-xl flex items-center justify-center shadow-sm">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-base mb-1">Ear Tagging Reminder</h3>
                      <p className="text-gray-600 text-sm">
                        Quarterly audit starts in 5 days. Ensure all 2023 calves are tagged and registered.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration Success */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-[#12ca49]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-base mb-1">Registration Successful</h3>
                      <p className="text-gray-600 text-sm">
                        Batch #4492 has been added to the national database.
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR Code Update */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-base mb-1">QR Code System Update</h3>
                      <p className="text-gray-600 text-sm">
                        Enhanced tracking is now available. Update your mobile app to access new features.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-base mb-1">Compliance Status: On Track</h3>
                      <p className="text-gray-600 text-sm">
                        Your farm meets all requirements for the 2024 certification period.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AlertsNotifications;
