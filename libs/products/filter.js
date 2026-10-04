// Products whose name contains filterText (case-insensitive), optionally only
// those in stock.
export function filterProducts(products, filterText, inStockOnly) {
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
export function groupByCategory(products) {
  const groups = new Map();
  for (const product of products) {
    if (!groups.has(product.category)) {
      groups.set(product.category, []);
    }
    groups.get(product.category).push(product);
  }
  return groups;
}
