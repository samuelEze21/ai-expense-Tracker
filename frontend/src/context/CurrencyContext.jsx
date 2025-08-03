import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

// Top 20 currencies with their symbols and names
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' }
];

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    // Get from localStorage or default to USD
    const saved = localStorage.getItem('selectedCurrency');
    return saved ? JSON.parse(saved) : CURRENCIES[0]; // USD as default
  });

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency));
  }, [selectedCurrency]);

  // Update user profile with selected currency (optional)
  const updateUserCurrency = async (currency) => {
    try {
      await axios.put('/api/auth/profile', {
        preferredCurrency: currency.code
      });
    } catch (error) {
      console.error('Failed to update user currency preference:', error);
    }
  };

  // Add a function to load user's preferred currency - around line 40
  const loadUserCurrency = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      if (response.data.success && response.data.data.preferredCurrency) {
        const userCurrency = CURRENCIES.find(
          c => c.code === response.data.data.preferredCurrency
        );
        if (userCurrency) {
          setSelectedCurrency(userCurrency);
        }
      }
    } catch (error) {
      console.error('Failed to load user currency preference:', error);
      // Don't show error to user, just use the default from localStorage
    }
  };
  
  // Call this function when the component mounts - after the useState hook
  useEffect(() => {
    loadUserCurrency();
  }, []);
  
  // Update the changeCurrency function
  const changeCurrency = async (currency) => {
    console.log('Changing currency to:', currency.code);
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
    
    // Make currency available globally
    window.selectedCurrency = currency;
    
    try {
      // Update user preference in backend
      await axios.put('/api/auth/profile', {
        preferredCurrency: currency.code
      }).catch(err => {
        // Silently fail if backend is not available
        console.log('Could not update user currency preference');
      });
      
      // Use the ExpenseContext directly
      if (window.updateExpenseCurrencyFilter) {
        console.log('Calling updateExpenseCurrencyFilter with:', currency.code);
        window.updateExpenseCurrencyFilter(currency.code);
      } else {
        console.warn('updateExpenseCurrencyFilter not available');
      }
    } catch (error) {
      console.error('Failed to update currency preference:', error);
    }
  };
  
  // Set global currency when component mounts
  useEffect(() => {
    window.selectedCurrency = selectedCurrency;
    console.log('Global currency set to:', selectedCurrency.code);
    
    // Initialize the updateExpenseCurrencyFilter function if not already set
    if (!window.updateExpenseCurrencyFilter) {
      console.log('Setting up global updateExpenseCurrencyFilter function');
      window.updateExpenseCurrencyFilter = (code) => {
        console.log(`Currency filter updated to ${code}`);
      };
    }
  }, []);

  // Get currency symbol by code
  const getCurrencySymbol = (code) => {
    const currency = CURRENCIES.find(c => c.code === code);
    return currency ? currency.symbol : '$';
  };

  // Format amount with currency
  const formatAmount = (amount, currencyCode = selectedCurrency.code) => {
    const symbol = getCurrencySymbol(currencyCode);
    // For Naira, ensure the symbol is displayed correctly
    if (currencyCode === 'NGN') {
      return `₦${parseFloat(amount).toFixed(2)}`;
    }
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  const value = {
    selectedCurrency,
    currencies: CURRENCIES,
    changeCurrency,
    getCurrencySymbol,
    formatAmount
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};