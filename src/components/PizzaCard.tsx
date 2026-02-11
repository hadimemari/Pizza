
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
  const transitionTime = 4000; // دقیقاً همگام با گردونه

  useEffect(() => {
    setAnimating(true);
    const timeout = setTimeout(() => {
      setDisplayPizza(pizza);
      setAnimating(false);
    }, transitionTime / 4); 
    return () => clearTimeout(timeout);
  }, [pizza]);

  return (
    <div 
      className={cn(
        "glass-card p-12 rounded-[4rem] transform w-full max-w-[520px] min-h-[700px] flex flex-col justify-between overflow-hidden relative border-none shadow-none bg-white/40",
      )}
      style={{
        transition: `all ${transitionTime}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        opacity: animating ? 0.2 : 1,
        filter: animating ? 'blur(20px)' : 'blur(0)',
        transform: animating ? 'translateY(40px) scale(0.98)' : 'translateY(0) scale(1)'
      }}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">طعم اصیل ایتالیایی</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-7xl font-black text-foreground uppercase tracking-tighter leading-[0.8]">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-black text-4xl mt-4">{displayPizza.price}</p>
          </div>
        </div>

        <p className="text-muted-foreground/90 text-xl leading-relaxed font-medium min-h-[140px]">
          {displayPizza.description}
        </p>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span>میزان کشسانی پنیر</span>
              <span className="font-mono">{displayPizza.cheesiness}%</span>
            </div>
            <Progress value={displayPizza.cheesiness} className="h-1.5 bg-black/5" />
          </div>

          <div className="pt-2 space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">مواد تشکیل دهنده</h4>
            <div className="flex flex-wrap gap-2">
              {displayPizza.ingredients.map((ing) => (
                <div 
                  key={ing} 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 text-xs font-bold"
                >
                  <Leaf className="w-3.5 h-3.5 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10">
        <Button className="w-full h-16 rounded-2xl bg-black hover:bg-primary text-white text-xl font-bold group shadow-xl transition-all duration-700 border-none">
          <ShoppingCart className="mr-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
          سفارش این برش لذیذ
        </Button>
      </div>
    </div>
  );
};
