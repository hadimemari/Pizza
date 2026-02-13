
"use client";

import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Leaf, ShoppingCart, Star, MessageSquare } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const IndustrialLamp = memo(({ isOn }: { isOn: boolean }) => {
  return (
    <div className="flex flex-col items-center mb-4 lg:mb-6 relative">
      <div className="w-[1px] h-6 lg:h-8 bg-black/40 relative" />
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-1.5 lg:w-4 h-2 bg-zinc-800 rounded-t-sm border-b border-zinc-700" />
        <div className={cn(
          "w-16 h-8 lg:w-20 lg:h-10 bg-zinc-900 rounded-[100%_100%_15%_15%] relative z-20 border-b-2 border-zinc-800 transition-all duration-700",
          isOn ? "shadow-[0_5px_20px_rgba(251,191,36,0.1)]" : "opacity-95"
        )}>
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 lg:w-10 lg:h-3 rounded-full blur-[4px] transition-all duration-700",
            isOn ? "bg-amber-100/60 opacity-100" : "bg-zinc-800 opacity-40"
          )} />
        </div>
        <div className={cn(
          "absolute top-6 lg:top-8 left-1/2 -translate-x-1/2 w-64 h-64 lg:w-72 lg:h-72 pointer-events-none transition-all duration-1000 ease-in-out z-10 hidden sm:block",
          isOn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(circle at top, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.03) 50%, transparent 80%)',
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              filter: 'blur(25px)'
            }}
          />
        </div>
      </div>
    </div>
  );
});

IndustrialLamp.displayName = 'IndustrialLamp';

export const PizzaCard = memo(({ pizza, visible, onOrder }: { pizza: Pizza; visible: boolean; onOrder: () => void }) => {
  const [showReviews, setShowReviews] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowReviews(false);
  }, [pizza.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showReviews && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowReviews(false);
      }
    };
    if (showReviews) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReviews]);

  const averageRating = useMemo(() => {
    if (!pizza.reviews || pizza.reviews.length === 0) return 5;
    return Math.round(pizza.reviews.reduce((acc, r) => acc + r.rating, 0) / pizza.reviews.length);
  }, [pizza.reviews]);

  return (
    <div 
      ref={cardRef}
      className={cn(
        "rounded-[2.5rem] lg:rounded-[4rem] w-full max-w-[90vw] sm:max-w-[450px] lg:max-w-[500px] h-[520px] sm:h-[600px] lg:h-[700px] flex flex-col overflow-hidden relative bg-white/80 backdrop-blur-xl border border-black/5 shadow-2xl transition-all duration-500 will-change-transform",
        !visible ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}
    >
      <div 
        className={cn(
          "flex w-[200%] h-full transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform",
          showReviews ? "-translate-x-1/2" : "translate-x-0"
        )}
      >
        {/* Main Content Side */}
        <div className="w-1/2 h-full flex flex-col p-5 sm:p-6 lg:p-10 justify-between">
          <div className="space-y-4 lg:space-y-6 relative z-10">
            <div className="space-y-2 lg:space-y-4 flex flex-col items-center text-center">
              <IndustrialLamp isOn={pizza.isAvailable} />
              <div className="flex items-center gap-2">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < averageRating ? 'fill-current' : 'text-black/10'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Premium Quality</span>
              </div>
              <h2 className={cn(
                "text-xl sm:text-2xl lg:text-4xl font-black uppercase tracking-tighter transition-all duration-700",
                pizza.isAvailable ? "text-foreground" : "text-zinc-400 opacity-40 blur-[0.5px]"
              )}>
                {pizza.name}
              </h2>
              <p className={cn("font-black text-lg lg:text-2xl", pizza.isAvailable ? "text-primary" : "text-zinc-400")}>
                {pizza.price}
              </p>
            </div>

            <p className="text-[11px] sm:text-sm leading-relaxed text-center px-2 text-muted-foreground line-clamp-2">
              {pizza.description}
            </p>

            <div className="flex justify-center">
              <button 
                onClick={() => setShowReviews(true)}
                className="flex items-center gap-3 bg-black/5 px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/10 hover:text-primary transition-all group w-fit"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>
                  نظرات
                  <span className="mr-1.5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] group-hover:scale-110 transition-transform inline-block">
                    {pizza.reviews.length}
                  </span>
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                  <span>Cheesiness</span>
                  <span>{pizza.cheesiness}%</span>
                </div>
                <Progress value={pizza.cheesiness} className="h-1 bg-black/5" />
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {pizza.ingredients.slice(0, 4).map((ing) => (
                  <div key={ing} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-bold bg-black/5">
                    <Leaf className="w-2.5 h-2.5 text-green-600" />
                    {ing}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={onOrder}
            disabled={!pizza.isAvailable}
            className={cn(
              "w-full h-12 lg:h-14 rounded-xl text-white font-bold transition-all mt-4",
              pizza.isAvailable ? "bg-black hover:bg-primary" : "bg-zinc-300"
            )}
          >
            <ShoppingCart className="mr-2 w-4 h-4" />
            {pizza.isAvailable ? "سفارش" : "ناموجود"}
          </Button>
        </div>

        {/* Reviews Side (Smartphone Slide Feature) */}
        <div className="w-1/2 h-full flex flex-col p-5 sm:p-8 bg-white/50 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-foreground">نظرات مشتریان</h3>
            <button 
              onClick={() => setShowReviews(false)} 
              className="w-10 h-10 flex items-center justify-center bg-black/5 rounded-full hover:bg-primary hover:text-white transition-all"
            >
              ←
            </button>
          </div>
          
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-4">
              {pizza.reviews.length > 0 ? (
                pizza.reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-white/80 rounded-2xl border border-black/5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs">{r.userName}</span>
                      <div className="flex text-primary">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{r.comment}</p>
                    <span className="text-[9px] text-zinc-300 mt-2 block">{r.date}</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-30">
                  <MessageSquare className="w-12 h-12 mb-2" />
                  <p className="text-sm font-bold">هنوز نظری ثبت نشده است</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
});

PizzaCard.displayName = 'PizzaCard';
