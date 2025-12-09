import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import { TimeHeader } from './TimeHeader';

describe('TimeHeader', () => {
  it('renders without crashing', () => {
    render(<TimeHeader />);
    expect(document.body).toBeTruthy();
  });

  it('displays a greeting message', () => {
    render(<TimeHeader />);
    const greeting = screen.getByText(/time!/i);
    expect(greeting).toBeInTheDocument();
  });

  it('displays the current date', () => {
    render(<TimeHeader />);
    const today = new Date();
    const monthName = today.toLocaleDateString('en-IN', { month: 'long' });
    expect(screen.getByText(new RegExp(monthName, 'i'))).toBeInTheDocument();
  });

  it('displays the current time', () => {
    render(<TimeHeader />);
    // Just check that time is displayed in some format
    const timeRegex = /\d{1,2}:\d{2}\s*(AM|PM)/i;
    expect(screen.getByText(timeRegex)).toBeInTheDocument();
  });

  it('shows morning greeting between 5am and 12pm', () => {
    // Mock the current hour to 9am
    const mockDate = new Date(2024, 0, 1, 9, 0, 0);
    vi.setSystemTime(mockDate);
    
    render(<TimeHeader />);
    expect(screen.getByText(/nashta time/i)).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('shows afternoon greeting between 12pm and 5pm', () => {
    // Mock the current hour to 2pm
    const mockDate = new Date(2024, 0, 1, 14, 0, 0);
    vi.setSystemTime(mockDate);
    
    render(<TimeHeader />);
    expect(screen.getByText(/lunch time/i)).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('shows evening greeting between 5pm and 9pm', () => {
    // Mock the current hour to 6pm
    const mockDate = new Date(2024, 0, 1, 18, 0, 0);
    vi.setSystemTime(mockDate);
    
    render(<TimeHeader />);
    expect(screen.getByText(/chai time/i)).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('shows night greeting after 9pm', () => {
    // Mock the current hour to 10pm
    const mockDate = new Date(2024, 0, 1, 22, 0, 0);
    vi.setSystemTime(mockDate);
    
    render(<TimeHeader />);
    expect(screen.getByText(/dinner time/i)).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
