
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
    // زمان‌بندی هماهنگ با سرعت گردونه (کمی سریع‌تر برای انتقال محتوا)
    const timeout = setTimeout(() => {
      setDisplayPizza(pizza);
      setAnimating(false);
    }, 600); // زمان هماهنگ با اوج سرعت جابجایی گردونه
    return () => clearTimeout(timeout);
  }, [pizza]);

  return (
    <div 
      className={cn(
        "glass-card p-10 rounded-[3.5rem] transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform w-full max-w-[500px] min-h-[660px] flex flex-col justify-between overflow-hidden relative",
        visible ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0",
        animating ? "scale-[0.98] opacity-40 blur-md translate-y-4" : "scale-100 opacity-100 blur-0 translate-y-0"
      )}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Premium Selection</span>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.85] transition-all duration-[1500ms]">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-black text-4xl mt-3 transition-all duration-[1500ms]">{displayPizza.price}</p>
          </div>
        </div>

        <p className="text-muted-foreground/80 text-base leading-relaxed font-medium min-h-[100px] transition-all duration-[1500ms]">
          {displayPizza.description}
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span>میزان کشسانی پنیر</span>
              <span className="font-mono">{displayPizza.cheesiness}%</span>
            </div>
            <Progress value={displayPizza.cheesiness} className="h-2 bg-black/5" />
          </div>

          <div className="pt-2 space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">مواد تشکیل دهنده</h4>
            <div className="flex flex-wrap gap-2">
              {displayPizza.ingredients.map((ing) => (
                <div 
                  key={ing} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 text-xs font-bold shadow-sm"
                >
                  <Leaf className="w-3 h-3 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-auto">
        <Button className="w-full h-16 rounded-2xl bg-black hover:bg-primary text-white text-xl font-bold group shadow-2xl transition-all duration-700 active:scale-95 border-none">
          <ShoppingCart className="mr-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
          سفارش این برش
        </Button>
      </div>
    </div>
  );
};
