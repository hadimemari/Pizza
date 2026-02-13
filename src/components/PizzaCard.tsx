
"use client";

import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Leaf, ShoppingCart, Star, MessageSquare, ChevronLeft } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const IndustrialLamp = memo(({ isOn }: { isOn: boolean }) => {
  return (
    <div className="flex flex-col items-center mb-1 lg:mb-2 relative">
      <div className="w-[1px] h-4 lg:h-6 bg-black/10 relative" />
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-1.5 lg:w-4 lg:h-2 bg-zinc-800 rounded-t-sm border-b border-zinc-700" />
        <div className={cn(
          "w-12 h-6 lg:w-16 lg:h-8 bg-zinc-900 rounded-[100%_100%_15%_15%] relative z-20 border-b-2 border-zinc-800 transition-all duration-700",
          isOn ? "shadow-[0_5px_15px_rgba(230,126,34,0.1)]" : "opacity-95"
        )}>
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 lg:w-8 lg:h-1.5 rounded-full blur-[3px] transition-all duration-700",
            isOn ? "bg-primary/40 opacity-100" : "bg-zinc-950 opacity-20"
          )} />
        </div>
      </div>
    </div>
  );
});

IndustrialLamp.displayName = 'IndustrialLamp';

export const PizzaCard = memo(({ pizza, visible, onOrder }: { pizza: Pizza; visible: boolean; onOrder: () => void }) => {
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
      className="relative group/card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* INTERACTIVE LIVE HALO - Desktop Only */}
      <div 
        className={cn(
          "absolute inset-0 -z-10 transition-opacity duration-700 pointer-events-none hidden lg:block",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          transform: `translate3d(${mousePos.x - 200}px, ${mousePos.y - 200}px, 0)`,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(230, 126, 34, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          borderRadius: '50%',
          willChange: 'transform'
        }}
      />

      <div 
        ref={cardRef}
        className={cn(
          "rounded-[3rem] w-full max-w-[90vw] sm:max-w-[420px] lg:max-w-[440px] h-[650px] sm:h-[680px] lg:h-[720px] flex flex-col overflow-hidden relative bg-white/40 backdrop-blur-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.03)] transition-all duration-1000 will-change-transform z-10",
          !visible ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        <div 
          className={cn(
            "flex w-[200%] h-full transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform",
            showReviews ? "-translate-x-1/2" : "translate-x-0"
          )}
        >
          {/* Main Content Side */}
          <div className="w-1/2 h-full flex flex-col p-6 lg:p-8 justify-between">
            <div className="flex-1 flex flex-col space-y-3 lg:space-y-4 relative z-10 overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <IndustrialLamp isOn={pizza.isAvailable} />
                
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < averageRating ? 'fill-current' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Premium</span>
                </div>

                <h2 className={cn(
                  "text-2xl lg:text-[2.2rem] font-black uppercase tracking-tighter transition-all duration-1000 leading-tight px-2 text-zinc-900",
                  !pizza.isAvailable && "opacity-40 grayscale blur-[1px]"
                )}>
                  {pizza.name}
                </h2>
                
                <p className={cn("font-black text-xl lg:text-2xl mt-0.5", pizza.isAvailable ? "text-primary drop-shadow-[0_5px_15px_rgba(230,126,34,0.12)]" : "text-zinc-300")}>
                  {pizza.price}
                </p>
              </div>

              <p className="text-xs lg:text-[13px] leading-relaxed text-center px-4 text-zinc-500 font-medium max-w-[95%] mx-auto line-clamp-3">
                {pizza.description}
              </p>

              <div className="flex justify-center">
                <button 
                  onClick={() => setShowReviews(true)}
                  className="flex items-center gap-2 bg-black/[0.03] px-5 py-1.5 rounded-full text-[10px] font-bold text-zinc-900 hover:bg-primary/10 hover:text-primary transition-all group w-fit border border-black/[0.03]"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>
                    نظرات
                    <span className="mr-2 px-2 py-0.5 rounded-full bg-primary text-white text-[8px] group-hover:scale-110 transition-transform inline-block font-black shadow-lg shadow-primary/30">
                      {pizza.reviews.length}
                    </span>
                  </span>
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>Intensity</span>
                    <span className="text-zinc-900">{pizza.cheesiness}%</span>
                  </div>
                  <Progress value={pizza.cheesiness} className="h-1 bg-black/[0.05]" />
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {pizza.ingredients.slice(0, 4).map((ing) => (
                    <div key={ing} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-bold bg-black/[0.03] text-zinc-600 border border-black/[0.02]">
                      <Leaf className="w-2.5 h-2.5 text-green-500" />
                      {ing}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-black/5">
              <Button 
                onClick={onOrder}
                disabled={!pizza.isAvailable}
                className={cn(
                  "w-full h-12 lg:h-14 rounded-[2rem] text-white font-black text-base transition-all border-none shadow-lg relative overflow-hidden group/btn",
                  pizza.isAvailable 
                    ? "bg-zinc-900 hover:bg-primary hover:scale-[1.01] active:scale-95" 
                    : "bg-zinc-200 text-zinc-400"
                )}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                <ShoppingCart className="mr-2 w-5 h-5 relative z-10" />
                <span className="relative z-10">{pizza.isAvailable ? "سفارش سریع" : "فعلاً ناموجود"}</span>
              </Button>
            </div>
          </div>

          {/* Reviews Side */}
          <div className="w-1/2 h-full flex flex-col p-8 bg-white/70 backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-zinc-900">نظرات مشتریان</h3>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowReviews(false); }} 
                className="w-8 h-8 flex items-center justify-center bg-black/[0.03] text-zinc-900 rounded-full hover:bg-primary hover:text-white transition-all border border-black/[0.03] group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {pizza.reviews.length > 0 ? (
                  pizza.reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-white/50 rounded-[1.5rem] border border-black/[0.03] shadow-sm transition-all hover:bg-white">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-black text-xs text-zinc-900">{r.userName}</span>
                        <div className="flex text-primary">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{r.comment}</p>
                      <span className="text-[8px] text-zinc-400 mt-2 block font-bold">{r.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-300">
                    <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-base font-black">بدون نظر</p>
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
