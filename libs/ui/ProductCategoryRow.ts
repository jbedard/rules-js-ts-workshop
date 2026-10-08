import { type ReactElement, createElement as h } from 'react';

export interface ProductCategoryRowProps {
  category: string;
}

export default function ProductCategoryRow({ category }: ProductCategoryRowProps): ReactElement {
  return h('tr', null, h('th', { colSpan: 2 }, category));
}
