import { Bike, LayoutDashboard, ShoppingBag, Store } from "lucide-react";
import type { Role } from "../../types";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";
import { Logo } from "./Logo";

const roles: { id: Role; label: string; icon: typeof Store }[] = [
  { id: "customer", label: "Customer", icon: ShoppingBag },
  { id: "store", label: "Store", icon: Store },
  { id: "delivery", label: "Delivery", icon: Bike },
  { id: "admin", label: "Admin", icon: LayoutDashboard },
];

export function RoleSwitcher() {
  const { role, setRole, orders } = useApp();
  const pending: Record<Role, number> = {
    customer: 0,
    store: orders.filter((o) => o.status === "placed").length,
    delivery: orders.filter((o) => o.status === "ready" && !o.partnerId).length,
    admin: 0,
  };

  return (
    <div className="sticky top-0 z-40 bg-ink text-white">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-3">
        <span className="hidden sm:block"><Logo light /></span>
        <span className="hidden text-xs text-white/60 lg:block">Demo · switch view</span>
        <nav className="no-scrollbar ml-auto flex gap-1 overflow-x-auto" aria-label="Switch role">
          {roles.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRole(id)}
              aria-pressed={role === id}
              className={cn(
                "relative flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition-colors",
                role === id ? "bg-white text-ink" : "text-white/80 hover:bg-white/10",
              )}
            >
              <Icon size={14} /> {label}
              {pending[id] > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                  {pending[id]}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
