import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Tractor, User, Bell, Settings, LogOut, ChevronDown
} from 'lucide-react';

const CommonNavbar = ({ pageName = 'Farm-Aid', userRole = 'Farmer' }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Left - Logo & Page Name */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="bg-[#12ca49] p-2 rounded-xl">
            <Tractor className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-gray-900 text-lg block">Farm-Aid</span>
            <span className="text-gray-500 text-xs font-medium">{pageName}</span>
          </div>
        </Link>
      </div>

      {/* Center - Navigation (if needed for specific page) */}
      <div className="flex-1" />

      {/* Right - User Menu & Actions */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <Link to="/notification-center" className="relative text-gray-400 hover:text-gray-600 transition">
          <Bell className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Link>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#12ca49] to-[#0a8c2c] flex items-center justify-center border-2 border-white shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900">Farmer</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CommonNavbar;
