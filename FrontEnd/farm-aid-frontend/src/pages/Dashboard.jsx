import React from 'react';
import { Activity, Plus, FileText, Stethoscope, CloudRain, Sun, Download, ChevronRight, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 overflow-auto font-sans text-gray-800">
        <div className="p-8 max-w-6xl">
          
          {/* Header */}
          <header className="flex justify-between items-center mb-10">
             <div>
                <h1 className="text-3xl font-extrabold text-[#111827] mb-1 tracking-tight">Farm Overview</h1>
                <p className="text-gray-500 font-medium">Welcome back. It's a clear day at Green Valley Farm.</p>
             </div>
             
             <div className="flex gap-4">
                <button className="bg-white border text-sm border-gray-200 text-gray-600 hover:text-gray-900 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition hover:bg-gray-50 shadow-sm">
                   <Download className="w-4 h-4" /> Download Report
                </button>
                <button className="bg-[#1e9d56] hover:bg-[#15803d] text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition shadow-sm">
                   <Plus className="w-4 h-4" /> Add Record
                </button>
             </div>
          </header>

          {/* Top Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                   <svg className="w-6 h-6 text-[#1e9d56]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 6l-4 4M2 13h20M9 22V13M15 22V13M5 3a2 2 0 012-2h1m4 0h1a2 2 0 012 2v2H5V3z"></path></svg>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Herd</p>
                <div className="flex items-end gap-3"><span className="text-3xl font-extrabold text-gray-900 leading-none">142</span> <span className="text-[#1e9d56] text-sm font-bold leading-none mb-1">+3 this month</span></div>
             </div>
             
             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                   <Activity className="w-6 h-6 text-[#ea580c]" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Active Cases</p>
                <div className="flex items-end gap-3"><span className="text-3xl font-extrabold text-gray-900 leading-none">3</span> <span className="text-gray-400 text-sm font-medium leading-none mb-1">2 resolving</span></div>
             </div>

             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                   <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Vaccinations Due</p>
                <div className="flex items-end gap-3"><span className="text-3xl font-extrabold text-gray-900 leading-none">18</span> <span className="text-blue-500 text-sm font-bold leading-none mb-1">Next 14 days</span></div>
             </div>

             {/* Weather Widget Mock */}
             <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-6 border border-gray-700 shadow-lg text-white relative overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition">
                <div className="absolute -right-6 -top-6 text-yellow-500/20"><Sun className="w-32 h-32" /></div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm relative z-10">
                   <CloudRain className="w-5 h-5 text-blue-300" />
                </div>
                <div className="relative z-10">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Weather (Gaborone)</p>
                   <div className="flex items-baseline gap-2 mb-1"><span className="text-3xl font-extrabold text-white leading-none">28°C</span><span className="text-gray-400 text-sm leading-none">Mostly Sunny</span></div>
                   <p className="text-[10px] text-gray-400">Rain expected tomorrow evening.</p>
                </div>
             </div>
          </div>

          {/* Bottom Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Recent Activities */}
             <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
                   <a href="#" className="text-sm font-bold text-[#1e9d56] hover:underline">View All</a>
                </div>
                
                <div className="p-6 flex-1 flex flex-col gap-6">
                   <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="w-5 h-5 text-[#1e9d56]" /></div>
                      <div>
                         <h4 className="font-bold text-sm text-gray-900 mb-0.5">Herd Vaccination Completed</h4>
                         <p className="text-sm text-gray-500 mb-1">FMD routine booster administered to 45 adult cattle.</p>
                         <span className="text-[10px] text-gray-400 font-bold uppercase">Today, 10:30 AM</span>
                      </div>
                   </div>

                   <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center shrink-0 mt-1"><Stethoscope className="w-5 h-5 text-[#ea580c]" /></div>
                      <div>
                         <h4 className="font-bold text-sm text-gray-900 mb-0.5">Reported Sick Animal</h4>
                         <p className="text-sm text-gray-500 mb-1">Tag #BW-192 showing signs of mild lameness. AI triage launched.</p>
                         <span className="text-[10px] text-gray-400 font-bold uppercase">Yesterday, 3:15 PM</span>
                      </div>
                   </div>

                   <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-1"><Plus className="w-5 h-5 text-blue-500" /></div>
                      <div>
                         <h4 className="font-bold text-sm text-gray-900 mb-0.5">New Calf Registered</h4>
                         <p className="text-sm text-gray-500 mb-1">Female Holstein calf born. Tag #BW-244 assigned.</p>
                         <span className="text-[10px] text-gray-400 font-bold uppercase">Oct 12, 06:00 AM</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Quick Actions / Recommendations */}
             <div className="flex flex-col gap-6">
                
                <div className="bg-[#fff7ed] rounded-2xl border border-orange-100 p-6 hover:shadow-[0_4px_20px_rgba(234,88,12,0.1)] transition">
                   <h2 className="text-lg font-bold text-orange-900 mb-2">Priority Task</h2>
                   <p className="text-sm text-orange-800 mb-5">You have 1 pending consultation reply from Dr. Sarah regarding Tag #BW-192.</p>
                   <button className="bg-[#ea580c] hover:bg-orange-600 text-white text-sm font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition w-full">
                      Open Telehealth <ChevronRight className="w-4 h-4" />
                   </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex-1">
                   <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="h-24 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition">
                         <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                         <span className="font-bold text-sm text-gray-700">Add Animal</span>
                      </button>
                      <button className="h-24 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition">
                         <Activity className="w-6 h-6 text-gray-500" />
                         <span className="font-bold text-sm text-gray-700">Log Health</span>
                      </button>
                      <button className="h-24 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition">
                         <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                         <span className="font-bold text-sm text-gray-700">Check Symptom</span>
                      </button>
                      <button className="h-24 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition">
                         <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         <span className="font-bold text-sm text-gray-700">Knowledge Base</span>
                      </button>
                   </div>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
