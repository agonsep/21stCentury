import React from 'react';

const Navigation = ({ currentView, onViewChange, userCount, productCount, serverStatus, isAdminAuthenticated, onAdminLogout }) => {
  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: '🏠',
      description: 'Welcome & Overview'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: '👥',
      description: 'User Management',
      count: userCount
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: '📦',
      description: 'Product Catalog',
      count: productCount
    },
    { 
      id: 'map-icons', 
      label: 'Map Icons', 
      icon: '🗺️',
      description: 'Infrastructure Mapping'
    }
  ];

  // Add admin nav item based on authentication state
  if (isAdminAuthenticated) {
    navItems.push({
      id: 'product-management',
      label: 'Admin Panel',
      icon: '⚙️',
      description: 'Product Management'
    });
  }
  // Admin access hidden - remove the else block to hide admin login link

  return (
    <div className="navigation">
      <div className="nav-header">
        <h1>Catalog Manager</h1>
        <p>EV Charging Equipment Catalog & Management System</p>
        <div className="server-status">
          <span className={`status-indicator ${serverStatus.includes('healthy') ? 'healthy' : 'error'}`}>
            ●
          </span>
          {serverStatus}
        </div>
        
        {isAdminAuthenticated && (
          <div className="admin-status">
            <span className="admin-indicator">👤</span>
            Admin Mode
            <button 
              onClick={onAdminLogout}
              className="logout-btn"
              title="Logout from Admin"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <nav className="nav-menu">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <div className="nav-item-content">
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-text">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
                {item.count !== undefined && (
                  <span className="nav-count">{item.count} items</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* Dropdown for mobile */}
      <div className="nav-dropdown">
        <select 
          value={currentView} 
          onChange={(e) => onViewChange(e.target.value)}
          className="nav-select"
        >
          {navItems.map(item => (
            <option key={item.id} value={item.id}>
              {item.icon} {item.label} {item.count !== undefined ? `(${item.count})` : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Navigation;