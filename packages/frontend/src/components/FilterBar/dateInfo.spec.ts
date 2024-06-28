import { endOfDay, format as formatDateFns, startOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { isCombinedDateAndInterval } from './dateInfo.ts';

(globalThis as unknown as { jest: typeof vi }).jest = vi;

const format = (date: Date | string, formatStr: string) => {
  return formatDateFns(date, formatStr, { locale: enUS });
};

describe('isCombinedDateAndInterval', () => {
  beforeAll(() => {
    const fakeDate = new Date('2024-06-15T12:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(fakeDate);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const currentYear = new Date().getFullYear();

  test('should return valid date range for same day within current year', () => {
    const label = '2024-06-11/2024-06-11';
    const result = isCombinedDateAndInterval(label, format);

    const expectedLabel = `11th June ${currentYear}`;

    expect(result).toEqual({
      isDate: true,
      label: expectedLabel,
      startDate: startOfDay(new Date('2024-06-11')),
      endDate: endOfDay(new Date('2024-06-11')),
    });
  });

  test('should return valid date range for different days in the same month within current year', () => {
    const label = '2024-06-11/2024-06-15';
    const result = isCombinedDateAndInterval(label, format);

    const expectedLabel = `11th-15th June`;

    expect(result).toEqual({
      isDate: true,
      label: expectedLabel,
      startDate: startOfDay(new Date('2024-06-11')),
      endDate: endOfDay(new Date('2024-06-15')),
    });
  });

  test('should return valid date range for different days in different months within current year', () => {
    const label = '2024-06-11/2024-07-01';
    const result = isCombinedDateAndInterval(label, format);

    const expectedLabel = `11th June - 1st July`;

    expect(result).toEqual({
      isDate: true,
      label: expectedLabel,
      startDate: startOfDay(new Date('2024-06-11')),
      endDate: endOfDay(new Date('2024-07-01')),
    });
  });

  test('should return valid date range for same day in different years', () => {
    const label = '2023-12-31/2024-01-01';
    const result = isCombinedDateAndInterval(label, format);

    const expectedLabel = `31st December 2023 - 1st January 2024`;

    expect(result).toEqual({
      isDate: true,
      label: expectedLabel,
      startDate: startOfDay(new Date('2023-12-31')),
      endDate: endOfDay(new Date('2024-01-01')),
    });
  });

  test('should return valid date range for same day in same month different years', () => {
    const label = '2023-06-11/2024-06-11';
    const result = isCombinedDateAndInterval(label, format);

    const expectedLabel = `11th June 2023`;

    expect(result).toEqual({
      isDate: true,
      label: expectedLabel,
      startDate: startOfDay(new Date('2023-06-11')),
      endDate: endOfDay(new Date('2024-06-11')),
    });
  });

  test('should return invalid date for incorrect format', () => {
    const label = '2024-06-11';
    const result = isCombinedDateAndInterval(label, format);

    expect(result).toEqual({
      isDate: false,
    });
  });

  test('should return invalid date for non-date strings', () => {
    const label = 'hello/world';
    const result = isCombinedDateAndInterval(label, format);

    expect(result).toEqual({
      isDate: false,
    });
  });

  test('should return invalid date for invalid dates', () => {
    const label = '2024-13-01/2024-01-01';
    const result = isCombinedDateAndInterval(label, format);

    expect(result).toEqual({
      isDate: false,
    });
  });

  test('should return invalid date for missing end date', () => {
    const label = '2024-06-11/';
    const result = isCombinedDateAndInterval(label, format);

    expect(result).toEqual({
      isDate: false,
    });
  });

  test('should return valid date range for different months and different years', () => {
    const label = '2023-05-11/2024-06-12';
    const result = isCombinedDateAndInterval(label, format);

    const expectedLabel = `11th May 2023 - 12th June 2024`;

    expect(result).toEqual({
      isDate: true,
      label: expectedLabel,
      startDate: startOfDay(new Date('2023-05-11')),
      endDate: endOfDay(new Date('2024-06-12')),
    });
  });
});
