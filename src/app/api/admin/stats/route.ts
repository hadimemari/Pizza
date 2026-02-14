import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    todayOrders,
    totalRevenue,
    todayRevenue,
    ordersByStatus,
    recentOrders,
    dailyRevenue,
  ] = await Promise.all([
    db.user.count(),
    db.product.count(),
    db.order.count(),
    db.order.count({ where: { createdAt: { gte: todayStart } } }),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } },
    }),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
    }),
    db.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, phone: true } },
        items: { include: { product: { select: { name: true } } } },
        payment: { select: { status: true, refId: true } },
      },
    }),
    // Daily revenue for last 7 days
    db.order.findMany({
      where: { createdAt: { gte: weekAgo }, status: { not: "CANCELLED" } },
      select: { totalAmount: true, createdAt: true },
    }),
  ]);

  // Process daily revenue into chart data
  const dailyMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
    dailyMap.set(key, 0);
  }
  for (const order of dailyRevenue) {
    const key = order.createdAt.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
    dailyMap.set(key, (dailyMap.get(key) || 0) + order.totalAmount);
  }

  const chartData = Array.from(dailyMap.entries()).map(([date, amount]) => ({
    date,
    amount,
  }));

  // Process status counts
  const statusCounts: Record<string, number> = {};
  for (const s of ordersByStatus) {
    statusCounts[s.status] = s._count.id;
  }

  return NextResponse.json({
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
    },
    statusCounts,
    recentOrders,
    chartData,
  });
}
