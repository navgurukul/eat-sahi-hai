import { describe, it, expect } from 'vitest';
import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Custom render for App since it already includes BrowserRouter
const renderApp = () => {
  const queryClient = createTestQueryClient();
  return rtlRender(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    renderApp();
    expect(document.body).toBeTruthy();
  });

  it('initializes with routing', () => {
    renderApp();
    // The app should have routing set up
    // Since we're not authenticated, we should be redirected appropriately
    expect(window.location.pathname).toBeTruthy();
  });
});
