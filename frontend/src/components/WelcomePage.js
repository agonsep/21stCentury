import React from 'react';

const WelcomePage = ({ onNavigate, userCount, productCount }) => {
  const features = [
    {
      title: 'User Management',
      description: 'Add, view, and manage users in the system',
      icon: '👥',
      count: userCount,
      action: () => onNavigate('users'),
      color: '#61dafb'
    },
    {
      title: 'Product Catalog',
      description: 'Manage products across multiple categories including EV chargers',
      icon: '📦',
      count: productCount,
      action: () => onNavigate('products'),
      color: '#28a745'
    }
  ];

  const quickStats = [
    { label: 'Total Users', value: userCount, icon: '👤' },
    { label: 'Total Products', value: productCount, icon: '📦' },
    { label: 'Categories', value: '1', icon: '🏷️' },
    { label: 'API Endpoints', value: '8', icon: '🔗' }
  ];

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <h1>EV Charging Equipment Catalog �</h1>
        <p className="welcome-subtitle">
          Comprehensive database of electric vehicle charging solutions and equipment.
        </p>
      </div>

      <div className="quick-stats">
        <h2>Catalog Overview</h2>
        <div className="stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="feature-cards">
        <h2>Catalog Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ borderLeftColor: feature.color }}>
              <div className="feature-header">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
              </div>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-stats">
                <span className="feature-count">{feature.count} items</span>
              </div>
              <button 
                className="feature-button"
                onClick={feature.action}
                style={{ backgroundColor: feature.color }}
              >
                Manage {feature.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="tech-stack">
        <h2>Technology Stack</h2>
        <div className="tech-grid">
          <div className="tech-section">
            <h4>Backend</h4>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>CORS</li>
              <li>dotenv</li>
            </ul>
          </div>
          <div className="tech-section">
            <h4>Frontend</h4>
            <ul>
              <li>React 18</li>
              <li>Axios</li>
              <li>CSS3</li>
              <li>React Hooks</li>
            </ul>
          </div>
          <div className="tech-section">
            <h4>Development</h4>
            <ul>
              <li>Nodemon</li>
              <li>React Scripts</li>
              <li>Concurrently</li>
              <li>Hot Reloading</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="getting-started">
        <h2>Getting Started</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Manage Users</h4>
              <p>Add and view users in the system</p>
              <button className="step-button" onClick={() => onNavigate('users')}>
                Go to Users →
              </button>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Browse Products</h4>
              <p>Explore the product catalog and add new items</p>
              <button className="step-button" onClick={() => onNavigate('products')}>
                Go to Products →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;