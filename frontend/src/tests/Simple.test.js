import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple component for testing
const SimpleTestComponent = ({ title, items }) => {
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

describe('Simple Frontend Tests - Working Examples', () => {
  test('renders title correctly', () => {
    render(<SimpleTestComponent title="Test Title" items={[]} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders list items correctly', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    render(<SimpleTestComponent title="Test" items={items} />);
    
    items.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test('renders empty list correctly', () => {
    render(<SimpleTestComponent title="Empty List" items={[]} />);
    expect(screen.getByText('Empty List')).toBeInTheDocument();
    
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });
});