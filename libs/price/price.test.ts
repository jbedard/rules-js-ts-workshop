import { describe, expect, test } from '@jest/globals';
import { formatPrice, parsePrice, totalPrice } from './price.js';

describe('parsePrice', () => {
  test('strips the dollar sign', () => {
    expect(parsePrice('$4')).toBe(4);
  });

  test('rejects garbage', () => {
    expect(() => parsePrice('four dollars')).toThrow('Invalid price');
  });
});

describe('totalPrice', () => {
  test('sums and formats', () => {
    expect(totalPrice([{ price: '$1' }, { price: '$2' }])).toBe(formatPrice(3));
  });

  test('is $0 for nothing', () => {
    expect(totalPrice([])).toBe('$0');
  });
});
