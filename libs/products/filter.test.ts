import { describe, expect, test } from '@jest/globals';
import { filterProducts, groupByCategory } from './filter.js';
import { PRODUCTS } from './products.js';

describe('filterProducts', () => {
  test('matches names case-insensitively', () => {
    const names = filterProducts(PRODUCTS, 'P', false).map((p) => p.name);
    expect(names).toEqual(['Apple', 'Passionfruit', 'Spinach', 'Pumpkin', 'Peas']);
  });

  test('can hide out-of-stock products', () => {
    const names = filterProducts(PRODUCTS, '', true).map((p) => p.name);
    expect(names).not.toContain('Passionfruit');
    expect(names).not.toContain('Pumpkin');
  });
});

describe('groupByCategory', () => {
  test('keeps categories in first-seen order', () => {
    const groups = groupByCategory(PRODUCTS);
    expect([...groups.keys()]).toEqual(['Fruits', 'Vegetables']);
    expect(groups.get('Fruits')).toHaveLength(3);
  });
});
