import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css';

// Configure axios defaults
axios.defaults.timeout = 15000; // Increase to 15 seconds for better reliability
axios.defaults.maxContentLength = 5000000; // 5MB
axios.defaults.maxBodyLength = 5000000; // 5MB

// Add request interceptor for retry logic
axios.interceptors.request.use(config => {
  // Set default retry config if not exists
  config.retry = config.retry || 2;
  config.retryDelay = config.retryDelay || ((retryCount) => Math.pow(2, retryCount) * 1000);
  return config;
});

// Add response interceptor to handle timeouts gracefully and implement retry
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // If we've already retried the maximum number of times, reject
    if (config._retryCount >= config.retry) {
      if (error.code === 'ECONNABORTED') {
        console.log('Request timed out - server may be slow or unavailable');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('Connection refused - backend server may not be running');
      }
      return Promise.reject(error);
    }
    
    // Set retry count
    config._retryCount = config._retryCount || 0;
    config._retryCount++;
    
    // Create new promise to handle retry
    const retryDelay = config.retryDelay(config._retryCount);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    
    // Return the retry request
    return axios(config);
  }
);

// Add a global function to update expense currency filter
// This will be properly implemented when the ExpenseContext is available
window.updateExpenseCurrencyFilter = (currencyCode) => {
  console.log(`Currency changed to ${currencyCode}, refreshing expenses...`);
  // The actual implementation will be set by ExpenseContext
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <ExpenseProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </ExpenseProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);