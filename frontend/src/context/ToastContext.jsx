import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { isDarkMode } = useTheme();

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getToastStyles = (type) => {
    const baseStyles = `flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform`;
    const darkStyles = isDarkMode ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-gray-900 border border-gray-200';
    
    switch (type) {
      case 'success':
        return `${baseStyles} ${darkStyles} border-l-4 border-l-green-500`;
      case 'error':
        return `${baseStyles} ${darkStyles} border-l-4 border-l-red-500`;
      case 'warning':
        return `${baseStyles} ${darkStyles} border-l-4 border-l-yellow-500`;
      default:
        return `${baseStyles} ${darkStyles} border-l-4 border-l-blue-500`;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={getToastStyles(toast.type)}
            style={{
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div className={`mr-3 ${getIconColor(toast.type)}`}>
              {getIcon(toast.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-3 p-1 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};