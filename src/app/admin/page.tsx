"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: { name: string; phone: string };
  items: Array<{ product: { name: string }; quantity: number }>;
  payment: { status: string; refId: string } | null;
}

interface ChartData {
  date: string;
  amount: number;
}

const statusLabels: Record<string, string> = {
  PENDING: "در انتظار",
  CONFIRMED: "تایید شده",
  PREPARING: "در حال آماده‌سازی",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function formatPrice(n: number) {
  return n.toLocaleString("fa-IR");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "لحظاتی پیش";
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${days} روز پیش`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setChartData(data.chartData || []);
      setStatusCounts(data.statusCounts || {});
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "درآمد کل",
      value: formatPrice(stats.totalRevenue) + " ت",
      sub: `امروز: ${formatPrice(stats.todayRevenue)} ت`,
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "سفارشات",
      value: stats.totalOrders.toLocaleString("fa-IR"),
      sub: `امروز: ${stats.todayOrders.toLocaleString("fa-IR")}`,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "محصولات",
      value: stats.totalProducts.toLocaleString("fa-IR"),
      sub: "محصول فعال",
      icon: Package,
      color: "from-primary to-orange-600",
      shadow: "shadow-primary/20",
    },
    {
      label: "کاربران",
      value: stats.totalUsers.toLocaleString("fa-IR"),
      sub: "کاربر ثبت‌نام شده",
      icon: Users,
      color: "from-violet-500 to-violet-600",
      shadow: "shadow-violet-500/20",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">داشبورد</h1>
          <p className="text-sm text-zinc-400 font-bold mt-1">خلاصه وضعیت رستوران</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold bg-white px-4 py-2 rounded-xl border border-zinc-100">
          <Clock className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.shadow}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-zinc-900">{card.value}</p>
            <p className="text-xs text-zinc-400 font-bold mt-1">{card.sub}</p>
            <p className="text-[11px] text-zinc-300 font-bold mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black text-zinc-900">نمودار درآمد</h2>
              <p className="text-xs text-zinc-400 font-bold">۷ روز اخیر</p>
            </div>
          </div>
          <div className="h-[260px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={{ stroke: "#f4f4f5" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={{ stroke: "#f4f4f5" }}
                  tickFormatter={(v) => v.toLocaleString("fa-IR")}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #f4f4f5",
                    fontFamily: "Lalezar",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [formatPrice(value) + " تومان", "درآمد"]}
                />
                <Bar dataKey="amount" fill="hsl(28, 77%, 52%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-100">
          <h2 className="text-base font-black text-zinc-900 mb-1">وضعیت سفارشات</h2>
          <p className="text-xs text-zinc-400 font-bold mb-6">توزیع وضعیت‌ها</p>
          <div className="space-y-3">
            {Object.entries(statusLabels).map(([key, label]) => {
              const count = statusCounts[key] || 0;
              const total = stats.totalOrders || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-bold ${statusColors[key]}`}>{label}</span>
                    <span className="text-zinc-500 font-bold">{count.toLocaleString("fa-IR")}</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-primary to-orange-400 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-zinc-900">آخرین سفارشات</h2>
            <p className="text-xs text-zinc-400 font-bold">۸ سفارش اخیر</p>
          </div>
          <a href="/admin/orders" className="text-xs text-primary font-bold hover:underline">
            مشاهده همه
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-zinc-400 font-bold border-b border-zinc-50">
                <th className="text-right px-6 py-3">شماره</th>
                <th className="text-right px-4 py-3">مشتری</th>
                <th className="text-right px-4 py-3">آیتم‌ها</th>
                <th className="text-right px-4 py-3">مبلغ</th>
                <th className="text-right px-4 py-3">وضعیت</th>
                <th className="text-right px-4 py-3">زمان</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <span className="font-black text-zinc-700">#{order.orderNumber}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-zinc-800">{order.user?.name || "بدون نام"}</p>
                      <p className="text-[11px] text-zinc-400" dir="ltr">{order.user?.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-zinc-600 truncate max-w-[180px]">
                      {order.items.map((i) => `${i.product.name} (${i.quantity})`).join("، ")}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-black text-zinc-800">{formatPrice(order.totalAmount)} ت</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-zinc-400 font-bold">{timeAgo(order.createdAt)}</span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-300 text-sm font-bold">
                    هنوز سفارشی ثبت نشده
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
