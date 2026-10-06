import { createElement as h } from 'react';
import { PRODUCTS } from '@demo/products';
import FilterableProductTable from './FilterableProductTable.js';

export default function App() {
  return h(FilterableProductTable, { products: PRODUCTS });
}
