"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "./CartProvider";
import { ArrowIcon, BagIcon, CheckIcon } from "./Icons";

export default function AddToCartButton({
  productId,
  className = "",
  variant = "primary",
}: {
  productId: string;
  className?: string;
  variant?: "primary" | "outline";
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handle = () => {
    add(productId, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all";
  const styles =
    variant === "primary"
      ? "bg-bolt text-ink hover:scale-[1.04]"
      : "border border-white/15 bg-white/5 text-white hover:border-bolt/40 hover:text-bolt";

  return (
    <motion.button
      type="button"
      onClick={handle}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${styles} ${className}`}
    >
      {justAdded ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Added to cart
        </>
      ) : (
        <>
          <BagIcon className="h-4 w-4" />
          Add to cart
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </motion.button>
  );
}
