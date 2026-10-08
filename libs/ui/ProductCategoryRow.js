import { createElement as h } from 'react';

export default function ProductCategoryRow({ category }) {
  return h('tr', null, h('th', { colSpan: 2 }, category));
}
