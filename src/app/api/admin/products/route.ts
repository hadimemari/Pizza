import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";
import { productUpdateSchema } from "@/lib/server/validations";

// Update product
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");
  if (!productId) {
    return NextResponse.json({ error: "شناسه محصول الزامی است" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { ingredients, ...rest } = parsed.data;
  const updateData: Record<string, unknown> = { ...rest };
  if (ingredients) {
    updateData.ingredients = JSON.stringify(ingredients);
  }

  const product = await db.product.update({
    where: { id: productId },
    data: updateData,
  });

  return NextResponse.json({ product });
}

// Delete product
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");
  if (!productId) {
    return NextResponse.json({ error: "شناسه محصول الزامی است" }, { status: 400 });
  }

  await db.product.delete({ where: { id: productId } });
  return NextResponse.json({ message: "محصول حذف شد" });
}
