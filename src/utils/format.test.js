import { describe, expect, it } from 'vitest';
import { formatDate, isOverdue, toDateInputValue } from './format';

describe('formatDate', () => {
  it('formats an ISO date', () => {
    expect(formatDate('2026-11-23T10:00:00.000Z')).toMatch(/Nov 2026/);
  });
  it('returns empty string for missing/invalid values', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('toDateInputValue', () => {
  it('produces yyyy-mm-dd', () => {
    expect(toDateInputValue('2026-01-05T12:00:00.000Z')).toBe('2026-01-05');
  });
  it('returns empty string for null', () => {
    expect(toDateInputValue(null)).toBe('');
  });
});

describe('isOverdue', () => {
  const now = new Date('2026-11-23T00:00:00Z');
  it('flags a past-due open task', () => {
    expect(isOverdue({ dueDate: '2026-11-01', status: 'todo' }, now)).toBe(true);
  });
  it('does not flag done tasks or future dates', () => {
    expect(isOverdue({ dueDate: '2026-11-01', status: 'done' }, now)).toBe(false);
    expect(isOverdue({ dueDate: '2026-12-01', status: 'todo' }, now)).toBe(false);
    expect(isOverdue({ dueDate: null, status: 'todo' }, now)).toBe(false);
  });
});
