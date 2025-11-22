import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import { BottomNavigation } from './BottomNavigation';

describe('BottomNavigation', () => {
  it('renders all navigation tabs', () => {
    const mockOnTabChange = vi.fn();
    render(<BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />);
    
    expect(screen.getByText('Khana')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    const mockOnTabChange = vi.fn();
    const { rerender } = render(
      <BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />
    );
    
    const homeButton = screen.getByText('Khana').closest('button');
    expect(homeButton).toHaveClass('bg-primary');
    
    // Switch to insights tab
    rerender(<BottomNavigation activeTab="insights" onTabChange={mockOnTabChange} />);
    
    const insightsButton = screen.getByText('Insights').closest('button');
    expect(insightsButton).toHaveClass('bg-primary');
  });

  it('calls onTabChange when a tab is clicked', () => {
    const mockOnTabChange = vi.fn();
    render(<BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />);
    
    fireEvent.click(screen.getByText('Insights'));
    expect(mockOnTabChange).toHaveBeenCalledWith('insights');
    
    fireEvent.click(screen.getByText('Fast'));
    expect(mockOnTabChange).toHaveBeenCalledWith('fast');
  });

  it('renders the center plus button', () => {
    const mockOnTabChange = vi.fn();
    render(<BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />);
    
    const plusButtons = document.querySelectorAll('button');
    // Should have 5 buttons: 4 tabs + 1 plus button
    expect(plusButtons.length).toBe(5);
  });
});
