import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calendar, Tag, FileText, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useExpense, EXPENSE_CATEGORIES } from '../context/ExpenseContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

const AddExpense = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { addExpense, loading } = useExpense();
  const { selectedCurrency } = useCurrency();
  const { addToast } = useToast();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    currency: selectedCurrency.code // Add currency to form data
  });

  // Update currency when selectedCurrency changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      currency: selectedCurrency.code
    }));
  }, [selectedCurrency]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
  
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      currency: selectedCurrency.code // Ensure current currency is used
    };
  
    console.log('Adding expense with currency:', expenseData.currency);
  
    const result = await addExpense(expenseData);
    
    if (result.success) {
      addToast('Expense added successfully!', 'success');
      navigate('/dashboard');
    } else {
      addToast(result.message || 'Failed to add expense', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <TopNavbar setSidebarOpen={setSidebarOpen} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className={`
                inline-flex items-center text-sm font-medium mb-4 transition-colors
                ${isDarkMode 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-900'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Add New Expense
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Track your spending with detailed expense information
            </p>
          </div>

          {/* Form */}
          <div className={`
            max-w-2xl rounded-2xl p-8 transition-all duration-300
            ${isDarkMode 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-white border border-gray-200 shadow-lg'
            }
          `}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Expense Title *
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter expense title"
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border transition-colors
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    `}
                    required
                  />
                </div>
              </div>

              {/* Amount with Currency Display */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Amount ({selectedCurrency.code}) *
                </label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`}>
                    <span className="font-medium">{selectedCurrency.symbol}</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border transition-colors
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    `}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Category *
                </label>
                <div className="relative">
                  <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border transition-colors appearance-none
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-cyan-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    `}
                    required
                  >
                    <option value="">Select a category</option>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Date *
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border transition-colors
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-cyan-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    `}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  rows={4}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors resize-none
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                  `}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600
                  text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700
                  transition-all duration-300 transform hover:scale-105 shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                "
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Adding Expense...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Expense
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddExpense;