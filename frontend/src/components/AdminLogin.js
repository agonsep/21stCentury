import React, { useState } from 'react';

const AdminLogin = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple password check (in production, this would be more secure)
    setTimeout(() => {
      if (password === 'a') {
        onLogin();
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500); // Simulate network delay
  };

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Products
          </button>
          <h2>🔐 Admin Access</h2>
          <p>Enter password to access administrative functions</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? '🔄 Verifying...' : '🚀 Access Admin Panel'}
          </button>
        </form>

        <div className="admin-login-features">
          <h3>Admin Panel Features:</h3>
          <ul>
            <li>📝 Edit existing products</li>
            <li>➕ Add new products</li>
            <li>🗑️ Delete products</li>
            <li>📊 View product statistics</li>
            <li>🔧 Manage product data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;