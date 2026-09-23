import { render } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: () => null,
  useNavigate: () => jest.fn(),
}));

// Mock pages to isolate App routing test
jest.mock('./pages/Home', () => () => <div>Home</div>);

// Mock Vercel Analytics
jest.mock('@vercel/analytics/react');

test('renders App without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
