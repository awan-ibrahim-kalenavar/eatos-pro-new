import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import MenuManagement from './pages/MenuManagement';
import OrdersDashboard from './pages/OrdersDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { Utensils, ClipboardList, Home, ChefHat } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <ChefHat className="w-6 h-6" />
          Restaurant Admin Pro
        </div>
        <div className="navbar-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            to="/menu"
            className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}
          >
            <Utensils className="w-4 h-4" />
            Menu Management
          </Link>
          <Link
            to="/orders"
            className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
          >
            <ClipboardList className="w-4 h-4" />
            Orders Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop&crop=center"
          alt="Restaurant"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Welcome to Restaurant Admin Pro
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto drop-shadow">
            Manage your restaurant with style and efficiency. Beautiful UI, powerful features.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="fade-in">
                  <HeroSection />
                  <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="card hover:scale-105 transition-transform cursor-pointer">
                        <div className="card-body text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Utensils className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="card-title mb-2">Menu Management</h3>
                          <p className="text-gray-600">Create, edit, and manage your restaurant menu with beautiful images and detailed descriptions.</p>
                        </div>
                      </div>
                      
                      <div className="card hover:scale-105 transition-transform cursor-pointer">
                        <div className="card-body text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="card-title mb-2">Order Tracking</h3>
                          <p className="text-gray-600">Track customer orders in real-time with status updates and detailed order information.</p>
                        </div>
                      </div>
                      
                      <div className="card hover:scale-105 transition-transform cursor-pointer">
                        <div className="card-body text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ChefHat className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="card-title mb-2">Professional UI</h3>
                          <p className="text-gray-600">Modern, responsive design with beautiful animations and intuitive user experience.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                      <Link
                        to="/menu"
                        className="btn btn-primary text-lg px-8 py-3"
                      >
                        Get Started →
                      </Link>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/menu" element={<MenuManagement />} />
              <Route path="/orders" element={<OrdersDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
