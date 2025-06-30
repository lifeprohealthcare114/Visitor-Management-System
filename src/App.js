import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home/Home';
import ThankYouMessage from './components/ThankYouMessage/ThankYouMessage';
import NotFound from './pages/NotFound/NotFound';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import './App.css';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmitSuccess = () => {
    // Navigation handled in ThankYouMessage component
  };

  const handleAdminLogin = (password) => {
    return new Promise((resolve) => {
      if (password === 'admin123') {
        setIsAuthenticated(true);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  return (
    <div className="app">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onSubmitSuccess={handleSubmitSuccess} 
              onAdminLogin={handleAdminLogin} 
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace state={{ from: location }} />
            )
          } 
        />
        <Route path="/thank-you" element={<ThankYouMessage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;