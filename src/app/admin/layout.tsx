"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ChefHat,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: string;
}

const navItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/orders", label: "سفارشات", icon: ShoppingCart },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/users", label: "کاربران", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user?.role === "ADMIN") {
          setUser(data.user);
        } else {
          router.replace("/");
        }
      } catch {
        router.replace("/");
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-zinc-500 font-bold">بارگذاری پنل مدیریت...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-zinc-50/80 font-lalezar" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-primary" />
          <span className="font-black text-lg">پنل مدیریت</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-[260px] bg-white border-l border-zinc-100 flex flex-col transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <ChefHat className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none">
                پیتزا<span className="text-primary">موشن</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-bold tracking-wider">پنل مدیریت</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", active ? "text-primary" : "text-zinc-400")} />
                {item.label}
                {active && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-sm font-black text-zinc-600">
              {user.name?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-black truncate">{user.name || "ادمین"}</span>
              <span className="text-[11px] text-zinc-400 font-bold" dir="ltr">{user.phone}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-[260px] pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
