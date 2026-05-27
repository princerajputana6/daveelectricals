"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartProvider";
import { BagIcon } from "./Icons";

export default function CartBadge() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count})`}
      className="relative grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-white ring-1 ring-white/10 transition-colors hover:text-bolt"
    >
      <BagIcon className="h-5 w-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
            className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-bolt px-1 text-[10px] font-bold text-ink"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
