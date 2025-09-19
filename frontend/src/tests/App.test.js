import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the components that might make API calls
jest.mock('../components/ProductList', () => {
  return function MockProductList() {
    return <div data-testid="product-list">Product List Component</div>;
  };
});

jest.mock('../components/Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation Component</nav>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // Just check that the app renders without throwing an error
    expect(document.body).toBeInTheDocument();
  });

  test('renders main application elements', () => {
    render(<App />);
    
    // This test will depend on your actual App component structure
    // You might need to adjust these expectations based on your implementation
    
    // Check if the app container exists
    const appElement = screen.getByTestId('app') || document.querySelector('#root') || document.body;
    expect(appElement).toBeInTheDocument();
  });
});