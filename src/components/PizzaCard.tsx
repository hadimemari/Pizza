
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Leaf, ShoppingCart, Star } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  visible: boolean;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, visible }) => {
  const [displayPizza, setDisplayPizza] = useState(pizza);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
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

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "p-6 lg:p-12 rounded-[2rem] lg:rounded-[4rem] transform w-full max-w-[500px] flex flex-col justify-between overflow-hidden relative bg-white/60 backdrop-blur-xl border border-black/5 shadow-2xl shadow-black/5 transition-all duration-700",
        isTransitioning ? "opacity-40 translate-x-4" : "opacity-100 translate-x-0"
      )}
    >
      {/* Modern Mouse-Follow Glow Effect */}
      <div 
        className={cn(
          "absolute pointer-events-none transition-opacity duration-700 ease-in-out bg-primary/20 blur-[100px] rounded-full w-[300px] h-[300px] -z-10",
          isHovering ? "opacity-100" : "opacity-0"
        )}
        style={{
          left: mousePos.x - 150,
          top: mousePos.y - 150,
          transition: isHovering ? 'left 0.15s ease-out, top 0.15s ease-out, opacity 0.7s ease-in-out' : 'opacity 0.7s ease-in-out'
        }}
      />

      <div className="space-y-4 lg:space-y-8 relative z-10">
        <div className="space-y-2 lg:space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 lg:w-4 lg:h-4 fill-current" />)}
            </div>
            <span className="text-[10px] lg:text-xs font-bold text-muted-foreground tracking-widest uppercase">طعم اصیل پیتزا موشن</span>
          </div>
          
          <div className="space-y-1 lg:space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-black text-foreground uppercase tracking-tighter leading-[1] lg:leading-[0.9]">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-black text-xl sm:text-2xl lg:text-4xl mt-1 lg:mt-4">{displayPizza.price}</p>
          </div>
        </div>

        <p className="text-muted-foreground/90 text-xs sm:text-sm lg:text-xl leading-relaxed font-medium min-h-[60px] lg:min-h-[120px]">
          {displayPizza.description}
        </p>

        <div className="space-y-4 lg:space-y-8">
          <div className="space-y-2 lg:space-y-3">
            <div className="flex justify-between text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span>میزان کشسانی پنیر</span>
              <span className="font-mono">{displayPizza.cheesiness}%</span>
            </div>
            <Progress value={displayPizza.cheesiness} className="h-1 lg:h-1.5 bg-black/5" />
          </div>

          <div className="pt-1 lg:pt-2 space-y-2 lg:space-y-4">
            <h4 className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-widest">مواد تشکیل دهنده</h4>
            <div className="flex flex-wrap gap-1.5 lg:gap-2">
              {displayPizza.ingredients.map((ing) => (
                <div 
                  key={ing} 
                  className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1 lg:py-2 rounded-full bg-black/5 text-[9px] lg:text-xs font-bold hover:bg-white hover:shadow-sm transition-all"
                >
                  <Leaf className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 lg:pt-8 relative z-10">
        <Button className="w-full h-11 lg:h-16 rounded-xl lg:rounded-2xl bg-black hover:bg-primary text-white text-base lg:text-xl font-bold group shadow-xl transition-all duration-700">
          <ShoppingCart className="mr-3 w-4 h-4 lg:w-6 lg:h-6 transition-transform group-hover:translate-x-1" />
          سفارش این برش لذیذ
        </Button>
      </div>
    </div>
  );
};
