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

  useEffect(() => {
    setAnimating(true);
    const timeout = setTimeout(() => {
      setDisplayPizza(pizza);
      setAnimating(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [pizza]);

  return (
    <div 
      className={cn(
        "glass-card p-10 rounded-[3rem] transition-all duration-700 transform w-full max-w-[480px] min-h-[640px] flex flex-col justify-between",
        visible ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0",
        animating ? "scale-[0.98] opacity-80 blur-sm" : "scale-100 opacity-100 blur-0"
      )}
    >
      <div className="space-y-8 flex-grow">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <span className="text-xs font-bold text-muted-foreground">انتخاب ممتاز</span>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-5xl font-black text-foreground uppercase tracking-tighter leading-[0.9]">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-black text-3xl mt-2">{displayPizza.price}</p>
          </div>
        </div>

        <p className="text-muted-foreground/80 text-sm leading-relaxed font-medium min-h-[60px]">
          {displayPizza.description}
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <span>بافت و تازگی</span>
              <span className="font-mono">{displayPizza.cheesiness}%</span>
            </div>
            <Progress value={displayPizza.cheesiness} className="h-1.5 bg-black/5" />
          </div>

          <div className="pt-2 space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground">مواد تشکیل دهنده</h4>
            <div className="flex flex-wrap gap-2">
              {displayPizza.ingredients.map((ing) => (
                <div 
                  key={ing} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/60 text-[10px] font-bold"
                >
                  <Leaf className="w-2.5 h-2.5 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <Button className="w-full h-14 rounded-2xl bg-black hover:bg-primary text-white text-lg font-bold group shadow-xl transition-all active:scale-95 border-none">
          <ShoppingCart className="mr-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
          سفارش این برش
        </Button>
      </div>
    </div>
  );
};
