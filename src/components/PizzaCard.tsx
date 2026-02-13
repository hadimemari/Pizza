
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
      <div className="w-[1.5px] h-6 lg:h-10 bg-black/30 relative" />
      <div className="relative flex flex-col items-center">
        <div className="w-4 h-2 lg:w-6 h-3 bg-zinc-800 rounded-t-sm border-b border-zinc-700" />
        <div className={cn(
          "w-16 h-8 lg:w-24 lg:h-12 bg-zinc-900 rounded-[100%_100%_15%_15%] relative z-20 border-b-2 border-zinc-800 transition-all duration-700",
          isOn ? "shadow-[0_5px_30px_rgba(251,191,36,0.3)]" : "opacity-95"
        )}>
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 lg:w-12 h-3 rounded-full blur-[6px] transition-all duration-700",
            isOn ? "bg-amber-100/70 opacity-100" : "bg-zinc-800 opacity-40"
          )} />
        </div>
        <div className={cn(
          "absolute top-6 lg:top-10 left-1/2 -translate-x-1/2 w-[350px] h-[350px] lg:w-[600px] lg:h-[600px] pointer-events-none transition-all duration-1000 ease-in-out z-10 hidden sm:block",
          isOn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(circle at top, rgba(230, 126, 34, 0.3) 0%, rgba(230, 126, 34, 0.1) 40%, transparent 70%)',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              filter: 'blur(50px)'
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
      {/* Interactive Liquid Halo (Desktop Only) */}
      <div className="absolute inset-0 -z-10 pointer-events-none hidden lg:block overflow-visible">
        <div 
          className={cn(
            "absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ease-out pointer-events-none",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background: 'radial-gradient(circle, rgba(230, 126, 34, 0.15) 0%, rgba(230, 126, 34, 0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
            willChange: 'transform, opacity'
          }}
        />
        <div 
          className={cn(
            "absolute w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ease-out pointer-events-none delay-75",
            isHovered ? "opacity-60" : "opacity-0"
          )}
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 60%)',
            filter: 'blur(40px)',
            willChange: 'transform, opacity'
          }}
        />
      </div>
      
      <div 
        ref={cardRef}
        className={cn(
          "rounded-[3rem] lg:rounded-[3.5rem] w-full max-w-[90vw] sm:max-w-[400px] lg:max-w-[440px] h-[580px] sm:h-[620px] lg:h-[680px] flex flex-col overflow-hidden relative bg-white/85 backdrop-blur-3xl border border-black/5 shadow-2xl transition-all duration-700 will-change-transform z-10",
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
          <div className="w-1/2 h-full flex flex-col p-6 sm:p-8 lg:p-10 justify-between">
            <div className="space-y-4 lg:space-y-6 relative z-10">
              <div className="space-y-3 lg:space-y-4 flex flex-col items-center text-center">
                <IndustrialLamp isOn={pizza.isAvailable} />
                <div className="flex items-center gap-2">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < averageRating ? 'fill-current' : 'text-black/10'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Authentic Recipe</span>
                </div>
                <h2 className={cn(
                  "text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter transition-all duration-700 leading-tight px-4",
                  pizza.isAvailable ? "text-foreground" : "text-zinc-400 grayscale opacity-40 blur-[1.5px]"
                )}>
                  {pizza.name}
                </h2>
                <p className={cn("font-black text-xl lg:text-2xl", pizza.isAvailable ? "text-primary drop-shadow-[0_2px_10px_rgba(230,126,34,0.2)]" : "text-zinc-400")}>
                  {pizza.price}
                </p>
              </div>

              <p className="text-xs sm:text-sm lg:text-[14px] leading-relaxed text-center px-4 text-muted-foreground/80 font-medium max-w-[90%] mx-auto">
                {pizza.description}
              </p>

              <div className="flex justify-center">
                <button 
                  onClick={() => setShowReviews(true)}
                  className="flex items-center gap-3 bg-black/5 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary/10 hover:text-primary transition-all group w-fit"
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

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    <span>Taste Intensity</span>
                    <span>{pizza.cheesiness}%</span>
                  </div>
                  <Progress value={pizza.cheesiness} className="h-1.5 bg-black/5" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {pizza.ingredients.map((ing) => (
                    <div key={ing} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold bg-black/5 text-foreground/70">
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
                "w-full h-14 lg:h-16 rounded-2xl lg:rounded-[2rem] text-white font-black text-base lg:text-lg transition-all mt-4 shadow-xl shadow-black/5",
                pizza.isAvailable ? "bg-black hover:bg-primary hover:scale-[1.02] active:scale-95 shadow-primary/10" : "bg-zinc-300"
              )}
            >
              <ShoppingCart className="mr-3 w-5 h-5 lg:w-5 lg:h-5" />
              {pizza.isAvailable ? "سفارش سریع" : "فعلاً ناموجود"}
            </Button>
          </div>

          {/* Reviews Side */}
          <div className="w-1/2 h-full flex flex-col p-6 sm:p-10 lg:p-12 bg-white/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h3 className="text-xl lg:text-2xl font-black text-foreground">نظرات مشتریان</h3>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowReviews(false); }} 
                className="w-10 h-10 flex items-center justify-center bg-black/5 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
              </button>
            </div>
            
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {pizza.reviews.length > 0 ? (
                  pizza.reviews.map((r) => (
                    <div key={r.id} className="p-4 lg:p-5 bg-white/80 rounded-[1.5rem] border border-black/5 shadow-sm transition-all hover:shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-xs lg:text-sm text-foreground">{r.userName}</span>
                        <div className="flex text-primary">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 lg:w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] lg:text-xs text-muted-foreground leading-relaxed font-medium">{r.comment}</p>
                      <span className="text-[9px] text-zinc-300 mt-3 block font-bold">{r.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-30">
                    <MessageSquare className="w-12 h-12 mb-4" />
                    <p className="text-base font-black">هنوز نظری ثبت نشده</p>
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
