import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Order, OrderStatus, Role, Screen } from "../types";
import { findProduct } from "../data/products";
import { findStore } from "../data/stores";

export const DELIVERY_FEE = 20;
export const FREE_DELIVERY_ABOVE = 299;
export const DISCOUNT_THRESHOLD = 199;
export const DISCOUNT_AMOUNT = 30;

interface Bill {
  count: number;
  itemTotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  screen: Screen;
  navigate: (s: Screen) => void;
  storeId: string;
  setStoreId: (id: string) => void;
  cart: Record<string, number>;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  bill: Bill;
  orders: Order[];
  placeOrder: (payment: string) => number;
  updateOrder: (id: number, status: OrderStatus, partnerId?: string) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("customer");
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [storeId, setStoreId] = useState("freshmart");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const nextId = useRef(1024);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0 });
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    window.scrollTo({ top: 0 });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[productId];
      else next[productId] = qty;
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const bill = useMemo<Bill>(() => {
    let count = 0;
    let itemTotal = 0;
    for (const [id, qty] of Object.entries(cart)) {
      const p = findProduct(id);
      if (!p) continue;
      count += qty;
      itemTotal += p.price * qty;
    }
    const deliveryFee = itemTotal === 0 || itemTotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const discount = itemTotal >= DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
    return { count, itemTotal, deliveryFee, discount, total: itemTotal + deliveryFee - discount };
  }, [cart]);

  const updateOrder = useCallback((id: number, status: OrderStatus, partnerId?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, partnerId: partnerId ?? o.partnerId } : o)),
    );
  }, []);

  const placeOrder = useCallback(
    (payment: string) => {
      const id = nextId.current++;
      const order: Order = {
        id,
        storeId,
        items: Object.entries(cart).map(([productId, qty]) => ({ productId, qty })),
        itemTotal: bill.itemTotal,
        deliveryFee: bill.deliveryFee,
        discount: bill.discount,
        total: bill.total,
        payment,
        status: "finding",
        createdAt: Date.now(),
      };
      setOrders((prev) => [order, ...prev]);
      setCart({});
      window.setTimeout(() => {
        updateOrder(id, "placed");
        showToast(`${findStore(storeId).name} accepted your order`);
      }, 2200);
      return id;
    },
    [storeId, cart, bill, updateOrder, showToast],
  );

  const value: AppState = {
    role, setRole, screen, navigate, storeId, setStoreId, cart, setQty, clearCart,
    bill, orders, placeOrder, updateOrder, toast, showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
