import { ClipboardList, Home, LayoutGrid, MapPin, Search, ShoppingCart, User } from "lucide-react";
import type { Screen } from "../../types";
import { useApp } from "../../context/AppContext";
import { currentUser } from "../../data/stores";
import { rupee } from "../../lib/format";
import { cn } from "../../utils/cn";
import { Logo } from "../ui/Logo";

export function CustomerHeader() {
  const { navigate, bill } = useApp();
  return (
    <header className="sticky top-12 z-30 border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <button onClick={() => navigate({ name: "home" })} aria-label="Padosi home" className="hidden md:block">
          <Logo />
        </button>
        <div className="min-w-0 flex-1 md:max-w-[220px] md:flex-none md:border-l md:border-line md:pl-4">
          <p className="text-[11px] font-extrabold uppercase text-brand-dark">Delivery in 30 min</p>
          <p className="flex items-center gap-1 truncate text-sm font-semibold">
            <MapPin size={14} className="shrink-0" /> {currentUser.addressLabel} – {currentUser.city}
          </p>
        </div>
        <button
          onClick={() => navigate({ name: "search" })}
          className="hidden h-11 flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm text-muted hover:border-brand md:flex"
        >
          <Search size={18} /> Search for groceries, snacks and more
        </button>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <button onClick={() => navigate({ name: "categories" })} className="min-h-11 rounded-lg px-3 text-sm font-bold hover:bg-surface">Categories</button>
          <button onClick={() => navigate({ name: "orders" })} className="min-h-11 rounded-lg px-3 text-sm font-bold hover:bg-surface">Orders</button>
        </nav>
        <button onClick={() => navigate({ name: "profile" })} aria-label="Profile" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface hover:bg-line">
          <User size={20} />
        </button>
        <button
          onClick={() => navigate({ name: "cart" })}
          className="hidden h-11 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white hover:bg-brand-dark md:flex"
          aria-label={`Cart, ${bill.count} items`}
        >
          <ShoppingCart size={18} />
          {bill.count > 0 ? <span className="leading-tight">{bill.count} items · {rupee(bill.total)}</span> : "My Cart"}
        </button>
      </div>
    </header>
  );
}

const tabs: { label: string; screen: Screen["name"]; icon: typeof Home }[] = [
  { label: "Home", screen: "home", icon: Home },
  { label: "Categories", screen: "categories", icon: LayoutGrid },
  { label: "Orders", screen: "orders", icon: ClipboardList },
  { label: "Cart", screen: "cart", icon: ShoppingCart },
];

export function BottomNav() {
  const { screen, navigate, bill } = useApp();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Bottom">
      <ul className="grid grid-cols-4">
        {tabs.map(({ label, screen: target, icon: Icon }) => {
          const active = screen.name === target || (target === "categories" && screen.name === "category");
          return (
            <li key={label}>
              <button
                onClick={() => navigate({ name: target } as Screen)}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-16 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-bold", active ? "text-brand" : "text-muted")}
              >
                {active && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-brand" />}
                <span className="relative">
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                  {target === "cart" && bill.count > 0 && (
                    <span key={bill.count} className="animate-pop absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                      {bill.count}
                    </span>
                  )}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function FloatingCartBar() {
  const { bill, navigate, screen } = useApp();
  if (bill.count === 0 || ["cart", "checkout"].includes(screen.name)) return null;
  return (
    <button
      onClick={() => navigate({ name: "cart" })}
      className="animate-slide-up fixed inset-x-3 bottom-[76px] z-30 flex items-center justify-between rounded-xl bg-brand px-4 py-3 text-white shadow-lg md:hidden"
    >
      <span className="flex items-center gap-2 text-left">
        <ShoppingCart size={20} />
        <span className="leading-tight">
          <span className="block text-sm font-extrabold">{bill.count} item{bill.count > 1 ? "s" : ""}</span>
          <span className="block text-xs">{rupee(bill.total)}</span>
        </span>
      </span>
      <span className="text-sm font-extrabold">View cart ›</span>
    </button>
  );
}
