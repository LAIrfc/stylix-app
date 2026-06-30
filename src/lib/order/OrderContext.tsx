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
import type { CartItem } from "@/lib/cart/CartContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OrderSummary {
  orderId: string;
  placedAt: string; // ISO string
  items: CartItem[];
  subtotal: number;
  estimatedTax: number;
  total: number;
  shippingFree: boolean;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
  };
  shipping: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: "card" | "apple-pay" | "paypal";
}

interface OrderContextValue {
  order: OrderSummary | null;
  setOrder: (order: OrderSummary) => void;
  clearOrder: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const OrderContext = createContext<OrderContextValue | null>(null);
const STORAGE_KEY = "stylix_last_order";

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrderState] = useState<OrderSummary | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setOrderState(JSON.parse(raw) as OrderSummary);
    } catch { /* ignore */ }
  }, []);

  const setOrder = useCallback((o: OrderSummary) => {
    setOrderState(o);
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(o)); } catch { /* ignore */ }
  }, []);

  const clearOrder = useCallback(() => {
    setOrderState(null);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const value = useMemo(
    () => ({ order, setOrder, clearOrder }),
    [order, setOrder, clearOrder]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `STX-${ts}-${rand}`;
}
