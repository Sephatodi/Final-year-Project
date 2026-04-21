import React, { useState } from 'react';
import { 
  Tractor, Bell, User, ShieldCheck, Key, AlertTriangle, Fingerprint, 
  Smartphone, Monitor, Activity, Shield, Download, CheckCircle2, 
  Info, Lock, LogOut, ChevronRight, Settings, Server, Box
} from 'lucide-react';

const SecuritySettings = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 flex flex-col">
      
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-20">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="bg-[#1f7550] p-1.5 rounded-lg flex items-center justify-center">
             <div className="w-5 h-5 flex flex-col justify-center items-center gap-0.5 relative">
                <div className="w-4 h-2 bg-white rounded-t-sm"></div>
                <div className="flex w-full gap-1 justify-between">
                   <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                   <div className="w-2 h-2 bg-white rounded-full mt-0.5"></div>
                </div>
             </div>
          </div>
          <div className="flex flex-col">
             <div className="font-extrabold text-[#111827] text-lg tracking-tight leading-none mb-0.5">Farm-Aid</div>
             <div className="text-[10px] font-bold text-[#1f7550] tracking-widest uppercase">Security Suite</div>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8">
           <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Dashboard</a>
           <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Crops</a>
           <a href="#" className="text-sm font-bold text-[#1f7550] transition-colors relative after:absolute after:-bottom-[19px] after:left-0 after:w-full after:h-[3px] after:bg-[#1f7550] after:rounded-t">Security</a>
           <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Devices</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
           <button className="text-slate-500 hover:text-slate-700 transition relative">
              <Bell className="w-5 h-5 fill-slate-500" />
           </button>
           <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 overflow-hidden flex items-center justify-center cursor-pointer shadow-sm relative">
              <User className="w-6 h-6 text-orange-500 mt-2" />
           </div>
        </div>

      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto p-8 lg:p-12 mb-10">
        
        {/* Title Area */}
        <div className="mb-10">
           <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#1f7550] tracking-widest uppercase mb-4">
              <span className="text-slate-400">Settings</span> <ChevronRight className="w-3 h-3 text-slate-300" /> <span>Security & Authentication</span>
           </div>
           
           <h1 className="text-4xl font-extrabold text-[#101828] mb-3 tracking-tight">Account Protection</h1>
           <p className="text-slate-500 font-medium text-[15px] max-w-2xl leading-relaxed">
              Manage your BAITS3-aligned security protocols, biometric access, and monitor real-time login activity for your agricultural network.
           </p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           
           {/* Security Health */}
           <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 bg-[#e5fcf0] rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#1f7550]" />
                 </div>
                 <span className="bg-[#e5fcf0] text-[#1f7550] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded">Active</span>
              </div>
              <div>
                 <p className="text-slate-500 text-sm font-semibold mb-1">Security Health</p>
                 <div className="text-[28px] font-extrabold text-[#101828] mb-4">Excellent</div>
                 
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex items-center">
                    <div className="bg-[#1f7550] h-full w-[94%] rounded-full"></div>
                 </div>
                 <div className="text-right mt-1.5"><span className="text-xs font-bold text-slate-700">94%</span></div>
              </div>
           </div>

           {/* Active Tokens */}
           <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Key className="w-5 h-5 text-blue-500" />
                 </div>
                 <span className="text-[#1f7550] text-sm font-bold cursor-pointer hover:underline">Manage</span>
              </div>
              <div>
                 <p className="text-slate-500 text-sm font-semibold mb-1">Active Security Tokens</p>
                 <div className="text-[28px] font-extrabold text-[#101828] mb-2">12 Tokens</div>
                 <p className="text-slate-400 text-xs font-medium">All tokens compliant with BAITS3 standards.</p>
              </div>
           </div>

           {/* Suspicious Logins */}
           <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                 </div>
              </div>
              <div>
                 <p className="text-slate-500 text-sm font-semibold mb-1">Suspicious Logins (24h)</p>
                 <div className="text-[28px] font-extrabold text-[#ea580c] mb-2">0 Alerts</div>
                 <p className="text-slate-400 text-xs font-medium">Monitoring active across 4 farm locations.</p>
              </div>
           </div>

        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
           
           {/* Left Main Column */}
           <div className="flex-1 space-y-12">
              
              {/* Authentication Methods */}
              <section>
                 <div className="flex items-center gap-3 mb-6">
                    <Fingerprint className="w-6 h-6 text-slate-300" />
                    <h2 className="text-[19px] font-extrabold text-[#101828]">Authentication Methods</h2>
                 </div>

                 <div className="space-y-4">
                    
                    {/* Offline Biometrics */}
                    <div className="bg-slate-50/50 border border-[#1f7550]/20 rounded-2xl p-5 flex items-center justify-between transition hover:border-[#1f7550]/40">
                       <div className="flex items-center gap-4">
                          <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                             <Fingerprint className="w-6 h-6 text-[#1f7550]" />
                          </div>
                          <div>
                             <h3 className="font-bold text-[#101828] text-base mb-0.5">Offline Biometric Login</h3>
                             <p className="text-sm text-slate-500 font-medium">Enable Face ID or Fingerprint for fields with no connectivity.</p>
                          </div>
                       </div>
                       
                       <button 
                         onClick={() => setBiometricEnabled(!biometricEnabled)}
                         className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1f7550] focus:ring-offset-2 ${biometricEnabled ? 'bg-[#1f7550]' : 'bg-slate-200'}`}
                       >
                         <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${biometricEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                       </button>
                    </div>

                    {/* Token-Based Security */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between transition hover:border-slate-200 shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
                             <Box className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                             <h3 className="font-bold text-[#101828] text-base mb-0.5">Token-Based Security</h3>
                             <p className="text-sm text-slate-500 font-medium">Require automated 15-minute rotation for hardware sensors.</p>
                          </div>
                       </div>
                       
                       <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-5 py-2.5 rounded-xl transition">
                          Configure
                       </button>
                    </div>

                    {/* 2FA */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between transition hover:border-slate-200 shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
                             <Smartphone className="w-6 h-6 text-slate-500" />
                          </div>
                          <div>
                             <h3 className="font-bold text-[#101828] text-base mb-0.5">Two-Factor Auth (MFA)</h3>
                             <p className="text-sm text-slate-500 font-medium">SMS or Authenticator App required for dashboard access.</p>
                          </div>
                       </div>
                       
                       <button 
                         onClick={() => setMfaEnabled(!mfaEnabled)}
                         className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1f7550] focus:ring-offset-2 ${mfaEnabled ? 'bg-[#1f7550]' : 'bg-slate-200'}`}
                       >
                         <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mfaEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                       </button>
                    </div>

                 </div>
              </section>

              {/* Recent Security Activity */}
              <section>
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <Activity className="w-5 h-5 text-slate-300" />
                       <h2 className="text-[19px] font-extrabold text-[#101828]">Recent Security Activity</h2>
                    </div>
                    <a href="#" className="flex items-center gap-1.5 text-sm font-bold text-[#1f7550] hover:text-[#165a3d]">
                       Download CSV <Download className="w-4 h-4" />
                    </a>
                 </div>

                 <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left font-sans">
                       <thead className="bg-[#fbfcff] border-b border-gray-100">
                          <tr>
                             <th className="px-6 py-4 font-extrabold text-[11px] uppercase tracking-wider text-slate-500">Event</th>
                             <th className="px-6 py-4 font-extrabold text-[11px] uppercase tracking-wider text-slate-500">Device/Location</th>
                             <th className="px-6 py-4 font-extrabold text-[11px] uppercase tracking-wider text-slate-500">Date & Time</th>
                             <th className="px-6 py-4 font-extrabold text-[11px] uppercase tracking-wider text-slate-500">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-sm">
                          
                          {/* Row 1 */}
                          <tr className="hover:bg-slate-50 transition min-h-[72px]">
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                   <CheckCircle2 className="w-4 h-4 text-[#12ca49]" />
                                   <span className="font-bold text-[#101828]">Successful Login</span>
                                </div>
                             </td>
                             <td className="px-6 py-5 text-slate-600 font-medium whitespace-nowrap">
                                iPhone 15 • Iowa Farm Hub
                             </td>
                             <td className="px-6 py-5 text-slate-600 font-medium">
                                Oct 24, 2023 • 09:42<br/>AM
                             </td>
                             <td className="px-6 py-5">
                                <span className="font-extrabold text-blue-500 text-[11px] tracking-widest uppercase">VERIFIED</span>
                             </td>
                          </tr>

                          {/* Row 2 */}
                          <tr className="hover:bg-slate-50 transition min-h-[72px]">
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                   <Info className="w-4 h-4 text-[#ea580c]" />
                                   <span className="font-bold text-[#101828]">Token Rotated</span>
                                </div>
                             </td>
                             <td className="px-6 py-5 text-slate-600 font-medium whitespace-nowrap">
                                Soil Sensor v3 #829
                             </td>
                             <td className="px-6 py-5 text-slate-600 font-medium">
                                Oct 24, 2023 • 08:30<br/>AM
                             </td>
                             <td className="px-6 py-5">
                                <span className="font-extrabold text-slate-400 text-[11px] tracking-widest uppercase break-words w-20 block">BAITS3-ALIGNED</span>
                             </td>
                          </tr>

                          {/* Row 3 */}
                          <tr className="hover:bg-slate-50 transition min-h-[72px]">
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                   <Lock className="w-4 h-4 text-[#dc2626]" />
                                   <span className="font-bold text-[#101828]">Offline Auth<br/>Attempt</span>
                                </div>
                             </td>
                             <td className="px-6 py-5 text-slate-600 font-medium whitespace-nowrap">
                                Unknown Tablet • North<br/>Sector
                             </td>
                             <td className="px-6 py-5 text-slate-600 font-medium">
                                Oct 23, 2023 • 11:15<br/>PM
                             </td>
                             <td className="px-6 py-5">
                                <span className="font-extrabold text-red-500 text-[11px] tracking-widest uppercase">BLOCKED</span>
                             </td>
                          </tr>

                       </tbody>
                    </table>
                 </div>
              </section>

           </div>

           {/* Right Sidebar Column */}
           <div className="w-full lg:w-[380px] space-y-10">
              
              {/* Logged in Devices */}
              <section>
                 <div className="flex items-center gap-3 mb-6">
                    <Monitor className="w-5 h-5 text-slate-300" />
                    <h2 className="text-[19px] font-extrabold text-[#101828]">Logged in Devices</h2>
                 </div>

                 <div className="space-y-4">
                    {/* Device 1 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                             <Smartphone className="w-5 h-5 text-slate-600 fill-slate-300" />
                          </div>
                          <div>
                             <h4 className="font-bold text-[#101828] text-sm mb-0.5">Farmer iPhone 15</h4>
                             <span className="text-[#1f7550] text-[10px] font-extrabold tracking-widest uppercase">CURRENT SESSION</span>
                          </div>
                       </div>
                       <button className="text-slate-400 hover:text-slate-600 transition">
                          <LogOut className="w-5 h-5" />
                       </button>
                    </div>

                    {/* Device 2 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                             <Monitor className="w-5 h-5 text-slate-600 fill-slate-300" />
                          </div>
                          <div>
                             <h4 className="font-bold text-[#101828] text-sm mb-0.5">Office Mac Studio</h4>
                             <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">LAST ACTIVE: 2H AGO</span>
                          </div>
                       </div>
                       <button className="text-slate-400 hover:text-slate-600 transition">
                          <LogOut className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </section>

              {/* Account Monitoring */}
              <section>
                 <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-5 h-5 text-slate-300" />
                    <h2 className="text-[19px] font-extrabold text-[#101828]">Account Monitoring</h2>
                 </div>

                 <div className="bg-[#e9f2ee] rounded-3xl p-6 border border-[#1f7550]/10 shadow-sm relative overflow-hidden">
                    {/* Widget content */}
                    <div className="flex gap-4 mb-6">
                       <div className="bg-[#1f7550] w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                          <Shield className="w-5 h-5 text-white fill-white/20" />
                       </div>
                       <div>
                          <h3 className="font-bold text-[#101828] text-base mb-1.5 tracking-tight">BAITS3 Proactive Monitoring</h3>
                          <p className="text-sm text-[#3b5346] font-medium leading-relaxed">
                             Our AI-driven engine is scanning for unusual biometric patterns and geolocation anomalies.
                          </p>
                       </div>
                    </div>

                    {/* Slider Widget */}
                    <div className="bg-white rounded-xl p-5 shadow-sm mb-6 border border-white">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Alert Sensitivity</span>
                          <span className="text-[10px] font-extrabold text-[#1f7550] uppercase tracking-widest">Balanced</span>
                       </div>
                       <div className="relative w-full h-2 bg-slate-100 rounded-full flex items-center">
                          <div className="absolute left-[60%] w-3.5 h-3.5 bg-[#1f7550] rounded-full shadow-sm"></div>
                       </div>
                    </div>

                    <button className="w-full bg-[#20513d] hover:bg-[#163e2e] text-white font-bold py-4 rounded-xl transition shadow-[0_4px_12px_rgba(32,81,61,0.3)] text-[15px] hover:-translate-y-0.5 transform duration-200">
                       View Full Security Audit
                    </button>
                 </div>
              </section>

           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 bg-white py-6 px-10 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2">
            <Tractor className="w-5 h-5 text-[#1f7550]" />
            <span className="font-extrabold text-slate-500 uppercase tracking-widest text-xs">FARM-AID • SECURED BY BAITS3</span>
         </div>
         <div className="flex gap-6">
            <a href="#" className="font-bold text-slate-400 hover:text-slate-600 text-[11px] uppercase tracking-wider transition">Privacy Policy</a>
            <a href="#" className="font-bold text-slate-400 hover:text-slate-600 text-[11px] uppercase tracking-wider transition">Compliance Standards</a>
            <a href="#" className="font-bold text-slate-400 hover:text-slate-600 text-[11px] uppercase tracking-wider transition">Hardware Security</a>
         </div>
         <div className="text-slate-400 font-semibold text-[10px]">
            © 2023 Farm-Aid Solutions. All sensors encrypted.
         </div>
      </footer>

    </div>
  );
};

export default SecuritySettings;
