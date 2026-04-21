import React from 'react';
import { 
  LayoutDashboard, PawPrint, Store, BarChart2, Settings,
  CheckCircle2, Bell, Camera, User, Home, Sliders, Shield,
  Upload, ChevronRight
} from 'lucide-react';

const AccountSettings = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-800">
      
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 shrink-0">
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50 flex-shrink-0 gap-3">
          <div className="bg-[#e35d18] p-2 rounded-xl flex items-center justify-center">
             <div className="w-5 h-5 flex flex-col justify-center items-center gap-0.5 relative">
                <div className="w-4 h-2 bg-white rounded-t-sm"></div>
                <div className="flex w-full gap-1 justify-between">
                   <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                   <div className="w-2 h-2 bg-white rounded-full mt-0.5"></div>
                </div>
             </div>
          </div>
          <div>
             <span className="font-extrabold text-gray-900 text-[17px] tracking-tight block leading-tight">Farm-Aid</span>
             <span className="text-gray-400 text-xs font-semibold">Livestock Management</span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors">
            <PawPrint className="w-5 h-5" /> Livestock
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors">
            <Store className="w-5 h-5" /> Marketplace
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors">
            <BarChart2 className="w-5 h-5" /> Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#e5fcf0] text-[#12ca49] font-bold rounded-xl transition-colors shadow-sm">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </nav>

        {/* Profile Bottom */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="bg-white p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
             <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center border border-orange-200 shrink-0 relative">
                <User className="w-6 h-6 text-orange-600 mt-2" />
             </div>
             <div className="overflow-hidden">
                <h4 className="font-extrabold text-sm text-gray-900 truncate">Farmer Segokgo</h4>
                <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase truncate block">PREMIUM PLAN</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen max-w-[1200px]">
        
        {/* Header */}
        <header className="h-20 bg-[#F8F9FA] flex items-center justify-between px-10 shrink-0 z-10 sticky top-0 mt-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User className="w-4 h-4" />
             </div>
             <h1 className="text-[22px] font-extrabold text-[#111827] tracking-tight leading-none">Account Settings</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-[#e5fcf0] text-[#12ca49] px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs shadow-sm border border-[#12ca49]/20">
              <CheckCircle2 className="w-4 h-4" />
              Offline Status: Synced
            </div>
            
            <button className="text-gray-400 hover:text-gray-600 transition relative">
              <Bell className="w-5 h-5 fill-current" />
            </button>
            
            <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm shrink-0">
               <User className="w-6 h-6 text-orange-600 mt-2" />
            </div>
          </div>
        </header>

        {/* Settings Navigation Tabs */}
        <div className="px-10 border-b border-gray-200 bg-[#F8F9FA] sticky top-[96px] z-10">
           <nav className="flex gap-8">
              <button className="py-4 border-b-[3px] border-[#12ca49] text-gray-900 font-bold text-sm flex items-center gap-2">
                 <User className="w-4 h-4" /> Profile Info
              </button>
              <button className="py-4 border-b-[3px] border-transparent text-gray-500 hover:text-gray-800 font-bold text-sm flex items-center gap-2 transition-colors">
                 <Home className="w-4 h-4" /> Farm Details
              </button>
              <button className="py-4 border-b-[3px] border-transparent text-gray-500 hover:text-gray-800 font-bold text-sm flex items-center gap-2 transition-colors">
                 <Sliders className="w-4 h-4" /> App Preferences
              </button>
              <button className="py-4 border-b-[3px] border-transparent text-gray-500 hover:text-gray-800 font-bold text-sm flex items-center gap-2 transition-colors">
                 <Shield className="w-4 h-4" /> Security
              </button>
           </nav>
        </div>

        {/* Settings Content */}
        <div className="p-10 pt-8 flex-1 overflow-y-auto space-y-8 pb-20">
          
          {/* Profile Information Block */}
          <section className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-8">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-[17px] font-extrabold text-gray-900">Profile Information</h2>
                <span className="text-slate-400 font-bold text-[11px] tracking-widest uppercase">GENERAL</span>
             </div>

             <div className="flex items-center gap-6 mb-10">
                <div className="relative">
                   <div className="w-32 h-32 rounded-3xl bg-[#f0a56c] overflow-hidden border border-orange-200 flex items-end justify-center">
                      <User className="w-24 h-24 text-white/50" strokeWidth={1} />
                   </div>
                   <button className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#12ca49] hover:bg-[#0fa63b] rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm transition-colors cursor-pointer">
                      <Camera className="w-4 h-4" />
                   </button>
                </div>
                <div>
                   <h3 className="text-2xl font-extrabold text-gray-900 mb-1">Farmer Segokgo</h3>
                   <p className="text-slate-500 text-sm font-medium mb-3">Account ID: FA-8829-BS</p>
                   <button className="text-[#12ca49] hover:text-[#0fa63b] font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" /> UPLOAD NEW PHOTO
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                   <label className="text-slate-500 font-bold text-[11px] tracking-widest uppercase">FULL NAME</label>
                   <input type="text" defaultValue="Farmer Segokgo" className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20 focus:border-[#12ca49]" />
                </div>
                
                <div className="space-y-2">
                   <label className="text-slate-500 font-bold text-[11px] tracking-widest uppercase">REGION</label>
                   <input type="text" defaultValue="Francistown" className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20 focus:border-[#12ca49]" />
                </div>

                <div className="space-y-2">
                   <label className="text-slate-500 font-bold text-[11px] tracking-widest uppercase">EMAIL ADDRESS</label>
                   <input type="email" defaultValue="f.segokgo@farmaid-bw.com" className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20 focus:border-[#12ca49]" />
                </div>

                <div className="space-y-2">
                   <label className="text-slate-500 font-bold text-[11px] tracking-widest uppercase">PHONE NUMBER</label>
                   <div className="flex gap-3">
                      <input type="text" defaultValue="+267" readOnly className="w-20 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-gray-500 text-sm font-bold text-center select-none outline-none" />
                      <input type="text" defaultValue="71234567" className="flex-1 px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#12ca49]/20 focus:border-[#12ca49]" />
                   </div>
                </div>
             </div>
          </section>

          {/* Farm Details Block */}
          <section className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-8">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-[17px] font-extrabold text-gray-900">Farm Details</h2>
                <span className="text-slate-400 font-bold text-[11px] tracking-widest uppercase">OPERATIONS</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Primary Livestock */}
                <div className="space-y-2">
                   <label className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">PRIMARY LIVESTOCK</label>
                   <div className="bg-[#e5fcf0] border border-[#12ca49]/20 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#12ca49] shadow-sm shrink-0">
                         <PawPrint className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                         <h4 className="font-extrabold text-gray-900 text-[15px] leading-tight mb-0.5">Cattle</h4>
                         <p className="text-slate-500 text-[11px] font-bold">Beef & Dairy</p>
                      </div>
                   </div>
                </div>

                {/* Farm Information */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">FARM INFORMATION</label>
                      <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-4 flex flex-col justify-center h-[74px]">
                         <span className="text-slate-400 font-medium text-[10px] mb-0.5">Farm Name</span>
                         <span className="font-extrabold text-gray-900 text-sm">Segokgo Plains Estate</span>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-slate-400 font-bold text-[10px] tracking-widest uppercase opacity-0 select-none">SPACER</label>
                      <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-4 flex flex-col justify-center h-[74px]">
                         <span className="text-slate-400 font-medium text-[10px] mb-0.5">Total Herd Size</span>
                         <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold text-[#12ca49] text-xl leading-none">142</span>
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">HEADS</span>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </section>

          {/* App Preferences Block (Partial) */}
          <section className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-8">
             <div className="flex justify-between items-center bg-white">
                <h2 className="text-[17px] font-extrabold text-gray-900">App Preferences</h2>
                <span className="text-slate-400 font-bold text-[11px] tracking-widest uppercase">CUSTOMIZATION</span>
             </div>
             {/* Extended content would go here */}
          </section>

        </div>
      </main>

    </div>
  );
};

export default AccountSettings;
