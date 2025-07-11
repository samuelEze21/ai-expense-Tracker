import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useExpense } from '../context/ExpenseContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import TopNavbar from '../components/TopNavbar.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import Charts from '../components/Charts.jsx';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { expenses, loading, getExpenses, error } = useExpense();

  // Load expenses when dashboard mounts
  useEffect(() => {
    getExpenses(); // Changed from loadExpenses to getExpenses
  }, [getExpenses]);

  // Get recent transactions (last 5)
  const recentTransactions = expenses.slice(0, 5);

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
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>Error: {error}</p>
            </div>
          )}
          
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
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                  <p className={`mt-2 text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>Loading expenses...</p>
                </div>
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((expense) => (
                  <div key={expense._id} className={`
                    flex items-center justify-between p-4 rounded-xl transition-colors
                    ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}
                  `}>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">💰</span>
                      </div>
                      <div>
                        <p className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {expense.title}
                        </p>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      -${expense.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  <p>No transactions yet. Start by adding your first expense!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;