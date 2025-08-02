import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Homepage from './pages/Homepage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddExpense from './pages/AddExpense.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <ExpenseProvider>
            <ToastProvider>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/add-expense" element={
                  <ProtectedRoute>
                    <AddExpense />
                  </ProtectedRoute>
                } />
                {/* Add more protected routes as needed */}
              </Routes>
            </ToastProvider>
          </ExpenseProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;