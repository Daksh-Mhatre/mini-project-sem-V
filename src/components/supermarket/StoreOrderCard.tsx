import { useState } from "react";
import { Bike, Check, MapPin, User } from "lucide-react";
import type { Order } from "../../types";
import { useApp } from "../../context/AppContext";
import { findProduct } from "../../data/products";
import { currentUser, findPartner, findStore } from "../../data/stores";
import { rupee, statusLabel } from "../../lib/format";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

export function StoreOrderCard({ order }: { order: Order }) {
  const { updateOrder, showToast } = useApp();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const store = findStore(order.storeId);
  const partner = findPartner(order.partnerId);
  const count = order.items.reduce((s, i) => s + i.qty, 0);
  const allPicked = order.items.every((i) => checked[i.productId]);

  const tone = order.status === "placed" ? "blue" : order.status === "preparing" ? "amber" : "green";

  return (
    <article className="animate-slide-up rounded-2xl border border-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-lg font-extrabold">{order.status === "placed" ? "New Order " : "Order "}#{order.id}</p>
          <p className="text-sm text-muted">{count} items · {rupee(order.total)} · {order.payment}</p>
        </div>
        <Badge tone={tone}>{order.status === "ready" ? "Ready for pickup" : statusLabel[order.status]}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span className="flex items-center gap-1"><User size={14} /> {currentUser.name}</span>
        <span className="flex items-center gap-1"><MapPin size={14} /> {store.distance} km delivery</span>
      </div>

      {order.status === "placed" && (
        <>
          <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
            {order.items.map((i) => (
              <li key={i.productId} className="rounded-md bg-surface px-2 py-1 font-semibold">{findProduct(i.productId)?.name} × {i.qty}</li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={() => { updateOrder(order.id, "preparing"); showToast(`Order #${order.id} accepted`); }}>Accept Order</Button>
            <Button variant="danger" onClick={() => updateOrder(order.id, "rejected")}>Reject</Button>
          </div>
        </>
      )}

      {order.status === "preparing" && (
        <>
          <p className="mt-4 text-xs font-bold uppercase text-muted">Pick list</p>
          <ul className="mt-2 space-y-1.5">
            {order.items.map((i) => {
              const on = !!checked[i.productId];
              return (
                <li key={i.productId}>
                  <button
                    onClick={() => setChecked((c) => ({ ...c, [i.productId]: !on }))}
                    aria-pressed={on}
                    className={cn("flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 text-left text-sm transition-colors", on ? "border-brand bg-brand-light" : "border-line")}
                  >
                    <span className={cn("flex h-5 w-5 items-center justify-center rounded border-2", on ? "border-brand bg-brand text-white" : "border-line")}>
                      {on && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className={cn("flex-1 font-semibold", on && "text-muted line-through")}>{findProduct(i.productId)?.name}</span>
                    <span className="font-bold">× {i.qty}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Button block className="mt-4" onClick={() => { updateOrder(order.id, "ready"); showToast("Order marked ready for pickup"); }}>
            {allPicked ? "Mark Order Ready" : "Mark Order Ready (skip checklist)"}
          </Button>
        </>
      )}

      {(order.status === "ready" || order.status === "assigned") && (
        <div className="mt-4 rounded-xl bg-surface p-3">
          <p className="flex items-center gap-2 text-sm">
            <Bike size={16} className="text-brand" />
            {partner ? <>Delivery partner <strong>{partner.name}</strong> is on the way</> : "Waiting for a delivery partner to accept…"}
          </p>
          <Button block className="mt-3" disabled={!partner} onClick={() => { updateOrder(order.id, "picked"); showToast("Order handed over"); }}>
            Hand Over Order
          </Button>
        </div>
      )}
    </article>
  );
}
