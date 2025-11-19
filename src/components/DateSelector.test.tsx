import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import { DateSelector } from './DateSelector';

describe('DateSelector', () => {
  it('renders without crashing', () => {
    const mockOnDateSelect = vi.fn();
    const today = new Date();
    render(<DateSelector selectedDate={today} onDateSelect={mockOnDateSelect} />);
    expect(document.body).toBeTruthy();
  });

  it('displays the selected date in header', () => {
    const mockOnDateSelect = vi.fn();
    const testDate = new Date(2024, 0, 15); // Jan 15, 2024
    render(<DateSelector selectedDate={testDate} onDateSelect={mockOnDateSelect} />);
    
    expect(screen.getByText(/monday/i)).toBeInTheDocument();
    expect(screen.getByText(/jan 15/i)).toBeInTheDocument();
  });

  it('renders 7 date buttons', () => {
    const mockOnDateSelect = vi.fn();
    const today = new Date();
    render(<DateSelector selectedDate={today} onDateSelect={mockOnDateSelect} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
  });

  it('highlights the selected date', () => {
    const mockOnDateSelect = vi.fn();
    const today = new Date();
    render(<DateSelector selectedDate={today} onDateSelect={mockOnDateSelect} />);
    
    const buttons = screen.getAllByRole('button');
    // The last button should be today and should be highlighted
    const lastButton = buttons[buttons.length - 1];
    expect(lastButton).toHaveClass('bg-primary');
  });

  it('calls onDateSelect when a date button is clicked', () => {
    const mockOnDateSelect = vi.fn();
    const today = new Date();
    render(<DateSelector selectedDate={today} onDateSelect={mockOnDateSelect} />);
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    
    expect(mockOnDateSelect).toHaveBeenCalledTimes(1);
    expect(mockOnDateSelect.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('displays day abbreviations', () => {
    const mockOnDateSelect = vi.fn();
    const today = new Date();
    render(<DateSelector selectedDate={today} onDateSelect={mockOnDateSelect} />);
    
    // Should have at least one day abbreviation
    const dayAbbrs = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const foundAbbr = dayAbbrs.some(abbr => screen.queryByText(abbr));
    expect(foundAbbr).toBe(true);
  });
});
