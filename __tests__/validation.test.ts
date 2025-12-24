import { test, expect } from '@jest/globals';
import { isDateYYYYMMDD, isPositiveNumber, isOneOf, required } from '@/utils/validation';

test('validates YYYY-MM-DD dates', () => {
  expect(isDateYYYYMMDD('2025-12-16')).toBe(true);
  expect(isDateYYYYMMDD('2025-02-30')).toBe(false);
  expect(isDateYYYYMMDD('16-12-2025')).toBe(false);
});

test('validates positive numbers', () => {
  expect(isPositiveNumber('10')).toBe(true);
  expect(isPositiveNumber('0')).toBe(false);
  expect(isPositiveNumber('-5')).toBe(false);
  expect(isPositiveNumber('abc')).toBe(false);
});

test('validates enums', () => {
  expect(isOneOf('dog', ['dog', 'cat', 'other'] as const)).toBe(true);
  expect(isOneOf('bird', ['dog', 'cat', 'other'] as const)).toBe(false);
});

test('validates required', () => {
  expect(required('x')).toBe(true);
  expect(required('')).toBe(false);
  expect(required(undefined)).toBe(false);
});
