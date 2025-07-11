import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { isDarkMode } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Expense', href: '/add-expense', icon: Plus },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
        border-r shadow-lg
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-between h-16 px-6 border-b ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <Link 
              to="/" 
              className="transition-opacity hover:opacity-80"
              onClick={() => setIsOpen(false)}
            >
              <h1 className={`text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
                ExpenseTracker
              </h1>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg' 
                      : isDarkMode 
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className={`
                flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${isDarkMode 
                  ? 'text-red-400 hover:text-red-300 hover:bg-slate-800' 
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }
              `}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;