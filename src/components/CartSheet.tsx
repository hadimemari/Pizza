"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api-client';

interface CartItem {
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

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCartUpdate: (count: number) => void;
}

export const CartSheet: React.FC<CartSheetProps> = ({ isOpen, onClose, onCartUpdate }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: number; refId: string } | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    const { data } = await api.cart.get();
    if (data) {
      setItems(data.items);
      setTotal(data.total);
      onCartUpdate(data.items.reduce((s, i) => s + i.quantity, 0));
    }
    setLoading(false);
  }, [onCartUpdate]);

  useEffect(() => {
    if (isOpen) {
      loadCart();
      setOrderSuccess(null);
    }
  }, [isOpen, loadCart]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    await api.cart.update(itemId, quantity);
    await loadCart();
  };

  const handleClearCart = async () => {
    await api.cart.clear();
    setItems([]);
    setTotal(0);
    onCartUpdate(0);
  };

  const handleOrder = async () => {
    setOrdering(true);

    // 1. Create order from cart
    const { data: orderData, error: orderErr } = await api.orders.create();
    if (orderErr || !orderData) {
      setOrdering(false);
      return;
    }

    // 2. Process payment (demo mode)
    const { data: payData } = await api.payment.request(orderData.order.id);

    setOrdering(false);
    setOrderSuccess({
      orderNumber: orderData.order.orderNumber,
      refId: payData?.payment?.refId || "",
    });
    setItems([]);
    setTotal(0);
    onCartUpdate(0);
  };

  const formatPrice = (price: number) => price.toLocaleString("fa-IR") + " تومان";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[85vh] rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl font-lalezar p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-black text-center text-foreground uppercase tracking-tighter flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            سبد خرید
          </DialogTitle>
        </DialogHeader>

        {/* Order Success */}
        {orderSuccess && (
          <div className="p-8 flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h3 className="text-xl font-black text-zinc-900">سفارش ثبت شد!</h3>
            <div className="text-center space-y-1 text-sm text-zinc-500">
              <p>شماره سفارش: <span className="font-black text-zinc-900">{orderSuccess.orderNumber}</span></p>
              {orderSuccess.refId && (
                <p>کد پیگیری: <span className="font-black text-primary">{orderSuccess.refId}</span></p>
              )}
            </div>
            <Button onClick={onClose} className="mt-4 rounded-xl bg-black hover:bg-primary text-white font-bold">
              بازگشت به منو
            </Button>
          </div>
        )}

        {/* Cart Content */}
        {!orderSuccess && (
          <>
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-300 px-6">
                <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-base font-black">سبد خرید خالی است</p>
                <p className="text-xs text-zinc-400 mt-1">محصولی به سبد اضافه کنید</p>
              </div>
            ) : (
              <>
                <ScrollArea className="max-h-[45vh] px-6">
                  <div className="space-y-3 pb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-black/[0.02] rounded-2xl border border-black/[0.03]">
                        <div className="relative w-14 h-14 flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black truncate">{item.product.name}</p>
                          <p className="text-xs text-primary font-bold">{formatPrice(item.product.price)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1 || 0)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                          </button>
                          <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-6 pt-3 border-t border-black/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">جمع کل:</span>
                    <span className="text-lg font-black text-primary">{formatPrice(total)}</span>
                  </div>

                  <Button
                    onClick={handleOrder}
                    disabled={ordering}
                    className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-primary text-white font-black text-base transition-all"
                  >
                    {ordering ? <Loader2 className="w-5 h-5 animate-spin" /> : "ثبت سفارش و پرداخت"}
                  </Button>

                  <button
                    onClick={handleClearCart}
                    className="w-full text-center text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    خالی کردن سبد
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
