"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ShoppingCart,
  Loader2,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  XCircle,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; image: string };
}

interface Order {
  id: string;
  orderNumber: number;
  status: string;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  user: { name: string; phone: string };
  items: OrderItem[];
  payment: { status: string; gateway: string; refId: string } | null;
}

const statusLabels: Record<string, string> = {
  PENDING: "در انتظار",
  CONFIRMED: "تایید شده",
  PREPARING: "در حال آماده‌سازی",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  PREPARING: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-3.5 h-3.5" />,
  CONFIRMED: <CheckCircle className="w-3.5 h-3.5" />,
  PREPARING: <ChefHat className="w-3.5 h-3.5" />,
  DELIVERED: <Truck className="w-3.5 h-3.5" />,
  CANCELLED: <XCircle className="w-3.5 h-3.5" />,
};

const allStatuses = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"];

function formatPrice(n: number) {
  return n.toLocaleString("fa-IR");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    await fetch(`/api/orders?orderId=${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await loadOrders();
    setUpdatingId(null);
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toString().includes(search) ||
      o.user?.name?.includes(search) ||
      o.user?.phone?.includes(search);
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          مدیریت سفارشات
        </h1>
        <p className="text-sm text-zinc-400 font-bold mt-1">
          {orders.length.toLocaleString("fa-IR")} سفارش
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="جستجو بر اساس شماره، نام یا تلفن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 rounded-xl border-zinc-200 bg-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="rounded-xl w-[160px] border-zinc-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">همه وضعیت‌ها</SelectItem>
              {allStatuses.map((s) => (
                <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", ...allStatuses].map((s) => {
          const count = s === "ALL" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                statusFilter === s
                  ? s === "ALL" ? "bg-zinc-900 text-white border-zinc-900" : statusColors[s]
                  : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200"
              }`}
            >
              {s === "ALL" ? "همه" : statusLabels[s]} ({count.toLocaleString("fa-IR")})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const isExpanded = expandedId === order.id;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div
                className="px-5 py-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
              >
                <div className="flex items-center gap-1 text-zinc-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>

                <div className="flex-1 flex items-center gap-4 flex-wrap min-w-0">
                  <span className="font-black text-zinc-800 text-sm whitespace-nowrap">#{order.orderNumber}</span>

                  <div className="min-w-0">
                    <p className="font-bold text-zinc-700 text-sm truncate">{order.user?.name || "بدون نام"}</p>
                    <p className="text-[11px] text-zinc-400" dir="ltr">{order.user?.phone}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border ${statusColors[order.status]}`}>
                    {statusIcons[order.status]}
                    {statusLabels[order.status]}
                  </span>

                  <span className="font-black text-zinc-800 text-sm mr-auto">{formatPrice(order.totalAmount)} ت</span>

                  <span className="text-[11px] text-zinc-400 font-bold whitespace-nowrap">{formatDate(order.createdAt)}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-zinc-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Items */}
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 mb-2">آیتم‌های سفارش</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-zinc-50 rounded-xl px-3 py-2">
                            <span className="text-sm font-bold text-zinc-700">{item.product.name}</span>
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                              <span>{item.quantity}x</span>
                              <span className="font-bold">{formatPrice(item.unitPrice)} ت</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.note && (
                        <div className="mt-3 p-3 bg-amber-50 rounded-xl text-xs text-amber-700 font-bold">
                          یادداشت: {order.note}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 mb-2">تغییر وضعیت</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {allStatuses.map((s) => (
                          <button
                            key={s}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(order.id, s);
                            }}
                            disabled={order.status === s || updatingId === order.id}
                            className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border flex items-center justify-center gap-1 ${
                              order.status === s
                                ? statusColors[s]
                                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 disabled:opacity-40"
                            }`}
                          >
                            {updatingId === order.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              statusIcons[s]
                            )}
                            {statusLabels[s]}
                          </button>
                        ))}
                      </div>

                      {order.payment && (
                        <div className="mt-3 p-3 bg-zinc-50 rounded-xl text-xs space-y-1">
                          <p className="text-zinc-400">
                            وضعیت پرداخت:{" "}
                            <span className={order.payment.status === "SUCCESS" ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                              {order.payment.status === "SUCCESS" ? "پرداخت شده" : "در انتظار"}
                            </span>
                          </p>
                          {order.payment.refId && (
                            <p className="text-zinc-400">
                              کد پیگیری: <span className="text-zinc-700 font-bold" dir="ltr">{order.payment.refId}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-zinc-300">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-bold">سفارشی یافت نشد</p>
        </div>
      )}
    </div>
  );
}
