import React, { useState, useEffect, useRef } from 'react';

const SearchableDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Select or type to search..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Filter options based on search term
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);
    onChange(inputValue);
  };

  const handleOptionSelect = (option) => {
    setSearchTerm(option);
    onChange(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    inputRef.current?.focus();
  };

  const displayValue = value || searchTerm;

  return (
    <div className="searchable-dropdown" ref={dropdownRef}>
      <label className="dropdown-label">{label}</label>
      <div className="dropdown-input-container">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="dropdown-input"
        />
        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            title="Clear filter"
          >
            ×
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="dropdown-arrow"
        >
          ▼
        </button>
      </div>
      
      {isOpen && (
        <div className="dropdown-options">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`dropdown-option ${value === option ? 'selected' : ''}`}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="dropdown-no-results">
              No matches found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MultiSelectDropdown = ({ 
  label, 
  options, 
  value = [], 
  onChange, 
  placeholder = "Select or type to search..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Filter options based on search term
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(option)) {
      // Remove if already selected
      onChange(currentValues.filter(v => v !== option));
    } else {
      // Add if not selected
      onChange([...currentValues, option]);
    }
    setSearchTerm('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentValues = Array.isArray(value) ? value : [];
    onChange(currentValues.filter(v => v !== tagToRemove));
  };

  const handleClearAll = () => {
    onChange([]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const selectedValues = Array.isArray(value) ? value : [];

  return (
    <div className="searchable-dropdown multi-select" ref={dropdownRef}>
      <label className="dropdown-label">{label}</label>
      
      {selectedValues.length > 0 && (
        <div className="selected-tags">
          {selectedValues.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="tag-remove"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleClearAll}
            className="clear-all-tags"
            aria-label="Clear all selections"
          >
            Clear all
          </button>
        </div>
      )}
      
      <div className="dropdown-input-container">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedValues.length > 0 ? "Add more..." : placeholder}
          className="dropdown-input"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="dropdown-arrow"
        >
          ▼
        </button>
      </div>
      
      {isOpen && (
        <div className="dropdown-options">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`dropdown-option ${selectedValues.includes(option) ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <span>{option}</span>
                {selectedValues.includes(option) && <span className="checkmark">✓</span>}
              </div>
            ))
          ) : (
            <div className="dropdown-no-results">
              No matches found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FilterControls = ({ 
  manufacturers = [], 
  origins = [], 
  onManufacturerChange, 
  onOriginChange,
  onPageSizeChange,
  selectedManufacturer = '',
  selectedOrigin = [],
  pageSize = 25,
  totalProducts = 0
}) => {
  const pageSizeOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
    { value: 'all', label: 'Show all' },
    { value: 'infinite', label: 'Infinite scroll' }
  ];

  const activeFiltersCount = [
    selectedManufacturer, 
    ...(Array.isArray(selectedOrigin) ? selectedOrigin : [])
  ].filter(Boolean).length;

  const handleClearAllFilters = () => {
    onManufacturerChange('');
    onOriginChange([]);
  };

  return (
    <div className="filter-controls">
      <div className="filter-header">
        <h3>Filter Products</h3>
        {activeFiltersCount > 0 && (
          <button 
            onClick={handleClearAllFilters}
            className="clear-all-btn"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <SearchableDropdown
            label="Manufacturer"
            options={manufacturers}
            value={selectedManufacturer}
            onChange={onManufacturerChange}
            placeholder="Select or search manufacturer..."
          />
        </div>

        <div className="filter-group">
          <MultiSelectDropdown
            label="Origin"
            options={origins}
            value={selectedOrigin}
            onChange={onOriginChange}
            placeholder="Select or search origins..."
          />
        </div>

        <div className="filter-group">
          <label className="dropdown-label">Page Size</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(e.target.value)}
            className="page-size-select"
          >
            {pageSizeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-summary">
        <span className="results-count">
          {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
        </span>
        {activeFiltersCount > 0 && (
          <span className="active-filters">
            • {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterControls;