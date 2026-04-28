import React from 'react';
import { NavLink ,Link} from 'react-router-dom';
import { LayoutDashboard, Users, Activity, FileText, Settings, HelpCircle, LogOut, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
   const { t } = useTranslation();

   return (
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 shadow-sm z-50">

         {/* Brand Header */}
         <div className="h-20 flex items-center px-6 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2 font-bold text-[#1e9d56] text-xl tracking-tight cursor-pointer">
               <div className="bg-[#1e9d56] p-1.5 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <circle cx="7" cy="17" r="3" />
                     <circle cx="17" cy="17" r="3" />
                     <line x1="14" y1="17" x2="14" y2="17" />
                     <path d="M7 14h10l2-4H5l-1-4h18" />
                  </svg>
               </div>
               <span className="text-gray-900">Farm-Aid</span>
            </div>
         </div>

         {/* Navigation Links */}
         <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            <NavLink
               to="/dashboard"
               className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#f0fdf4] text-[#16a34a] font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`
               }
            >
               <LayoutDashboard className="w-5 h-5" /> {t('Dashboard') || 'Dashboard'}
            </NavLink>

            <NavLink
               to="/herd"
               className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#f0fdf4] text-[#16a34a] font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`
               }
            >
               <Users className="w-5 h-5" /> {t('nav.herd') || 'Herd Records'}
            </NavLink>

            <NavLink
               to="/symptom-checker"
               className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#f0fdf4] text-[#16a34a] font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`
               }
            >
               <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5" /> {t('nav.symptoms') || 'Symptom Checker'}
               </div>
               <span className="bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</span>
            </NavLink>

            <NavLink
               to="/knowledge-base"
               className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#f0fdf4] text-[#16a34a] font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`
               }
            >
               <BookOpen className="w-5 h-5" /> {t('nav.knowledge') || 'Knowledge Base'}
            </NavLink>

            <NavLink
               to="/reports"
               className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#f0fdf4] text-[#16a34a] font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`
               }
            >
               <FileText className="w-5 h-5" /> {t('nav.reports') || 'Reports'}
            </NavLink>
         </nav>

         {/* Footer Nav */}
         <div className="p-4 border-t border-gray-100 space-y-1 shrink-0">
            <NavLink to="/help" className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-lg text-sm transition-colors">
               <HelpCircle className="w-4 h-4" /> {t('nav.help') || 'Help & Support'}
            </NavLink>
            <NavLink to="/settings" className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-lg text-sm transition-colors">
               <Settings className="w-4 h-4" /> {t('nav.settings') || 'Settings'}
            </NavLink>
            <button
               onClick={() => {/* handle logout */ }}
               className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 font-bold rounded-lg text-sm transition-colors mt-4"
            >
               <LogOut className="w-4 h-4" /> {t('nav.logout') || 'Sign Out'}
            </button>
         </div>
      </aside>
   );
};

export default Sidebar;
