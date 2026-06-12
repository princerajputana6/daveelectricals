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
import { products, findVariant } from "@/lib/products";
import {
  cartLineKey,
  type CartLine,
  type CartLineFull,
} from "@/lib/cart";

type CartContextValue = {
  lines: CartLineFull[];
  count: number;
  subtotal: number;
  deposit: number;
  balance: number;
  add: (productId: string, variantId?: string, qty?: number) => void;
  setQty: (productId: string, variantId: string | undefined, qty: number) => void;
  remove: (productId: string, variantId?: string) => void;
  clear: () => void;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dave_cart_v2";
const LEGACY_KEY = "dave_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRaw(JSON.parse(stored));
      } else if (localStorage.getItem(LEGACY_KEY)) {
        // Legacy carts didn't have variants — purge them
        localStorage.removeItem(LEGACY_KEY);
      }
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
    const out: CartLineFull[] = [];
    for (const l of raw) {
      const p = products.find((x) => x.id === l.productId);
      if (!p) continue;
      let price = p.price ?? 0;
      let variantLabel: string | undefined;
      if (p.variants && p.variants.length) {
        const v = findVariant(p, l.variantId);
        if (!v) continue;
        price = v.price;
        variantLabel = v.label;
      }
      out.push({
        productId: l.productId,
        variantId: l.variantId,
        key: cartLineKey(l.productId, l.variantId),
        qty: l.qty,
        name: p.shortName,
        variantLabel,
        price,
        unit: p.unit,
        lineTotal: +(price * l.qty).toFixed(2),
      });
    }
    return out;
  }, [raw]);

  const subtotal = +lines.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
  const deposit = +(subtotal / 2).toFixed(2);
  const balance = +(subtotal - deposit).toFixed(2);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const add = useCallback(
    (productId: string, variantId?: string, qty = 1) => {
      setRaw((curr) => {
        const idx = curr.findIndex(
          (l) => l.productId === productId && l.variantId === variantId,
        );
        if (idx >= 0) {
          const copy = curr.slice();
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
          return copy;
        }
        return [...curr, { productId, variantId, qty }];
      });
    },
    [],
  );

  const setQty = useCallback(
    (productId: string, variantId: string | undefined, qty: number) => {
      setRaw((curr) =>
        qty <= 0
          ? curr.filter(
              (l) => !(l.productId === productId && l.variantId === variantId),
            )
          : curr.map((l) =>
              l.productId === productId && l.variantId === variantId
                ? { ...l, qty }
                : l,
            ),
      );
    },
    [],
  );

  const remove = useCallback((productId: string, variantId?: string) => {
    setRaw((curr) =>
      curr.filter(
        (l) => !(l.productId === productId && l.variantId === variantId),
      ),
    );
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
