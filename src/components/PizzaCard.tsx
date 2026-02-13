
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
    <div className="flex flex-col items-center mb-6 lg:mb-8 relative">
      <div className="w-[1.5px] h-8 lg:h-12 bg-black/40 relative" />
      <div className="relative flex flex-col items-center">
        <div className="w-4 h-2 lg:w-6 h-3 bg-zinc-800 rounded-t-sm border-b border-zinc-700" />
        <div className={cn(
          "w-20 h-10 lg:w-28 lg:h-14 bg-zinc-900 rounded-[100%_100%_15%_15%] relative z-20 border-b-2 border-zinc-800 transition-all duration-700",
          isOn ? "shadow-[0_5px_30px_rgba(251,191,36,0.2)]" : "opacity-95"
        )}>
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 lg:w-14 lg:h-4 rounded-full blur-[6px] transition-all duration-700",
            isOn ? "bg-amber-100/60 opacity-100" : "bg-zinc-800 opacity-40"
          )} />
        </div>
        <div className={cn(
          "absolute top-8 lg:top-12 left-1/2 -translate-x-1/2 w-72 h-72 lg:w-96 lg:h-96 pointer-events-none transition-all duration-1000 ease-in-out z-10 hidden sm:block",
          isOn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(circle at top, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.05) 50%, transparent 80%)',
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              filter: 'blur(35px)'
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
    <div className="relative group/card">
      {/* Cinematic Glow Behind Card (Desktop Only) */}
      <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[80px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 hidden lg:block" />
      
      <div 
        ref={cardRef}
        className={cn(
          "rounded-[3rem] lg:rounded-[4.5rem] w-full max-w-[90vw] sm:max-w-[450px] lg:max-w-[550px] h-[580px] sm:h-[650px] lg:h-[780px] flex flex-col overflow-hidden relative bg-white/90 backdrop-blur-2xl border border-black/5 shadow-2xl transition-all duration-700 will-change-transform",
          !visible ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        <div 
          className={cn(
            "flex w-[200%] h-full transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform",
            showReviews ? "-translate-x-1/2" : "translate-x-0"
          )}
        >
          {/* Main Content Side */}
          <div className="w-1/2 h-full flex flex-col p-6 sm:p-8 lg:p-12 justify-between">
            <div className="space-y-6 lg:space-y-8 relative z-10">
              <div className="space-y-4 lg:space-y-6 flex flex-col items-center text-center">
                <IndustrialLamp isOn={pizza.isAvailable} />
                <div className="flex items-center gap-3">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < averageRating ? 'fill-current' : 'text-black/10'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] lg:text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Premium Quality</span>
                </div>
                <h2 className={cn(
                  "text-2xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tighter transition-all duration-700",
                  pizza.isAvailable ? "text-foreground" : "text-zinc-400 opacity-40 blur-[1px]"
                )}>
                  {pizza.name}
                </h2>
                <p className={cn("font-black text-xl lg:text-3xl", pizza.isAvailable ? "text-primary" : "text-zinc-400")}>
                  {pizza.price}
                </p>
              </div>

              <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-center px-4 text-muted-foreground/80 font-medium">
                {pizza.description}
              </p>

              <div className="flex justify-center">
                <button 
                  onClick={() => setShowReviews(true)}
                  className="flex items-center gap-4 bg-black/5 px-6 py-3 rounded-full text-xs lg:text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all group w-fit"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    نظرات
                    <span className="mr-2 px-2.5 py-1 rounded-full bg-primary text-white text-[10px] lg:text-[11px] group-hover:scale-110 transition-transform inline-block font-black shadow-lg shadow-primary/30">
                      {pizza.reviews.length}
                    </span>
                  </span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <span>Cheesiness</span>
                    <span>{pizza.cheesiness}%</span>
                  </div>
                  <Progress value={pizza.cheesiness} className="h-1.5 bg-black/5" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {pizza.ingredients.map((ing) => (
                    <div key={ing} className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] lg:text-[10px] font-bold bg-black/5 text-foreground/70">
                      <Leaf className="w-3 h-3 text-green-600" />
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
                "w-full h-14 lg:h-18 rounded-2xl lg:rounded-3xl text-white font-black text-base lg:text-xl transition-all mt-6 shadow-xl shadow-black/5",
                pizza.isAvailable ? "bg-black hover:bg-primary hover:scale-[1.02] active:scale-95" : "bg-zinc-300"
              )}
            >
              <ShoppingCart className="mr-3 w-5 h-5 lg:w-6 lg:h-6" />
              {pizza.isAvailable ? "سفارش سریع" : "فعلاً ناموجود"}
            </Button>
          </div>

          {/* Reviews Side (Smartphone Slide Feature) */}
          <div className="w-1/2 h-full flex flex-col p-6 sm:p-10 lg:p-14 bg-white/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-8 lg:mb-10">
              <h3 className="text-2xl lg:text-3xl font-black text-foreground">نظرات مشتریان</h3>
              <button 
                onClick={() => setShowReviews(false)} 
                className="w-12 h-12 flex items-center justify-center bg-black/5 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                ←
              </button>
            </div>
            
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {pizza.reviews.length > 0 ? (
                  pizza.reviews.map((r) => (
                    <div key={r.id} className="p-5 lg:p-6 bg-white/80 rounded-[2rem] border border-black/5 shadow-sm transition-all hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-black text-sm lg:text-base text-foreground">{r.userName}</span>
                        <div className="flex text-primary">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 lg:w-4 lg:h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed font-medium">{r.comment}</p>
                      <span className="text-[10px] text-zinc-300 mt-4 block font-bold">{r.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground opacity-30">
                    <MessageSquare className="w-16 h-16 mb-4" />
                    <p className="text-lg font-black">هنوز نظری ثبت نشده است</p>
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
