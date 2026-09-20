import { render } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: () => null,
}));

// Mock pages to isolate App routing test
jest.mock('./pages/Home', () => () => <div>Home</div>);

test('renders App without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
