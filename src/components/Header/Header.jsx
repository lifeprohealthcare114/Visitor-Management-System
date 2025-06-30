import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePWAInstallPrompt } from '../../usePWAInstallPrompt';
import './Header.css';

function Header({ onAdminLogin }) {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const { deferredPrompt, isAppInstalled, installApp } = usePWAInstallPrompt();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const visitors = JSON.parse(localStorage.getItem('visitorRegistrations') || '[]');
      setNotificationCount(visitors.length);
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const success = await onAdminLogin(password);
    if (success) {
      setShowAdminModal(false);
      setNotificationCount(0);
      navigate('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Visitor Management</h1>
          </Link>
          
          <div className="header-actions">
            {deferredPrompt && !isAppInstalled && (
              <button 
                className="install-btn"
                onClick={installApp}
              >
                Install App
              </button>
            )}
            <button 
              className="admin-btn"
              onClick={() => setShowAdminModal(true)}
            >
              Admin
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {showAdminModal && (
        <div className="admin-modal">
          <div className="modal-content">
            <h3>Admin Login</h3>
            <form onSubmit={handleAdminSubmit}>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
              {error && <p className="error">{error}</p>}
              <div className="modal-actions">
                <button type="submit">Login</button>
                <button 
                  type="button" 
                  onClick={() => setShowAdminModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;