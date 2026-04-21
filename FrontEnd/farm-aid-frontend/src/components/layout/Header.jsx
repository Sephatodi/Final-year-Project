import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Moon, Sun, User, LogOut, Menu, X, Settings, Bell } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Apply dark mode to document
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  const getUserInitial = () => {
    if (!user || !user.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full">
      {/* Top Banner - Botswana Announcement */}
      <div className="bg-[#1e9d56] text-white py-2 text-center text-sm font-medium">
        <span>🇧🇼 {t('announcement.setswana_support') || 'New: Setswana language support now available!'} 🇧🇼</span>
        <a href="#learn-more" className="ml-2 underline hover:text-green-100 font-semibold">
          {t('common.learn_more') || 'Learn more'}
        </a>
      </div>

      {/* Main Nav */}
      <nav className="bg-white dark:bg-gray-900 px-4 py-4 shadow-sm sticky top-0 z-50 transition-colors">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-[#1e9d56] p-1.5 rounded-md group-hover:bg-[#128042] transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#1a202c] dark:text-white font-bold text-xl tracking-tight">
              Farm-Aid
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] dark:hover:text-[#1e9d56] font-medium text-sm transition-colors">
              {t('About') || 'How It Works'}
            </Link>
            {user && (
            <Link to="/telehealth" className="text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] dark:hover:text-[#1e9d56] font-medium text-sm transition-colors">
              {t('Telehealth') || 'Telehealth'}
            </Link>
              )}
            <Link to="/knowledge-base" className="text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] dark:hover:text-[#1e9d56] font-medium text-sm transition-colors">
              {t('Knowledge') || 'Knowledge Base'}
            </Link>
           
            {user && (
              <Link to={getDashboardLink()} className="text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] dark:hover:text-[#1e9d56] font-medium text-sm transition-colors">
                {t('Dashboard') || 'Dashboard'}
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell (Optional) */}
                <button className="text-gray-500 dark:text-gray-400 hover:text-[#1e9d56] transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell className="w-5 h-5" />
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full pl-2 pr-3 py-1.5 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-[#1e9d56] flex items-center justify-center text-white text-xs font-bold">
                      {getUserInitial()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:inline">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] dark:hover:text-[#1e9d56] font-medium text-sm transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-[#1e9d56] hover:bg-[#128042] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e9d56]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
            {/* Mobile Nav Links */}
            <Link to="/about" className="block px-2 py-2 text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              {t('nav.how_it_works') || 'How It Works'}
            </Link>
            <Link to="/telehealth" className="block px-2 py-2 text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              {t('nav.telehealth') || 'Telehealth'}
            </Link>
            <Link to="/knowledge-base" className="block px-2 py-2 text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              {t('nav.knowledge') || 'Knowledge Base'}
            </Link>

            {user && (
              <Link to={getDashboardLink()} className="block px-2 py-2 text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] font-medium transition-colors">
                Dashboard
              </Link>
            )}

            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 w-full px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Mobile Auth Section */}
            {user ? (
              <>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-[#1e9d56] flex items-center justify-center text-white text-xs font-bold">
                      {getUserInitial()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                <Link to="/profile" className="flex items-center gap-3 px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-2 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/login"
                  className="text-center text-gray-600 dark:text-gray-300 hover:text-[#1e9d56] font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-center bg-[#1e9d56] hover:bg-[#128042] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 
