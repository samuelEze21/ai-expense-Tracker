import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import TopNavbar from '../components/TopNavbar.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import Charts from '../components/Charts.jsx';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <TopNavbar setSidebarOpen={setSidebarOpen} />
        
        {/* Main content area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Summary Cards */}
          <SummaryCards />
          
          {/* Charts */}
          <Charts />
          
          {/* Recent Transactions */}
          <div className={`
            mt-8 rounded-2xl p-6 transition-all duration-300
            ${isDarkMode 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-white border border-gray-200 shadow-lg'
            }
          `}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Transactions
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className={`
                  flex items-center justify-between p-4 rounded-xl transition-colors
                  ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}
                `}>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">🛒</span>
                    </div>
                    <div>
                      <p className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Grocery Shopping
                      </p>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        Food & Dining • Today
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    -$45.67
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;