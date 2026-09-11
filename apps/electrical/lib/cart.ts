export type CartLine = {
  productId: string;
  variantId?: string;
  qty: number;
};

export type CartLineFull = CartLine & {
  /** Stable composite key (productId + variantId) */
  key: string;
  name: string;
  variantLabel?: string;
  price: number;
  unit: string;
  lineTotal: number;
};

export function cartLineKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}::${variantId}` : productId;
}
