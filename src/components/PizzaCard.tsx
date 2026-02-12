
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
  const [animating, setAnimating] = useState(false);
  const transitionTime = 5000; 

  useEffect(() => {
    setAnimating(true);
    const timeout = setTimeout(() => {
      setDisplayPizza(pizza);
      setAnimating(false);
    }, transitionTime / 2.5); 
    return () => clearTimeout(timeout);
  }, [pizza]);

  return (
    <div 
      className={cn(
        "p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] transform w-full max-w-[500px] flex flex-col justify-between overflow-hidden relative bg-white/40 backdrop-blur-md border border-black/5 shadow-2xl shadow-black/5",
      )}
      style={{
        transition: `all ${transitionTime}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        opacity: animating ? 0.3 : 1,
        transform: animating ? 'translateX(20px)' : 'translateX(0)'
      }}
    >
      <div className="space-y-6 md:space-y-8">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />)}
            </div>
            <span className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-widest uppercase">طعم اصیل پیتزا موشن</span>
          </div>
          
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-3xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.9]">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-black text-2xl md:text-4xl mt-2 md:mt-4">{displayPizza.price}</p>
          </div>
        </div>

        <p className="text-muted-foreground/90 text-sm md:text-xl leading-relaxed font-medium min-h-[80px] md:min-h-[120px]">
          {displayPizza.description}
        </p>

        <div className="space-y-6 md:space-y-8">
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span>میزان کشسانی پنیر</span>
              <span className="font-mono">{displayPizza.cheesiness}%</span>
            </div>
            <Progress value={displayPizza.cheesiness} className="h-1.5 bg-black/5" />
          </div>

          <div className="pt-1 md:pt-2 space-y-3 md:space-y-4">
            <h4 className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">مواد تشکیل دهنده</h4>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {displayPizza.ingredients.map((ing) => (
                <div 
                  key={ing} 
                  className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/5 text-[10px] md:text-xs font-bold"
                >
                  <Leaf className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 md:pt-8">
        <Button className="w-full h-12 md:h-16 rounded-xl md:rounded-2xl bg-black hover:bg-primary text-white text-lg md:text-xl font-bold group shadow-xl transition-all duration-700">
          <ShoppingCart className="mr-3 w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" />
          سفارش این برش لذیذ
        </Button>
      </div>
    </div>
  );
};
