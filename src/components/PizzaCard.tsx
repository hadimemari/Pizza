
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
    <div className="flex flex-col items-center mb-4 lg:mb-6 relative">
      <div className="w-[1.5px] h-6 lg:h-10 bg-black/10 relative" />
      <div className="relative flex flex-col items-center">
        <div className="w-4 h-2 lg:w-6 h-3 bg-zinc-800 rounded-t-sm border-b border-zinc-700" />
        <div className={cn(
          "w-16 h-8 lg:w-20 lg:h-10 bg-zinc-900 rounded-[100%_100%_15%_15%] relative z-20 border-b-2 border-zinc-800 transition-all duration-700",
          isOn ? "shadow-[0_10px_20px_rgba(230,126,34,0.1)]" : "opacity-95"
        )}>
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 lg:w-10 h-1.5 rounded-full blur-[4px] transition-all duration-700",
            isOn ? "bg-primary/50 opacity-100" : "bg-zinc-950 opacity-20"
          )} />
        </div>
        {/* Subtle Light Cone */}
        {isOn && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[150%] h-32 bg-gradient-to-b from-primary/5 to-transparent blur-2xl pointer-events-none z-10" />
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
      <div 
        ref={cardRef}
        className={cn(
          "rounded-[3.5rem] w-full max-w-[90vw] sm:max-w-[420px] lg:max-w-[440px] h-[620px] sm:h-[680px] lg:h-[740px] flex flex-col overflow-hidden relative bg-white/40 backdrop-blur-3xl border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.04)] transition-all duration-1000 will-change-transform z-10",
          !visible ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        {/* Interactive Liquid Halo - Desktop Only */}
        <div 
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-700 ease-out pointer-events-none overflow-hidden hidden lg:block",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div 
            className="absolute w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out rounded-full"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              background: 'radial-gradient(circle, rgba(230, 126, 34, 0.12) 0%, rgba(230, 126, 34, 0.04) 45%, transparent 70%)',
              filter: 'blur(50px)',
              willChange: 'transform'
            }}
          />
        </div>

        <div 
          className={cn(
            "flex w-[200%] h-full transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform",
            showReviews ? "-translate-x-1/2" : "translate-x-0"
          )}
        >
          {/* Main Content Side */}
          <div className="w-1/2 h-full flex flex-col p-8 lg:p-10 justify-between">
            <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 relative z-10">
              <div className="flex flex-col items-center text-center">
                <IndustrialLamp isOn={pizza.isAvailable} />
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < averageRating ? 'fill-current' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Authentic</span>
                </div>

                <h2 className={cn(
                  "text-3xl lg:text-4xl font-black uppercase tracking-tighter transition-all duration-1000 leading-tight px-4 text-zinc-900",
                  !pizza.isAvailable && "opacity-40 grayscale blur-[1px]"
                )}>
                  {pizza.name}
                </h2>
                
                <p className={cn("font-black text-2xl lg:text-3xl mt-2", pizza.isAvailable ? "text-primary drop-shadow-[0_5px_15px_rgba(230,126,34,0.15)]" : "text-zinc-300")}>
                  {pizza.price}
                </p>
              </div>

              <p className="text-sm lg:text-[15px] leading-relaxed text-center px-4 text-zinc-600 font-medium max-w-[95%] mx-auto line-clamp-3">
                {pizza.description}
              </p>

              <div className="flex justify-center">
                <button 
                  onClick={() => setShowReviews(true)}
                  className="flex items-center gap-3 bg-black/[0.03] px-6 py-2.5 rounded-full text-[11px] font-bold text-zinc-900 hover:bg-primary/10 hover:text-primary transition-all group w-fit border border-black/[0.03]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    نظرات
                    <span className="mr-2 px-2.5 py-0.5 rounded-full bg-primary text-white text-[9px] group-hover:scale-110 transition-transform inline-block font-black shadow-lg shadow-primary/30">
                      {pizza.reviews.length}
                    </span>
                  </span>
                </button>
              </div>

              <div className="space-y-4 pt-1">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>Intensity</span>
                    <span className="text-zinc-900">{pizza.cheesiness}%</span>
                  </div>
                  <Progress value={pizza.cheesiness} className="h-1.5 bg-black/[0.05]" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {pizza.ingredients.map((ing) => (
                    <div key={ing} className="flex items-center gap-1.5 px-3 py-1.2 rounded-full text-[9px] font-bold bg-black/[0.03] text-zinc-700 border border-black/[0.02]">
                      <Leaf className="w-3 h-3 text-green-500" />
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
                "w-full h-14 lg:h-18 rounded-[2rem] text-white font-black text-lg transition-all mt-4 border-none shadow-lg",
                pizza.isAvailable 
                  ? "bg-zinc-900 hover:bg-primary hover:scale-[1.02] active:scale-95 hover:shadow-[0_15px_35px_rgba(230,126,34,0.35)]" 
                  : "bg-zinc-200 text-zinc-400"
              )}
            >
              <ShoppingCart className="mr-3 w-5 h-5 lg:w-6 lg:h-6" />
              {pizza.isAvailable ? "سفارش سریع" : "فعلاً ناموجود"}
            </Button>
          </div>

          {/* Reviews Side */}
          <div className="w-1/2 h-full flex flex-col p-8 sm:p-12 lg:p-14 bg-white/70 backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-zinc-900">نظرات مشتریان</h3>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowReviews(false); }} 
                className="w-10 h-10 flex items-center justify-center bg-black/[0.03] text-zinc-900 rounded-full hover:bg-primary hover:text-white transition-all border border-black/[0.03] group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {pizza.reviews.length > 0 ? (
                  pizza.reviews.map((r) => (
                    <div key={r.id} className="p-5 bg-white/50 rounded-[2rem] border border-black/[0.03] shadow-sm transition-all hover:bg-white hover:shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm text-zinc-900">{r.userName}</span>
                        <div className="flex text-primary">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] text-zinc-600 leading-relaxed font-medium">{r.comment}</p>
                      <span className="text-[9px] text-zinc-400 mt-3 block font-bold">{r.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-black">هنوز نظری ثبت نشده</p>
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
