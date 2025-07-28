// components/AdminLogin/AdminLogin.jsx
import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onLogin(password);
    if (!success) {
      setError('Invalid password');
    }
  };

  return (
    <div className="admin-modal">
      <div className="modal-content">
        <h3>Admin Login</h3>
        <form onSubmit={handleSubmit}>
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
