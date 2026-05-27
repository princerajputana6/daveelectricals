"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/products";
import type { CartLine, CartLineFull } from "@/lib/cart";

type CartContextValue = {
  lines: CartLineFull[];
  count: number;
  subtotal: number;
  deposit: number;
  balance: number;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dave_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRaw(JSON.parse(stored));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {}
  }, [raw, ready]);

  const lines = useMemo<CartLineFull[]>(() => {
    return raw
      .map((l) => {
        const p = products.find((x) => x.id === l.productId);
        if (!p) return null;
        return {
          productId: l.productId,
          qty: l.qty,
          name: p.shortName,
          price: p.price,
          unit: p.unit,
          lineTotal: +(p.price * l.qty).toFixed(2),
        };
      })
      .filter((x): x is CartLineFull => !!x);
  }, [raw]);

  const subtotal = +lines.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
  const deposit = +(subtotal / 2).toFixed(2);
  const balance = +(subtotal - deposit).toFixed(2);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const add = useCallback((productId: string, qty = 1) => {
    setRaw((curr) => {
      const existing = curr.find((l) => l.productId === productId);
      if (existing) {
        return curr.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [...curr, { productId, qty }];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setRaw((curr) =>
      qty <= 0
        ? curr.filter((l) => l.productId !== productId)
        : curr.map((l) =>
            l.productId === productId ? { ...l, qty } : l,
          ),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setRaw((curr) => curr.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const value: CartContextValue = {
    lines,
    count,
    subtotal,
    deposit,
    balance,
    add,
    setQty,
    remove,
    clear,
    ready,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
