import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';

const CurrencySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { selectedCurrency, currencies, changeCurrency } = useCurrency();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencySelect = (currency) => {
    changeCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200
          ${isDarkMode 
            ? 'hover:bg-slate-800 text-slate-300 border border-slate-600' 
            : 'hover:bg-gray-100 text-gray-600 border border-gray-300'
          }
        `}
      >
        <span className="font-medium text-sm">
          {selectedCurrency.symbol} {selectedCurrency.code}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute right-0 mt-2 w-64 rounded-xl shadow-lg border z-50
          ${isDarkMode 
            ? 'bg-slate-800 border-slate-600' 
            : 'bg-white border-gray-200'
          }
        `}>
          <div className="max-h-64 overflow-y-auto">
            <div className={`p-2 border-b ${
              isDarkMode ? 'border-slate-600' : 'border-gray-200'
            }`}>
              <p className={`text-xs font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Select Currency
              </p>
            </div>
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 text-left transition-colors
                  ${isDarkMode 
                    ? 'hover:bg-slate-700 text-slate-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                  ${selectedCurrency.code === currency.code 
                    ? (isDarkMode ? 'bg-slate-700' : 'bg-gray-50') 
                    : ''
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-sm">
                    {currency.symbol}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{currency.code}</p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {currency.name}
                    </p>
                  </div>
                </div>
                {selectedCurrency.code === currency.code && (
                  <Check className="w-4 h-4 text-cyan-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;