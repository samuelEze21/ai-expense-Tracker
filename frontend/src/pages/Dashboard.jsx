import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, BarChart3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useExpense } from '../context/ExpenseContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import TopNavbar from '../components/TopNavbar.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import Charts from '../components/Charts.jsx';

// Move EmptyState outside Dashboard component
const EmptyState = ({ isDarkMode, selectedCurrency, navigate }) => {
  return (
    <div className={`
      flex flex-col items-center justify-center py-16 px-6 text-center
      ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}
    `}>
      <div className={`
        w-24 h-24 rounded-full mb-6 flex items-center justify-center
        ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}
      `}>
        <TrendingUp className={`w-12 h-12 ${
          isDarkMode ? 'text-slate-400' : 'text-gray-400'
        }`} />
      </div>
      <h3 className={`text-2xl font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        No expenses in {selectedCurrency.code}
      </h3>
      <p className={`text-lg mb-8 max-w-md ${
        isDarkMode ? 'text-slate-400' : 'text-gray-500'
      }`}>
        Start tracking your expenses in {selectedCurrency.code} to see insights, charts, and analytics about your spending habits.
      </p>
      <button
        onClick={() => navigate('/add-expense')}
        className="
          inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600
          text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700
          transition-all duration-300 transform hover:scale-105 shadow-lg
        "
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Your First {selectedCurrency.code} Expense
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { expenses, loading, getExpenses, error } = useExpense();
  const { selectedCurrency, formatAmount } = useCurrency(); // Add formatAmount
  const navigate = useNavigate();

  // Load expenses when dashboard mounts or currency changes
  useEffect(() => {
    console.log('Dashboard loading expenses with currency:', selectedCurrency.code);
    // Force a refresh with the current currency
    getExpenses(1, { currency: selectedCurrency.code });
  }, [getExpenses, selectedCurrency.code]); // Add selectedCurrency.code as dependency

  // Check if user has any expenses
  const hasExpenses = expenses && expenses.length > 0;

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
          {/* Only show error if it's not a timeout error */}
          {error && !error.includes('timeout') && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>Error: {error}</p>
            </div>
          )}
          
          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
              <p className={`ml-4 text-lg ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>Loading your dashboard...</p>
            </div>
          ) : hasExpenses ? (
            // Dashboard with data
            <>
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
                  {recentTransactions.map((expense) => (
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
                        -{formatAmount(expense.amount, expense.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <EmptyState 
              isDarkMode={isDarkMode} 
              selectedCurrency={selectedCurrency} 
              navigate={navigate} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;