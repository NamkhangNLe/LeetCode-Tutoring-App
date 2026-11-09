import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Patternwise dashboard with all six patterns', () => {
  render(<App />);
  expect(screen.getAllByText(/Patternwise/i).length).toBeGreaterThan(0);
  expect(screen.getByText('Two Pointers')).toBeInTheDocument();
  expect(screen.getByText('Sliding Window')).toBeInTheDocument();
  expect(screen.getByText('Binary Search')).toBeInTheDocument();
  expect(screen.getByText('Hash Map')).toBeInTheDocument();
  expect(screen.getByText('Stack')).toBeInTheDocument();
  expect(screen.getByText('Dynamic Programming')).toBeInTheDocument();
  expect(screen.getByText(/of 24 problems solved/i)).toBeInTheDocument();
});
