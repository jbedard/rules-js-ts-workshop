import { type ChangeEvent, type ReactElement, createElement as h } from 'react';

export interface SearchBarProps {
  filterText: string;
  inStockOnly: boolean;
  onFilterTextChange: (filterText: string) => void;
  onInStockOnlyChange: (inStockOnly: boolean) => void;
}

export default function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}: SearchBarProps): ReactElement {
  return h(
    'form',
    null,
    h('input', {
      type: 'text',
      value: filterText,
      placeholder: 'Search...',
      onChange: (e: ChangeEvent<HTMLInputElement>) => onFilterTextChange(e.target.value),
    }),
    h(
      'label',
      null,
      h('input', {
        type: 'checkbox',
        checked: inStockOnly,
        onChange: (e: ChangeEvent<HTMLInputElement>) => onInStockOnlyChange(e.target.checked),
      }),
      ' Only show products in stock',
    ),
  );
}
