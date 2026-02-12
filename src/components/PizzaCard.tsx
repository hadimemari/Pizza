
"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Leaf, ShoppingCart, Star, MessageSquare, ArrowRight, User, MessageCircle } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const IndustrialLamp = ({ isOn }: { isOn: boolean }) => {
  return (
    <div className="flex flex-col items-center mb-6 relative">
      <div className="w-[1px] h-8 bg-black/40 relative">
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-black/0 to-black/60" />
      </div>
      
      <div className="relative flex flex-col items-center">
        <div className="w-4 h-2 bg-zinc-800 rounded-t-sm border-b border-zinc-700" />
        
        <div className={cn(
          "w-20 h-10 bg-zinc-900 rounded-[100%_100%_15%_15%] relative z-20 border-b-2 border-zinc-800 shadow-2xl transition-all duration-700",
          isOn ? "shadow-[0_10px_40px_rgba(251,191,36,0.15)]" : "opacity-95"
        )}>
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full blur-[4px] transition-all duration-700",
            isOn ? "bg-amber-100/80 opacity-100" : "bg-zinc-800 opacity-40"
          )} />
          <div className="absolute inset-0 rounded-[100%_100%_15%_15%] border-t border-white/5 pointer-events-none" />
        </div>

        <div className={cn(
          "absolute top-8 left-1/2 -translate-x-1/2 w-72 h-80 pointer-events-none transition-all duration-1000 ease-in-out z-10",
          isOn ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}>
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(circle at top, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.04) 50%, transparent 80%)',
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              filter: 'blur(30px)'
            }}
          />
        </div>

        <div className={cn(
          "absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.4em] transition-all duration-500 z-30",
          isOn ? "text-amber-500 shadow-sm" : "text-zinc-600 opacity-40"
        )}>
          {isOn ? "موجود در تنور" : "فعلاً تمام شده"}
        </div>
      </div>
    </div>
  );
};

export const PizzaCard: React.FC<{ pizza: Pizza; visible: boolean; onOrder: (pizza: Pizza) => void }> = ({ pizza, visible, onOrder }) => {
  const [displayPizza, setDisplayPizza] = useState(pizza);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayPizza(pizza);
      setShowReviews(false);
      setIsTransitioning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [pizza]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const averageRating = useMemo(() => {
    if (!displayPizza.reviews || displayPizza.reviews.length === 0) return 5;
    const sum = displayPizza.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / displayPizza.reviews.length);
  }, [displayPizza]);

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "rounded-[2.5rem] lg:rounded-[4rem] transform w-full max-w-[500px] h-[600px] lg:h-[700px] flex flex-col overflow-hidden relative bg-white/70 backdrop-blur-2xl border border-black/5 shadow-2xl shadow-black/5 transition-all duration-700",
        isTransitioning ? "opacity-40 translate-x-4 blur-sm" : "opacity-100 translate-x-0"
      )}
    >
      {/* Dynamic Glow Background */}
      <div 
        className={cn(
          "absolute pointer-events-none transition-opacity duration-700 ease-in-out bg-primary/20 blur-[120px] rounded-full w-[400px] h-[400px] -z-10",
          isHovering ? "opacity-100" : "opacity-0"
        )}
        style={{
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          transition: isHovering ? 'left 0.2s ease-out, top 0.2s ease-out, opacity 0.7s ease-in-out' : 'opacity 0.7s ease-in-out'
        }}
      />

      {/* Sliding Content Wrapper */}
      <div 
        className={cn(
          "flex w-[200%] h-full transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
          showReviews ? "-translate-x-1/2" : "translate-x-0"
        )}
      >
        {/* VIEW 1: PIZZA INFO */}
        <div className="w-1/2 h-full flex flex-col p-6 lg:p-10 justify-between">
          <div className="space-y-4 lg:space-y-6 relative z-10">
            <div className="space-y-2 lg:space-y-4 flex flex-col items-center text-center">
              <IndustrialLamp isOn={displayPizza.isAvailable} />

              <div className="flex items-center gap-2">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 lg:w-4 lg:h-4 ${i < averageRating ? 'fill-current' : 'text-black/10'}`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-muted-foreground tracking-widest uppercase">طعم اصیل پیتزا موشن</span>
              </div>
              
              <div className="space-y-1 relative px-4">
                <h2 className={cn(
                  "text-2xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-tight transition-all duration-1000",
                  displayPizza.isAvailable 
                    ? "text-foreground drop-shadow-[0_15px_35px_rgba(251,191,36,0.3)] scale-100 opacity-100" 
                    : "text-zinc-400 grayscale opacity-30 scale-95 blur-[0.5px]"
                )}>
                  {displayPizza.name}
                </h2>
                <p className={cn(
                  "font-black text-xl sm:text-2xl lg:text-3xl mt-2 transition-all duration-700",
                  displayPizza.isAvailable ? "text-primary" : "text-zinc-400"
                )}>
                  {displayPizza.price}
                </p>
              </div>
            </div>

            <p className={cn(
              "text-xs sm:text-sm lg:text-base leading-relaxed font-medium text-center px-4 transition-all duration-700",
              displayPizza.isAvailable ? "text-muted-foreground/90" : "text-zinc-400/50"
            )}>
              {displayPizza.description}
            </p>

            <div className="flex justify-center">
              <button 
                onClick={() => setShowReviews(true)}
                className="flex items-center gap-3 bg-black/5 px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/10 hover:text-primary transition-all group w-fit"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>نظرات</span>
                </div>
                <span className="bg-primary text-white px-2 py-0.5 rounded-lg text-[10px] min-w-[22px] text-center shadow-sm shadow-primary/20">
                  {displayPizza.reviews.length}
                </span>
              </button>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <span>میزان کشسانی پنیر</span>
                  <span className="font-mono">{displayPizza.cheesiness}%</span>
                </div>
                <Progress value={displayPizza.cheesiness} className="h-1 lg:h-1.5 bg-black/5" />
              </div>

              <div className="space-y-2 lg:space-y-3">
                <h4 className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-widest">مواد تشکیل دهنده</h4>
                <div className="flex flex-wrap justify-center gap-1.5 lg:gap-2">
                  {displayPizza.ingredients.map((ing) => (
                    <div 
                      key={ing} 
                      className={cn(
                        "flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full text-[9px] lg:text-xs font-bold transition-all",
                        displayPizza.isAvailable 
                          ? "bg-black/5 hover:bg-white hover:shadow-sm" 
                          : "bg-zinc-100 text-zinc-400"
                      )}
                    >
                      <Leaf className={cn("w-2.5 h-2.5 lg:w-3 h-3", displayPizza.isAvailable ? "text-green-600" : "text-zinc-300")} />
                      {ing}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 pb-2 relative z-10">
            <Button 
              onClick={() => onOrder(displayPizza)}
              disabled={!displayPizza.isAvailable}
              className={cn(
                "w-full h-12 lg:h-14 rounded-xl lg:rounded-2xl text-white text-base lg:text-lg font-bold group shadow-xl transition-all duration-700",
                displayPizza.isAvailable 
                  ? "bg-black hover:bg-primary" 
                  : "bg-zinc-400 cursor-not-allowed grayscale"
              )}
            >
              <ShoppingCart className="mr-3 w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-1" />
              {displayPizza.isAvailable ? "سفارش" : "ناموجود"}
            </Button>
          </div>
        </div>

        {/* VIEW 2: REVIEWS (SLIDE-IN) */}
        <div className="w-1/2 h-full flex flex-col p-6 lg:p-10 bg-white/40">
          <header className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setShowReviews(false)}
              className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-1 transition-transform"
            >
              <ArrowRight className="w-5 h-5" />
              <span>بازگشت به جزئیات</span>
            </button>
            <div className="flex flex-col items-end">
              <span className="text-xs font-black uppercase text-muted-foreground">نظرات کاربران</span>
              <span className="text-[10px] font-bold text-primary">{displayPizza.name}</span>
            </div>
          </header>

          <ScrollArea className="flex-1 -mr-2 pr-4 ml-[-1rem]">
            <div className="space-y-4">
              {displayPizza.reviews.length > 0 ? (
                displayPizza.reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="p-4 rounded-2xl bg-white/60 border border-black/5 space-y-3 transition-all hover:bg-white hover:shadow-lg hover:shadow-black/5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs">{review.userName}</span>
                          <span className="text-[8px] text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-primary text-primary' : 'text-black/10'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] lg:text-xs text-muted-foreground leading-relaxed font-medium">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">هنوز نظری ثبت نشده است.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="mt-6 pt-4 border-t border-black/5">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>میانگین امتیاز</span>
              <div className="flex items-center gap-1 text-primary">
                <Star className="w-3 h-3 fill-current" />
                <span>{averageRating} از ۵</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
