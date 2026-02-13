
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
    <div className="flex flex-col items-center mb-6 lg:mb-8 relative">
      <div className="w-[1.5px] h-8 lg:h-12 bg-black/10 relative" />
      <div className="relative flex flex-col items-center">
        <div className="w-4 h-2 lg:w-6 h-3 bg-zinc-800 rounded-t-sm border-b border-zinc-700" />
        <div className={cn(
          "w-16 h-8 lg:w-24 lg:h-12 bg-zinc-900 rounded-[100%_100%_15%_15%] relative z-20 border-b-2 border-zinc-800 transition-all duration-700",
          isOn ? "shadow-[0_10px_30px_rgba(230,126,34,0.2)]" : "opacity-95"
        )}>
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 lg:w-12 h-2 rounded-full blur-[4px] transition-all duration-700",
            isOn ? "bg-primary/60 opacity-100" : "bg-zinc-950 opacity-20"
          )} />
        </div>
        {/* Cinematic Light Cone - Subtle on light background */}
        {isOn && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[180%] h-48 bg-gradient-to-b from-primary/10 to-transparent blur-3xl pointer-events-none z-10" />
        )}
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showReviews && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowReviews(false);
      }
    };
    if (showReviews) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReviews]);

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
      className="relative group/card perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Interactive Halo - Optimized for light mode */}
      <div className="absolute inset-0 -z-10 pointer-events-none hidden lg:block overflow-visible">
        <div 
          className={cn(
            "absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ease-out pointer-events-none",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background: 'radial-gradient(circle, rgba(230, 126, 34, 0.15) 0%, rgba(230, 126, 34, 0.05) 40%, transparent 75%)',
            filter: 'blur(60px)',
            willChange: 'transform, opacity'
          }}
        />
      </div>
      
      <div 
        ref={cardRef}
        className={cn(
          "rounded-[3.5rem] w-full max-w-[90vw] sm:max-w-[420px] lg:max-w-[460px] h-[600px] sm:h-[650px] lg:h-[760px] flex flex-col overflow-hidden relative bg-white/40 backdrop-blur-2xl border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all duration-1000 will-change-transform z-10",
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
          <div className="w-1/2 h-full flex flex-col p-8 sm:p-10 lg:p-12 justify-between">
            <div className="space-y-6 lg:space-y-8 relative z-10">
              <div className="space-y-4 lg:space-y-5 flex flex-col items-center text-center">
                <IndustrialLamp isOn={pizza.isAvailable} />
                
                <div className="flex items-center gap-2">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < averageRating ? 'fill-current' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Authentic Recipe</span>
                </div>

                <h2 className={cn(
                  "text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter transition-all duration-1000 leading-tight px-4 text-zinc-900",
                  !pizza.isAvailable && "opacity-40 grayscale blur-[1px]"
                )}>
                  {pizza.name}
                </h2>
                
                <p className={cn("font-black text-2xl lg:text-3xl", pizza.isAvailable ? "text-primary drop-shadow-[0_5px_15px_rgba(230,126,34,0.2)]" : "text-zinc-300")}>
                  {pizza.price}
                </p>
              </div>

              <p className="text-sm sm:text-base lg:text-[16px] leading-relaxed text-center px-4 text-zinc-600 font-medium max-w-[95%] mx-auto">
                {pizza.description}
              </p>

              <div className="flex justify-center">
                <button 
                  onClick={() => setShowReviews(true)}
                  className="flex items-center gap-3 bg-black/[0.03] px-6 py-3 rounded-full text-xs font-bold text-zinc-900 hover:bg-primary/10 hover:text-primary transition-all group w-fit border border-black/[0.03]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    نظرات
                    <span className="mr-2 px-3 py-1 rounded-full bg-primary text-white text-[10px] group-hover:scale-110 transition-transform inline-block font-black shadow-lg shadow-primary/30">
                      {pizza.reviews.length}
                    </span>
                  </span>
                </button>
              </div>

              <div className="space-y-5 pt-2">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>Taste Intensity</span>
                    <span className="text-zinc-900">{pizza.cheesiness}%</span>
                  </div>
                  <Progress value={pizza.cheesiness} className="h-2 bg-black/[0.05]" />
                </div>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {pizza.ingredients.map((ing) => (
                    <div key={ing} className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold bg-black/[0.03] text-zinc-700 border border-black/[0.02]">
                      <Leaf className="w-3.5 h-3.5 text-green-500" />
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
                "w-full h-16 lg:h-20 rounded-[2.5rem] text-white font-black text-lg lg:text-xl transition-all mt-6 border-none shadow-xl",
                pizza.isAvailable 
                  ? "bg-zinc-900 hover:bg-primary hover:scale-[1.02] active:scale-95 hover:shadow-[0_20px_40px_rgba(230,126,34,0.3)]" 
                  : "bg-zinc-200 text-zinc-400"
              )}
            >
              <ShoppingCart className="mr-3 w-6 h-6" />
              {pizza.isAvailable ? "سفارش سریع" : "فعلاً ناموجود"}
            </Button>
          </div>

          {/* Reviews Side */}
          <div className="w-1/2 h-full flex flex-col p-8 sm:p-12 lg:p-14 bg-white/60 backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-8 lg:mb-10">
              <h3 className="text-2xl lg:text-3xl font-black text-zinc-900">نظرات مشتریان</h3>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowReviews(false); }} 
                className="w-12 h-12 flex items-center justify-center bg-black/[0.03] text-zinc-900 rounded-full hover:bg-primary hover:text-white transition-all border border-black/[0.03] group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            
            <ScrollArea className="flex-1 pr-6">
              <div className="space-y-5">
                {pizza.reviews.length > 0 ? (
                  pizza.reviews.map((r) => (
                    <div key={r.id} className="p-6 lg:p-7 bg-white/50 rounded-[2rem] border border-black/[0.03] shadow-sm transition-all hover:bg-white hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-black text-sm lg:text-base text-zinc-900">{r.userName}</span>
                        <div className="flex text-primary">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 lg:w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs lg:text-sm text-zinc-600 leading-relaxed font-medium">{r.comment}</p>
                      <span className="text-[10px] text-zinc-400 mt-4 block font-bold">{r.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-zinc-300">
                    <MessageSquare className="w-16 h-16 mb-6 opacity-20" />
                    <p className="text-xl font-black">هنوز نظری ثبت نشده</p>
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
