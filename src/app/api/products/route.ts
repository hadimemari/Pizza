import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";
import { productCreateSchema } from "@/lib/server/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");

  const products = await db.product.findMany({
    where: categorySlug
      ? { category: { slug: categorySlug } }
      : undefined,
    orderBy: { sortOrder: "asc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  // Parse ingredients from JSON string
  const formatted = products.map((p) => ({
    ...p,
    ingredients: JSON.parse(p.ingredients) as string[],
  }));

  return NextResponse.json({ products: formatted });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { ingredients, ...rest } = parsed.data;
    const product = await db.product.create({
      data: {
        ...rest,
        ingredients: JSON.stringify(ingredients),
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
