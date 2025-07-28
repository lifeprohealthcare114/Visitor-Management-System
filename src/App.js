// App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home/Home';
import ThankYouMessage from './components/ThankYouMessage/ThankYouMessage';
import NotFound from './pages/NotFound/NotFound';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminLogin from './components/AdminLogin/AdminLogin'; 
import Footer from './components/Footer/Footer'; 
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAdminLogin = (password) => {
    return new Promise((resolve) => {
      if (password === 'admin123') {
        setIsAuthenticated(true);
        navigate('/admin/dashboard');
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  return (
    <div className="app">
      <ToastContainer />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onSubmitSuccess={() => {}} 
            />
          } 
        />

        {/* Admin login shown here instead of inside header */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />

        <Route path="/thank-you" element={<ThankYouMessage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
         <Footer />
    </div>
  );
}

export default App;
