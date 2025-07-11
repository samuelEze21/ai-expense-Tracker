import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calendar, Tag, FileText, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useExpense, EXPENSE_CATEGORIES } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

const AddExpense = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { addExpense, loading } = useExpense();
  const { addToast } = useToast();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Please fix the errors in the form', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      if (result.success) {
        addToast('Expense added successfully!', 'success');
        navigate('/dashboard');
      } else {
        addToast(result.message || 'Failed to add expense', 'error');
        
        // Handle validation errors from backend
        if (result.errors) {
          const backendErrors = {};
          result.errors.forEach(error => {
            backendErrors[error.field] = error.message;
          });
          setErrors(backendErrors);
        }
      }
    } catch (error) {
      addToast('An unexpected error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/dashboard');
  };

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
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className={`
                inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors mb-4
                ${isDarkMode 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
            <p className={`mt-2 text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Track your spending by adding a new expense entry
            </p>
          </div>

          {/* Form */}
          <div className={`
            max-w-2xl mx-auto rounded-2xl p-6 transition-all duration-300
            ${isDarkMode 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-white border border-gray-200 shadow-lg'
            }
          `}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <FileText className="w-4 h-4 inline mr-2" />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Lunch at restaurant"
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                    }
                    ${errors.title ? 'border-red-500' : ''}
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                  `}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Amount and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                      }
                      ${errors.amount ? 'border-red-500' : ''}
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    `}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Tag className="w-4 h-4 inline mr-2" />
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-cyan-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                      }
                      ${errors.category ? 'border-red-500' : ''}
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    `}
                  >
                    <option value="">Select a category</option>
                    {EXPENSE_CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                    }
                    ${errors.date ? 'border-red-500' : ''}
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                  `}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any additional notes about this expense..."
                  rows={4}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors resize-none
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                    }
                    ${errors.description ? 'border-red-500' : ''}
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                  `}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
                <p className={`mt-1 text-xs ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="
                    flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white
                    px-6 py-3 rounded-xl font-medium transition-all duration-200
                    hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center
                  "
                >
                  {isSubmitting || loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Expense...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Expense
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting || loading}
                  className={`
                    flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200
                    ${isDarkMode 
                      ? 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddExpense;