export type CartLine = {
  productId: string;
  qty: number;
};

export type CartLineFull = CartLine & {
  name: string;
  price: number;
  unit: string;
  lineTotal: number;
};
