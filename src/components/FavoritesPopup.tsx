"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  ShoppingBag,
  Loader2,
  Zap,
  X,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api-client";

interface FavoriteItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    isAvailable: boolean;
  };
}

interface FavoriteOrder {
  id: string;
  title: string;
  totalAmount?: number;
  items: FavoriteItem[];
}

interface FavoritesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderAdded: () => void;
}

export const FavoritesPopup: React.FC<FavoritesPopupProps> = ({
  isOpen,
  onClose,
  onOrderAdded,
}) => {
  const [favorites, setFavorites] = useState<FavoriteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const { data } = await api.favorites.list();
    if (data?.favorites) {
      setFavorites(data.favorites);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
      setSuccess(false);
    }
  }, [isOpen, loadFavorites]);

  const handleQuickOrder = async (fav: FavoriteOrder) => {
    setOrdering(fav.id);
    for (const item of fav.items) {
      if (!item.product.isAvailable) continue;
      const { error } = await api.cart.add(item.product.id, item.quantity);
      if (error) {
        setOrdering(null);
        return;
      }
    }
    setOrdering(null);
    setSuccess(true);
    onOrderAdded();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] max-h-[80vh] rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl font-lalezar p-0 overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-bl from-red-500 via-rose-500 to-pink-500 px-6 pt-8 pb-6">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-6 w-16 h-16 rounded-full bg-white blur-2xl" />
            <div className="absolute bottom-2 left-8 w-12 h-12 rounded-full bg-white blur-2xl" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="relative z-10 text-center text-white">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3">
              <Heart className="w-7 h-7 fill-white" />
            </div>
            <h2 className="text-2xl font-black">سفارش همیشگی</h2>
            <p className="text-sm text-white/80 mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              غذاهای مورد علاقه‌تان آماده سفارش هستند
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-emerald-200/50 animate-ping" />
            </div>
            <p className="text-lg font-black text-zinc-900">به سبد خرید اضافه شد</p>
            <p className="text-xs text-zinc-400">در حال بستن...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
            <Heart className="w-12 h-12 text-zinc-200" />
            <p className="text-base font-black text-zinc-400">هنوز آیتمی در همیشگی ندارید</p>
            <p className="text-xs text-zinc-400">با زدن دکمه قلب روی هر محصول، آن را ذخیره کنید</p>
            <Button
              onClick={onClose}
              variant="outline"
              className="mt-2 rounded-xl border-dashed"
            >
              بستن
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-[45vh] px-5 pb-5">
            <div className="space-y-3 pt-3">
              {favorites.map((fav) => {
                const totalPrice = fav.items.reduce(
                  (sum, item) => sum + item.product.price * item.quantity,
                  0
                );
                const allAvailable = fav.items.every((i) => i.product.isAvailable);

                return (
                  <div
                    key={fav.id}
                    className="relative p-4 rounded-2xl bg-gradient-to-bl from-red-50/80 to-rose-50/50 border border-red-100/60 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900">{fav.title}</p>
                          <p className="text-[10px] text-zinc-400">{fav.items.length} آیتم</p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-3">
                      {fav.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex-shrink-0 flex items-center gap-2 bg-white/80 rounded-xl p-2 border border-black/5"
                        >
                          <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center">
                            <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold whitespace-nowrap text-zinc-700">{item.product.name}</p>
                            <p className="text-[9px] text-zinc-400">
                              {item.product.price.toLocaleString("fa-IR")} ت
                              {item.quantity > 1 && ` × ${item.quantity}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-red-100/60">
                      <p className="text-xs text-zinc-500">
                        مبلغ:{" "}
                        <span className="font-black text-zinc-800">
                          {totalPrice.toLocaleString("fa-IR")} تومان
                        </span>
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleQuickOrder(fav)}
                        disabled={ordering !== null || !allAvailable}
                        className="h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold px-4 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-rose-200/50"
                      >
                        {ordering === fav.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 ml-1" />
                            سفارش سریع
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
