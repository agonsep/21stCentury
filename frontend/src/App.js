import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './components/Navigation';
import WelcomePage from './components/WelcomePage';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import ProductList from './components/ProductList';
import ProductManagement from './components/ProductManagement';
import AdminLogin from './components/AdminLogin';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState('');
  const [productError, setProductError] = useState('');
  const [serverStatus, setServerStatus] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    checkServerHealth();
    
    // Check for admin access in URL path
    if (window.location.pathname === '/admin') {
      setCurrentView('admin-login');
    }
    
    // Listen for URL changes
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setCurrentView('admin-login');
      } else {
        setCurrentView('home');
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users. Make sure the backend server is running.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkServerHealth = async () => {
    try {
      const response = await axios.get('/api/health');
      setServerStatus(`Server is healthy (${response.data.status})`);
    } catch (err) {
      setServerStatus('Server is not responding');
    }
  };

  const addUser = async (userData) => {
    try {
      const response = await axios.post('/api/users', userData);
      setUsers([...users, response.data]);
      setError('');
      return true;
    } catch (err) {
      setError('Failed to add user. Please try again.');
      console.error('Error adding user:', err);
      return false;
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setProductError('');
    } catch (err) {
      setProductError('Failed to fetch products. Make sure the backend server is running.');
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('product-management');
    window.history.pushState({}, '', '/admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

  const handleViewChange = (view) => {
    if (view === 'admin') {
      if (isAdminAuthenticated) {
        setCurrentView('product-management');
      } else {
        setCurrentView('admin-login');
      }
    } else {
      setCurrentView(view);
    }
    // Clear errors when switching views
    setError('');
    setProductError('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <WelcomePage 
            onNavigate={handleViewChange}
            userCount={users.length}
            productCount={products.length}
          />
        );
      
      case 'users':
        return (
          <div className="view-content">
            {error && <div className="error">{error}</div>}

            <div className="card">
              <h2>Add New User</h2>
              <UserForm onSubmit={addUser} />
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Users ({users.length})</h2>
                <button className="button" onClick={fetchUsers}>
                  Refresh
                </button>
              </div>
              
              {loading ? (
                <div className="loading">Loading users...</div>
              ) : (
                <UserList users={users} />
              )}
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="view-content">
            {productError && <div className="error">{productError}</div>}

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Products ({products.length})</h2>
                <button className="button" onClick={fetchProducts}>
                  Refresh
                </button>
              </div>
              
              {productsLoading ? (
                <div className="loading">Loading products...</div>
              ) : (
                <ProductList 
                  products={products} 
                />
              )}
            </div>
          </div>
        );

      case 'admin-login':
        return (
          <AdminLogin 
            onLogin={handleAdminLogin}
            onBack={() => handleViewChange('home')}
          />
        );

      case 'product-management':
        return (
          <ProductManagement 
            onBack={handleAdminLogout}
          />
        );

      default:
        return <WelcomePage onNavigate={handleViewChange} userCount={users.length} productCount={products.length} />;
    }
  };

  return (
    <div className="App">
      <Navigation 
        currentView={currentView}
        onViewChange={handleViewChange}
        userCount={users.length}
        productCount={products.length}
        serverStatus={serverStatus}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={handleAdminLogout}
      />
      
      <div className="main-content">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;