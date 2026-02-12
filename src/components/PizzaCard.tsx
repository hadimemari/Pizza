
"use client";

import React, { useEffect, useState } from 'react';
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
  const transitionTime = 5000; 

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayPizza(pizza);
      setIsTransitioning(false);
    }, 400); // زمان کوتاه برای جابجایی نرم متن
    return () => clearTimeout(timer);
  }, [pizza]);

  return (
    <div 
      className={cn(
        "p-6 lg:p-12 rounded-[2rem] lg:rounded-[4rem] transform w-full max-w-[500px] flex flex-col justify-between overflow-hidden relative bg-white/40 backdrop-blur-md border border-black/5 shadow-2xl shadow-black/5 transition-all duration-700",
        isTransitioning ? "opacity-40 translate-x-4" : "opacity-100 translate-x-0"
      )}
    >
      <div className="space-y-4 lg:space-y-8">
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
                  className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1 lg:py-2 rounded-full bg-black/5 text-[9px] lg:text-xs font-bold"
                >
                  <Leaf className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 lg:pt-8">
        <Button className="w-full h-11 lg:h-16 rounded-xl lg:rounded-2xl bg-black hover:bg-primary text-white text-base lg:text-xl font-bold group shadow-xl transition-all duration-700">
          <ShoppingCart className="mr-3 w-4 h-4 lg:w-6 lg:h-6 transition-transform group-hover:translate-x-1" />
          سفارش این برش لذیذ
        </Button>
      </div>
    </div>
  );
};
