"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  X,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  ingredients: string[];
  isAvailable: boolean;
  sortOrder: number;
  category: { id: string; name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function formatPrice(n: number) {
  return n.toLocaleString("fa-IR");
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formIngredients, setFormIngredients] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formAvailable, setFormAvailable] = useState(true);

  const loadData = useCallback(async () => {
    const [prodRes, catRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
    ]);
    const prodData = await prodRes.json();
    const catData = await catRes.json();
    setProducts(prodData.products || []);
    setCategories(catData.categories || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setIsCreateMode(false);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormDesc(product.description);
    setFormImage(product.image);
    setFormIngredients(product.ingredients.join("، "));
    setFormCategory(product.category.id);
    setFormAvailable(product.isAvailable);
  };

  const openCreateDialog = () => {
    setEditProduct(null);
    setIsCreateMode(true);
    setFormName("");
    setFormPrice("");
    setFormDesc("");
    setFormImage("/images/pizzas/default.png");
    setFormIngredients("");
    setFormCategory(categories[0]?.id || "");
    setFormAvailable(true);
  };

  const closeDialog = () => {
    setEditProduct(null);
    setIsCreateMode(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const ingredients = formIngredients.split("،").map((s) => s.trim()).filter(Boolean);
    const body = {
      name: formName,
      price: parseInt(formPrice),
      description: formDesc,
      image: formImage,
      ingredients,
      categoryId: formCategory,
      isAvailable: formAvailable,
    };

    if (isCreateMode) {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else if (editProduct) {
      await fetch(`/api/admin/products?id=${editProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    closeDialog();
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این محصول مطمئنید؟")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    await loadData();
  };

  const handleToggleAvailability = async (product: Product) => {
    await fetch(`/api/admin/products?id=${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !product.isAvailable }),
    });
    await loadData();
  };

  const filtered = products.filter((p) =>
    p.name.includes(search) || p.category.name.includes(search)
  );

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            مدیریت محصولات
          </h1>
          <p className="text-sm text-zinc-400 font-bold mt-1">
            {products.length.toLocaleString("fa-IR")} محصول
          </p>
        </div>
        <Button onClick={openCreateDialog} className="rounded-xl bg-zinc-900 hover:bg-primary text-white font-bold gap-2">
          <Plus className="w-4 h-4" />
          محصول جدید
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder="جستجوی محصول..."
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
              !product.isAvailable ? "opacity-60" : ""
            }`}
          >
            <div className="relative aspect-square bg-zinc-50 p-4">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                unoptimized
              />
              {!product.isAvailable && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg">ناموجود</span>
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-1">
                <button
                  onClick={() => openEditDialog(product)}
                  className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleToggleAvailability(product)}
                  className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                  title={product.isAvailable ? "غیرفعال کردن" : "فعال کردن"}
                >
                  {product.isAvailable ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-black text-zinc-900 text-sm truncate">{product.name}</h3>
              </div>
              <p className="text-xs text-zinc-400 font-bold mb-2">{product.category.name}</p>
              <p className="text-primary font-black text-sm">{formatPrice(product.price)} تومان</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-zinc-300">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-bold">محصولی یافت نشد</p>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={!!editProduct || isCreateMode} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl bg-white font-lalezar" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black">
              {isCreateMode ? "محصول جدید" : "ویرایش محصول"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-bold text-zinc-500 mb-1 block">نام محصول</label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 mb-1 block">قیمت (تومان)</label>
                <Input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="rounded-xl" dir="ltr" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 mb-1 block">دسته‌بندی</label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 mb-1 block">توضیحات</label>
              <Textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="rounded-xl resize-none" rows={2} />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 mb-1 block">مواد اولیه (با ، جدا کنید)</label>
              <Input value={formIngredients} onChange={(e) => setFormIngredients(e.target.value)} className="rounded-xl" placeholder="پنیر موزارلا، سس گوجه..." />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 mb-1 block">آدرس تصویر</label>
              <Input value={formImage} onChange={(e) => setFormImage(e.target.value)} className="rounded-xl" dir="ltr" />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormAvailable(!formAvailable)}
                className={`w-10 h-6 rounded-full transition-colors ${formAvailable ? "bg-emerald-500" : "bg-zinc-300"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${formAvailable ? "translate-x-0" : "-translate-x-4"}`} />
              </button>
              <span className="text-xs font-bold text-zinc-600">{formAvailable ? "موجود" : "ناموجود"}</span>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-primary text-white font-bold gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isCreateMode ? "ایجاد محصول" : "ذخیره تغییرات"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
