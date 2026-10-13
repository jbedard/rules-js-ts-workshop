import { type ReactElement, createElement as h, useState } from 'react';
import type { Product } from '@demo/products';
import { ProductTable, SearchBar } from '@demo/ui';

export interface FilterableProductTableProps {
  products: readonly Product[];
}

export default function FilterableProductTable({ products }: FilterableProductTableProps): ReactElement {
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
