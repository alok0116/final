import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMapPin, FiPlusCircle, FiList, FiMap, FiShield, FiHome } from 'react-icons/fi';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <FiHome className="w-4 h-4" /> },
    { name: 'Dashboard / File Issue', path: '/dashboard', icon: <FiPlusCircle className="w-4 h-4" /> },
    { name: 'History', path: '/history', icon: <FiList className="w-4 h-4" /> },
    { name: 'Live Map', path: '/map', icon: <FiMap className="w-4 h-4" /> },
    { name: 'Admin Dashboard', path: '/admin', icon: <FiShield className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transform group-hover:scale-105 transition-transform duration-200">
                <FiMapPin className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent">
                CityFix AI
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.icon}
                  <span className="hidden md:inline">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
