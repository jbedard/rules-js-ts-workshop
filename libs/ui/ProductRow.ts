import { type ReactElement, createElement as h } from 'react';
import type { Product } from '@demo/products';

export interface ProductRowProps {
  product: Product;
}

export default function ProductRow({ product }: ProductRowProps): ReactElement {
  const name = product.stocked
    ? product.name
    : h('span', { style: { color: 'red' } }, product.name);

  return h('tr', null, h('td', null, name), h('td', null, product.price));
}
