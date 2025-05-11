import { expect, describe, it } from 'vitest';
import { getLocalizedMonthName } from './dateUtils';

describe('getLocalizedMonthName', () => {
  it('should correctly convert a integer to the correct month name', () => {
    expect(getLocalizedMonthName(1)).toBe('January');
    expect(getLocalizedMonthName(2)).toBe('February');
    expect(getLocalizedMonthName(3)).toBe('March');
    expect(getLocalizedMonthName(4)).toBe('April');
    expect(getLocalizedMonthName(5)).toBe('May');
    expect(getLocalizedMonthName(6)).toBe('June');
    expect(getLocalizedMonthName(7)).toBe('July');
    expect(getLocalizedMonthName(8)).toBe('August');
    expect(getLocalizedMonthName(9)).toBe('September');
    expect(getLocalizedMonthName(10)).toBe('October');
    expect(getLocalizedMonthName(11)).toBe('November');
    expect(getLocalizedMonthName(12)).toBe('December');
  });
});
