import { createElement as h } from 'react';

export default function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  return h(
    'form',
    null,
    h('input', {
      type: 'text',
      value: filterText,
      placeholder: 'Search...',
      onChange: (e) => onFilterTextChange(e.target.value),
    }),
    h(
      'label',
      null,
      h('input', {
        type: 'checkbox',
        checked: inStockOnly,
        onChange: (e) => onInStockOnlyChange(e.target.checked),
      }),
      ' Only show products in stock',
    ),
  );
}
