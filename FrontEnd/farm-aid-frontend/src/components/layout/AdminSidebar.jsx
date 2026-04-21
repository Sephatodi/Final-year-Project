import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Users, BookOpen, Settings, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-[#111827] text-gray-400 flex flex-col h-screen fixed left-0 top-0 border-r border-[#1f2937]">
      <div className="p-6">
        <div className="flex items-center gap-3 text-white mb-2">
          <div className="bg-[#2563eb] p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Farm-Aid PWA</h1>
            <p className="text-xs text-gray-500 font-semibold tracking-wider">ADMINISTRATOR</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#1f2937] text-white' : 'hover:bg-[#1f2937]'}`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium text-sm">Admin Home</span>
        </NavLink>
        <NavLink
          to="/admin/disease-monitoring"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#1e3a8a]/30 text-[#60a5fa] border border-[#1e3a8a]/50' : 'hover:bg-[#1f2937]'}`}
        >
          <Activity className="w-5 h-5" />
          <span className="font-medium text-sm">Disease Monitoring</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#1f2937] text-white' : 'hover:bg-[#1f2937]'}`}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium text-sm">User Management</span>
        </NavLink>
        <NavLink
          to="/admin/knowledge-base"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#1f2937] text-white' : 'hover:bg-[#1f2937]'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium text-sm">Knowledge Base</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-[#1f2937]">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#1f2937] text-white' : 'hover:bg-[#1f2937]'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">System Settings</span>
        </NavLink>
        <button
          onClick={() => {/* logout logic */ }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 text-red-400 transition-colors mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
