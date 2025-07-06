import React from 'react';
import { Menu, Bell, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const TopNavbar = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`
      sticky top-0 z-30 h-16 border-b backdrop-blur-sm
      ${isDarkMode 
        ? 'bg-slate-900/95 border-slate-700 text-white' 
        : 'bg-white/95 border-gray-200 text-gray-900'
      }
    `}>
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`
              p-2 rounded-md lg:hidden transition-colors
              ${isDarkMode 
                ? 'hover:bg-slate-800 text-slate-300' 
                : 'hover:bg-gray-100 text-gray-600'
              }
            `}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className={`ml-2 text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`
              p-2 rounded-xl transition-all duration-200
              ${isDarkMode 
                ? 'hover:bg-slate-800 text-slate-300' 
                : 'hover:bg-gray-100 text-gray-600'
              }
            `}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className={`
            relative p-2 rounded-xl transition-all duration-200
            ${isDarkMode 
              ? 'hover:bg-slate-800 text-slate-300' 
              : 'hover:bg-gray-100 text-gray-600'
            }
          `}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.name}
              </p>
              <p className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {user?.email}
              </p>
            </div>
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold
            `}>
              {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;