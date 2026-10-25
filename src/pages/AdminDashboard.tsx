import { Bike, CheckCircle2, ShoppingBag, Store } from "lucide-react";
import { useApp } from "../context/AppContext";
import { findStore, stores } from "../data/stores";
import { statusLabel } from "../lib/format";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";

const sampleLive = [
  { id: 1019, storeId: "dailyneeds", label: "Out for delivery", tone: "amber" as const },
  { id: 1018, storeId: "ganesh", label: "Delivered", tone: "green" as const },
];

export function AdminDashboard() {
  const { orders } = useApp();
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const live = [
    ...orders.map((o) => ({
      id: o.id,
      storeId: o.storeId,
      label: statusLabel[o.status],
      tone: o.status === "delivered" ? ("green" as const) : o.status === "rejected" ? ("red" as const) : ("amber" as const),
    })),
    ...sampleLive,
  ];

  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted">Platform admin</p>
      <h1 className="mb-5 text-2xl font-extrabold">Network overview</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Orders" value={184 + orders.length} icon={ShoppingBag} tint="#E0F2FE" />
        <StatCard label="Partner Stores" value={12} icon={Store} tint="#EAF7EE" />
        <StatCard label="Delivery Partners" value={21} icon={Bike} tint="#FEF3C7" />
        <StatCard label="Completed" value={162 + delivered} icon={CheckCircle2} tint="#F1ECFB" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-4">
          <h2 className="mb-3 font-extrabold">Live orders</h2>
          <ul className="divide-y divide-line">
            {live.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <span><strong>#{o.id}</strong> <span className="text-muted">· {findStore(o.storeId).name}</span></span>
                <Badge tone={o.tone}>{o.label}</Badge>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white p-4">
          <h2 className="mb-3 font-extrabold">Partner stores</h2>
          <ul className="divide-y divide-line">
            {stores.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3 text-sm">
                <span><strong>{s.name}</strong> <span className="text-muted">· {s.area}</span></span>
                <Badge tone={s.status === "online" ? "green" : "red"}>{s.status === "online" ? "🟢 Online" : "🔴 Offline"}</Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
