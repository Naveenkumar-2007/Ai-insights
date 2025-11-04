import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, BarChart3, Activity, Menu, X, Home, Info, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const menuRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Swipe to close menu
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    
    // Close menu on left swipe
    if (isLeftSwipe && isOpen) {
      setIsOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/prediction', label: 'Start Predicting', icon: Activity },
    { path: '/about', label: 'About', icon: Info }
  ];

  const getUserInitial = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white dark:bg-dark-card/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-dark-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Premium Animated Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Advanced Animated Stock Chart Logo */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Rotating outer glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 dark:from-cyan-400/30 dark:via-blue-400/30 dark:to-purple-400/30 blur-lg animate-pulse-glow"></div>
              
              {/* Rotating border gradient */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 animate-spin-slow opacity-50" style={{ WebkitMaskImage: 'linear-gradient(0deg, transparent 0%, black 50%, transparent 100%)', maskImage: 'linear-gradient(0deg, transparent 0%, black 50%, transparent 100%)' }}></div>
              
              {/* Main logo container */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden group-hover:scale-110 transition-transform duration-300">
                {/* Animated candlestick bars */}
                <div className="absolute bottom-1 left-1 w-0.5 bg-gradient-to-t from-green-500 to-green-400 animate-bar-1" style={{ height: '35%' }}></div>
                <div className="absolute bottom-1 left-2 w-0.5 bg-gradient-to-t from-red-500 to-red-400 animate-bar-2" style={{ height: '20%' }}></div>
                <div className="absolute bottom-1 left-3 w-0.5 bg-gradient-to-t from-green-500 to-green-400 animate-bar-3" style={{ height: '45%' }}></div>
                <div className="absolute bottom-1 left-4 w-0.5 bg-gradient-to-t from-green-500 to-green-400 animate-bar-4" style={{ height: '55%' }}></div>
                <div className="absolute bottom-1 right-3 w-0.5 bg-gradient-to-t from-red-500 to-red-400 animate-bar-5" style={{ height: '25%' }}></div>
                <div className="absolute bottom-1 right-1 w-0.5 bg-gradient-to-t from-green-500 to-green-400 animate-bar-6" style={{ height: '60%' }}></div>
                
                {/* Animated trend line */}
                <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M 0,80 Q 25,70 50,45 T 100,20" 
                    stroke="url(#navLineGradient)" 
                    strokeWidth="3" 
                    fill="none"
                    className="animate-draw-line"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                  />
                  <defs>
                    <linearGradient id="navLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Center icon badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 flex items-center justify-center shadow-lg animate-float-subtle">
                  <div className="animate-icon-rotate-fast">
                    <BarChart3 className="absolute w-3.5 h-3.5 text-white animate-fade-1" />
                    <TrendingUp className="absolute w-3.5 h-3.5 text-white animate-fade-2" />
                    <Activity className="absolute w-3.5 h-3.5 text-white animate-fade-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Branding Text */}
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                AI Stock Price Predictions
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Powered by <span className="font-semibold text-cyan-600 dark:text-cyan-400">AI Insights</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(path) 
                    ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-dark-elevated'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {currentUser ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {getUserInitial()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{getUserName()}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors active:scale-95 text-gray-600 dark:text-gray-300"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu with swipe support and overlay */}
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm top-16"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile menu panel with swipe */}
            <div 
              className="md:hidden absolute left-0 right-0 bg-white dark:bg-dark-elevated shadow-lg rounded-b-2xl border-t border-gray-200 dark:border-dark-border max-h-[calc(100vh-4rem)] overflow-y-auto"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="py-4 px-2">
                <div className="flex flex-col gap-1">
                  {navLinks.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all active:scale-98 ${
                        isActive(path)
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-base">{label}</span>
                    </Link>
                  ))}

                  {/* Theme Toggle in Mobile Menu */}
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-all active:scale-98"
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span className="text-base font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  {currentUser ? (
                    <>
                      <div className="border-t border-gray-200 dark:border-dark-border my-2" />
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-all active:scale-98"
                      >
                        <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                          {getUserInitial()}
                        </div>
                        <span className="text-base font-medium">{getUserName()}</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-gray-200 dark:border-dark-border my-2" />
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-4 text-center font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-all active:scale-98"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-4 text-center font-semibold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl hover:shadow-lg active:scale-98 transition-all"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                  
                  {/* Swipe hint */}
                  <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-500">
                    Swipe left to close
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Premium CSS Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }

        @keyframes draw-line {
          to { strokeDashoffset: 0; }
        }

        @keyframes icon-rotate-fast {
          0%, 100% { transform: rotate(0deg); }
          33% { transform: rotate(120deg); }
          66% { transform: rotate(240deg); }
        }

        @keyframes fade-1 {
          0%, 100% { opacity: 1; }
          33%, 66% { opacity: 0; }
        }

        @keyframes fade-2 {
          0%, 100% { opacity: 0; }
          33% { opacity: 1; }
          66% { opacity: 0; }
        }

        @keyframes fade-3 {
          0%, 100% { opacity: 0; }
          33% { opacity: 0; }
          66% { opacity: 1; }
        }

        @keyframes bar-1 {
          0%, 100% { height: 35%; }
          50% { height: 50%; }
        }

        @keyframes bar-2 {
          0%, 100% { height: 20%; }
          50% { height: 35%; }
        }

        @keyframes bar-3 {
          0%, 100% { height: 45%; }
          50% { height: 30%; }
        }

        @keyframes bar-4 {
          0%, 100% { height: 55%; }
          50% { height: 65%; }
        }

        @keyframes bar-5 {
          0%, 100% { height: 25%; }
          50% { height: 15%; }
        }

        @keyframes bar-6 {
          0%, 100% { height: 60%; }
          50% { height: 70%; }
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-float-subtle {
          animation: float-subtle 3s ease-in-out infinite;
        }

        .animate-draw-line {
          animation: draw-line 3s ease-in-out infinite;
        }

        .animate-icon-rotate-fast {
          animation: icon-rotate-fast 4s ease-in-out infinite;
        }

        .animate-fade-1 {
          animation: fade-1 4s ease-in-out infinite;
        }

        .animate-fade-2 {
          animation: fade-2 4s ease-in-out infinite;
        }

        .animate-fade-3 {
          animation: fade-3 4s ease-in-out infinite;
        }

        .animate-bar-1 {
          animation: bar-1 1.8s ease-in-out infinite;
        }

        .animate-bar-2 {
          animation: bar-2 2.1s ease-in-out infinite;
        }

        .animate-bar-3 {
          animation: bar-3 1.6s ease-in-out infinite;
        }

        .animate-bar-4 {
          animation: bar-4 2.3s ease-in-out infinite;
        }

        .animate-bar-5 {
          animation: bar-5 1.9s ease-in-out infinite;
        }

        .animate-bar-6 {
          animation: bar-6 1.7s ease-in-out infinite;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;