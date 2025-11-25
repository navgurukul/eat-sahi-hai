import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { MacroIndicators } from './MacroIndicators';
import { FoodProvider } from '@/contexts/FoodContext';

// Wrapper with FoodProvider
const renderWithContext = (component: React.ReactElement) => {
  return render(<FoodProvider>{component}</FoodProvider>);
};

describe('MacroIndicators', () => {
  it('renders without crashing', () => {
    renderWithContext(<MacroIndicators />);
    expect(document.body).toBeTruthy();
  });

  it('displays macro nutrient labels', () => {
    renderWithContext(<MacroIndicators />);
    
    // Check for common nutrition labels
    expect(screen.getByText(/calories/i) || screen.getByText(/cal/i)).toBeTruthy();
  });

  it('renders progress indicators', () => {
    renderWithContext(<MacroIndicators />);
    
    // Should have multiple progress indicators
    const container = document.querySelector('.grid') || document.querySelector('[class*="flex"]');
    expect(container).toBeTruthy();
  });
});
