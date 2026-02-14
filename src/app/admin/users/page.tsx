"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  Loader2,
  Search,
  X,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserData {
  id: string;
  phone: string;
  name: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number; reviews: number };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleRole = async (user: UserData) => {
    const newRole = user.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    setTogglingId(user.id);
    await fetch(`/api/admin/users?id=${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    await loadUsers();
    setTogglingId(null);
  };

  const filtered = users.filter((u) =>
    u.name?.includes(search) || u.phone.includes(search)
  );

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;

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
          <Users className="w-6 h-6 text-primary" />
          مدیریت کاربران
        </h1>
        <p className="text-sm text-zinc-400 font-bold mt-1">
          {users.length.toLocaleString("fa-IR")} کاربر ({adminCount.toLocaleString("fa-IR")} ادمین، {customerCount.toLocaleString("fa-IR")} مشتری)
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder="جستجو بر اساس نام یا شماره..."
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

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-zinc-400 font-bold border-b border-zinc-100">
                <th className="text-right px-6 py-3.5">کاربر</th>
                <th className="text-right px-4 py-3.5">شماره تماس</th>
                <th className="text-right px-4 py-3.5">نقش</th>
                <th className="text-center px-4 py-3.5">سفارشات</th>
                <th className="text-center px-4 py-3.5">نظرات</th>
                <th className="text-right px-4 py-3.5">تاریخ عضویت</th>
                <th className="text-center px-4 py-3.5">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-sm font-black text-zinc-500">
                        {user.name?.charAt(0) || "?"}
                      </div>
                      <span className="font-bold text-zinc-800">{user.name || "بدون نام"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-zinc-600 font-bold" dir="ltr">{user.phone}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        user.role === "ADMIN"
                          ? "bg-primary/10 text-primary"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {user.role === "ADMIN" ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {user.role === "ADMIN" ? "ادمین" : "مشتری"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-zinc-500">
                      <ShoppingCart className="w-3 h-3" />
                      <span className="font-bold">{user._count.orders.toLocaleString("fa-IR")}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-zinc-500">
                      <Star className="w-3 h-3" />
                      <span className="font-bold">{user._count.reviews.toLocaleString("fa-IR")}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-zinc-400 font-bold">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => handleToggleRole(user)}
                      disabled={togglingId === user.id}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        user.role === "ADMIN"
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      } disabled:opacity-50`}
                    >
                      {togglingId === user.id ? (
                        <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                      ) : user.role === "ADMIN" ? (
                        "حذف ادمین"
                      ) : (
                        "ارتقا به ادمین"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-300">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-bold">کاربری یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}
