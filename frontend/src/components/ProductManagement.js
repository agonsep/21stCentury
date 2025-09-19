import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ConfirmationModal from './ConfirmationModal';

const ProductManagement = ({ onBack }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (productData) => {
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        
        if (editingProduct) {
          // Update existing product
          setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        } else {
          // Add new product
          setProducts([...products, updatedProduct]);
        }
        
        setShowForm(false);
        setEditingProduct(null);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save product');
      }
    } catch (error) {
      setError('Error saving product: ' + error.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setError('');
  };

  const handleDelete = (productId) => {
    const product = products.find(p => p.id === productId);
    setDeleteModal({
      isOpen: true,
      productId,
      productName: product?.name || 'this product'
    });
  };

  const confirmDelete = async () => {
    const { productId } = deleteModal;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete product');
      }
    } catch (error) {
      setError('Error deleting product: ' + error.message);
    } finally {
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: '' });
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="management-header">
        <div className="header-controls">
          <button className="back-btn" onClick={onBack}>
            ← Back to Products
          </button>
          <h2>Product Management</h2>
        </div>
        
        {!showForm && (
          <button className="add-btn primary" onClick={handleAdd}>
            ➕ Add New Product
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="form-section">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div className="products-management-list">
          <div className="management-stats">
            <div className="stat-card">
              <h4>Total Products</h4>
              <span className="stat-number">{products.length}</span>
            </div>
            <div className="stat-card">
              <h4>EV Chargers</h4>
              <span className="stat-number">
                {products.filter(p => p.category === 'EV Charger').length}
              </span>
            </div>
            <div className="stat-card">
              <h4>NEVI Eligible</h4>
              <span className="stat-number">
                {products.filter(p => p.neviEligible).length}
              </span>
            </div>
          </div>

          <div className="management-table">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Manufacturer</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Rating</th>
                  <th>NEVI</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="product-name">{product.name}</td>
                    <td>{product.manufacturer}</td>
                    <td>{product.category}</td>
                    <td>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: product.currency || 'USD'
                      }).format(product.cost)}
                    </td>
                    <td>{product.rating}</td>
                    <td>{product.neviEligible ? '✅' : '❌'}</td>
                    <td className="actions-cell">
                      <button
                        className="edit-btn small"
                        onClick={() => handleEdit(product)}
                        title="Edit product"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn small"
                        onClick={() => handleDelete(product.id)}
                        title="Delete product"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ProductManagement;