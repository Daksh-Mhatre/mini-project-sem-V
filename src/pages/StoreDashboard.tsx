import { CheckCircle2, Clock, PackageCheck, Bell, Store } from "lucide-react";
import { useApp } from "../context/AppContext";
import { findStore } from "../data/stores";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/Feedback";
import { StoreOrderCard } from "../components/supermarket/StoreOrderCard";
import { statusRank } from "../lib/format";

const BASE_COMPLETED = 128;

export function StoreDashboard() {
  const { orders, storeId } = useApp();
  const store = findStore(storeId);
  const mine = orders.filter((o) => o.storeId === storeId);
  const incoming = mine.filter((o) => o.status === "placed");
  const preparing = mine.filter((o) => o.status === "preparing");
  const ready = mine.filter((o) => o.status === "ready" || o.status === "assigned");
  const completed = mine.filter((o) => statusRank[o.status] >= 5).length;
  const active = [...incoming, ...preparing, ...ready];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white"><Store size={24} /></span>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase text-muted">Partner store dashboard</p>
          <h1 className="text-2xl font-extrabold">{store.name}</h1>
        </div>
        <Badge tone="green" className="px-3 py-1 text-xs">● Open</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="New Orders" value={incoming.length} icon={Bell} tint="#E0F2FE" />
        <StatCard label="Preparing" value={preparing.length} icon={Clock} tint="#FEF3C7" />
        <StatCard label="Ready" value={ready.length} icon={PackageCheck} tint="#EAF7EE" />
        <StatCard label="Completed" value={BASE_COMPLETED + completed} icon={CheckCircle2} tint="#F1ECFB" />
      </div>

      <h2 className="mb-3 mt-7 text-lg font-extrabold">Incoming & active orders</h2>
      {active.length === 0 ? (
        <EmptyState emoji="🛎️" title="No active orders" text="New orders from nearby customers will appear here automatically. Place one from the Customer app." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {active.map((o) => <StoreOrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
