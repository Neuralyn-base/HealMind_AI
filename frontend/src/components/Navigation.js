import React, { useState, useEffect } from 'react';
import { Menu, X, Brain, LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { useUser } from './UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation = ({ onTryFree }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navigation on /auth route
  if (location.pathname === '/auth') return null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#founder' },
    { name: 'Blog', href: '#blog' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass backdrop-blur-2xl shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">HealMind AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-neutral-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={logout}
                  className="text-neutral-700 hover:text-primary-600 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
                <div className="relative group">
                  <UserAvatar user={user} size="sm" className="cursor-pointer" />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 hidden group-hover:block animate-fade-in">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-semibold text-neutral-900">{user.name}</p>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button 
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors" 
                  onClick={() => navigate('/auth')}
                >
              Sign In
            </button>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/auth')}
                >
                  Sign Up
            </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-2xl shadow-lg mt-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-neutral-700 hover:text-primary-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <UserAvatar user={user} size="sm" />
                      <div>
                        <p className="font-semibold text-neutral-900">{user.name}</p>
                        <p className="text-sm text-neutral-500">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-3 py-2 text-red-600 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="block w-full text-left px-3 py-2 text-primary-600 font-medium"
                      onClick={() => { setIsOpen(false); navigate('/auth'); }}
                    >
                  Sign In
                </button>
                    <button 
                      className="block w-full btn-primary text-center" 
                      onClick={() => { setIsOpen(false); if (onTryFree) onTryFree(); }}
                    >
                  Try Free
                </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;