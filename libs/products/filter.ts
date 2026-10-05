import type { Product } from './products.js';

// Products whose name contains filterText (case-insensitive), optionally only
// those in stock.
export function filterProducts(
  products: readonly Product[],
  filterText: string,
  inStockOnly: boolean,
): Product[] {
  const query = filterText.toLowerCase();
  return products.filter((product) => {
    if (!product.name.toLowerCase().includes(query)) {
      return false;
    }
    if (inStockOnly && !product.stocked) {
      return false;
    }
    return true;
  });
}

// Group products by category, keeping the order categories first appear in.
export function groupByCategory(products: readonly Product[]): Map<string, Product[]> {
  const groups = new Map<string, Product[]>();
  for (const product of products) {
    let group = groups.get(product.category);
    if (!group) {
      group = [];
      groups.set(product.category, group);
    }
    group.push(product);
  }
  return groups;
}
