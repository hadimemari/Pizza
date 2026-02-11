
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
  const transitionTime = 4000; // همگام با گردونه

  useEffect(() => {
    setAnimating(true);
    const timeout = setTimeout(() => {
      setDisplayPizza(pizza);
      setAnimating(false);
    }, transitionTime / 3); // تغییر محتوا در یک‌سوم زمان حرکت برای هماهنگی بهتر
    return () => clearTimeout(timeout);
  }, [pizza]);

  return (
    <div 
      className={cn(
        "glass-card p-10 rounded-[3.5rem] transform w-full max-w-[500px] min-h-[680px] flex flex-col justify-between overflow-hidden relative",
      )}
      style={{
        transition: `all ${transitionTime}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        opacity: animating ? 0.3 : 1,
        filter: animating ? 'blur(15px)' : 'blur(0)',
        transform: animating ? 'translateY(30px) scale(0.95)' : 'translateY(0) scale(1)'
      }}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">انتخاب ممتاز</span>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.85]">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-black text-4xl mt-3">{displayPizza.price}</p>
          </div>
        </div>

        <p className="text-muted-foreground/80 text-lg leading-relaxed font-medium min-h-[120px]">
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
