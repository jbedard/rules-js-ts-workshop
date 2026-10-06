import { Fragment, createElement as h } from 'react';
import { filterProducts, groupByCategory } from '@demo/products';
import ProductCategoryRow from './ProductCategoryRow.js';
import ProductRow from './ProductRow.js';

export default function ProductTable({ products, filterText, inStockOnly }) {
  const visible = filterProducts(products, filterText, inStockOnly);
  const groups = groupByCategory(visible);

  return h(
    'table',
    null,
    h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, 'Price'))),
    h(
      'tbody',
      null,
      [...groups].map(([category, items]) =>
        h(
          Fragment,
          { key: category },
          h(ProductCategoryRow, { category }),
          items.map((product) => h(ProductRow, { product, key: product.name })),
        ),
      ),
    ),
  );
}
