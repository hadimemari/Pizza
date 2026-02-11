
"use client";

import React, { useEffect, useState } from 'react';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
        "glass-card p-10 rounded-[3rem] transition-all duration-700 transform w-[450px]",
        visible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0",
        animating ? "scale-95 opacity-50 blur-sm" : "scale-100 opacity-100 blur-0"
      )}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs font-bold text-muted-foreground">(4.9 Rating)</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-foreground font-headline uppercase tracking-tighter leading-tight">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-black text-3xl">{displayPizza.price}</p>
          </div>
        </div>

        <p className="text-muted-foreground text-base leading-relaxed">
          {displayPizza.description}
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <span>Authentic Recipe</span>
              <span>{displayPizza.cheesiness}% Quality</span>
            </div>
            <Progress value={displayPizza.cheesiness} className="h-1.5" />
          </div>

          <div className="pt-4 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Core Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {displayPizza.ingredients.map((ing) => (
                <div 
                  key={ing} 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100/50 border border-black/5 text-xs font-bold"
                >
                  <Leaf className="w-3 h-3 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Button className="w-full h-16 rounded-2xl bg-black hover:bg-primary text-white text-lg font-black group shadow-2xl transition-all active:scale-95 border-none">
            <ShoppingCart className="mr-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
            Order This Slice
          </Button>
        </div>
      </div>
    </div>
  );
};
