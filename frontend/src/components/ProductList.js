import React, { useState, useMemo, useEffect, useCallback } from 'react';
import FilterControls from './FilterControls';
import ManufacturerLogo from './ManufacturerLogo';
import axios from 'axios';

const ProductList = ({ products }) => {
  const [viewMode, setViewMode] = useState('condensed'); // 'condensed', 'expanded', 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageSize, setPageSize] = useState('infinite');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(10); // For infinite scroll
  const [expandedRows, setExpandedRows] = useState(new Set()); // Track expanded rows

  // Fetch unique manufacturers and origins
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [manufacturersRes, originsRes] = await Promise.all([
          axios.get('/api/products/manufacturers'),
          axios.get('/api/products/origins')
        ]);
        setManufacturers(manufacturersRes.data || []);
        setOrigins(originsRes.data || []);
      } catch (error) {
        // Fallback to extracting from products data
        const uniqueManufacturers = [...new Set(products.map(p => p.manufacturer))].filter(Boolean).sort();
        const uniqueOrigins = [...new Set(products.map(p => p.manufacturedIn))].filter(Boolean).sort();
        setManufacturers(uniqueManufacturers);
        setOrigins(uniqueOrigins);
      }
    };

    if (products.length > 0) {
      fetchFilterOptions();
    }
  }, [products]);

  // Filtering function
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesManufacturer = !selectedManufacturer || 
        product.manufacturer?.toLowerCase().includes(selectedManufacturer.toLowerCase());
      
      const matchesOrigin = !selectedOrigin.length || 
        selectedOrigin.some(origin => 
          product.manufacturedIn?.toLowerCase().includes(origin.toLowerCase())
        );
      
      return matchesManufacturer && matchesOrigin;
    });
  }, [products, selectedManufacturer, selectedOrigin]);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  // Sorting function
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle specific field types
      if (sortField === 'cost') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortField === 'rating') {
        // Extract numeric value from rating (e.g., "50 kW" -> 50)
        aValue = parseFloat(aValue?.toString().replace(/[^\d.]/g, '')) || 0;
        bValue = parseFloat(bValue?.toString().replace(/[^\d.]/g, '')) || 0;
      } else if (sortField === 'efficiency') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        // String comparison
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredProducts, sortField, sortDirection]);

  // Calculate pagination
  const itemsPerPage = pageSize === 'all' ? sortedProducts.length : 
                      pageSize === 'infinite' ? displayedItems : 
                      parseInt(pageSize);
  
  const totalPages = pageSize === 'all' || pageSize === 'infinite' ? 1 : 
                    Math.ceil(sortedProducts.length / itemsPerPage);
  
  const startIndex = pageSize === 'infinite' ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = pageSize === 'infinite' ? displayedItems : 
                  pageSize === 'all' ? sortedProducts.length : 
                  startIndex + itemsPerPage;
  const currentProducts = useMemo(() => {
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, startIndex, endIndex]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (pageSize !== 'infinite') return;
    
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 5 && displayedItems < sortedProducts.length) {
      setDisplayedItems(prev => Math.min(prev + 10, sortedProducts.length));
    }
  }, [pageSize, displayedItems, sortedProducts.length]);

  useEffect(() => {
    if (pageSize === 'infinite') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, pageSize]);

  // Filter handlers
  const handleManufacturerChange = (value) => {
    setSelectedManufacturer(value);
    setCurrentPage(1);
    setDisplayedItems(10);
  };

  const handleOriginChange = (value) => {
    setSelectedOrigin(value);
    setCurrentPage(1);
    setDisplayedItems(10);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    setDisplayedItems(10);
  };

  // Reset displayed items when filters change
  useEffect(() => {
    setDisplayedItems(10);
    setCurrentPage(1);
  }, [selectedManufacturer, selectedOrigin]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
    setExpandedRows(new Set()); // Close all expanded rows when sorting
  };

  // Toggle row expansion for description (only one row at a time)
  const toggleRowExpansion = (productId) => {
    setExpandedRows(prev => {
      const newSet = new Set();
      // If the clicked row is already expanded, close it (empty set)
      // Otherwise, open only the clicked row
      if (!prev.has(productId)) {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of product list
    document.getElementById('product-list-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (products.length === 0) {
    return <p>No products found. Add a product to get started!</p>;
  }

  const renderTableView = () => (
    <div className="table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('manufacturer')} className="sortable">
              Manufacturer {sortField === 'manufacturer' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('name')} className="sortable">
              Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('rating')} className="sortable">
              Rating {sortField === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('manufacturedIn')} className="sortable">
              Origin {sortField === 'manufacturedIn' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <React.Fragment key={product.id}>
              <tr>
                <td>
                  <div className="manufacturer-cell">
                    <ManufacturerLogo manufacturer={product.manufacturer} size="small" />
                    <span className="manufacturer-name">{product.manufacturer}</span>
                  </div>
                </td>
                <td className="product-name-cell clickable-name" onClick={() => toggleRowExpansion(product.id)}>
                  <span className="name-content">
                    {product.name}
                  </span>
                </td>
                <td className="rating-cell">
                  {product.rating}
                </td>
                <td className="origin-cell">
                  {product.manufacturedIn || '-'}
                </td>
              </tr>
              {expandedRows.has(product.id) && (
                <tr className="expanded-description-row">
                  <td colSpan="4" className="expanded-description">
                    <div className="expanded-product-details">
                      {product.description && (
                        <div className="expanded-description-text">
                          <p>{product.description}</p>
                        </div>
                      )}
                      
                      <div className="expanded-specs">
                        <div className="spec-item">
                          <span className="spec-label">Cost</span>
                          <span className="spec-value cost-value">{formatCurrency(product.cost, product.currency)}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Maintenance</span>
                          <span className="spec-value">{product.maintenanceCost 
                            ? formatCurrency(product.maintenanceCost, product.currency) 
                            : 'Not specified'
                          }</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Efficiency</span>
                          <span className="spec-value efficiency-value">{product.efficiency ? `${product.efficiency}%` : 'Not specified'}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Lifetime</span>
                          <span className="spec-value">{product.lifetime ? `${product.lifetime} years` : 'Not specified'}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">NEVI Eligible</span>
                          <span className={`spec-value nevi-badge ${product.neviEligible ? 'nevi-yes' : 'nevi-no'}`}>
                            {product.neviEligible ? '✅ Yes' : '❌ No'}
                          </span>
                        </div>
                        {product.footprint && (
                          <div className="spec-item">
                            <span className="spec-label">Footprint</span>
                            <span className="spec-value">{product.footprint}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCondensedProduct = (product) => (
    <div key={product.id} className="product-item condensed">
      <div className="product-condensed-header">
        <h3>{product.name}</h3>
        <div className="product-condensed-meta">
          <span className="product-category">{product.category}</span>
          <span className="product-price">{formatCurrency(product.cost, product.currency)}</span>
        </div>
      </div>
      <div className="product-condensed-details">
        <span><strong>Rating:</strong> {product.rating}</span>
        <span><strong>Manufacturer:</strong> 
          <ManufacturerLogo manufacturer={product.manufacturer} size="small" />
          {product.manufacturer}
        </span>
        {product.efficiency && <span><strong>Efficiency:</strong> {product.efficiency}%</span>}
        <span><strong>NEVI:</strong> {product.neviEligible ? '✅' : '❌'}</span>
      </div>
    </div>
  );

  const renderExpandedProduct = (product) => (
    <div key={product.id} className="product-item expanded">
      <div className="product-header">
        <h3>{product.name}</h3>
        <span className="product-category">{product.category}</span>
      </div>
      
      <div className="product-details">
        <div className="product-row">
          <strong>Cost:</strong> {formatCurrency(product.cost, product.currency)}
        </div>
        <div className="product-row">
          <strong>Rating:</strong> {product.rating}
        </div>
        <div className="product-row">
          <strong>Manufacturer:</strong> 
          <ManufacturerLogo manufacturer={product.manufacturer} size="medium" />
          {product.manufacturer}
        </div>
        {product.manufacturedIn && (
          <div className="product-row">
            <strong>Manufactured in:</strong> {product.manufacturedIn}
          </div>
        )}
        {product.efficiency && (
          <div className="product-row">
            <strong>Efficiency:</strong> {product.efficiency}%
          </div>
        )}
        {product.lifetime && (
          <div className="product-row">
            <strong>Lifetime:</strong> {product.lifetime} years
          </div>
        )}
        {product.maintenanceCost && (
          <div className="product-row">
            <strong>Maintenance Cost:</strong> {formatCurrency(product.maintenanceCost, product.currency)}/year
          </div>
        )}
        {product.footprint && (
          <div className="product-row">
            <strong>Footprint:</strong> {product.footprint}
          </div>
        )}
        <div className="product-row">
          <strong>NEVI Eligible:</strong> {product.neviEligible ? 'Yes' : 'No'}
        </div>
        {product.documents && product.documents.length > 0 && (
          <div className="product-row">
            <strong>Documents:</strong>
            <ul className="document-list">
              {product.documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="product-footer">
        <div className="product-meta">
          <small>ID: {product.id}</small>
          {product.createdAt && (
            <small>Added: {new Date(product.createdAt).toLocaleDateString()}</small>
          )}
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'table':
        return renderTableView();
      case 'expanded':
        return (
          <div className={`product-list expanded-view`}>
            {currentProducts.map(product => renderExpandedProduct(product))}
          </div>
        );
      case 'condensed':
      default:
        return (
          <div className={`product-list condensed-view`}>
            {currentProducts.map(product => renderCondensedProduct(product))}
          </div>
        );
    }
  };

  return (
    <div id="product-list-container" className="product-list-container">
      {/* Filter Controls */}
      <FilterControls
        manufacturers={manufacturers}
        origins={origins}
        onManufacturerChange={handleManufacturerChange}
        onOriginChange={handleOriginChange}
        onPageSizeChange={handlePageSizeChange}
        selectedManufacturer={selectedManufacturer}
        selectedOrigin={selectedOrigin}
        pageSize={pageSize}
        totalProducts={filteredProducts.length}
      />

      {/* View Controls */}
      <div className="product-controls">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'condensed' ? 'active' : ''}`}
            onClick={() => setViewMode('condensed')}
            title="Condensed view"
          >
            📋 Condensed
          </button>
          <button
            className={`toggle-btn ${viewMode === 'expanded' ? 'active' : ''}`}
            onClick={() => setViewMode('expanded')}
            title="Expanded view"
          >
            📄 Expanded
          </button>
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table view"
          >
            📊 Table
          </button>
        </div>
        
        <div className="product-info">
          <span className="product-count">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
          </span>
          {viewMode === 'table' && (
            <span className="sort-info">
              Sorted by {sortField} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
            </span>
          )}
        </div>
      </div>

      {/* Product List */}
      {renderCurrentView()}

      {/* Pagination */}
      {pageSize === 'infinite' ? (
        displayedItems < sortedProducts.length && (
          <div className="infinite-scroll-info">
            <p>Showing {displayedItems} of {sortedProducts.length} products</p>
            <p className="scroll-hint">Scroll down to load more...</p>
          </div>
        )
      ) : pageSize !== 'all' && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="pagination-numbers">
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                className={`pagination-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;