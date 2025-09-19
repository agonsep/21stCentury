import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductForm from '../components/ProductForm';

describe('ProductForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockCategories = ['evchargers', 'weapons', 'electronics'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with all required fields', () => {
    render(<ProductForm onSubmit={mockOnSubmit} categories={mockCategories} />);
    
    // Check for required form fields
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/manufacturer/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /submit|add|create/i })).toBeInTheDocument();
  });

  test('updates form fields when user types', () => {
    render(<ProductForm onSubmit={mockOnSubmit} categories={mockCategories} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(costInput, { target: { value: '1000' } });
    
    expect(nameInput.value).toBe('Test Product');
    expect(costInput.value).toBe('1000');
  });

  test('shows validation error for missing required fields', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} categories={mockCategories} />);
    
    const submitButton = screen.getByRole('button', { name: /submit|add|create/i });
    
    // Try to submit without filling required fields
    fireEvent.click(submitButton);
    
    // Should not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    // Should show validation message (this depends on your implementation)
    // You might need to check for alert or error message display
  });

  test('submits form with valid data', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} categories={mockCategories} />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: 'Test Product' } 
    });
    fireEvent.change(screen.getByLabelText(/cost/i), { 
      target: { value: '1000' } 
    });
    fireEvent.change(screen.getByLabelText(/rating/i), { 
      target: { value: '5 stars' } 
    });
    fireEvent.change(screen.getByLabelText(/manufacturer/i), { 
      target: { value: 'Test Manufacturer' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /submit|add|create/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product',
          cost: 1000,
          rating: '5 stars',
          manufacturer: 'Test Manufacturer'
        })
      );
    });
  });

  test('handles checkbox fields correctly', () => {
    render(<ProductForm onSubmit={mockOnSubmit} categories={mockCategories} />);
    
    const checkbox = screen.getByLabelText(/nevi eligible/i);
    
    expect(checkbox.checked).toBe(false);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  test('handles category selection', () => {
    render(<ProductForm onSubmit={mockOnSubmit} categories={mockCategories} />);
    
    const categorySelect = screen.getByLabelText(/category/i);
    
    fireEvent.change(categorySelect, { target: { value: 'weapons' } });
    expect(categorySelect.value).toBe('weapons');
  });

  test('processes documents field correctly', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} categories={mockCategories} />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: 'Test Product' } 
    });
    fireEvent.change(screen.getByLabelText(/cost/i), { 
      target: { value: '1000' } 
    });
    fireEvent.change(screen.getByLabelText(/rating/i), { 
      target: { value: '5 stars' } 
    });
    fireEvent.change(screen.getByLabelText(/manufacturer/i), { 
      target: { value: 'Test Manufacturer' } 
    });
    
    // Add documents
    const documentsInput = screen.getByLabelText(/documents/i);
    fireEvent.change(documentsInput, { 
      target: { value: 'doc1.pdf, doc2.pdf, doc3.pdf' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /submit|add|create/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          documents: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
        })
      );
    });
  });

  test('disables submit button while submitting', async () => {
    // Mock onSubmit to return a promise that we can control
    const slowOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<ProductForm onSubmit={slowOnSubmit} categories={mockCategories} />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: 'Test Product' } 
    });
    fireEvent.change(screen.getByLabelText(/cost/i), { 
      target: { value: '1000' } 
    });
    fireEvent.change(screen.getByLabelText(/rating/i), { 
      target: { value: '5 stars' } 
    });
    fireEvent.change(screen.getByLabelText(/manufacturer/i), { 
      target: { value: 'Test Manufacturer' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /submit|add|create/i });
    
    fireEvent.click(submitButton);
    
    // Button should be disabled while submitting
    expect(submitButton).toBeDisabled();
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});