import React, { useState } from 'react';
import { 
  LayoutDashboard, PawPrint, BarChart2, WalletCards, Archive, Settings,
  CloudOff, Bell, User, Banknote, Utensils, AlertTriangle, Filter,
  Save, CheckCircle2, FileText, FileDown, PlusCircle, Info, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const reportData = [
  { date: '2023-10-24', category: 'Vaccination', description: 'Anthrax Dose (Herd A)', qty: '50 units', cost: 750,   status: 'offline', createdAt: '2023-10-24' },
  { date: '2023-10-20', category: 'Feed',        description: 'Winter Lick (50kg)',    qty: '10 bags', cost: 2500,  status: 'synced',  createdAt: '2023-10-20' },
  { date: '2023-10-18', category: 'Supplements', description: 'Mineral Blocks',        qty: '5 blocks',cost: 450,   status: 'offline', createdAt: '2023-10-18' },
];

const Reports = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar 
        title="Financial & Input Report" 
        subtitle="Track expenses and inventory" 
        showBack={true}
        backTo="/vet-dashboard"
      />
      <div className="flex flex-1 font-sans text-gray-800">
      
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 shrink-0">
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50 flex-shrink-0 gap-3">
          <div className="bg-[#12ca49] p-2 rounded-xl flex items-center justify-center">
             <div className="w-5 h-5 flex flex-col justify-center items-center gap-0.5 relative">
                <div className="w-4 h-2 bg-white rounded-t-sm"></div>
                <div className="flex w-full gap-1 justify-between">
                   <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                   <div className="w-2 h-2 bg-white rounded-full mt-0.5"></div>
                </div>
             </div>
          </div>
          <div>
             <span className="font-extrabold text-gray-900 text-[17px] tracking-tight block leading-tight">Farm-Aid PWA</span>
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
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#e5fcf0] text-[#12ca49] font-bold rounded-xl transition-colors shadow-sm">
            <BarChart2 className="w-5 h-5" /> Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors">
            <WalletCards className="w-5 h-5" /> Expenses
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors">
            <Archive className="w-5 h-5" /> Inventory
          </a>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-100">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen border-l border-gray-100">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0 px-10">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Financial & Input Report</h1>
          
          <div className="flex items-center gap-6">
            <div className="bg-[#fff4e5] text-[#d97706] px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs shadow-sm">
              <CloudOff className="w-4 h-4" />
              Sync Status: Offline - 4 entries pending
            </div>
            
            <button className="text-gray-400 hover:text-gray-600 transition">
              <Bell className="w-5 h-5 fill-current" />
            </button>
            
            <div className="w-9 h-9 rounded-full bg-slate-800 shadow-sm overflow-hidden flex items-center justify-center border-2 border-transparent">
              {/* Profile Avatar Mock */}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-10 pt-8 flex-1 overflow-y-auto w-full max-w-[1400px] mx-auto bg-[#FAFBFC]">
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             {/* Total Expenses */}
             <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex items-start justify-between">
                <div>
                   <h3 className="text-slate-500 font-medium text-[13px] mb-2">Total Expenses (Oct)</h3>
                   <div className="text-[28px] font-extrabold text-gray-900 mb-2 leading-none">4,250 BWP</div>
                   <div className="flex items-center gap-1 text-[#12ca49] font-bold text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>12% from last month</span>
                   </div>
                </div>
                <div className="w-10 h-10 bg-[#e5fcf0] rounded-lg flex items-center justify-center text-[#12ca49]">
                   <Banknote className="w-5 h-5" />
                </div>
             </div>

             {/* Top Input Category */}
             <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex items-start justify-between">
                <div className="w-full">
                   <div className="flex justify-between items-start w-full mb-3">
                      <div>
                         <h3 className="text-slate-500 font-medium text-[13px] mb-1">Top Input Category</h3>
                         <div className="text-[24px] font-extrabold text-gray-900 leading-none">Feed (60%)</div>
                      </div>
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                         <Utensils className="w-5 h-5" />
                      </div>
                   </div>
                   {/* Progress Bar */}
                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
                   </div>
                </div>
             </div>

             {/* Stock Levels */}
             <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex items-start justify-between">
                <div>
                   <h3 className="text-slate-500 font-medium text-[13px] mb-1">Stock Levels</h3>
                   <div className="text-[24px] font-extrabold text-red-500 mb-2 leading-none">Low (Vaccines)</div>
                   <div className="text-red-500 text-[13px] font-medium mt-3">
                      Only 5 units remaining in stock
                   </div>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                   <AlertTriangle className="w-5 h-5" />
                </div>
             </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
             {/* Left Column (Charts & Tables) */}
             <div className="flex-1 flex flex-col gap-8">
                
                {/* Chart Card */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
                   <div className="flex justify-between items-center mb-10">
                      <h2 className="text-[17px] font-bold text-gray-900">Input Usage Trends (Last 4 Weeks)</h2>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                         <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#12ca49]"></span>Feed</div>
                         <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>Vaccines</div>
                         <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#fbbf24]"></span>Supplements</div>
                         <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#94a3b8]"></span>Ticks/Dip</div>
                      </div>
                   </div>
                   
                   {/* CSS Stacked Bar Chart Mockup */}
                   <div className="h-64 flex items-end justify-around px-8 pb-6 relative">
                      {/* Grid Lines */}
                      <div className="absolute inset-x-8 inset-y-0 flex flex-col justify-between pointer-events-none z-0">
                         {[...Array(5)].map((_, i) => (
                           <div key={i} className="w-full border-b border-gray-50 h-0"></div>
                         ))}
                      </div>
                      
                      {/* Week 1 */}
                      <div className="relative z-10 w-16 h-full flex flex-col justify-end gap-0.5 group">
                         <div className="w-full bg-[#94a3b8] h-[10%] rounded-t-sm"></div>
                         <div className="w-full bg-[#fbbf24] h-[15%]"></div>
                         <div className="w-full bg-[#3b82f6] h-[20%]"></div>
                         <div className="w-full bg-[#12ca49] h-[35%]"></div>
                         <span className="absolute -bottom-6 w-full text-center text-[11px] font-bold text-slate-500">Week 1</span>
                      </div>
                      {/* Week 2 */}
                      <div className="relative z-10 w-16 h-full flex flex-col justify-end gap-0.5 group">
                         <div className="w-full bg-[#94a3b8] h-[8%] rounded-t-sm"></div>
                         <div className="w-full bg-[#fbbf24] h-[12%]"></div>
                         <div className="w-full bg-[#3b82f6] h-[18%]"></div>
                         <div className="w-full bg-[#12ca49] h-[55%]"></div>
                         <span className="absolute -bottom-6 w-full text-center text-[11px] font-bold text-slate-500">Week 2</span>
                      </div>
                      {/* Week 3 */}
                      <div className="relative z-10 w-16 h-full flex flex-col justify-end gap-0.5 group">
                         <div className="w-full bg-[#94a3b8] h-[12%] rounded-t-sm"></div>
                         <div className="w-full bg-[#fbbf24] h-[10%]"></div>
                         <div className="w-full bg-[#3b82f6] h-[38%]"></div>
                         <div className="w-full bg-[#12ca49] h-[25%]"></div>
                         <span className="absolute -bottom-6 w-full text-center text-[11px] font-bold text-slate-500">Week 3</span>
                      </div>
                      {/* Week 4 */}
                      <div className="relative z-10 w-16 h-full flex flex-col justify-end gap-0.5 group">
                         <div className="w-full bg-[#94a3b8] h-[5%] rounded-t-sm"></div>
                         <div className="w-full bg-[#fbbf24] h-[18%]"></div>
                         <div className="w-full bg-[#3b82f6] h-[12%]"></div>
                         <div className="w-full bg-[#12ca49] h-[60%]"></div>
                         <span className="absolute -bottom-6 w-full text-center text-[11px] font-bold text-slate-500">Week 4</span>
                      </div>
                   </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm flex flex-col overflow-hidden">
                   <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h2 className="text-[17px] font-bold text-gray-900">Transaction History</h2>
                      <button className="flex items-center gap-2 border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                         <Filter className="w-4 h-4" /> Filter
                      </button>
                   </div>
                   
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-[#fbfcff] border-b border-gray-100">
                               <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider text-slate-400">Date</th>
                               <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider text-slate-400">Category</th>
                               <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider text-slate-400">Description</th>
                               <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider text-slate-400">Qty/Unit</th>
                               <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider text-slate-400">Cost (BWP)</th>
                               <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider text-slate-400">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 bg-white">
                            {/* Row 1 */}
                            <tr className="hover:bg-slate-50/50 transition-colors">
                               <td className="py-5 px-6 whitespace-nowrap">
                                  <div className="text-gray-900 font-medium text-sm">Oct<br/>24</div>
                               </td>
                               <td className="py-5 px-6 whitespace-nowrap">
                                  <span className="bg-[#e0efff] text-[#2563eb] text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">Vaccination</span>
                               </td>
                               <td className="py-5 px-6">
                                  <div className="text-gray-900 font-medium text-sm leading-tight">Anthrax Dose<br/><span className="text-gray-500">(Herd A)</span></div>
                               </td>
                               <td className="py-5 px-6 whitespace-nowrap text-slate-500 text-sm font-medium">50 units</td>
                               <td className="py-5 px-6 whitespace-nowrap text-gray-900 font-bold">750.00</td>
                               <td className="py-5 px-6 whitespace-nowrap text-[#ea580c] font-bold text-[13px] flex items-center gap-1.5">
                                  <Save className="w-4 h-4" /> Offline Saved
                               </td>
                            </tr>
                            {/* Row 2 */}
                            <tr className="hover:bg-slate-50/50 transition-colors">
                               <td className="py-5 px-6 whitespace-nowrap">
                                  <div className="text-gray-900 font-medium text-sm">Oct<br/>20</div>
                               </td>
                               <td className="py-5 px-6 whitespace-nowrap">
                                  <span className="bg-[#e5fcf0] text-[#16a34a] text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">Feed</span>
                               </td>
                               <td className="py-5 px-6">
                                  <div className="text-gray-900 font-medium text-sm leading-tight">Winter Lick<br/><span className="text-gray-500">(50kg)</span></div>
                               </td>
                               <td className="py-5 px-6 whitespace-nowrap text-slate-500 text-sm font-medium">10 bags</td>
                               <td className="py-5 px-6 whitespace-nowrap text-gray-900 font-bold">2,500.00</td>
                               <td className="py-5 px-6 whitespace-nowrap text-[#16a34a] font-bold text-[13px] flex items-center gap-1.5 mt-2">
                                  <CheckCircle2 className="w-4 h-4" /> Synced
                               </td>
                            </tr>
                            {/* Row 3 */}
                            <tr className="hover:bg-slate-50/50 transition-colors">
                               <td className="py-5 px-6 whitespace-nowrap">
                                  <div className="text-gray-900 font-medium text-sm">Oct<br/>18</div>
                               </td>
                               <td className="py-5 px-6 whitespace-nowrap">
                                  <span className="bg-[#fef3c7] text-[#d97706] text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">Supplements</span>
                               </td>
                               <td className="py-5 px-6">
                                  <div className="text-gray-900 font-medium text-sm leading-tight">Mineral<br className="md:hidden"/> Blocks</div>
                               </td>
                               <td className="py-5 px-6 whitespace-nowrap text-slate-500 text-sm font-medium">5 blocks</td>
                               <td className="py-5 px-6 whitespace-nowrap text-gray-900 font-bold">450.00</td>
                               <td className="py-5 px-6 whitespace-nowrap text-[#ea580c] font-bold text-[13px] flex items-center gap-1.5 mt-2">
                                  <Save className="w-4 h-4" /> Offline Saved
                               </td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                </div>

             </div>

             {/* Right Column (Actions & Alerts) */}
             <div className="w-full xl:w-[320px] flex flex-col gap-6">
                
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex flex-col gap-4">
                   <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-widest mb-1">Quick Actions</h3>
                   
                   <button className="w-full bg-[#12ca49] hover:bg-[#0fa63b] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(18,202,73,0.3)] transition active:scale-95">
                      <PlusCircle className="w-5 h-5 fill-black text-[#12ca49]" strokeWidth={1.5} /> Add Expense
                   </button>
                   
                   <button className="w-full bg-[#f8fafc] hover:bg-slate-100 text-gray-800 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-100 shadow-sm transition active:scale-95">
                      <FileText className="w-5 h-5" /> Log Input Usage
                   </button>
                   
                   <button className="w-full bg-[#f8fafc] hover:bg-slate-100 text-gray-800 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-100 shadow-sm transition active:scale-95">
                      <FileDown className="w-5 h-5" /> Export PDF Report
                   </button>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm flex flex-col gap-5">
                   <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-widest">Low Stock Alerts</h3>
                   
                   <div className="flex justify-between items-center bg-white">
                      <div>
                         <h4 className="text-gray-900 font-bold text-[14px] leading-tight mb-0.5">Anthrax Vaccine</h4>
                         <span className="text-red-500 font-medium text-xs">5 units left</span>
                      </div>
                      <button className="bg-[#e5fcf0] hover:bg-[#d1facd] text-[#16a34a] font-bold text-xs px-3 py-1.5 rounded-lg transition">
                         Restock
                      </button>
                   </div>
                   
                   <div className="flex justify-between items-center bg-white">
                      <div>
                         <h4 className="text-gray-900 font-bold text-[14px] leading-tight mb-0.5">Winter Lick</h4>
                         <span className="text-[#d97706] font-medium text-xs">12 bags left</span>
                      </div>
                      <button className="bg-[#e5fcf0] hover:bg-[#d1facd] text-[#16a34a] font-bold text-xs px-3 py-1.5 rounded-lg transition">
                         Restock
                      </button>
                   </div>
                </div>

                {/* Offline Mode Alert */}
                <div className="bg-[#e5fcf0] rounded-2xl p-6 border border-[#12ca49]/20 shadow-sm relative overflow-hidden flex flex-col gap-3">
                   <div className="flex items-center gap-2 text-[#16a34a] font-bold text-[13px]">
                      <Info className="w-4 h-4 fill-current text-white" /> Offline Mode Active
                   </div>
                   <p className="text-[#15803d] text-xs leading-relaxed font-medium">
                      You can continue adding expenses and logs. Your data is safely stored on your device and will sync automatically once connection is restored.
                   </p>
                </div>

             </div>
          </div>

        </div>
      </main>
      </div>
    </div>
  );
};

export default Reports;
