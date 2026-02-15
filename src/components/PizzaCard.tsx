"use client";

import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { type MappedProduct as Pizza } from '@/lib/data-mapper';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Leaf, ShoppingCart, Star, MessageSquare, ChevronLeft, Heart } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const IndustrialLamp = memo(({ isOn }: { isOn: boolean }) => {
  return (
    <div className="flex flex-col items-center mb-0.5 sm:mb-1 lg:mb-2 relative">
      <div className="w-[1px] h-3 sm:h-4 lg:h-6 bg-black/10 relative" />
      <div className="relative flex flex-col items-center">
        <div className="w-2.5 h-1 sm:w-3 sm:h-1.5 lg:w-4 lg:h-2 bg-zinc-800 rounded-t-sm border-b border-zinc-700" />
        <div className={cn(
          "w-10 h-5 sm:w-12 sm:h-6 lg:w-16 lg:h-8 bg-zinc-900 rounded-[100%_100%_15%_15%] relative z-20 border-b-2 border-zinc-800 transition-all duration-700",
          isOn ? "shadow-[0_5px_15px_rgba(230,126,34,0.1)]" : "opacity-95"
        )}>
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 sm:w-6 sm:h-1 lg:w-8 lg:h-1.5 rounded-full blur-[3px] transition-all duration-700",
            isOn ? "bg-primary/40 opacity-100" : "bg-zinc-950 opacity-20"
          )} />
        </div>
      </div>
    </div>
  );
});

IndustrialLamp.displayName = 'IndustrialLamp';

export const PizzaCard = memo(({ pizza, visible, onOrder, isFavorite, onToggleFavorite }: {
  pizza: Pizza; visible: boolean; onOrder: () => void;
  isFavorite?: boolean; onToggleFavorite?: () => void;
}) => {
  const [showReviews, setShowReviews] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowReviews(false);
  }, [pizza.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === 'undefined' || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const averageRating = useMemo(() => {
    if (!pizza.reviews || pizza.reviews.length === 0) return 5;
    return Math.round(pizza.reviews.reduce((acc, r) => acc + r.rating, 0) / pizza.reviews.length);
  }, [pizza.reviews]);

  return (
    <div
      className="relative group/card h-full sm:h-auto"
      dir="rtl"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* INTERACTIVE LIVE HALO - Desktop Only */}
      <div
        className={cn(
          "absolute inset-0 -z-10 transition-all duration-300 ease-out pointer-events-none hidden lg:block opacity-0 group-hover/card:opacity-100",
        )}
        style={{
          transform: `translate3d(${mousePos.x - 150}px, ${mousePos.y - 150}px, 0)`,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(230, 126, 34, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          borderRadius: '50%',
          willChange: 'transform'
        }}
      />

      <div
        ref={cardRef}
        className={cn(
          "rounded-[2rem] sm:rounded-[3rem] w-full max-w-[78vw] sm:max-w-[420px] lg:max-w-[440px] flex flex-col overflow-hidden relative border border-white/20 transition-all duration-1000 z-10",
          "h-full sm:h-[680px] lg:h-[720px]",
          "bg-white/90 sm:bg-white/40 sm:backdrop-blur-3xl",
          "shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.03)]",
          !visible ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        <div
          className={cn(
            "flex w-[200%] h-full transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1)",
            showReviews ? "translate-x-1/2" : "translate-x-0"
          )}
        >
          {/* Main Content Side */}
          <div className="w-1/2 h-full flex flex-col p-3 sm:p-6 lg:p-8 justify-between relative">
            <div className="flex-1 flex flex-col space-y-1 sm:space-y-3 lg:space-y-4 relative z-10 overflow-hidden text-center">
              <div className="flex flex-col items-center">
                {/* Lamp - visible on all sizes */}
                <IndustrialLamp isOn={pizza.isAvailable} />

                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5" dir="ltr">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < averageRating ? 'fill-current' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                  <span className="text-[7px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] hidden sm:inline">Premium</span>
                </div>

                <h2 className={cn(
                  "text-xl sm:text-2xl lg:text-[2.5rem] font-black tracking-tight transition-all duration-1000 leading-tight px-1 text-zinc-900",
                  !pizza.isAvailable && "opacity-40 grayscale blur-[1px]"
                )}>
                  {pizza.name}
                </h2>

                {/* Dynamic Price Badge */}
                <div className="relative inline-flex items-center justify-center mt-1" dir="rtl">
                  {pizza.isAvailable && (
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
                  )}
                  <p className={cn(
                    "font-black text-xl sm:text-xl lg:text-2xl relative px-4 py-0.5 rounded-full transition-all duration-700",
                    pizza.isAvailable
                      ? "text-primary bg-primary/[0.06] border border-primary/10"
                      : "text-zinc-300"
                  )}>
                    {pizza.price}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-xs lg:text-[13px] leading-relaxed text-zinc-500 font-medium max-w-[95%] mx-auto line-clamp-2 text-center" dir="rtl">
                {pizza.description}
              </p>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowReviews(true)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-black/[0.03] px-3 sm:px-5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[10px] font-bold text-zinc-900 hover:bg-primary/10 hover:text-primary transition-all group w-fit border border-black/[0.03]"
                >
                  <MessageSquare className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span className="flex items-center gap-1">
                    نظرات
                    <span className="px-1 sm:px-2 py-0.5 rounded-full bg-primary text-white text-[6px] sm:text-[8px] group-hover:scale-110 transition-transform inline-block font-black">
                      {pizza.reviews.length}
                    </span>
                  </span>
                </button>
                {onToggleFavorite && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                    className={cn(
                      "flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 border",
                      isFavorite
                        ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                        : "bg-black/[0.03] text-zinc-500 border-black/[0.03] hover:bg-red-50 hover:text-red-400 hover:border-red-200"
                    )}
                  >
                    <Heart className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 transition-all duration-300", isFavorite && "fill-current scale-110")} />
                    <span className="hidden sm:inline">{isFavorite ? "همیشگی" : "همیشگی"}</span>
                  </button>
                )}
              </div>

              {/* Ingredients - glass buttons, visible on all sizes */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-2">
                {pizza.ingredients.slice(0, 3).map((ing) => (
                  <div key={ing} className="flex items-center gap-1 sm:gap-1 px-2.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[8px] font-bold bg-white/60 sm:bg-black/[0.03] text-zinc-600 border border-black/[0.04] backdrop-blur-sm">
                    <Leaf className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-500" />
                    {ing}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-1.5 sm:mt-4 pt-1.5 sm:pt-4 border-t border-black/5">
              <Button
                onClick={onOrder}
                disabled={!pizza.isAvailable}
                className={cn(
                  "w-full h-11 sm:h-12 lg:h-14 rounded-[1.5rem] sm:rounded-[2rem] text-white font-black text-base sm:text-base transition-all border-none shadow-lg relative overflow-hidden group/btn",
                  pizza.isAvailable
                    ? "bg-zinc-900 hover:bg-primary hover:scale-[1.01] active:scale-95"
                    : "bg-zinc-200 text-zinc-400"
                )}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                <ShoppingCart className="ml-2 w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                <span className="relative z-10">{pizza.isAvailable ? "سفارش سریع" : "فعلاً ناموجود"}</span>
              </Button>
            </div>
          </div>

          {/* Reviews Side */}
          <div className="w-1/2 h-full flex flex-col p-4 sm:p-8 bg-white/70 sm:backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <h3 className="text-base sm:text-xl font-black text-zinc-900">نظرات مشتریان</h3>
              <button
                onClick={(e) => { e.stopPropagation(); setShowReviews(false); }}
                className="w-8 h-8 flex items-center justify-center bg-black/[0.03] text-zinc-900 rounded-full hover:bg-primary hover:text-white transition-all border border-black/[0.03] group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" />
              </button>
            </div>

            <ScrollArea className="flex-1 pl-2">
              <div className="space-y-2 sm:space-y-3">
                {pizza.reviews.length > 0 ? (
                  pizza.reviews.map((r) => (
                    <div key={r.id} className="p-2.5 sm:p-4 bg-white/50 rounded-[1.2rem] sm:rounded-[1.5rem] border border-black/[0.03] shadow-sm transition-all hover:bg-white">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-[10px] sm:text-xs text-zinc-900">{r.userName}</span>
                        <div className="flex text-primary" dir="ltr">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed font-medium">{r.comment}</p>
                      <span className="text-[7px] sm:text-[8px] text-zinc-400 mt-1.5 block font-bold" dir="ltr">{r.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-zinc-300">
                    <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 opacity-20" />
                    <p className="text-sm sm:text-base font-black">بدون نظر</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
});

PizzaCard.displayName = 'PizzaCard';
