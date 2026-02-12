
"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Leaf, ShoppingCart, Star, MessageSquare } from 'lucide-react';
import { ReviewsDialog } from './ReviewsDialog';

interface PizzaCardProps {
  pizza: Pizza;
  visible: boolean;
  onOrder: (pizza: Pizza) => void;
}

const IndustrialLamp = ({ isOn }: { isOn: boolean }) => {
  return (
    <div className="flex flex-col items-center mb-6 relative">
      {/* Wire */}
      <div className="w-[1.5px] h-12 bg-black/40 relative">
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-black/0 to-black/40" />
      </div>
      
      {/* Fixture */}
      <div className="w-4 h-5 bg-zinc-800 rounded-sm border-b border-zinc-700 shadow-sm" />
      
      {/* Bulb & Glow Container */}
      <div className="relative">
        {/* Bulb Body */}
        <div className={cn(
          "w-3 h-4 rounded-full transition-all duration-700 mt-[-2px] border",
          isOn 
            ? "bg-amber-200 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]" 
            : "bg-zinc-700 border-zinc-600 shadow-inner"
        )} />
        
        {/* Cinematic Light Cone & Glow */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full pointer-events-none transition-all duration-1000 ease-in-out mix-blend-screen",
          isOn 
            ? "opacity-100 scale-100 bg-amber-500/20 blur-3xl animate-pulse" 
            : "opacity-0 scale-50"
        )} style={{ animationDuration: '4s' }} />

        {/* Status Label */}
        <div className={cn(
          "absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500",
          isOn ? "text-amber-600 opacity-60" : "text-zinc-400 opacity-30"
        )}>
          {isOn ? "Available Now" : "Out of Stock"}
        </div>
      </div>
    </div>
  );
};

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, visible, onOrder }) => {
  const [displayPizza, setDisplayPizza] = useState(pizza);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayPizza(pizza);
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
    <>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "p-6 lg:p-10 rounded-[2rem] lg:rounded-[3.5rem] transform w-full max-w-[500px] flex flex-col justify-between overflow-hidden relative bg-white/60 backdrop-blur-xl border border-black/5 shadow-2xl shadow-black/5 transition-all duration-700",
          isTransitioning ? "opacity-40 translate-x-4" : "opacity-100 translate-x-0"
        )}
      >
        <div 
          className={cn(
            "absolute pointer-events-none transition-opacity duration-700 ease-in-out bg-primary/25 blur-[100px] rounded-full w-[300px] h-[300px] -z-10",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: mousePos.x - 150,
            top: mousePos.y - 150,
            transition: isHovering ? 'left 0.15s ease-out, top 0.15s ease-out, opacity 0.7s ease-in-out' : 'opacity 0.7s ease-in-out'
          }}
        />

        <div className="space-y-4 lg:space-y-6 relative z-10">
          <div className="space-y-2 lg:space-y-3 flex flex-col items-center text-center">
            {/* Cinematic Industrial Lamp */}
            <IndustrialLamp isOn={displayPizza.isAvailable} />

            <div className="flex items-center gap-2 mt-2">
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
            
            <div className="space-y-1">
              <h2 className={cn(
                "text-2xl sm:text-3xl lg:text-5xl font-black text-foreground uppercase tracking-tighter leading-tight transition-all duration-700",
                displayPizza.isAvailable ? "drop-shadow-[0_10px_15px_rgba(251,191,36,0.3)]" : ""
              )}>
                {displayPizza.name}
              </h2>
              <p className="text-primary font-black text-xl sm:text-2xl lg:text-3xl mt-1">{displayPizza.price}</p>
            </div>
          </div>

          <p className="text-muted-foreground/90 text-xs sm:text-sm lg:text-lg leading-relaxed font-medium min-h-[60px] lg:min-h-[80px] text-center">
            {displayPizza.description}
          </p>

          <div className="flex justify-center">
            <button 
              onClick={() => setIsReviewsOpen(true)}
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
                    className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full bg-black/5 text-[9px] lg:text-xs font-bold hover:bg-white hover:shadow-sm transition-all"
                  >
                    <Leaf className="w-2.5 h-2.5 lg:w-3 h-3 text-green-600" />
                    {ing}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 lg:pt-8 pb-2 relative z-10">
          <Button 
            onClick={() => onOrder(displayPizza)}
            disabled={!displayPizza.isAvailable}
            className={cn(
              "w-full h-11 lg:h-14 rounded-xl lg:rounded-2xl text-white text-base lg:text-lg font-bold group shadow-xl transition-all duration-700",
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

      <ReviewsDialog 
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        pizzaName={displayPizza.name}
        reviews={displayPizza.reviews}
      />
    </>
  );
};
