export interface Priced {
  price: string;
}

// "$4" -> 4
export function parsePrice(price: string): number {
  const value = Number(price.replace(/^\$/, ''));
  if (Number.isNaN(value)) {
    throw new Error(`Invalid price: ${price}`);
  }
  return value;
}

// 4 -> "$4"
export function formatPrice(value: number): string {
  return `$${value}`;
}

export function totalPrice(items: readonly Priced[]): string {
  return formatPrice(items.reduce((sum, item) => sum + parsePrice(item.price), 0));
}
