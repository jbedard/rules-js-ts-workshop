import { createElement as h } from 'react';

export default function ProductRow({ product }) {
  const name = product.stocked
    ? product.name
    : h('span', { style: { color: 'red' } }, product.name);

  return h('tr', null, h('td', null, name), h('td', null, product.price));
}
