# Testing Documentation

This document provides comprehensive information about testing the eat-sahi-hai application.

## Overview

The application uses **Vitest** as the test runner and **React Testing Library** for component testing. This setup provides fast, reliable testing with excellent TypeScript support.

## Test Infrastructure

### Key Dependencies
- `vitest` - Fast test runner built for Vite
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM elements
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM implementation for Node.js

### Configuration Files
- `vitest.config.ts` - Main test configuration
- `src/test/setup.ts` - Global test setup and mocks
- `src/test/test-utils.tsx` - Reusable test utilities

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (re-runs on file changes)
npm test

# Run tests with UI dashboard
npm run test:ui
```

### Watch Mode Features
- Automatically re-runs tests when files change
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit

## Test Files

### Current Test Coverage

| File | Tests | Description |
|------|-------|-------------|
| `src/App.test.tsx` | 2 | Application initialization and routing |
| `src/components/TimeHeader.test.tsx` | 8 | Time-based greetings for different periods |
| `src/components/BottomNavigation.test.tsx` | 4 | Navigation bar functionality |
| `src/components/MacroIndicators.test.tsx` | 3 | Macro nutrition display |
| `src/components/DateSelector.test.tsx` | 6 | Date selection component |
| `src/lib/utils.test.ts` | 6 | Utility functions |

**Total: 29 tests across 6 files**

## Test Structure

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders without crashing', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Using Test Utilities

The `src/test/test-utils.tsx` file provides a custom render function that wraps components with necessary providers:

```typescript
import { render, screen } from '../test/test-utils';
// This automatically wraps with QueryClientProvider and BrowserRouter
```

## Mocking

### Environment Variables
Supabase environment variables are mocked in `vitest.config.ts`:
```typescript
define: {
  'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://test.supabase.co'),
  'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('test-publishable-key'),
}
```

### Window APIs
The `window.matchMedia` API is mocked in `src/test/setup.ts` for responsive design tests.

## Writing New Tests

### Guidelines

1. **Test file naming**: Use `.test.tsx` for component tests, `.test.ts` for utility tests
2. **Test location**: Place test files next to the source files they test
3. **Test structure**: Use `describe` blocks to group related tests
4. **Test names**: Use descriptive names that explain what is being tested
5. **Assertions**: Use jest-dom matchers for better error messages

### Best Practices

- Test user behavior, not implementation details
- Use `screen` queries over `container` queries
- Prefer `getByRole` over `getByTestId` when possible
- Mock external dependencies (API calls, Supabase, etc.)
- Keep tests simple and focused on one thing
- Use `beforeEach` for common setup code

## Debugging Tests

### Common Issues

1. **Missing providers**: If you get context errors, ensure you're using the custom render from `test-utils.tsx`
2. **Async issues**: Use `waitFor` or `findBy` queries for async operations
3. **Router errors**: For components using routing, wrap with `BrowserRouter` or use `test-utils.tsx`

### Debug Mode

Run tests in debug mode to step through with a debugger:
```bash
node --inspect-brk node_modules/.bin/vitest --run
```

## CI/CD Integration

The test suite is designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions step
- name: Run tests
  run: npm run test:run
```

## Test Coverage Goals

Current coverage focuses on:
- ✅ Core UI components
- ✅ Utility functions
- ✅ Routing logic
- ⏳ Context providers (partial)
- ⏳ API service layer (to be added)

## Future Improvements

Potential areas for expansion:
- Add E2E tests with Playwright
- Increase context provider test coverage
- Add integration tests for food logging flow
- Add snapshot tests for UI consistency
- Implement visual regression testing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom)

## Support

For questions or issues with tests:
1. Check the test output for specific error messages
2. Review the test setup files for configuration issues
3. Consult the Vitest and React Testing Library documentation
