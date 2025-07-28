import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ onAdminLogin }) {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setNotificationCount] = useState(0);
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
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Logo" className="logo-image" />
            <h1>Visitor Management System</h1>
          </Link>

          <div className="header-actions">
            {/* Optional buttons can go here */}
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
