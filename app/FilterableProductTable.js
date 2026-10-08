import { createElement as h, useState } from 'react';
import { ProductTable, SearchBar } from '@demo/ui';

export default function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return h(
    'div',
    null,
    h(SearchBar, {
      filterText,
      inStockOnly,
      onFilterTextChange: setFilterText,
      onInStockOnlyChange: setInStockOnly,
    }),
    h(ProductTable, { products, filterText, inStockOnly }),
  );
}
