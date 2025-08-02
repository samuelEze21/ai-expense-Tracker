import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

const ExpenseContext = createContext();

// Categories for dropdown
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Bills & Utilities',
  'Education',
  'Travel',
  'Personal Care',
  'Other'
];

// Initial state
// In initialState, add currency to filters - around line 20
const initialState = {
  expenses: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  },
  summary: {
    totalAmount: 0,
    avgAmount: 0,
    maxAmount: 0,
    minAmount: 0,
    count: 0
  },
  filters: {
    category: 'all',
    startDate: '',
    endDate: '',
    search: '',
    currency: '' // Add currency filter
  },
  stats: {
    categoryStats: [],
    monthlyStats: [],
    recentExpenses: []
  }
};

// Action types
const EXPENSE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_EXPENSES: 'SET_EXPENSES',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_STATS: 'SET_STATS',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const expenseReducer = (state, action) => {
  switch (action.type) {
    case EXPENSE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case EXPENSE_ACTIONS.SET_EXPENSES:
      return {
        ...state,
        expenses: action.payload.expenses,
        pagination: action.payload.pagination,
        summary: action.payload.summary,
        loading: false,
        error: null
      };
    case EXPENSE_ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        summary: {
          ...state.summary,
          totalAmount: state.summary.totalAmount + action.payload.amount,
          count: state.summary.count + 1
        }
      };
    case EXPENSE_ACTIONS.UPDATE_EXPENSE:
      const updatedExpenses = state.expenses.map(expense =>
        expense._id === action.payload._id ? action.payload : expense
      );
      return {
        ...state,
        expenses: updatedExpenses
      };
    case EXPENSE_ACTIONS.DELETE_EXPENSE:
      const deletedExpense = state.expenses.find(e => e._id === action.payload);
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload),
        summary: {
          ...state.summary,
          totalAmount: state.summary.totalAmount - (deletedExpense?.amount || 0),
          count: state.summary.count - 1
        }
      };
    case EXPENSE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case EXPENSE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case EXPENSE_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case EXPENSE_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload
      };
    case EXPENSE_ACTIONS.RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const getExpensesRef = useRef(null);

  // Get expenses with filters and pagination
  const getExpenses = useCallback(async (page = 1, customFilters = {}, retryCount = 0) => {
    try {
      dispatch({ type: EXPENSE_ACTIONS.SET_LOADING, payload: true });
      
      // Clear any previous errors
      dispatch({ type: EXPENSE_ACTIONS.CLEAR_ERROR });
      
      const filters = { ...state.filters, ...customFilters };
      
      // Ensure currency is always set
      if (!filters.currency && window.selectedCurrency) {
        filters.currency = window.selectedCurrency.code;
        console.log('Using global currency from window:', window.selectedCurrency.code);
      } else if (!filters.currency) {
        // Fallback to NGN if no currency is specified
        filters.currency = 'NGN';
        console.log('No currency specified, defaulting to NGN');
      }
      
      console.log('Final filters for expense fetch:', filters);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });
      
      // Remove empty values EXCEPT currency - we always want to filter by currency
      for (const [key, value] of params.entries()) {
        if ((!value || value === 'all') && key !== 'currency') {
          params.delete(key);
        }
      }
      
      console.log('Fetching expenses with params:', Object.fromEntries(params.entries())); // Debug log
      
      // Add timeout to prevent hanging requests - increased to 15 seconds
      const response = await axios.get(`/api/expenses?${params}`, {
        timeout: 15000, // Increased to 15 seconds for better reliability
        // Add retry configuration
        retry: 2,
        retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000 // Exponential backoff
      });
      
      dispatch({
        type: EXPENSE_ACTIONS.SET_EXPENSES,
        payload: response.data.data
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      
      // Check if it's a timeout error and we haven't retried too many times
      if ((error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') && retryCount < 3) {
        console.log(`Request timed out, retrying (${retryCount + 1}/3)...`);
        // Wait a bit before retrying, with exponential backoff
        setTimeout(() => {
          getExpenses(page, customFilters, retryCount + 1);
        }, 1000 * Math.pow(2, retryCount)); // 1s, then 2s, then 4s for retries
        return;
      }
      
      // For timeout or connection errors, set empty expenses instead of showing error
      if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
        dispatch({
          type: EXPENSE_ACTIONS.SET_EXPENSES,
          payload: {
            expenses: [],
            pagination: {
              current: 1,
              pages: 1,
              total: 0,
              hasNext: false,
              hasPrev: false
            },
            summary: {
              totalAmount: 0,
              avgAmount: 0,
              maxAmount: 0,
              minAmount: 0,
              count: 0
            }
          }
        });
        
        // Also set a user-friendly error message
        dispatch({
          type: EXPENSE_ACTIONS.SET_ERROR,
          payload: 'Unable to connect to the server. Please check your internet connection or try again later.'
        });
      } else {
        // For other errors, show the error message
        dispatch({
          type: EXPENSE_ACTIONS.SET_ERROR,
          payload: error.response?.data?.message || 'Failed to fetch expenses. Please try again later.'
        });
      }
    } finally {
      dispatch({ type: EXPENSE_ACTIONS.SET_LOADING, payload: false });
    }
  }, [state.filters]);

  // Store the latest version of getExpenses in a ref
  useEffect(() => {
    getExpensesRef.current = getExpenses;
  }, [getExpenses]);

  // Set up the global currency filter updater with proper debouncing
  useEffect(() => {
    let timeoutId;
    
    window.updateExpenseCurrencyFilter = (currencyCode) => {
      dispatch({
        type: EXPENSE_ACTIONS.SET_FILTERS,
        payload: { ...state.filters, currency: currencyCode }
      });
      
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
      
      // Debounce the API call to prevent multiple rapid requests
      timeoutId = setTimeout(() => {
        // Use the ref to access the latest version of getExpenses
        if (getExpensesRef.current) {
          getExpensesRef.current(1);
        }
      }, 250); // 250ms debounce as requested
    };
    
    return () => {
      window.updateExpenseCurrencyFilter = () => {};
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [state.filters]); // Remove getExpenses from dependency array

  // Add expense
  // Add expense
  const addExpense = async (expenseData) => {
    try {
      console.log('Adding expense with data:', expenseData);
      const response = await axios.post('/api/expenses', expenseData);
      
      console.log('Expense added successfully:', response.data.data);
      
      dispatch({
        type: EXPENSE_ACTIONS.ADD_EXPENSE,
        payload: response.data.data
      });
      
      // Refresh stats after adding
      await getExpenseStats();
      
      // Refresh expenses with the current currency
      if (expenseData.currency === window.selectedCurrency?.code) {
        console.log('Refreshing expenses for current currency:', expenseData.currency);
        getExpenses(1, { currency: expenseData.currency });
      }
      
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error adding expense:', error);
      const message = error.response?.data?.message || 'Failed to add expense';
      dispatch({ type: EXPENSE_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message, errors: error.response?.data?.errors };
    }
  };

  // Update expense
  const updateExpense = async (id, expenseData) => {
    try {
      const response = await axios.put(`/api/expenses/${id}`, expenseData);
      
      dispatch({
        type: EXPENSE_ACTIONS.UPDATE_EXPENSE,
        payload: response.data.data
      });
      
      // Refresh stats after updating
      await getExpenseStats();
      
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update expense';
      dispatch({ type: EXPENSE_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message, errors: error.response?.data?.errors };
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      
      dispatch({
        type: EXPENSE_ACTIONS.DELETE_EXPENSE,
        payload: id
      });
      
      // Refresh stats after deleting
      await getExpenseStats();
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete expense';
      dispatch({ type: EXPENSE_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Get expense statistics
  // Update getExpenseStats to use currency filter - around line 240
  const getExpenseStats = async () => {
    try {
      const params = new URLSearchParams();
      if (state.filters.currency) {
        params.append('currency', state.filters.currency);
      }
      
      const response = await axios.get(`/api/expenses/stats?${params}`);
      
      dispatch({
        type: EXPENSE_ACTIONS.SET_STATS,
        payload: response.data.data
      });
      
      return response.data.data;
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch expense statistics'
      });
      return null;
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: EXPENSE_ACTIONS.SET_FILTERS, payload: filters });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: EXPENSE_ACTIONS.CLEAR_ERROR });
  };

  // Reset state (useful for logout)
  const resetState = () => {
    dispatch({ type: EXPENSE_ACTIONS.RESET_STATE });
  };

  const value = {
    ...state,
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
    setFilters,
    clearError,
    resetState
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};