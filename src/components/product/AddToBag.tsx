"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/types/product";

export function AddToBag({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.some((i) => i.product.id === product.id);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center justify-center px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 bg-gold/90 text-ink-deep hover:bg-gold"
      >
        {added ? "Added to Bag" : inCart ? "Add Another" : "Add to Bag"}
      </button>
      {inCart && (
        <Link
          href="/bag"
          className="inline-flex items-center justify-center px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border border-gold/40 text-gold hover:border-gold"
        >
          View Bag
        </Link>
      )}
    </div>
  );
}
