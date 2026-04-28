import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Wifi, 
  WifiOff, 
  ShieldCheck,
  User,
  Bell
} from 'lucide-react';

const Navbar = ({ 
  title = 'Farm-Aid', 
  subtitle = '',
  showBack = true,
  backTo = getDashboardLink(),
  isOnline = true,
  isConnected = false
}) => {
  const [connectionStatus, setConnectionStatus] = useState(isOnline);
 
const { user } = useAuth();
// Utility to determine dashboard link based on user role
const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'farmer':
        return '/dashboard';
      case 'veterinarian':
        return '/vet-dashboard';
      case 'admin':
        return '/admin-console';
      default:
        return '/';
    }
  };
  useEffect(() => {
    const handleOnline = () => setConnectionStatus(true);
    const handleOffline = () => setConnectionStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {showBack && (
          <Link 
            to={getDashboardLink()} 
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00E5C1] to-[#009680] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">🐄</span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-none">{title}</h1>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2 text-xs font-bold">
          {connectionStatus ? (
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
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse ml-1"></div>
          )}
        </div>

        {/* Security Info */}
        <div className="hidden md:flex flex-col items-end text-right">
          <div className="text-[10px] font-black text-green-600 uppercase tracking-widest">End-to-End Encrypted</div>
          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Government Protected</div>
        </div>

        {/* Notification & Profile */}
        <div className="flex items-center gap-3">
          

          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition">
            <ShieldCheck className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
