import { describe, expect, test } from '@jest/globals';
import type { Product } from '@demo/products';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ProductRow from './ProductRow.js';

function render(product: Product): string {
  return renderToStaticMarkup(
    h('table', null, h('tbody', null, h(ProductRow, { product }))),
  );
}

describe('ProductRow', () => {
  test('renders in-stock products plainly', () => {
    const html = render({ category: 'Fruits', name: 'Apple', price: '$1', stocked: true });
    expect(html).toContain('<td>Apple</td><td>$1</td>');
  });

  test('highlights out-of-stock products in red', () => {
    const html = render({ category: 'Vegetables', name: 'Pumpkin', price: '$4', stocked: false });
    expect(html).toContain('<span style="color:red">Pumpkin</span>');
  });
});
