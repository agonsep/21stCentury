import React, { useState } from 'react';

const ProductForm = ({ onSubmit, categories = [] }) => {
  const [formData, setFormData] = useState({
    category: 'evchargers',
    name: '',
    cost: '',
    currency: 'USD',
    rating: '',
    manufacturer: '',
    manufacturedIn: '',
    efficiency: '',
    lifetime: '',
    maintenanceCost: '',
    footprint: '',
    neviEligible: false,
    documents: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.cost || !formData.rating.trim() || !formData.manufacturer.trim()) {
      alert('Please fill in all required fields (Name, Cost, Rating, Manufacturer)');
      return;
    }

    setIsSubmitting(true);
    
    // Process documents string into array
    const processedData = {
      ...formData,
      name: formData.name.trim(),
      manufacturer: formData.manufacturer.trim(),
      cost: parseFloat(formData.cost),
      efficiency: formData.efficiency ? parseFloat(formData.efficiency) : null,
      lifetime: formData.lifetime ? parseInt(formData.lifetime) : null,
      maintenanceCost: formData.maintenanceCost ? parseFloat(formData.maintenanceCost) : null,
      documents: formData.documents 
        ? formData.documents.split(',').map(doc => doc.trim()).filter(doc => doc.length > 0)
        : []
    };
    
    const success = await onSubmit(processedData);
    
    if (success) {
      setFormData({
        category: 'evchargers',
        name: '',
        cost: '',
        currency: 'USD',
        rating: '',
        manufacturer: '',
        manufacturedIn: '',
        efficiency: '',
        lifetime: '',
        maintenanceCost: '',
        footprint: '',
        neviEligible: false,
        documents: ''
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="evchargers">EV Chargers</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="currency">Currency *:</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="USD">US Dollars</option>
            <option value="EUR">Euros</option>
            <option value="CAD">Canadian Dollars</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="name">Product Name *:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cost">Cost *:</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="Enter cost"
            disabled={isSubmitting}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="rating">Rating *:</label>
          <input
            type="text"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="e.g., 50kW"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="manufacturer">Manufacturer *:</label>
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            placeholder="Enter manufacturer"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="manufacturedIn">Manufactured In:</label>
          <input
            type="text"
            id="manufacturedIn"
            name="manufacturedIn"
            value={formData.manufacturedIn}
            onChange={handleChange}
            placeholder="e.g., United States"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="efficiency">Efficiency (%):</label>
          <input
            type="number"
            id="efficiency"
            name="efficiency"
            value={formData.efficiency}
            onChange={handleChange}
            placeholder="e.g., 92"
            disabled={isSubmitting}
            step="0.1"
            min="0"
            max="100"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lifetime">Lifetime (years):</label>
          <input
            type="number"
            id="lifetime"
            name="lifetime"
            value={formData.lifetime}
            onChange={handleChange}
            placeholder="e.g., 10"
            disabled={isSubmitting}
            min="0"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="maintenanceCost">Maintenance Cost (annual):</label>
          <input
            type="number"
            id="maintenanceCost"
            name="maintenanceCost"
            value={formData.maintenanceCost}
            onChange={handleChange}
            placeholder="Annual maintenance cost"
            disabled={isSubmitting}
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="footprint">Footprint:</label>
          <input
            type="text"
            id="footprint"
            name="footprint"
            value={formData.footprint}
            onChange={handleChange}
            placeholder="e.g., 12 sq ft"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="documents">Documents (comma-separated):</label>
        <input
          type="text"
          id="documents"
          name="documents"
          value={formData.documents}
          onChange={handleChange}
          placeholder="e.g., datasheet.pdf, manual.pdf"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="neviEligible"
            checked={formData.neviEligible}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          NEVI Eligible
        </label>
      </div>
      
      <button 
        type="submit" 
        className="button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding Product...' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;