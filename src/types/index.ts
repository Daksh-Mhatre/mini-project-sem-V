export interface Category {
  id: string;
  name: string;
  emoji: string;
  tint: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  emoji: string;
  quantity: string;
  price: number;
  originalPrice?: number;
  description: string;
  tags: string[];
}

export interface Store {
  id: string;
  name: string;
  rating: number;
  distance: number;
  deliveryTime: string;
  area: string;
  status: "online" | "offline";
}

export interface DeliveryPartner {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
}

export interface User {
  name: string;
  phone: string;
  addressLabel: string;
  address: string;
  city: string;
}

export type OrderStatus =
  | "finding"
  | "placed"
  | "preparing"
  | "ready"
  | "assigned"
  | "picked"
  | "out"
  | "delivered"
  | "rejected";

export interface OrderItem {
  productId: string;
  qty: number;
}

export interface Order {
  id: number;
  storeId: string;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  payment: string;
  status: OrderStatus;
  partnerId?: string;
  createdAt: number;
}

export type Role = "customer" | "store" | "delivery" | "admin";

export type Screen =
  | { name: "home" }
  | { name: "search" }
  | { name: "categories" }
  | { name: "category"; id: string }
  | { name: "product"; id: string }
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "tracking"; id: number }
  | { name: "orders" }
  | { name: "profile" };
