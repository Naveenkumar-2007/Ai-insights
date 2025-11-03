import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Menu, X, Home, Activity, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();
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
    { path: '/prediction', label: 'Prediction', icon: Activity },
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
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-brand-50/60" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-brand-text">AI Insights</h1>
              <p className="text-xs text-brand-muted hidden sm:block">Powered by AI technology</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(path) ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-brand-muted hover:text-brand-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {currentUser ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitial()}
                </div>
                <span className="text-sm font-medium text-brand-text uppercase">{getUserName()}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-text">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-hover shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - Larger touch target */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-3 rounded-lg hover:bg-brand-50 transition-colors active:scale-95"
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
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm top-16"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile menu panel with swipe */}
            <div 
              className="md:hidden absolute left-0 right-0 bg-white shadow-lg rounded-b-2xl border-t border-brand-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
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
                          ? 'bg-brand text-white shadow-md'
                          : 'text-brand-muted hover:bg-brand-50 active:bg-brand-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-base">{label}</span>
                    </Link>
                  ))}

                  {currentUser ? (
                    <>
                      <div className="border-t border-brand-50 my-2" />
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 text-brand-text hover:bg-brand-50 active:bg-brand-100 rounded-xl transition-all active:scale-98"
                      >
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {getUserInitial()}
                        </div>
                        <span className="text-base font-medium">{getUserName()}</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-brand-50 my-2" />
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-4 text-center font-medium text-brand-muted hover:bg-brand-50 active:bg-brand-100 rounded-xl transition-all active:scale-98"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-4 text-center font-medium text-white bg-brand rounded-xl hover:bg-brand-hover active:scale-98 transition-all shadow-md"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                  
                  {/* Swipe hint */}
                  <div className="text-center py-2 text-xs text-brand-muted">
                    Swipe left to close
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;