import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('handles conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
    expect(result).toContain('base-class');
    expect(result).toContain('conditional-class');
    expect(result).not.toContain('hidden-class');
  });

  it('handles tailwind merge conflicts', () => {
    // When conflicting classes are provided, twMerge should keep the last one
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles undefined and null values', () => {
    const result = cn('text-base', undefined, null, 'bg-white');
    expect(result).toContain('text-base');
    expect(result).toContain('bg-white');
  });

  it('merges conflicting Tailwind classes correctly', () => {
    const result = cn('text-sm', 'text-lg');
    expect(result).toBe('text-lg');
  });
});
