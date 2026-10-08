import { describe, expect, test } from '@jest/globals';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from './App.js';

describe('App', () => {
  test('renders every category and product', () => {
    const html = renderToStaticMarkup(h(App));
    expect(html).toContain('Fruits');
    expect(html).toContain('Vegetables');
    expect(html).toContain('Dragonfruit');
    expect(html).toContain('Only show products in stock');
  });
});
