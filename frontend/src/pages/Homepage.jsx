import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Homepage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AI ExpenseTracker
                </h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="text-slate-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </a>
                <a href="#features" className="text-slate-400 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-slate-400 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors">
                  Pricing
                </a>
                <a href="#contact" className="text-slate-400 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-cyan-400 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Track Your Expenses
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Smarter with AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your financial management with AI-powered categorization, 
              real-time insights, and intelligent expense tracking across all your devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-cyan-500/25 hover:scale-105"
              >
                Get Started Free
              </button>
              <button className="border-2 border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 hover:bg-slate-800/50">
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Dashboard Mockup */}
          <div className="mt-20">
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
                <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl p-8 text-center border border-cyan-500/20">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Dashboard</h3>
                    <p className="text-slate-300">Smart insights and automated categorization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">Smart Expense Management</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of expense tracking with AI-driven insights and seamless automation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border border-cyan-200/50">
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">AI Categorization</h3>
              <p className="text-slate-600">Automatically categorize expenses with 95% accuracy using advanced machine learning.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-200/50">
              <div className="text-5xl mb-6">🏷️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Smart Auto-Tagging</h3>
              <p className="text-slate-600">Intelligent tagging system that learns from your spending patterns and preferences.</p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border border-emerald-200/50">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Real-Time Tracking</h3>
              <p className="text-slate-600">Monitor your expenses instantly with live updates and real-time notifications.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border border-orange-200/50">
              <div className="text-5xl mb-6">📱</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Multi-Device Sync</h3>
              <p className="text-slate-600">Access your data seamlessly across all devices with cloud synchronization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:border-slate-600">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
                <div className="text-5xl font-bold text-white mb-2">$0</div>
                <p className="text-slate-400 mb-8">per month</p>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Up to 100 transactions/month</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Basic AI categorization</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Mobile app access</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Basic reporting</span>
                  </li>
                </ul>
                
                <button 
                  onClick={handleGetStarted}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-cyan-500/30 hover:shadow-xl transition-all duration-300 hover:border-cyan-400/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
                <div className="text-5xl font-bold text-white mb-2">$9</div>
                <p className="text-slate-400 mb-8">per month</p>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Unlimited transactions</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Advanced AI insights</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Custom categories</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Export & integrations</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-400 mr-3">✓</span>
                    <span className="text-slate-300">Priority support</span>
                  </li>
                </ul>
                
                <button 
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
                >
                  Start Pro Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what our users are saying about their experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-slate-600 mb-6">"This app has completely transformed how I manage my finances. The AI categorization is incredibly accurate!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  S
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Sarah Johnson</p>
                  <p className="text-slate-500 text-sm">Freelance Designer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-slate-600 mb-6">"The real-time tracking and insights have helped me save over $500 this month. Highly recommended!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  M
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Michael Chen</p>
                  <p className="text-slate-500 text-sm">Software Engineer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-slate-600 mb-6">"Simple, elegant, and powerful. Everything I need for expense tracking in one beautiful app."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  E
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Emily Rodriguez</p>
                  <p className="text-slate-500 text-sm">Marketing Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                AI ExpenseTracker
              </h3>
              <p className="text-slate-400 mb-6 max-w-md">
                Revolutionize your financial management with AI-powered insights and intelligent expense tracking.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  💼
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <span className="sr-only">GitHub</span>
                  🐙
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">API</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2025 AI ExpenseTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;